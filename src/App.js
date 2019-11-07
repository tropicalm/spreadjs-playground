import React from "react";
import { JsonEditor } from "jsoneditor-react";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";
import Spread from "./Spread";

const PT = require("./process-template");

const processTemplate = PT();

function App() {

  const [template, setTemplate] = React.useState();
  const [data, setData] = React.useState({
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
  });
  const [isReady, setIsReady] = React.useState(false);
  const [spec, setSpec] = React.useState();
  return (
    <div>

      {!template && (
        <>
          <label htmlFor="template">
            <h2>Template</h2>
          </label>
          <input
            type="file"
            id="template"
            name="template"
            accept=".ssjson, .json"
            onChange={event => {
              const target = event.target;
              
              if (target.files.length === 0) {
                return;
              }

              const reader = new FileReader();
              reader.onload = event => {
                setTemplate(JSON.parse(event.target.result));
                setSpec(JSON.parse(event.target.result));
              };
              reader.readAsText(target.files[0]);
            }}
          />
        </>
      )}

      {template && (
        <div>
          <button
            onClick={() => {
              setSpec(processTemplate(template, data));
              setIsReady(true);              
            }}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              padding: 10,
              zIndex: 99
            }}
          >
            Done
          </button>

      <div style={{display: "flex"}}> 
        <div style={{width: "70%"}}>
          <Spread template={spec} spec={spec}/>
        </div>
        <div style={{width: "30%"}}>
        <h3>Data</h3>
          <JsonEditor
            value={data}
            onChange={newData => setData(newData)}
            onError={error => console.log(error)}
            mode={JsonEditor.modes.code}
            ace={ace}
            theme="ace/theme/github"
          />
        </div>
      </div>
      </div>
      )}
    </div>
  );
}

export default App;
