const GC = require("@grapecity/spread-sheets");
const { parseSpec } = require("./parser");
const { getTemplateWithCustomDataBinding } = require('./customDataBinding')

const R = require('ramda')
let worksheet;

function updateFormula(formula, x, y) {
  const expression = GC.Spread.Sheets.CalcEngine.formulaToExpression(worksheet, formula, 0, 0);
  return GC.Spread.Sheets.CalcEngine.expressionToFormula(worksheet, expression, x, y);
}

function processTemplate(template, data) {
  const spec = parseSpec(template, data)

  const diff = R.mapObjIndexed(v => R.reduce
    ((acc, cur) => {
    const data = acc.data.dataTable
    const col = data[cur.y] || (data[cur.y] = {})
    const row = col[cur.x] = cur.v
    cur.v.formula && (row.formula = updateFormula(cur.v.formula, cur.dy, cur.dx))

    return acc
  }, {data: {dataTable: {}}})(v))(spec)

  return R.pipe(
    R.mergeDeepLeft({sheets:diff}),
    R.mergeDeepRight(getTemplateWithCustomDataBinding(template))
  )(template)
}

module.exports = (ws) => {
  worksheet = ws;
  return processTemplate
}