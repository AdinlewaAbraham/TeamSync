import React, { useEffect, useState } from "react";
import Draft from "draft-js";
import "./rich.css";
import { Fa500Px, FaCalculator } from "react-icons/fa";
import { usePopper } from "react-popper";

const { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw } =
  Draft;

export default class RichEditorProjectDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }
  render() {
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }

    const editorContent = editorState.getCurrentContent();
    const contentStateJSON = convertToRaw(editorContent);

    return (
      <div className="bg-bg-secondary border-2 border-white rounded-lg px-2 py-1 ">
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            placeholder=""
            ref="editor"
            spellCheck={true}
          />
        </div>
        <div className="flex">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
        </div>
      </div>
    );
  }
}
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    return (
      <span
        className={` flex justify-center items-center px-2 ${
          this.props.active ? "bg-blue-300" : " bg-transparent "
        }`}
        onMouseDown={this.onToggle}
      >
        {this.props.label}
        {this.props.icon}
      </span>
    );
  }
}
const BLOCK_TYPES = [
  { label: "H1", style: "header-one", icon: <Fa500Px /> },
  { label: "H2", style: "header-two", icon: <Fa500Px /> },
  { label: "H3", style: "header-three", icon: <Fa500Px /> },
  { label: "H4", style: "header-four", icon: <Fa500Px /> },
  { label: "H5", style: "header-five", icon: <Fa500Px /> },
  { label: "H6", style: "header-six", icon: <Fa500Px /> },
  { label: "Blockquote", style: "blockquote", icon: <Fa500Px /> },
  { label: "UL", style: "unordered-list-item", icon: <Fa500Px /> },
  { label: "OL", style: "ordered-list-item", icon: <Fa500Px /> },
  { label: "Code Block", style: "code-block", icon: <Fa500Px /> },
];
const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const [showBlockStyles, setShowBlockStyles] = useState(false);
  useEffect(() => {
    const hanldeClick = (e) => {
      if (!e.target.closest(".blockStyles")) {
        setShowBlockStyles(false);
      }
    };
    document.addEventListener("click", hanldeClick);
    return () => document.removeEventListener("click", hanldeClick);
  }, []);

  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const [arrowElement, setArrowElement] = useState();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  return (
    <div className=" flex blockStyles">
      <i
        onClick={() => setShowBlockStyles(true)}
        className="mr-2"
        ref={setReferenceElement}
      >
        show
      </i>

      {showBlockStyles && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {BLOCK_TYPES.map((type) => (
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
              icon={type.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};
var INLINE_STYLES = [
  { label: "Bold", style: "BOLD", icon: <FaCalculator /> },
  { label: "Italic", style: "ITALIC", icon: <FaCalculator /> },
  { label: "Underline", style: "UNDERLINE", icon: <FaCalculator /> },
  { label: "Monospace", style: "CODE", icon: <FaCalculator /> },
];
const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="flex">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
        />
      ))}
    </div>
  );
};
