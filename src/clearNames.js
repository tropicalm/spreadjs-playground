const fs = require('fs')
const _ = require('lodash/fp')

const templatePath = process.argv[2]
const rawTemplate = fs.readFileSync(templatePath);
const template = JSON.parse(rawTemplate);

const sheetNames = _.keys(template.sheets)

_.forEach(sheet => {
    template.sheets[sheet].names = []
})(sheetNames)

template.sheets = {
    'Cal_Bilanz': template.sheets.Cal_Bilanz
}
fs.writeFile(templatePath, JSON.stringify(template), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});