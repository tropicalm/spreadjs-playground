const mockBrowser = require('mock-browser').mocks.MockBrowser;

global.window = mockBrowser.createWindow()
global.document = window.document
global.navigator = window.navigator
global.HTMLCollection = window.HTMLCollection
global.getComputedStyle = window.getComputedStyle

global.console.error = () => {}

module.exports = (worksheet) => {
    return require('./process-template')(worksheet)
}
