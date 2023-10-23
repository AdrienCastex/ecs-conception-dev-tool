
/**
 * @typedef {{ components: ECS_Component[], archetypes: ECS_Archetype[], componentsGroups: ECS_Group[], archetypesGroups: ECS_Group[] }} ECS_Data
 * @typedef {{ id: string, name: string }} ECS_Group
 * @typedef {{ id: string, name: string, groupId: string, properties: ECS_ComponentProperty[], get isTag: boolean }} ECS_Component
 * @typedef {{ id: string, name: string, type: ComponentPropertyType, arraySize: number }} ECS_ComponentProperty
 * @typedef {{ id: string, name: string, groupId: string, componentsRelationship: ECS_ArchetypeComponentRel[] }} ECS_Archetype
 * @typedef {{ componentId: string, isMandatory: boolean, getComponent(components: ECS_Component[]): ECS_Component }} ECS_ArchetypeComponentRel
 * @typedef {{ components: { properties: { types: IConfigComponentPropertyType[] } }, convertToCode: (currentData: ECS_Data, options: { json: string }) => string }} IConfig
 * @typedef {{ id: string, name?: string }} IConfigComponentPropertyType
 */
