import React from 'react';

function TemplateUploader({ onLoad }) {
  function onChange(event) {
    const target = event.target;

    if (target.files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      onLoad(JSON.parse(event.target.result));
    };
    reader.readAsText(target.files[0]);
  }
  return (
    <input
      type="file"
      id="template"
      name="template"
      accept=".ssjson, .json"
      onChange={onChange}
    />
  );
}

export default TemplateUploader;

/* */
