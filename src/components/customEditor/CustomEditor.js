import React, { useCallback, useMemo, useState, useRef } from "react";
import { Editable, withReact, useSlate, useEditor, Slate } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from "slate";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { withHistory } from "slate-history";
import { Tooltip } from "react-tippy";
import DNDBlock from "../dndBlock/dndBlock";
import Checkbox from "../checkbox/Checkbox";
import Image, { InsertImageButton, withImages } from "../image/Image";
import Link, { LinkButton, withLinks } from "../link/Link";
import Video, { InsertVideoButton, withEmbades } from "../embeds/Embeds";
import Uppercase from "../uppercase/Uppercase";
// import Capitalize from "../capitalise/Capitalise";
import Styles from "../Styles/customEditor.module.css";
import "react-tippy/dist/tippy.css";
import "../../App.css";
import DragLayer from "../dndBlock/dndCustomLayer";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const CustomEditor = () => {
  const [value, setValue] = useState(initialValue);
  const [selectAll, setSelectAll] = useState(false);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const dndBlockRef = useRef(null);

  const editor = useMemo(
    () =>
      withEmbades(
        withLinks(withImages(withHistory(withReact(createEditor()))))
      ),
    []
  );
  // console.log(value);
  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <div className={Styles.mainContainer}>
        <div className={Styles.buttonContainer}>
          <Tooltip title="Bold" position="bottom">
            <MarkButton format="bold" icon="ri-bold" />
          </Tooltip>
          <Tooltip title="Italic" position="bottom">
            <MarkButton format="italic" icon="ri-italic" />
          </Tooltip>
          <Tooltip title="Underline" position="bottom">
            <MarkButton format="underline" icon="ri-underline" />
          </Tooltip>
          <Tooltip title="Code" position="bottom">
            <MarkButton format="code" icon="ri-code-line" />
          </Tooltip>
          <Tooltip title="Delete" position="bottom">
            <MarkButton format="delete" icon="ri-chat-delete-line" />
          </Tooltip>
          <Tooltip title="Highlighter" position="bottom">
            <MarkButton format="highlight" icon="ri-mark-pen-line" />
          </Tooltip>
          <Tooltip title="Uppercase" position="bottom">
            <MarkButton format="uppercase" icon="ri-font-size" />
          </Tooltip>
          <Tooltip title="Heading-one" position="bottom">
            <BlockButton format="heading-one" icon="ri-h-1" />
          </Tooltip>
          <Tooltip title="Heading-two" position="bottom">
            <BlockButton format="heading-two" icon="ri-h-2" />
          </Tooltip>
          <Tooltip title="Block-quote" position="bottom">
            <BlockButton format="block-quote" icon="ri-chat-quote-line" />
          </Tooltip>
          <Tooltip title="Numbered-list" position="bottom">
            <BlockButton format="numbered-list" icon="ri-list-ordered" />
          </Tooltip>
          <Tooltip title="Bulleted-list" position="bottom">
            <BlockButton format="bulleted-list" icon="ri-list-unordered" />
          </Tooltip>
          <Tooltip title="Checkbox" position="bottom">
            <BlockButton format="checkbox" icon="ri-checkbox-line" />
          </Tooltip>
          <Tooltip title="Image" position="bottom">
            <InsertImageButton format="image" icon="ri-image-add-line" />
          </Tooltip>
          <Tooltip title="Link" position="bottom">
            <LinkButton />
          </Tooltip>
          <Tooltip title="Video" position="bottom">
            <InsertVideoButton format="video" icon="ri-video-line" />
          </Tooltip>
        </div>
        <div>
          <DndProvider backend={HTML5Backend}>
            <Editable
              className={Styles.inputContainer}
              onKeyDown={(event) => {
                // console.log("Key Down", event.key);
                if (event.key === "a" && event.ctrlKey) {
                  event.preventDefault();
                  setSelectAll(true);
                  // console.log(editor.selection);
                  if (editor.selection) {
                    let range = null;
                    if (
                      editor.selection.anchor.offset ===
                      editor.selection.focus.offset
                    )
                      range = Editor.range(
                        editor,
                        editor.selection.anchor.path,
                        editor.selection.focus.path
                      );
                    else
                      range = Editor.range(
                        editor,
                        [0, 0],
                        [editor.children.length - 1, 0]
                      );
                    console.log(range);
                    Transforms.select(editor, range);
                    // let nodes = [];
                    // for (let i = 0; i < editor.children.length; i++) {
                    //   nodes.push(
                    //     Editor.node(
                    //       editor,
                    //       Editor.range(editor, [i, 0], [i, 0])
                    //     )
                    //   );
                    // }
                  }
                }
                if (!event.ctrlKey && event.key) {
                  if (
                    editor.selection?.anchor.offset !==
                    editor.selection?.focus.offset
                  ) {
                    setSelectAll(false);
                    Transforms.deselect(editor);
                  }
                }
              }}
              onClick={(event) => {
                if (
                  editor.selection?.anchor.offset !==
                  editor.selection?.focus.offset
                ) {
                  setSelectAll(false);
                  Transforms.deselect(editor);
                }
              }}
              renderElement={(props) => {
                return (
                  <DNDBlock
                    dndBlockRef={dndBlockRef}
                    selectAll={selectAll}
                    {...props}
                  >
                    {renderElement(props)}
                  </DNDBlock>
                );
              }}
              renderLeaf={renderLeaf}
            />
            <DragLayer />
            <div
              style={{
                position: "fixed",
                height: "5px",
                width: "70%",
                top: "-999px",
                zIndex: "999",
              }}
              ref={dndBlockRef}
            ></div>
          </DndProvider>
        </div>
      </div>
    </Slate>
  );
};

const Element = (props) => {
  const { attributes, element, children } = props;
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return (
        <ul style={{ margin: 0, padding: 0 }} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={{ margin: 0, padding: 0 }} {...attributes}>
          {children}
        </ol>
      );
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "checkbox":
      return <Checkbox {...props}>{children}</Checkbox>;
    case "image":
      return <Image {...props}>{children}</Image>;
    case "link":
      return <Link {...props}>{children}</Link>;
    case "video":
      return <Video {...props}>{children}</Video>;
    case "delete":
      return null;
    default:
      return <div {...attributes}>{children}</div>;
  }
};

const Leaf = (props) => {
  let { attributes, leaf, children } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.highlight) {
    children = <span style={{ background: "yellow" }}>{children}</span>;
  }
  if (leaf.selection) {
    children = (
      <div style={{ background: "cyan", width: "100%" }}>{children}</div>
    );
  }
  if (leaf.uppercase) {
    children = <Uppercase {...props}>{children}</Uppercase>;
  }
  return <span {...attributes}>{children}</span>;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });
  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (format === "delete") {
    Transforms.delete(editor, { type: format });
  }
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const BlockButton = ({ format, icon }) => {
  const editor = useEditor();
  const gray = "#696969";
  const [color, setColor] = useState(gray);
  return (
    <button
      className={Styles.button}
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <i
        className={icon}
        style={{ color: color }}
        onClick={() => {
          let newColor = "#000000";
          color === gray ? setColor(newColor) : setColor(gray);
        }}
      ></i>
    </button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const gray = "#696969";
  const [color, setColor] = useState(gray);
  return (
    <button
      className={Styles.button}
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <i
        className={icon}
        style={{ color: color }}
        onClick={() => {
          let newColor = "#000000";
          color === gray ? setColor(newColor) : setColor(gray);
        }}
      ></i>
    </button>
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of textarea!",
        // https://www.youtube.com/embed/X7R-q9rsrtU
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "It's rich text, you can do things like turn a selection of textarea!",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "It has roots in a piece of classical Latin literature from 45 BC.",
      },
    ],
  },
];
export default CustomEditor;
