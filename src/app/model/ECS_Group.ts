import { guid } from "./guid";

export class ECS_Group {
    static fromData(data: ReturnType<ECS_Group['toJSON']>) {
        const result = new ECS_Group();
        
        result.id = data.id;
        result.name = data.name;

        return result;
    }

    id = guid();
    name: string = ''

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
