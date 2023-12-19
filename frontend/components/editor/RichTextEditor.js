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
import { PiCrownSimpleBold } from "react-icons/pi";

const { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw } =
  Draft;

export default class RichEditorProjectDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.props.editorState || EditorState.createEmpty(),
      isFocused: false,
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
        4 /* maxDepth */,
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
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle),
    );
  }
  render() {
    const { editorState, isFocused } = this.state;
    const { turnOffBorders , alwaysShowButtons} = this.props;
    console.log(alwaysShowButtons);
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
      this.setState({ isFocused: false });
      localStorage.setItem(
        "projectDescriptionJson",
        JSON.stringify(contentStateJSON),
      );
    };
    const handleFocus = () => {
      this.setState({ isFocused: true });
    };
    return (
      <div
        className={`${
          !turnOffBorders &&
          (isFocused
            ? "border-white"
            : "border-transparent hover:border-border-default")
        } ${!turnOffBorders && "rounded-lg border"}`}
        onClick={this.focus}
      >
        <div
          className={`box-content flex min-h-[131px] flex-col justify-between p-3
        ${
          !turnOffBorders && (isFocused ? "border-white" : "border-transparent")
        } ${!turnOffBorders && "rounded-lg border"} bg-bg-secondary`}
        >
          <div className={`${className}`}>
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
              onFocus={handleFocus}
            />
          </div>
          <div
            className={`flex items-center ${
               alwaysShowButtons || isFocused ? "opacity-100" : "opacity-0"
            }`}
          >
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
        className={` mr-1 flex h-[28px] w-[28px] cursor-pointer items-center justify-center 
        rounded-md ${
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
        className={` flex h-[40px] cursor-pointer items-center rounded-lg px-2
        text-sm ${
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
    <div className=" blockStyles flex">
      <span
        className={` flex h-[28px] w-[28px] cursor-pointer items-center justify-center 
        rounded-md ${
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
      <i
        className="mx-1 flex h-[28px] w-[1px] items-center justify-center
       bg-muted-dark"
      />
      {showBlockStyles && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="rounded-lg border border-border-default bg-bg-secondary p-2 "
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
