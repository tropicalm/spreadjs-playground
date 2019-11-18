const _ = require('lodash/fp');
const deepMerge = require('deepmerge');
const GC = require('@grapecity/spread-sheets');
const { parseSpec } = require('./parser');
const { getTemplateWithCustomDataBinding } = require('./customDataBinding');
const {
  formulaToExpression,
  expressionToFormula,
} = GC.Spread.Sheets.CalcEngine;

const wb = new GC.Spread.Sheets.Workbook(); // required by SpreadJS
const worksheet = new GC.Spread.Sheets.Worksheet();
worksheet.reset() // required by SpreadJS

function updateFormula(formula, x, y) {
  const expression = formulaToExpression(worksheet, formula, 0, 0);
  return expressionToFormula(worksheet, expression, x, y);
}

function processTemplate(template, data) {
  const spec = parseSpec(template, data);

  const diff = _.mapValues(v =>
    _.reduce(
      (acc, cell) => {
        const data = acc.data.dataTable;
        const col = data[cell.y] || (data[cell.y] = {});
        const row = (col[cell.x] = cell.v);
        cell.v.formula &&
          (row.formula = updateFormula(cell.v.formula, cell.dy, cell.dx));

        return acc;
      },
      { data: { dataTable: {} } },
    )(v),
  )(spec);

  return _.reduce(deepMerge, {}, [
    template,
    getTemplateWithCustomDataBinding(template),
    { sheets: diff },
  ]);
}

module.exports = processTemplate;
