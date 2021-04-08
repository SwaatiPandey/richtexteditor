import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Transforms } from "slate";
import { ReactEditor, useEditor } from "slate-react";
import { FaEllipsisV } from "react-icons/fa";

const DNDBlock = (props) => {
  const editor = useEditor();
  const [displayValue, setDisplayValue] = useState("none");
  const style = {
    padding: "1rem 2rem",
    backgroundColor: "white",
    display: "flex",
  };
  const { element } = props;
  const [{ opacity }, drag, preview] = useDrag(() => ({
    item: { type: "DNDBlock", element: element },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  const [, drop] = useDrop({
    accept: "DNDBlock",
    drop(item, monitor) {
      {
        const dragIndex = ReactEditor.findPath(editor, item.element);
        const hoverIndex = ReactEditor.findPath(editor, element);
        Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
      }
    },
  });

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
