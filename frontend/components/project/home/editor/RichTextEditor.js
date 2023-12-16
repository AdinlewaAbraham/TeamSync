import React, { useEffect, useState } from "react";
import Draft from "draft-js";
import "./rich.css";
import {
  Fa500Px,
  FaBold,
  FaUnderline,
  FaItalic,
  FaListOl,
  FaList,
  FaCode,
  FaPlus,
} from "react-icons/fa";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";
import { usePopper } from "react-popper";

const { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw } =
  Draft;

export default class RichEditorProjectDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.props.editorState || EditorState.createEmpty(),
    };
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
    const handleBlur = () => {
      localStorage.setItem(
        "projectDescriptionJson",
        JSON.stringify(contentStateJSON)
      );
    };
    return (
      <div
        className="bg-bg-secondary border-2 border-white rounded-lg p-3 min-h-[131px]
       box-content flex flex-col justify-between"
      >
        <div className={`${className} mb-3`} onClick={this.focus}>
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
            onBlur={handleBlur}
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
export const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
export function getBlockStyle(block) {
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
        className={` flex justify-center items-center h-[28px] w-[28px] rounded-md mr-1 
        cursor-pointer ${
          this.props.active
            ? "bg-accent-blue bg-opacity-30 hover:bg-opacity-50"
            : " bg-transparent hover:bg-menuItem-active"
        }`}
        onMouseDown={this.onToggle}
      >
        <i
          className={` ${
            this.props.active ? "text-accent-blue" : "text-muted-border"
          }`}
        >
          {this.props.icon}
        </i>
      </span>
    );
  }
}

class ButtonListItem extends React.Component {
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
        className={` flex items-center h-[40px] rounded-lg px-2 text-sm
        cursor-pointer ${
          this.props.active
            ? "bg-accent-blue bg-opacity-30 hover:bg-opacity-50"
            : " bg-transparent hover:bg-menuItem-active"
        }`}
        onMouseDown={this.onToggle}
      >
        <i
          className={`mr-2 ${
            this.props.label.endsWith("list") ? "text-[17x]" : "text-[20px]"
          } ${this.props.active ? "text-accent-blue" : "text-muted-border"}`}
        >
          {this.props.icon}
        </i>
        {this.props.label}
      </span>
    );
  }
}
const BLOCK_TYPES = [
  { label: "Heading 1", style: "header-one", icon: <LuHeading1 /> },
  { label: "Heading 2", style: "header-two", icon: <LuHeading2 /> },
  { label: "Heading 3", style: "header-three", icon: <LuHeading3 /> },
  { label: "Heading 4", style: "header-four", icon: <LuHeading4 /> },
  { label: "Heading 5", style: "header-five", icon: <LuHeading5 /> },
  { label: "Heading 6", style: "header-six", icon: <LuHeading6 /> },
  // { label: "Blockquote", style: "blockquote", icon: <Fa500Px /> },
  { label: "Bulleted list", style: "unordered-list-item", icon: <FaList /> },
  { label: "Numbered list", style: "ordered-list-item", icon: <FaListOl /> },
  { label: "Code Block", style: "code-block", icon: <FaCode /> },
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
      <span
        className={` flex justify-center items-center h-[28px] w-[28px] rounded-md 
        cursor-pointer ${
          showBlockStyles
            ? "bg-accent-blue bg-opacity-30 hover:bg-opacity-50"
            : " bg-transparent hover:bg-menuItem-active"
        }`}
        onClick={() => setShowBlockStyles(!showBlockStyles)}
        ref={setReferenceElement}
      >
        <i
          className={` ${
            showBlockStyles ? "text-accent-blue" : "text-muted-border"
          }`}
        >
          <FaPlus />
        </i>
      </span>
      <i className="flex justify-center items-center w-[1px] h-[28px] bg-muted-dark
       mx-1" />
      {showBlockStyles && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="p-2 bg-bg-secondary border border-border-default rounded-lg "
        >
          {BLOCK_TYPES.map((type) => (
            <ButtonListItem
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
  { label: "Bold", style: "BOLD", icon: <FaBold /> },
  { label: "Italic", style: "ITALIC", icon: <FaItalic /> },
  { label: "Underline", style: "UNDERLINE", icon: <FaUnderline /> },
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
