const {
  getDataBindingDefs,
  getTemplateWithCustomDataBinding,
  getRefValues,
} = require('../src/customDataBinding');

describe('Custom Data Binding', () => {
  it('gets data binding defs', () => {
    const template = require('./fixtures/templateWithBinding');
    const expected = [
      { col: 1, row: 2, name: 'another_kpi', sheetName: 'Sheet2' },
      { col: 0, row: 1, name: 'first_kpi', sheetName: 'Sheet1' },
    ];
    const result = getDataBindingDefs(template.names);
    expect(result).toEqual(expected);
  });

  it('gets new template with data bindings', () => {
    const template = require('./fixtures/templateWithBinding');
    const expected = {
      sheets: {
        Sheet2: {
          data: {
            dataTable: {
              '2': { '1': { bindingPath: 'another_kpi', formula: null } },
            },
          },
        },
        Sheet1: {
          data: {
            dataTable: {
              '1': { '0': { bindingPath: 'first_kpi', formula: null } },
            },
          },
        },
      },
      designerBindingPathSchema: {
        properties: {
          another_kpi: { dataFieldType: 'text', type: 'string' },
          first_kpi: { dataFieldType: 'text', type: 'string' },
        },
      },
    };
    const result = getTemplateWithCustomDataBinding(template);
    expect(result).toEqual(expected);
  });

  it('gets values of refs', () => {
    const template = require('./fixtures/templateWithBinding');
    const expected = [
      { name: 'read_only_kpi', value: 123 },
      { name: 'another_read_only_kpi', value: 321, formula: 'SUM(B1:B3)' },
    ];

    const result = getRefValues(template);
    expect(result).toEqual(expected);
  });
});
