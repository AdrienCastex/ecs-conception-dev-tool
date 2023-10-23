/**
 * For bitecs (js/ts ECS env)
 * 
 * @see https://github.com/NateTheGreatt/bitECS
 * @see https://www.npmjs.com/package/bitecs
 */

/** @typedef {import("./jsdoc/jsdoc")} */

/**
 * @type {IConfig}
 */
const config = {
    components: {
        properties: {
            types: [
                { id: "eid",    name: "Entity ID" },
                
                { id: "f64",    name: "Float 64" },
                { id: "f32",    name: "Float 32" },
                
                { id: "i32",    name: "Int 32" },
                { id: "ui32",   name: "Int 32 (unsigned)" },

                { id: "i16",    name: "Int 16" },
                { id: "ui16",   name: "Int 16 (unsigned)" },

                { id: "i8",     name: "Int 8" },
                { id: "ui8",    name: "Int 8 (unsigned)" },
                { id: "ui8c",   name: "Int 8 (unsigned, clamped)" },
            ]
        }
    },
    convertToCode(currentData, options) {
        const { components: comps, archetypes: archs, componentsGroups } = currentData;
        
        let result = `//// GENERATED //// ${options.json}\n\nimport { Types, defineComponent } from "bitecs";\n\n`;

        const docLinePrefix = `\n * `;

        for(const comp of comps) {
            const includedIn = archs.filter(a => a.componentsRelationship.some(rel => rel.componentId === comp.id));
            let doc = includedIn.length > 0 ? `${docLinePrefix}For archetypes: ${includedIn.map(a => {
                const rel = a.componentsRelationship.find(rel => rel.componentId === comp.id);
                return `${a.name}${rel.isMandatory ? ' (required)' : ''}`;
            }).join(', ')}` : '';

            if(comp.groupId) {
                doc = `${docLinePrefix}Group: ${componentsGroups.find(g => g.id === comp.groupId).name}${doc ? `${docLinePrefix}${doc}` : ''}`;
            }
            if(comp.properties.length === 0) {
                doc = `${docLinePrefix}Tag${doc ? `${docLinePrefix}${doc}` : ''}`;
            }

            if(doc) {
                result += `/**${doc}\n */\n`;
            }

            result += `export const ${comp.name.replace(/\s+/img, '')} = defineComponent({${comp.properties.map(p => `\n    ${p.name}: ${p.arraySize > 1 ? `[Types.${p.type},${p.arraySize}]` : `Types.${p.type}`}`).join(',')}\n});\n\n`;
        }

        result += `export const componentsGroups = {`;
        for(const group of componentsGroups) {
            result += `\n    ${group.name.replace(/\s/img, '')}: {`;

            for(const comp of comps.filter(c => c.groupId === group.id)) {
                const name = comp.name.replace(/\s/img, '');
                result += `\n        ${name}: ${name},`;
            }

            result += `\n    },`;
        }
        result += `\n};\n\n`;

        result += `export const archetypesComps = {`;
        for(const arch of archs) {
            result += `\n    ${arch.name.replace(/\s/img, '')}: {`;

            result += `\n        $mandatory: {`;
            for(const rel of arch.componentsRelationship.filter(rel => rel.isMandatory)) {
                const name = rel.getComponent(comps).name.replace(/\s/img, '');
                result += `\n            ${name}: ${name},`;
            }
            result += `\n        },`;

            for(const rel of arch.componentsRelationship) {
                const name = rel.getComponent(comps).name.replace(/\s/img, '');
                result += `\n        ${name}: ${name},`;
            }
            
            result += `\n    },`;
        }
        result += `\n};\n\n`;

        return result;
    }
};

start(config);
