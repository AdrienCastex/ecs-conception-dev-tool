import React, { useEffect, useReducer, useRef, useState } from "react";
import "./ArchetypesColumnStyle";
import { ECS_Component, ECS_ComponentProperty } from "../../model/ECS_Component";
import { ECS_Archetype, ECS_ArchetypeComponentRel } from "../../model/ECS_Archetype";
import { Dropdown, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { KeyboardManager } from "../../KeyboardManager";
import { DropDownSearch } from "../DropDownSearch";
import { ECS_Group } from "../../model/ECS_Group";
import { Config } from "../../Config";

export function ArchetypesColumnView({ archetypes, components, componentsGroups, onArchetypesChanged }: { archetypes: ECS_Archetype[], componentsGroups: ECS_Group[], components: ECS_Component[], onArchetypesChanged: (archetypes: ECS_Archetype[]) => void }) {
    const [archs, setArchetypes] = useState(archetypes);

    const changeArchetypes = (value: typeof archetypes) => {
        setArchetypes(value);
        onArchetypesChanged(value);
    }

    useEffect(() => {
        setArchetypes(archetypes);
    }, [archetypes]);

    return <div className="archetypes-column main-column">
        <div className="column-header">
            <div className="gbtn" onClick={() => {
                changeArchetypes([
                    ...archs,
                    ECS_Archetype.create({
                        name: ''
                    })
                ])
            }}>+</div>
            <div className="column-name">Archetypes</div>
            <div className="gbtn" onClick={() => changeArchetypes(archs.slice().sort((a, b) => a.name.localeCompare(b.name)))}>Sort</div>
        </div>
        <div className="column-body">
            {archs.map((arch, i) => <Archetype key={arch.id} archetype={arch} componentsGroups={componentsGroups} components={components} onChanged={(newArch) => {
                changeArchetypes([
                    ...archs.slice(0, i),
                    newArch,
                    ...archs.slice(i + 1),
                ].filter(Boolean))
            }} />)}
        </div>
    </div>
}

function Archetype({ archetype, components, componentsGroups, onChanged }: { archetype: ECS_Archetype, components: ECS_Component[], componentsGroups: ECS_Group[], onChanged: (archetype: ECS_Archetype) => void }) {
    const [compsRel, setCompsRel] = useState(archetype.componentsRelationship);
    const [name, setName] = useState(archetype.name);

    useEffect(() => {
        if(archetype.componentsRelationship !== compsRel) {
            archetype.componentsRelationship = compsRel;
        }
    }, [compsRel]);
    
    useEffect(() => {
        if(archetype.name !== name) {
            archetype.name = name;
        }
    }, [name]);
    
    useEffect(() => {
        setCompsRel(archetype.componentsRelationship);
    }, [archetype.componentsRelationship]);

    const componentToReact = (comp: ECS_Component) => {
        const rel = compsRel.find(rel => rel.componentId === comp.id);
        return <Dropdown.Item key={comp.id} data-filter={comp.name} eventKey={comp.id}>{rel ? (rel.isMandatory ? '⬢' : '⬡') : '-'} {comp.name}{comp.isTag ? ' ⚐' : ''}</Dropdown.Item>;
    };

    return <div className="archetype">
        <div className="name-line">
            <Form.Control type="text" placeholder="Archetype name" value={name} onChange={(e) => setName(e.target.value)} />
            <Dropdown onSelect={(eventKey, e) => {
                let result: typeof compsRel;
                const index = compsRel.findIndex(rel => rel.componentId === eventKey);

                if(index >= 0) {
                    result = compsRel.filter((_, i) => i !== index);
                } else {
                    const item = new ECS_ArchetypeComponentRel();
                    item.componentId = eventKey;
                    item.isMandatory = KeyboardManager.instance.ctrl;
                    
                    result = [
                        ...compsRel,
                        item
                    ].sort((a, b) => a.getComponent(components).name.localeCompare(b.getComponent(components).name));
                }

                setCompsRel(result);
            }} autoClose="outside">
                <Dropdown.Toggle className="gbtn-inv"></Dropdown.Toggle>
                <Dropdown.Menu align="end" as={DropDownSearch}>
                    <Dropdown.Header>CTRL + Click = add as mandatory</Dropdown.Header>
                    {componentsGroups.map(group => [
                        <Dropdown.Header key={group.id + '_header_'} className="comp-group-header">{group.name}</Dropdown.Header>,
                        ...components.filter(c => c.groupId === group.id).map(componentToReact)
                    ])}
                    <Dropdown.Header className="comp-group-header">- no group -</Dropdown.Header>
                    {components.filter(c => !c.groupId).map(componentToReact)}
                </Dropdown.Menu>
            </Dropdown>
            <div className="gbtn-inv" onClick={() => {
                onChanged(undefined);
            }}>⨯</div>
        </div>
        <div className="components">
            {compsRel.filter(rel => rel.isMandatory).map(rel => <ArchetypeComponent key={rel.componentId} rel={rel} components={components} />)}
            {compsRel.filter(rel => !rel.isMandatory).map(rel => <ArchetypeComponent key={rel.componentId} rel={rel} components={components} />)}
        </div>
    </div>;
}

function ArchetypeComponent({ rel, components }: { rel: ECS_ArchetypeComponentRel, components: ECS_Component[] }) {
    const [mandatory, setMandatory] = useState(rel.isMandatory);
    const component = rel.getComponent(components);

    useEffect(() => {
        rel.isMandatory = mandatory;
    }, [mandatory]);

    return <div className="component">
        <OverlayTrigger placement="left" overlay={<Tooltip>
                <div>Mandatory?</div>
                <div>⬡ = Yes | ⬢ = No</div>
                <div>Click to toggle</div>
            </Tooltip>}>
                <span className="btn-simple" onClick={() => setMandatory(rel.isMandatory)}>
                    {mandatory ? '⬢' : '⬡'}
                </span>
        </OverlayTrigger>
        &nbsp;
        <OverlayTrigger placement="bottom-start" overlay={<Tooltip>
                {component.properties.length === 0 ? 'Tag' : <>
                    {component.properties.map(prop => {
                        const typeToDisplay = Config.instance.componentsTypes.find(t => t.id === prop.type)?.name ?? prop.type;
                        return <div key={prop.id}>{prop.name}: {prop.arraySize > 1 ? `[${typeToDisplay}, ${prop.arraySize}]` : typeToDisplay}</div>
                    })}
                </>}
            </Tooltip>}>
                <span>{component.name}{component.isTag ? ' ⚐' : ''}</span>
        </OverlayTrigger>
    </div>;
}
