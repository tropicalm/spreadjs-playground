import React from 'react';
import JsonEditor from './JsonEditor';

import 'brace/mode/json';
import 'brace/theme/github';
import Spread from './Spread';
import TemplateUploader from './TemplateUploader';
import api from './api';

function App() {
  //const [template, setTemplate] = React.useState();
  const [template, setTemplate] = React.useState(api.getTemplate());
  const [data, setData] = React.useState(api.db);
  const [dataBindings, setDataBindings] = React.useState(api.bindings);

  function onTemplateLoad(template) {
    api.setTemplateSpec(template);
    setTemplate(api.getTemplate());
  }

  function onDataApply() {
    api.setData(data);
    setTemplate(api.getTemplate());
  }

  return (
    <div>
      {!template && (
        <>
          <label htmlFor="template">
            <h2>Template</h2>
          </label>
          <TemplateUploader onLoad={onTemplateLoad} />
        </>
      )}

      {template && (
        <div style={{ display: 'flex' }}>
          <Spread
            template={template}
            data={dataBindings}
            onChange={setDataBindings}
          />

          <div style={{ width: '30%' }}>
            <button id="apply-btn" onClick={onDataApply}>
              Reload
            </button>

            <h3>Database</h3>
            <JsonEditor value={data} onChange={setData} />

            <h3>Data bindings</h3>
            <JsonEditor value={dataBindings} onChange={d => setDataBindings(d)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
