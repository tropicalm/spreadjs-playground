import React, {Component, useRef, useEffect} from 'react'
import ace from "brace";
import JSONEditorLib from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

function JSONEditor({value, onChange}) {
    const jsonEditor = useRef()
    const jsonEditorElement = useRef()
    const options = {
        mode: 'code',
        ace: ace,
        theme: "ace/theme/github",
        onChange: () => {
            try {
                const val = Object.assign({}, jsonEditor.current.get())
                return onChange(val)
            } catch(err) {
                console.log(err)
            }
        },
    }

    useEffect(() => {
        jsonEditor.current = new JSONEditorLib(jsonEditorElement.current, options)
        jsonEditor.current.set(value || {})
    }, [])

    useEffect(() => {
        jsonEditor.current.update(value)
    }, [value])

    return <div className="jsoneditor-react-container" ref={jsonEditorElement} />
}

export default JSONEditor