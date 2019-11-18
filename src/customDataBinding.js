const {
  cloneDeep,
  filter,
  map,
  omit,
  path,
  pipe,
  reduce,
  setWith,
} = require('lodash/fp');

const formulaRe = /(.*)\!\$([A-Z]*)\$([0-9]*)/; // "Sheet1!$A$1" -> "Sheet1", "A", "1"

const lettersToNumber = letters =>
   letters.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0);

const formulaToPos = formula => {
    const parsed = formula.match(formulaRe);
    return {
      sheetName: parsed[1],
      col: lettersToNumber(parsed[2]) - 1,
      row: parsed[3] - 1
    }
}

const getDataBindingDefs = pipe(
  filter(cell => cell.comment === 'input'),
  map(cell => {
    const pos = formulaToPos(cell.formula);
    return Object.assign({name: cell.name}, pos);
  }),
);

const getRefValues = template =>
  pipe(
    path('names'),
    filter(cell => cell.comment !== 'input'),
    map(ref => {
      const {sheetName, row, col } = formulaToPos(ref.formula);
      const sheetPath = ['sheets', sheetName, 'data', 'dataTable'];
      const cellPath = sheetPath.concat(row, col);
      return Object.assign({ name: ref.name }, path(cellPath, template));
    }),
  )(template);

const getTemplateWithCustomDataBinding = oldTemplate => {
  const template = cloneDeep(oldTemplate);
  const bindings = getDataBindingDefs(template.names);
  return reduce((result, bindingDef) => {
    const { col, row, name, sheetName } = bindingDef;
    const sheetPath = ['sheets', sheetName, 'data', 'dataTable'];
    const cellPath = sheetPath.concat(row, col);
    const cell = path(cellPath, template);
    const newCell = Object.assign({}, cell, {
      bindingPath: name,
      formula: null,
    });

    const schemaPath = ['designerBindingPathSchema', 'properties', name];
    const newSchemaVal = { dataFieldType: 'text', type: 'string' };

    return pipe(
      setWith(Object, cellPath, newCell),
      setWith(Object, schemaPath, newSchemaVal),
    )(result);
  }, {})(bindings);
};

module.exports = {
  getDataBindingDefs,
  getTemplateWithCustomDataBinding,
  getRefValues,
};