import { ECS_Component } from "./ECS_Component";
import { guid } from "./guid";

export interface IECS_ArchetypeOptions {
    name: string
}
export class ECS_ArchetypeComponentRel {
    public static fromData(data: ReturnType<ECS_ArchetypeComponentRel['toJSON']>) {
        const result = new ECS_ArchetypeComponentRel();
        
        result.componentId = data.componentId;
        result.isMandatory = data.isMandatory;

        return result;
    }

    componentId: string
    isMandatory: boolean

    private _comp: ECS_Component;
    getComponent(components: ECS_Component[]) {
        if(!this._comp || this._comp.id !== this.componentId) {
            this._comp = components.find(c => c.id === this.componentId);
        }
        return this._comp;
    }

    toJSON() {
        return {
            componentId: this.componentId,
            isMandatory: this.isMandatory,
        }
    }
}
export class ECS_Archetype {
    static create(options: IECS_ArchetypeOptions) {
        const result = new ECS_Archetype();

        result.name = options.name;

        return result;
    }

    public static fromData(data: ReturnType<ECS_Archetype['toJSON']>) {
        const result = new ECS_Archetype();
        
        result.id = data.id;
        result.name = data.name;
        result.groupId = data.groupId;
        result.componentsRelationship = data.componentsRelationship.map(ECS_ArchetypeComponentRel.fromData);

        return result;
    }

    id = guid();
    name: string;
    groupId: string;
    componentsRelationship: ECS_ArchetypeComponentRel[] = [];

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            groupId: this.groupId,
            componentsRelationship: this.componentsRelationship.map(a => a.toJSON()),
        }
    }
}
