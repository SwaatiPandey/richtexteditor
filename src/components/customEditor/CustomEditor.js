import React, { useCallback, useMemo, useState, useContext } from "react";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from "slate";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { withHistory } from "slate-history";
import "../../App.css";
import Image, { InsertImageButton, withImages } from "../image/Image";
import Link, { LinkButton, withLinks } from "../link/Link";
import Video, { InsertVideoButton, withEmbades } from "../embeds/Embeds";
import Checkbox from "../checkbox/Checkbox";
import DNDBlock from "../dndBlock/dndBlock";
import Styles from "../Styles/customEditor.module.css";
import { EditorContext } from "../../index";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const CustomEditor = () => {
  const [value, setValue] = useState(initialValue);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const editor = useMemo(
    () =>
      withEmbades(
        withLinks(withImages(withHistory(withReact(createEditor()))))
      ),
    []
  );
  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <div className={Styles.mainContainer}>
        <div className={Styles.buttonContainer}>
          <MarkButton format="bold" icon="B" />
          <MarkButton format="italic" icon="I" />
          <MarkButton format="underline" icon="U" />
          <MarkButton format="code" icon="<>" />
          <MarkButton format="delete" icon="D" />
          <MarkButton format="highlight" icon="M" />
          <BlockButton format="heading-one" icon="h1" />
          <BlockButton format="heading-two" icon="h2" />
          <BlockButton format="block-quote" icon="''" />
          <BlockButton format="numbered-list" icon="numbered" />
          <BlockButton format="bulleted-list" icon="bulleted" />
          <BlockButton format="checkbox" icon="checkbox" />
          <InsertImageButton format="image" icon="image" />
          <LinkButton />
          <InsertVideoButton format="video" icon="video" />
        </div>
        <div className={Styles.inputContainer}>
          <DndProvider backend={HTML5Backend}>
            <Editable
              renderElement={(props) => {
                return <DNDBlock {...props}>{renderElement(props)}</DNDBlock>;
              }}
              renderLeaf={renderLeaf}
            />
          </DndProvider>
        </div>
      </div>
    </Slate>
  );
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

const Element = (props) => {
  const { attributes, element, children } = props;
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
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
    // case "dropdown":
    //   return <ol {...attributes}>{children}</ol>;
    default:
      return <div {...attributes}>{children}</div>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
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
  return <span {...attributes}>{children}</span>;
};
const BlockButton = ({ format, icon }) => {
  // const editor = useEditor();
  const editor = useContext(EditorContext).editor();
  return (
    <button
      className={Styles.button}
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </button>
  );
};
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      className={Styles.button}
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};
const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text",
      },
    ],
  },
  // {
  //   type: "image",
  //   url:
  //     "https://images-na.ssl-images-amazon.com/images/I/61OXKrkiy-L._SL1399_.jpg",
  //   children: [{ text: "this is jerry" }],
  // },
  // {
  //   type: "checkbox",
  //   children: [
  //     {
  //       text: "first Checkbox",
  //     },
  //   ],
  // },
  // {
  //   type: "checkbox",
  //   children: [
  //     {
  //       text: "Second Checkbox",
  //     },
  //   ],
  // },
  // {
  //   type: "checkbox",
  //   children: [
  //     {
  //       text: "Third Checkbox",
  //     },
  //   ],
  // },
];

export default CustomEditor;
