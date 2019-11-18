var domino = require('domino');

class HTMLCollection extends Function {}
const window = domino.createWindow();
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

global.console.error = () => {}

module.exports = require('./process-template')
