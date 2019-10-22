const GC = require("@grapecity/spread-sheets");
const {getSpecCells, parseSpec} = require("./parser");

let worksheet;

function updateFormula(formula, x, y) {
  const expression = GC.Spread.Sheets.CalcEngine.formulaToExpression(worksheet, formula, 0, 0);
  return GC.Spread.Sheets.CalcEngine.expressionToFormula(worksheet, expression, x, y);
}

function updateRow(sheet, value, rowId, colId, rowD, colD) {
  const x = parseInt(rowId) + rowD;
  const y = parseInt(colId) + colD;
  const formula = updateFormula(value, rowD, colD);

  sheet.data.dataTable[x][y] = {
      formula: formula
  }
}

function processTemplate(template, data) {
  const specCells = getSpecCells(template);
  const spec = parseSpec(specCells, data)
  const result = JSON.parse(JSON.stringify(template));

  spec.map((el) => {
    const sheet = result.sheets[el.sheetName];
    el.val.map((cellSpec, idx) => {
      if(Array.isArray(cellSpec)) {
          cellSpec.map((value, colIdx) => {
            updateRow(sheet, value, el.rowNr, el.colNr, idx, colIdx)
          });
      } else {
        updateRow(sheet, cellSpec, el.rowNr, el.colNr, idx, 0)
      }
    })
  });
  return result;
}

module.exports = (ws) => {
  worksheet = ws;
  return processTemplate
}