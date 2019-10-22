import React from "react";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-print";
import "@grapecity/spread-sheets-pdf";
import { saveAs } from "file-saver";

const setSheetDataSource = (spread, data, template, spec) => {
  const sheet = spread.getActiveSheet();
  sheet.setDataSource(new GC.Spread.Sheets.Bindings.CellBindingSource(data));
};

const Spread = ({ template, data, spec }) => {
  const spread = React.useRef(null);
  const spreadRef = React.useRef(null);
  const formulaRef = React.useRef(null);
  const statusbarRef = React.useRef(null);

  React.useEffect(() => {
    spread.current = new GC.Spread.Sheets.Workbook(spreadRef.current);
    window.spread = spread.current;
    window.GC = GC;
    const fbx = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(
      formulaRef.current
    );
    fbx.workbook(spread.current);

    const statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
      statusbarRef.current
    );
    statusBar.bind(spread.current);

    spread.current.fromJSON(template);

    setSheetDataSource(spread.current, data, template, spec);

    spread.current.bind(GC.Spread.Sheets.Events.ActiveSheetChanged, function(
      sender,
      args
    ) {
      setSheetDataSource(spread.current, data, template, spec);
    });



    return () => {
      spread.current.destroy();
      fbx.destroy();
      statusBar.dispose();
    };
  }, [template, data, spec]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div>
        <div
          ref={formulaRef}
          contentEditable
          style={{ overflow: "hidden", padding: 5, border: "1px solid" }}
        />
      </div>
      <div ref={spreadRef} style={{ flex: 1, height: "100%" }} />
      <div ref={statusbarRef} />

      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ padding: 10 }}
          onClick={() =>
            spread.current.savePDF(
              function(blob) {
                saveAs(blob, "foo.pdf");
              },
              function(error) {
                console.log(error);
              },
              {
                title: "Test Title",
                author: "Test Author",
                subject: "Test Subject",
                keywords: "Test Keywords",
                creator: "test Creator"
              }
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
      </div>
    </div>
  );
};

export default Spread;
