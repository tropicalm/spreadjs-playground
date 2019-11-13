const {
  cloneDeep,
  path,
  pipe,
  map,
  omit,
  reduce,
  setWith,
} = require('lodash/fp');

const sheetNameRe = /(.*)\!/; // "Sheet1!$A$1" -> "Sheet1"

const getDataBindingDefs = map(cell => {
  const sheetName = cell.formula.match(sheetNameRe)[1];
  return Object.assign({ sheetName }, omit('formula', cell));
});

const getTemplateWithCustomDataBinding = oldTemplate => {
  const template = cloneDeep(oldTemplate);
  const bindings = getDataBindingDefs(template.names);
  return reduce((result, bindingDef) => {
    const { col, row, name, sheetName } = bindingDef;
    const sheetPath = ['sheets', sheetName, 'data', 'dataTable'];
    const cellPath = sheetPath.concat(row, col);
    const cell = path(cellPath, template);
    const newCell = Object.assign({}, cell, { bindingPath: name });

    const schemaPath = ['designerBindingPathSchema', 'properties', name];
    const newSchemaVal = { dataFieldType: 'text', type: 'string' };

    return pipe(
      setWith(Object, cellPath, newCell),
      setWith(Object, schemaPath, newSchemaVal),
    )(result)
  }, {})(bindings);
};

module.exports = {
  getDataBindingDefs,
  getTemplateWithCustomDataBinding,
};

// "designerBindingPathSchema": {
//     "$schema": "http://json-schema.org/draft-04/schema#",
//     "properties": {
//         "custom_value": {
//             "dataFieldType": "text",
//             "type": "string"
//         },
//         "another_value": {
//             "dataFieldType": "text",
//             "type": "string"
//         }
//     },
//     "type": "object"
// }

//             "data": {
//             "dataTable": {
//                 "0": {
//                     "0": {
//                         "bindingPath": "custom_value"
//                     }
