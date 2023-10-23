import { ListType, Type, Types } from "bitecs";
import { guid } from "./guid";

export interface IECS_ComponentOptions {
    name: string
}
export type ComponentPropertyType = Type;

export class ECS_ComponentProperty {
    public static fromData(data: ReturnType<ECS_ComponentProperty['toJSON']>) {
        const result = new ECS_ComponentProperty();
        
        result.id = data.id;
        result.name = data.name;
        result.type = data.type;
        result.arraySize = data.arraySize;

        return result;
    }

    id = guid();
    name: string = ''
    type: ComponentPropertyType = 'ui8'
    arraySize: number = 1

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            arraySize: this.arraySize,
        }
    }
}
export class ECS_Component {
    static create(options: IECS_ComponentOptions) {
        const result = new ECS_Component();

        result.name = options.name;

        return result;
    }

    public static fromData(data: ReturnType<ECS_Component['toJSON']>) {
        const result = new ECS_Component();
        
        result.id = data.id;
        result.name = data.name;
        result.groupId = data.groupId;
        result.properties = data.properties.map(ECS_ComponentProperty.fromData);

        return result;
    }

    id: string = guid();
    name: string;
    groupId: string;
    properties: ECS_ComponentProperty[] = [];

    get isTag() {
        return this.properties.length === 0;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            groupId: this.groupId,
            properties: this.properties.map(a => a.toJSON()),
        }
    }
}
