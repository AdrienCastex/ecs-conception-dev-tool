import React, { useEffect, useReducer, useRef, useState } from "react";
import "./AppStyle";
import { ComponentsColumnView } from "../ComponentsColumn/ComponentsColumnView";
import { ArchetypesColumnView } from "../ArchetypesColumn/ArchetypesColumnView";
import { ECS_Data } from "../../model/ECS_Data";
import { KeyboardManager } from "../../KeyboardManager";
import { Config } from "../../Config";

export function AppView() {
    const [currentData, setCurrentData] = useState(ECS_Data.current);
    const [comps, setComps] = useState(ECS_Data.current.components);
    const [archs, setArchs] = useState(ECS_Data.current.archetypes);
    const [archetypesGroups, setArchetypesGroups] = useState(ECS_Data.current.archetypesGroups);
    const [componentsGroups, setComponentsGroups] = useState(ECS_Data.current.componentsGroups);
    const [lastGeneratedCode, setLastGeneratedCode] = useState(localStorage.getItem('last-generated-code') ?? '');

    useEffect(() => {
        ECS_Data.current = currentData;
        setComps(currentData.components);
        setArchs(currentData.archetypes);
        setArchetypesGroups(currentData.archetypesGroups);
        setComponentsGroups(currentData.componentsGroups);
    }, [currentData]);

    useEffect(() => {
        if(comps !== currentData.components) {
            const removed = comps.length < currentData.components.length;

            currentData.components = comps;

            if(removed) {
                setArchs(archs.map(arch => {
                    arch.componentsRelationship = arch.componentsRelationship.filter(rel => comps.some(c => c.id === rel.componentId));
                    return arch;
                }));
            }
        }
    }, [comps]);

    useEffect(() => {
        if(archetypesGroups !== currentData.archetypesGroups) {
            const removed = archetypesGroups.length < currentData.archetypesGroups.length;

            currentData.archetypesGroups = archetypesGroups;

            if(removed) {
                setArchs(archs.map(arch => {
                    if(arch.groupId && !archetypesGroups.some(g => g.id === arch.groupId)) {
                        arch.groupId = undefined;
                    }
                    return arch;
                }));
            }
        }
    }, [archetypesGroups]);

    useEffect(() => {
        if(componentsGroups !== currentData.componentsGroups) {
            const removed = componentsGroups.length < currentData.componentsGroups.length;

            currentData.componentsGroups = componentsGroups;

            if(removed) {
                setComps(comps.map(comp => {
                    if(comp.groupId && !componentsGroups.some(g => g.id === comp.groupId)) {
                        comp.groupId = undefined;
                    }
                    return comp;
                }));
            }
        }
    }, [componentsGroups]);

    useEffect(() => {
        localStorage.setItem('last-generated-code', lastGeneratedCode);
    }, [lastGeneratedCode]);

    useEffect(() => {
        if(archs !== currentData.archetypes) {
            currentData.archetypes = archs;
        }
    }, [archs]);

    useEffect(() => {
        document.addEventListener('keydown', e => {
            KeyboardManager.instance.ctrl = e.ctrlKey;
        })
        document.addEventListener('keyup', e => {
            KeyboardManager.instance.ctrl = e.ctrlKey;
        })
    }, []);

    return <div className="main-columns-wrapper">
        <ComponentsColumnView components={comps} groups={componentsGroups} onGroupsChanged={(newGroups) => setComponentsGroups(newGroups)} onComponentsChanged={(newComps) => setComps(newComps)} />
        <ArchetypesColumnView components={comps} componentsGroups={componentsGroups} archetypes={archs} onArchetypesChanged={setArchs} />
        <div className="overlay-btns">
            <div className="gbtn" onClick={() => {
                setLastGeneratedCode(Config.instance.convertToCode(currentData));
            }}>Generate {'>'}</div>
            <textarea value={lastGeneratedCode} onChange={e => {
                const newValue = e.target.value ?? '';
                setLastGeneratedCode(newValue);
            }}></textarea>
            <div className="gbtn" onClick={() => {
                let json: string = lastGeneratedCode;

                const genStartIndex = json.indexOf(`{__gen_start__}`);
                if(genStartIndex >= 0) {
                    json = json.substring(genStartIndex + `{__gen_start__}`.length);
                    json = json.substring(0, json.indexOf(`{__gen_end__}`));
                }

                const data = JSON.parse(json);

                setCurrentData(ECS_Data.fromData(data));
            }}>{'>'} Load</div>
        </div>
    </div>
}
