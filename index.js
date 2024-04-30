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

  render() {
    return html`
      <button @click=${() => (this.editing = !this.editing)}>
        toggle editing
      </button>
      <serlo-editor
        mode=${this.editing ? "write" : "read"}
        initial-state=${JSON.stringify(initialExampleState)}
        @state-changed=${(e) => console.log("new state", e.detail)}
      ></serlo-editor>
    `;
  }
}
customElements.define("test-element", TestElement);
