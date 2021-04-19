import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Transforms, Editor } from "slate";
import { ReactEditor, useEditor } from "slate-react";
import { FaEllipsisV } from "react-icons/fa";
import { getEmptyImage } from "react-dnd-html5-backend";
import { CustomDragLayer } from "./dndCustomLayer";

const DNDBlock = (props) => {
  const editor = useEditor();
  const [displayValue, setDisplayValue] = useState("none");
  const [dragPosition, setDragPosition] = useState(undefined);
  const dndBlockRef = useRef(null);
  const blueLine = useRef(null);
  const style = {
    margin: "1rem 2rem",
    backgroundColor: "white",
    display: "flex",
  };
  const { element } = props;
  const [{ opacity }, drag, preview] = useDrag(() => ({
    item: { type: "DNDBlock", element: element },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0 : 1,
    }),
  }));
  const [, drop] = useDrop({
    accept: "DNDBlock",
    collect: (monitor) => {
      if (!monitor.isOver() && blueLine.current) {
        blueLine.current.style["opacity"] = "0";
        blueLine.current.style["border"] = "none";
      }
    },
    hover(item, monitor) {
      const hoverBoundingRect = dndBlockRef.current.getBoundingClientRect();
      const hoverRectMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = Math.round(clientOffset.y - hoverBoundingRect.top);
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      if (clientOffset.y < hoverBoundingRect.top) {
        blueLine.current.style["borderTop"] = "5px solid cyan";
        blueLine.current.style["borderBottom"] = "none";
        blueLine.current.style["opacity"] = "1";
        blueLine.current.style["marginTop"] = "-8px";
        setDragPosition("Top");
      } else if (clientOffset.y > hoverBoundingRect.bottom) {
        blueLine.current.style["borderTop"] = "none";
        blueLine.current.style["borderBottom"] = "5px solid cyan";
        blueLine.current.style["opacity"] = "1";
        blueLine.current.style["marginTop"] = "26px";
        setDragPosition("Bottom");
      }
    },
    drop(item, monitor) {
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      if (dragPosition === "Top") hoverIndex[0] = hoverIndex[0] - 1;
      Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
    },
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  const line = {
    width: "65%",
    height: "5px",
    opacity: "0",
    caretColor: "transparent",
    boxSizing: "border-box",
    position: "absolute",
  };
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
                ref={blueLine}
                contentEditable={false}
                style={{ borderTop: "5px solid cyan", ...line }}
              />
              <div
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
          <CustomDragLayer />
        </>
      )}
    </>
  );
};
export default DNDBlock;
