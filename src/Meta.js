//@flow
export const objectPropertyTypes = {
    STRING: 'String',
    EXTENDED_STRING: 'ExtendedString',
    BOOLEAN: 'Boolean',
    DATETIME: 'DateTime',
    DURATION: 'Duration',
    DECIMAL: 'Decimal',
    INTEGER: 'Integer',
    DOUBLE: 'Double',
    ACCOUNT: 'Account',
    DOCUMENT: 'Document',
    INSTANCE: 'Instance',
    COLLECTION: 'Collection',
    ENUM: 'Enum'
};

export const presentingComponentsTypes = {
    form: 'form',
    popup: 'popup',
    group: 'group',
    field: 'field',
    tab: 'tab'
};

export const iconsNames = {
    expand: 'expand',
    minimize: 'compress',
    newTab: 'share-square',
    close: 'times'
};

export default {
    objectPropertyTypes,
    presentingComponentsTypes,
    iconsNames
};
