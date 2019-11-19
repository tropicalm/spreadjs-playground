var domino = require('domino');

class HTMLCollection extends Function {}
const window = domino.createWindow('');
const HTMLCanvasElement = Object.create(window.HTMLCanvasElement);
HTMLCanvasElement.getContext = () => ({
  fillRect: () => {},
  fillStyle: () => {},
  clearRect: () => {},
  getImageData: () => {},
  createImageData: () => {},
});

global.window = window
window.HTMLCanvasElement.prototype = HTMLCanvasElement;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLCollection = window.HTMLCollection;
global.getComputedStyle = window.getComputedStyle;
global.HTMLCollection = HTMLCollection;

//console.log(typeof test.addEventListener)
const GC = require('@grapecity/spread-sheets');
const wb = new GC.Spread.Sheets.Workbook();

const {
  formulaToExpression,
  expressionToFormula,
} = GC.Spread.Sheets.CalcEngine;

const worksheet = new GC.Spread.Sheets.Worksheet();
worksheet.reset();
let a = formulaToExpression(worksheet, 'SUM(A1:A2)', 0, 0);
let b = expressionToFormula(worksheet, a, 10, 0);
console.log(b);
