import React, { useEffect, useState } from "react";
import "./ComponentsColumnStyle";
import { ECS_Component, ECS_ComponentProperty } from "../../model/ECS_Component";
import { Dropdown, Form } from "react-bootstrap";
import { ECS_Group } from "../../model/ECS_Group";
import { Config } from "../../Config";

export function ComponentsColumnView({ components, groups: compGroups, onGroupsChanged, onComponentsChanged }: { components: ECS_Component[], groups: ECS_Group[], onGroupsChanged: (groups: ECS_Group[]) => void, onComponentsChanged: (components: ECS_Component[]) => void }) {
    const [comps, setComps] = useState(components);
    const [groups, setGroups] = useState(compGroups);

    useEffect(() => {
        if(comps !== components) {
            setComps(components);
        }
    }, [components]);

    useEffect(() => {
        if(groups !== compGroups) {
            setGroups(compGroups);
        }
    }, [compGroups]);

    return <div className="components-column main-column">
        <div className="column-header">
            <div className="gbtn" onClick={() => {
                const newValue = [
                    ...comps,
                    ECS_Component.create({
                        name: ''
                    })
                ];
                setComps(newValue);
                onComponentsChanged(newValue);
            }}>+</div>
            <div className="column-name">Components</div>
            <div className="gbtn" onClick={() => {
                const newValue = comps.slice().sort((a, b) => a.name.localeCompare(b.name));
                setComps(newValue);
                onComponentsChanged(newValue);
            }}>Sort</div>
            <div className="gbtn" onClick={() => {
                const newValue = [
                    ...groups,
                    new ECS_Group()
                ];
                setGroups(newValue);
                onGroupsChanged(newValue);
            }}>+ Group</div>
        </div>
        <div className="column-body">
            {[...groups, undefined].map((g, i) => <Group groups={groups} components={comps.filter(c => (c.groupId ?? '') === (g?.id ?? ''))} key={g?.id ?? '-'} group={g} onChanged={(newGroup) => {
                if(g) {
                    const newValue = [
                        ...groups.slice(0, i),
                        newGroup,
                        ...groups.slice(i + 1),
                    ].filter(Boolean);
                    setGroups(newValue);
                    onGroupsChanged(newValue);
                }
            }} onComponentsChanged={(newComps) => {
                const newValue = comps.map(c => {
                    if(c.groupId == g?.id) {
                        const index = newComps.findIndex(nc => nc.id === c.id);
                        return index >= 0 ? newComps[index] : undefined;
                    } else {
                        return c;
                    }
                }).filter(Boolean);

                setComps(newValue);
                onComponentsChanged(newValue);
            }} />)}
        </div>
    </div>
}

function Group({ group, groups, components, onComponentsChanged, onChanged }: { groups: ECS_Group[], components: ECS_Component[], group: ECS_Group, onComponentsChanged: (newComponents: ECS_Component[]) => void, onChanged: (newGroup: ECS_Group) => void }) {
    const [name, setName] = useState(group && group.name);
    
    if(group) {
        useEffect(() => {
            if(group && group.name !== name) {
                group.name = name;
            }
        }, [name]);
    
        useEffect(() => {
            setName(group.name);
        }, [group]);
    }

    return <div className="group">
        <div className={`group-header ${group ? '' : 'default-group'}`}>
            {group ? <>
                <Form.Control type="text" placeholder="Group name" value={name} onChange={(e) => {
                    const newValue = e.target.value;
                    setName(newValue);
                    onChanged(group);
                }} />
                <div className="gbtn-inv plus-btn" onClick={() => onChanged(undefined)}>⨯</div>
            </> : <>
                Without group
            </>}
        </div>
        <div className="group-components">
            {components.map((comp, i) => <Component groups={groups} key={comp.id} component={comp} onChanged={(newComp) => {
                const newValue = [
                    ...components.slice(0, i),
                    newComp,
                    ...components.slice(i + 1),
                ].filter(Boolean);

                onComponentsChanged(newValue);
            }} />)}
        </div>
    </div>
}

function Component({ component, groups, onChanged }: { groups: ECS_Group[], component: ECS_Component, onChanged: (newComp: ECS_Component) => void }) {
    const [name, setName] = useState(component.name);
    const [properties, setProperties] = useState(component.properties);

    useEffect(() => {
        if(component.name !== name) {
            component.name = name;
            onChanged(component);
        }
    }, [name]);

    useEffect(() => {
        if(component.properties !== properties) {
            component.properties = properties;
            onChanged(component);
        }
    }, [properties]);

    return <div key={component.id} className="component">
        <div className="name">
            <Form.Control type="text" placeholder="Component name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="gbtn-inv plus-btn" onClick={() => {
                setProperties([
                    ...properties,
                    new ECS_ComponentProperty()
                ]);
            }}>+</div>
            <div className="gbtn-inv plus-btn" onClick={() => {
                onChanged(undefined);
            }}>⨯</div>
            <Dropdown onSelect={(eventKey: string) => {
                component.groupId = eventKey;
                onChanged(component);
            }}>
                <Dropdown.Toggle className="gbtn-inv"></Dropdown.Toggle>
                <Dropdown.Menu>
                    {groups.map(g => <Dropdown.Item key={g.id} eventKey={g.id} active={g.id === component.groupId}>{g.name}</Dropdown.Item>)}
                    <Dropdown.Item eventKey={''} active={!component.groupId}>- no group -</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <div className="properties">
            <div className="props-wrapper">
                {properties.map((p, i) => <ComponentProperty key={p.id} property={p} onChanged={(newProp) => {
                    setProperties([
                        ...properties.slice(0, i),
                        newProp,
                        ...properties.slice(i + 1)
                    ].filter(Boolean));
                }} />)}
            </div>
        </div>
    </div>;
}

function ComponentProperty({ property, onChanged }: { property: ECS_ComponentProperty, onChanged: (newProp: ECS_ComponentProperty) => void }) {
    const [name, setName] = useState(property.name);
    const [type, setType] = useState(property.type);
    const [arraySize, setArraySize] = useState(property.arraySize);
    
    useEffect(() => {
        if(property.name !== name) {
            property.name = name;
            onChanged(property);
        }
    }, [name]);

    useEffect(() => {
        if(property.type !== type) {
            property.type = type;
            onChanged(property);
        }
    }, [type]);

    useEffect(() => {
        if(property.arraySize !== arraySize) {
            property.arraySize = arraySize;
            onChanged(property);
        }
    }, [arraySize]);

    return <div className="property">
        <div className="name">
            <Form.Control type="text" placeholder="Property name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="type">
            <Dropdown onSelect={(eventKey: string) => setType(eventKey)}>
                <Dropdown.Toggle className="gbtn">{Config.instance.componentsTypes.find(t => t.id === type)?.name ?? type}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {Config.instance.componentsTypes.map(typeInfo => <Dropdown.Item key={typeInfo.id} eventKey={typeInfo.id}>{typeInfo.name ?? typeInfo.id}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <div className="array-size">
            <Form.Control type="integer" value={arraySize} onChange={(e) => {
                const value = parseInt(e.target.value);
                if(!isNaN(value)) {
                    setArraySize(value);
                }
            }} />
        </div>
        <div className="gbtn-inv" onClick={() => {
            onChanged(undefined);
        }}>⨯</div>
    </div>
}
