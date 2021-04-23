import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Transforms } from "slate";
import { ReactEditor, useEditor } from "slate-react";
import { FaEllipsisV } from "react-icons/fa";
import { getEmptyImage } from "react-dnd-html5-backend";
import Styles from "../Styles/dnd.module.css";

const DNDBlock = (props) => {
  const editor = useEditor();
  const [displayValue, setDisplayValue] = useState("none");
  const dndBlockRef = useRef(null);
  const style = {
    margin: "1rem 2rem",
    backgroundColor: "white",
    display: "flex",
  };
  const { element } = props;
  const [, drag, preview] = useDrag(() => ({
    item: { type: "DNDBlock", element: element },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0 : 1,
    }),
  }));
  const [, drop] = useDrop({
    accept: "DNDBlock",
    collect: (monitor) => {
      if (!monitor.isOver() && props.dndBlockRef.current) {
        props.dndBlockRef.current.style["border"] = "none";
        props.dndBlockRef.current.style["top"] = `-999px`;
      }
    },
    hover(item, monitor) {
      const hoverBoundingRect = dndBlockRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      // const hoverRectMiddleY =
      //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // const hoverClientY = Math.round(clientOffset.y - hoverBoundingRect.top);
      // const dragIndex = ReactEditor.findPath(editor, item.element);
      // const hoverIndex = ReactEditor.findPath(editor, element);
      // const hoverBoundingLine = props.dndBlockRef.current.getBoundingClientRect();
      if (clientOffset.y < hoverBoundingRect.top) {
        props.dndBlockRef.current.style["borderTop"] = "5px solid cyan";
        props.dndBlockRef.current.style["top"] = `${hoverBoundingRect.top}px`;
      } else if (clientOffset.y > hoverBoundingRect.bottom) {
        props.dndBlockRef.current.style["borderTop"] = "5px solid cyan";
        props.dndBlockRef.current.style[
          "top"
        ] = `${hoverBoundingRect.bottom}px`;
      }
    },
    drop(item, monitor) {
      const hoverBoundingRect = dndBlockRef.current.getBoundingClientRect();
      const hoverBoundingLine = props.dndBlockRef.current.getBoundingClientRect();
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      if (hoverBoundingRect.y < hoverBoundingLine.y)
        hoverIndex[0] = hoverIndex[0] + 1;
      Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
    },
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  const currentIndex = editor.children.indexOf(props.element);
  const currentAnchor = editor.selection?.anchor.path[0];
  const currentFocus = editor.selection?.focus.path[0];
  let select = "";
  if (editor.selection?.anchor.offset !== editor.selection?.focus.offset) {
    if (currentAnchor === currentFocus) select = "single";
    else select = "all";
  }
  return (
    <>
      {props.element.type === "link" ? (
        <> {props.children}</>
      ) : (
        <>
          <div
            ref={preview}
            style={{ ...style }}
            onMouseEnter={() => setDisplayValue("inline")}
            onMouseLeave={() => setDisplayValue("none")}
          >
            <div
              ref={drop}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                outline: "none",
              }}
            >
              <div
                className={
                  props.selectAll
                    ? select === "single"
                      ? currentIndex === currentAnchor
                        ? Styles["selection-halo"]
                        : Styles[""]
                      : Styles["selection-halo"]
                    : Styles[""]
                }
                ref={dndBlockRef}
                style={{
                  display: "flex",
                  width: "100%",
                  outline: "none",
                }}
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
          </div>
        </>
      )}
    </>
  );
};
export default DNDBlock;
