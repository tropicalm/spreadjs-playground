const processTemplate = require('../src/process-template-backend');
const template = require('./fixtures/template');
const templateParsed = require('./fixtures/template-parsed.json');

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


describe("Process template backend", () => {
  it('gets all spec cells from a template',  () => {
    const result = processTemplate(template, data);
    expect(result).toEqual(templateParsed)
   // done()
  });
})