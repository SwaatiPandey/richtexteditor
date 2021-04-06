import { useRef, useState, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { FaEllipsisV } from "react-icons/fa";
import { EditorContext } from "../../index";

const DNDBlock = (props) => {
  const editor = useContext(EditorContext).editor();
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
      // console.log(item.test);
      while (item.test !== true) {
        // console.log(item);
        const dragIndex = ReactEditor.findPath(editor, item.element);
        const hoverIndex = ReactEditor.findPath(editor, element);
        if (dragIndex === hoverIndex) {
          return;
        }
        moveItem(dragIndex, hoverIndex);
        item.test = true;
      }
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
  // console.log(props);
  // console.log(props.element.type);
  return (
    <>
      {props.element.type === "link" ? (
        <> {props.children}</>
      ) : (
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
              onDrag={(event) => event.stopPropagation()}
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
      )}
    </>
  );
};
export default DNDBlock;
