import {
  EditorWebComponent,
  pluginMenuDe,
  pluginMenuEn,
} from "@serlo/editor-web-component";
import { LitElement, html } from "lit";

console.log("plugins", { pluginMenuEn, pluginMenuDe });
customElements.define("serlo-editor", EditorWebComponent);

// const initialExampleState = {
//   plugin: "rows",
//   state: [
//     {
//       plugin: "multimedia",
//       state: {
//         explanation: {
//           plugin: "rows",
//           state: [
//             {
//               plugin: "text",
//               state: [
//                 {
//                   type: "p",
//                   children: [
//                     {
//                       text: "example text",
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         multimedia: {
//           plugin: "image",
//           state: {
//             src: "",
//             caption: {
//               plugin: "text",
//               state: [
//                 {
//                   type: "p",
//                   children: [
//                     {
//                       text: "",
//                     },
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//         illustrating: true,
//         width: 50,
//       },
//     },
//   ],
// };

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
    editing1: { type: Boolean },
    editing2: { type: Boolean },
    isRenderedInShadowRoot: true,
    editorState1: { type: Object },
    editorState2: { type: Object },
    selectedPlugin1: { type: String },
    selectedPlugin2: { type: String },
  };

  constructor() {
    super();
    this.editing1 = false;
    this.editing2 = false;
    this.editorState1 = initialExampleState;
    this.editorState2 = initialExampleState;
    this.selectedPlugin1 = Plugin.Text;
    this.selectedPlugin2 = Plugin.Text;
  }

  createRenderRoot() {
    this.isRenderedInShadowRoot = false;
    return this;
  }

  getEditor(id) {
    return this.isRenderedInShadowRoot
      ? this.shadowRoot.querySelector(`serlo-editor[id="${id}"]`)
      : this.querySelector(`serlo-editor[id="${id}"]`);
  }

  writeCurrentEditorState(id) {
    const editor = this.getEditor(id);
    if (editor) {
      console.log(`Current state for editor ${id}:`, editor.currentState);
      this[`editorState${id}`] = editor.currentState;
    }
  }

  handleStateChange(event, id) {
    console.log(`Editor ${id} state updated:`, event.detail);
  }

  handlePluginChange(event, id) {
    this[`selectedPlugin${id}`] = event.target.value;
    this[`editing${id}`] = true;
    this.updateEditorStateWithInitialPlugin(id);
  }

  updateEditorStateWithInitialPlugin(id) {
    const selectedPluginConfig = pluginMenuDe[this[`selectedPlugin${id}`]];
    const pluginInitialState = selectedPluginConfig?.initialState || {
      plugin: this[`selectedPlugin${id}`],
      state: [],
    };
    this[`editorState${id}`] = pluginInitialState;
  }

  undo(id) {
    const editor = this.getEditor(id);
    if (editor && editor.history) {
      editor.history.dispatchUndo();
    }
  }

  redo(id) {
    const editor = this.getEditor(id);
    if (editor && editor.history) {
      editor.history.dispatchRedo();
    }
  }

  render() {
    return html`
      ${[1, 2].map(
        (id) => html`
          <div>
            <h2>Editor ${id}</h2>
            <button
              @click=${() => (this[`editing${id}`] = !this[`editing${id}`])}
            >
              ${this[`editing${id}`] ? "READ" : "EDIT"}
            </button>
            <button @click=${() => this.writeCurrentEditorState(id)}>
              Write current State
            </button>
            <button @click=${() => this.undo(id)}>Undo</button>
            <button @click=${() => this.redo(id)}>Redo</button>
            <select @change=${(e) => this.handlePluginChange(e, id)}>
            // Record<pluginid, { initialState, title, type }>
              ${Object.values(pluginMenuDe).map(
                ({ type, title }) => html`
                  <option
                    value="${type}"
                    ?selected=${type === this[`selectedPlugin${id}`]}
                  >
                    ${title}
                  </option>
                `
              )}
            </select>
            <div style="margin-top: 20px;">
              <serlo-editor
                id="${id}"
                use-shadow-dom=${!this.isRenderedInShadowRoot}
                mode=${this[`editing${id}`] ? "write" : "read"}
                initial-state=${JSON.stringify(this[`editorState${id}`])}
                @state-changed=${(e) => this.handleStateChange(e, id)}
              ></serlo-editor>
            </div>
          </div>
        `
      )}
    `;
  }
}

customElements.define("test-element", TestElement);
