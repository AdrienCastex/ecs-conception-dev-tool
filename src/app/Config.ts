import { ECS_Data } from "./model/ECS_Data";

export interface IConfigComponentPropertyType {
    id: string
    name?: string
}

export interface IConfigOptions {
    components: {
        properties: {
            types: IConfigComponentPropertyType[]
        }
    }
    convertToCode(data: ECS_Data, options: { json: string }): string
}

export class Config {
    public static instance: Config;
    
    public constructor(protected options: IConfigOptions) {
    }

    get componentsTypes() {
        return this.options.components.properties.types;
    }
    
    convertToCode(data: ECS_Data): string {
        return this.options.convertToCode(data, {
            json: `{__gen_start__}${JSON.stringify(data)}{__gen_end__}`
        });
    }
}
