import React from 'react';
import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-print';
import '@grapecity/spread-sheets-pdf';
import { saveAs } from 'file-saver';
import {getRefValues} from './customDataBinding'

const setSheetDataSource = (spread, data) => {
  const sheet = spread.getActiveSheet();
  const dataBindings = JSON.parse(JSON.stringify(data));
  sheet.setDataSource(
    new GC.Spread.Sheets.Bindings.CellBindingSource(dataBindings),
  );
};

const Spread = ({ template, data, onChange }) => {
  const spread = React.useRef(null);
  const spreadRef = React.useRef(null);
  const formulaRef = React.useRef(null);
  const statusbarRef = React.useRef(null);

  React.useEffect(() => {
    spread.current = new GC.Spread.Sheets.Workbook(spreadRef.current);
    window.spread = spread.current;
    window.GC = GC;

    const fbx = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(
      formulaRef.current,
    );
    fbx.workbook(spread.current);

    const statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
      statusbarRef.current,
    );

    statusBar.bind(spread.current);
    spread.current.fromJSON(template);
    setSheetDataSource(spread.current, data);

    spread.current.bind(GC.Spread.Sheets.Events.CellChanged, (e, info) => {
      const sheet = spread.current.getActiveSheet();
      const data = sheet.getDataSource()['xf'];
      onChange && onChange({
        bindings: Object.assign({}, data),
        refs: getRefValues(spread.current.toJSON())
      });
    });

    return () => {
      spread.current.destroy();
      fbx.destroy();
      statusBar.dispose();
    };
  }, []);

  React.useEffect(() => {
    spread.current.fromJSON(template);
    setSheetDataSource(spread.current, data);
  }, [template]);

  React.useEffect(() => {
    setSheetDataSource(spread.current, data);
    onChange && onChange({
      refs: getRefValues(spread.current.toJSON())
    });
  }, [data]);

  return (
    <div
      style={{
        width: '60vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <div
          ref={formulaRef}
          contentEditable
          style={{ overflow: 'hidden', padding: 5, border: '1px solid' }}
        />
      </div>
      <div ref={spreadRef} style={{ flex: 1, height: '100%' }} />
      <div ref={statusbarRef} />

      {/* <div style={{ position: 'fixed', bottom: 50, right: 50 }}>
        <button
          style={{ padding: 10 }}
          onClick={() =>
            spread.current.savePDF(
              function(blob) {
                saveAs(blob, 'foo.pdf');
              },
              function(error) {
                console.log(error);
              },
              {
                title: 'Test Title',
                author: 'Test Author',
                subject: 'Test Subject',
                keywords: 'Test Keywords',
                creator: 'test Creator',
              },
            )
          }
        >
          Export PDF
        </button>
        <button
          style={{ padding: 10 }}
          onClick={() =>
            console.log({ template: spread.current.toJSON(), data })
          }
        >
          Save
        </button>
      </div> */}
    </div>
  );
};

export default Spread;