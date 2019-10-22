const {getSpecCells, parseSpecCell, parseSpec} = require('../src/parser');
const template = require('../templates/template');

describe("Parser", () => {
  it('gets all spec cells from a template', () => {
    const spec = {
      "Investor_Gains": {
        "1": {
          "4": "[1,investors as invr]\"{invr.name}\""
        },
        "3": {
          "4": "[1,investors as invr]\"in%\""
        },
        "4": {
          "0": "[investments as inv]\"{inv.name}\"",
          "1": "[investments as inv]{inv.participation_quote}",
          "2": "[investments as inv]{inv.dividend_distribution}",
          "3": "[investments as inv]=SUM(F5:OFFSET(F5, 0, {investors.length}))",
          "4": "[investments as invm,investors as invr]=$B5*{invr.commitment}"
        }
      }
    };

    const result = getSpecCells(template);
    expect(result).toEqual(spec)
  });

  it('parses a loop containing an value', () => {
    const spec = "[investments as inv]{inv.name}";
    const data = {
      investments: [{
        name: 'abc'
      }, {
        name: 'another inv'
      }],
      investors: [{
        name: 'tom',
        commitment: 12
      }, {
        name: 'bob',
        commitment: 50
      }]
    }
    const result = parseSpecCell(spec, data);
    expect(result).toEqual(["abc", "another inv"])
  });

  it('parses a loop containing a formula', () => {
    const spec = "[investments as inv]=SUM(F5:OFFSET(F5, 0, {investors.length}))";
    const data = {
      investments: [{
        name: 'abc'
      }, {
        name: 'another inv'
      }],
      investors: [{
        name: 'tom'
      }, {
        name: 'bob'
      }]
    }
    const expected = ["=SUM(F5:OFFSET(F5, 0, 2))", "=SUM(F5:OFFSET(F5, 0, 2))"];
    const result = parseSpecCell(spec, data);
    expect(result).toEqual(expected)
  });

  it('parses an entire spec', () => {
    const data = {
      investments: [{
          name: 'abc',
          participation_quote: 12,
          dividend_distribution: 100
        },
        {
          name: 'another inv',
          participation_quote: 5,
          dividend_distribution: 25
        }
      ],
      investors: [{
        name: 'tom',
        commitment: 10
      }, {
        name: 'bob',
        commitment: 50
      }]
    }

    const expectedResult = [{
      "val": [
        ["\"tom\"", "\"bob\""]
      ],
      "sheetName": "Investor_Gains",
      "rowNr": "1",
      "colNr": "4"
    }, {
      "val": [
        ["\"in%\"", "\"in%\""]
      ],
      "sheetName": "Investor_Gains",
      "rowNr": "3",
      "colNr": "4"
    }, {
      "val": ["\"abc\"", "\"another inv\""],
      "sheetName": "Investor_Gains",
      "rowNr": "4",
      "colNr": "0"
    }, {
      "val": ["12", "5"],
      "sheetName": "Investor_Gains",
      "rowNr": "4",
      "colNr": "1"
    }, {
      "val": ["100", "25"],
      "sheetName": "Investor_Gains",
      "rowNr": "4",
      "colNr": "2"
    }, {
      "val": ["=SUM(F5:OFFSET(F5, 0, 2))", "=SUM(F5:OFFSET(F5, 0, 2))"],
      "sheetName": "Investor_Gains",
      "rowNr": "4",
      "colNr": "3"
    }, {
      "val": [
        ["=$B5*10", "=$B5*50"],
        ["=$B5*10", "=$B5*50"]
      ],
      "sheetName": "Investor_Gains",
      "rowNr": "4",
      "colNr": "4"
    }];

    const result = parseSpec(getSpecCells(template), data, x => x);
    
    //console.log(JSON.stringify(result));

    expect(result).toEqual(expectedResult)
  });
})