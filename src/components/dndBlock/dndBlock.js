import { useRef, useState, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { FaEllipsisV } from "react-icons/fa";
import { EditorContext } from "../../index";

const DNDBlock = (props) => {
  // Normal Declaration
  // const editorContext = useContext(EditorContext);
  // const editor = editorContext.editor();
  // Chaining Declaration
  const editor = useContext(EditorContext).editor();
  // useEditor() consumes more memory so another alternative
  // editor uses the Editor Context using the useContext Hook
  // & this Context has the editor function in it
  // this function is called after the Editor Context is used
  //
  const [displayValue, setDisplayValue] = useState("none");
  const style = {
    padding: "1rem 2rem",
    backgroundColor: "white",
    display: "flex",
  };
  const ref = useRef(null);
  // const editor = useEditor();
  const { element } = props;

  const [, drop] = useDrop({
    accept: "DNDBlock",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      console.log("for drag", dragIndex);
      console.log("for hover", hoverIndex);
    },
    drop(item, monitor) {
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      if (dragIndex === hoverIndex) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
    },
  });

  const moveItem = (dragIndex, hoverIndex) => {
    Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
  };

  const [{ opacity }, drag, preview] = useDrag(() => ({
    item: { type: "DNDBlock", element: element },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));
  return (
    <>
      <div
        ref={preview}
        style={{ ...style, opacity }}
        onMouseEnter={() => setDisplayValue("inline")}
        onMouseLeave={() => setDisplayValue("none")}
      >
        <div
          ref={drop}
          style={{ display: "flex", width: "100%", outline: "none" }}
        >
          <div
            contentEditable={false}
            ref={drag}
            style={{ width: "1rem", height: "1rem" }}
          >
            <FaEllipsisV style={{ display: `${displayValue}` }} />
          </div>
          {props.children}
        </div>
      </div>
    </>
  );
};
export default DNDBlock;
