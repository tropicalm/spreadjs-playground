const {
  getSpecCells,
  parseSpecCell,
  parseSpec,
  parseSpecDef,
  groupCellsBySpec,
  getGroupRange,
  replaceSpecWithVal
} = require('../src/parser');
const template = require('../templates/template');

describe("Parser", () => {
  it('gets all spec cells from a template', () => {
    const spec = require('./fixtures/specCellsFiltered')
    const result = getSpecCells(template);
    expect(result).toEqual(spec)
  });

  it('gets all spec cells from a template', () => {
    const spec = require('./fixtures/specCellsGrouped')
    const specCells = getSpecCells(template)
    let result = groupCellsBySpec(specCells);
    expect(result).toEqual(spec)
  });

  it('parses a spec definition', () => {
    let spec, result
    
    spec = "repeat for inv in investments below"
    result = parseSpecDef(spec)
    expect(result).toEqual({"below": ["inv", "investments"]})

    spec = "repeat for invr in investors to the right"
    result = parseSpecDef(spec)
    expect(result).toEqual({"right": ["invr", "investors"]})

    spec = "repeat for inv in investments below\nrepeat for invr in investors to the right"
    result = parseSpecDef(spec)
    expect(result).toEqual({"below": ["inv", "investments"], "right": ["invr", "investors"]})
  })

  it('gets a group range', () => {
    let group, result
    const specCells = getSpecCells(template)
    const groupedCells = groupCellsBySpec(specCells)
    
    group = groupedCells["Investor_Gains"]["repeat for inv in investments below"]
    result = getGroupRange(group)
    expect(result).toEqual({"x": 3, "y": 1})
    
    group = groupedCells["Investor_Gains"]["repeat for invr in investors to the right"]
    result = getGroupRange(group)
    expect(result).toEqual({"x": 1, "y": 2})

  })

  it('parses a loop containing an value', () => {
    let spec, cells, result, defs
    const specCells = getSpecCells(template)
    const groupedCells = groupCellsBySpec(specCells)
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

    spec = require('./fixtures/specCellsParsed')
    defs = "repeat for inv in investments below"
    cells = groupedCells["Investor_Gains"][defs]
    result = parseSpecCell(defs, cells, data);

    expect(result).toEqual(spec)
  });



  it.skip('parses a loop containing a formula', () => {
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
    let expectedResult, result
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

    expectedResult = require('./fixtures/specParsed')
    result = parseSpec(template, data);
    expect(result).toEqual(expectedResult)    
  });
})