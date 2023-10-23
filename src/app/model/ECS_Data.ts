import { ECS_Archetype } from "./ECS_Archetype";
import { ECS_Component } from "./ECS_Component";
import { ECS_Group } from "./ECS_Group";

export class ECS_Data {
    static current: ECS_Data;

    public static fromData(data: ReturnType<ECS_Data['toJSON']>) {
        const result = new ECS_Data();
        
        result.components = data.components.map(ECS_Component.fromData);
        result.archetypes = data.archetypes.map(ECS_Archetype.fromData);
        result.componentsGroups = data.componentsGroups?.map(ECS_Group.fromData) ?? [];
        result.archetypesGroups = data.archetypesGroups?.map(ECS_Group.fromData) ?? [];

        return result;
    }

    components: ECS_Component[] = [];
    archetypes: ECS_Archetype[] = [];

    componentsGroups: ECS_Group[] = [];
    archetypesGroups: ECS_Group[] = [];

    toJSON() {
        return {
            components: this.components.map(a => a.toJSON()),
            archetypes: this.archetypes.map(a => a.toJSON()),
            componentsGroups: this.componentsGroups.map(a => a.toJSON()),
            archetypesGroups: this.archetypesGroups.map(a => a.toJSON()),
        }
    }
}
