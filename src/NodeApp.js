
const hrstart = process.hrtime()

const fs = require('fs')
const processTemplate = require("./process-template-backend");
const GC = require("@grapecity/spread-sheets");
const wb = new GC.Spread.Sheets.Workbook();

const templatePath = './templates/template.ssjson'
const outputPath = './templates/template-parsed.json'

const rawTemplate = fs.readFileSync(templatePath);
const template = JSON.parse(rawTemplate);

const data = {
    investments: [
      {
        id: "Investment_A",
        name: "Investment A",
        type: "Equity",
        beginningYear: 10000,
        participation_quote: 12,
        dividend_distribution: 100
      },
      {
        id: "Investment_B",
        name: "Investment B",
        type: "Equity",
        beginningYear: 200000,
        participation_quote: 99,
        dividend_distribution: 10000
      },
      {
        id: "Investment_C",
        name: "Investment C",
        type: "Equity",
        beginningYear: 55000,
        participation_quote: 40,
        dividend_distribution: 240
      },
      {
        id: "Investment_D",
        name: "Investment D",
        type: "Equity",
        beginningYear: 55000,
        participation_quote: 40,
        dividend_distribution: 240
      }
    ],
    investors: [
      {
        id: "Investor_A",
        name: "Investor A",
        commitment: 2
      },
      {
        id: "Investor_B",
        name: "Investor B",
        commitment: 1.4
      },
      {
        id: "Investor_C",
        name: "Investor C",
        commitment: 3
      },
      {
        id: "Investor_D",
        name: "Investor D",
        commitment: 0.8
      }
    ]
  };

// for(let i = 0; i < 1000; i++) {
//     data.investors.push({
//         id: "Investor_D"+i,
//         name: "Investor D"+i,
//         commitment: 0.8
//       })
// }

for(let i = 0; i < 8; i++) {
    data.investments.push({
        id: "Investment_D"+i,
        name: "Investment D"+i,
        type: "Equity",
        beginningYear: 55000,
        participation_quote: 40,
        dividend_distribution: 240
      })
}

setTimeout(() => {
    const worksheet = new GC.Spread.Sheets.Worksheet();
    worksheet.reset()

    const processTemplateFn = processTemplate(worksheet)
    const result = processTemplateFn(template, data);

    fs.writeFile(outputPath, JSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    const hrend = process.hrtime(hrstart)
    console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
}, 0)
