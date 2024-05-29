import { EditorWebComponent } from "@serlo/editor-web-component";
import { LitElement, html } from "lit";

customElements.define("serlo-editor", EditorWebComponent);

const initialExampleState = {
  plugin: "rows",
  state: [
    {
      plugin: "text",
      state: [
        {
          type: "h",
          level: 1,
          children: [{ text: "Beispiel überschrift" }],
        },
      ],
    },
  ],
};

class TestElement extends LitElement {
  static properties = {
    editing: { type: Boolean },
  };

  constructor() {
    super();
    this.editing = false;
  }

  getCurrentEditorState() {
    const editor = this.shadowRoot.querySelector("serlo-editor");
    if (editor) {
      console.log("Current state:", editor.currentState);
    }
  }

  undo() {
    const editor = this.shadowRoot.querySelector("serlo-editor");
    if (editor && editor.history) {
      editor.history.dispatchUndo();
    }
  }

  redo() {
    const editor = this.shadowRoot.querySelector("serlo-editor");
    if (editor && editor.history) {
      editor.history.dispatchRedo();
    }
  }

  render() {
    return html`
      <button @click=${() => (this.editing = !this.editing)}>
        ${this.editing ? "READ" : "EDIT"}
      </button>
      <button @click=${this.getCurrentEditorState.bind(this)}>
        Get Current State
      </button>
      <button @click=${this.undo.bind(this)}>Undo</button>
      <button @click=${this.redo.bind(this)}>Redo</button>

      <serlo-editor
        mode=${this.editing ? "write" : "read"}
        initial-state=${JSON.stringify(initialExampleState)}
        @state-changed=${(e) => console.log("new state", e.detail)}
      ></serlo-editor>
    `;
  }
}

customElements.define("test-element", TestElement);
