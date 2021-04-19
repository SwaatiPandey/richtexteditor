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
  // const upwardRef = useRef(null);
  // const downwardRef = useRef(null);
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
      // if (!monitor.isOver() && downwardRef.current && upwardRef.current) {
      if (!monitor.isOver() && blueLine.current) {
        // downwardRef.current.style["opacity"] = "0";
        // upwardRef.current.style["opacity"] = "0";
        blueLine.current.style["opacity"] = "0";
        blueLine.current.style["border"] = "none";
      }
    },
    hover(item, monitor) {
      // console.log(monitor.getClientOffset());
      // console.log(dndBlockRef.current.getBoundingClientRect());
      const hoverBoundingRect = dndBlockRef.current.getBoundingClientRect();
      const hoverRectMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = Math.round(clientOffset.y - hoverBoundingRect.top);
      // console.log("box's Middle", hoverRectMiddleY);
      // console.log("Hover's Middle", hoverClientY);
      // if (hoverClientY <= hoverRectMiddleY) {
      //   upwardRef.current.style["opacity"] = "1";
      //   upwardRef.current.style["marginTop"] = "-8px";
      //   downwardRef.current.style["opacity"] = "0";
      // } else {
      //   upwardRef.current.style["opacity"] = "0";
      //   downwardRef.current.style["opacity"] = "1";
      //   downwardRef.current.style["marginTop"] = "26px";
      // }
      // console.log("Upward Ref", upwardRef.current.style);
      // console.log("Downward Ref", downwardRef.current.style);
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      // console.log("for hover", hoverIndex);
      // console.log("for drag", dragIndex);
      // insert blue line at hoverIndex +1/-1
      // console.log("Editor", editor);
      // if (hoverClientY <= hoverRectMiddleY) {
      if (clientOffset.y < hoverBoundingRect.top) {
        blueLine.current.style["borderTop"] = "5px solid cyan";
        blueLine.current.style["borderBottom"] = "none";
        blueLine.current.style["opacity"] = "1";
        blueLine.current.style["marginTop"] = "-8px";
        setDragPosition("Top");
        //  Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
      } else if (clientOffset.y > hoverBoundingRect.bottom) {
        blueLine.current.style["borderTop"] = "none";
        blueLine.current.style["borderBottom"] = "5px solid cyan";
        blueLine.current.style["opacity"] = "1";
        blueLine.current.style["marginTop"] = "26px";
        setDragPosition("Bottom");
        //  Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
      }
      // else {
      //   blueLine.current.style["opacity"] = "0";
      //   blueLine.current.style["border"] = "none";
      // }
      // console.log("Blue Line", blueLine);
      // console.log("for hover", hoverIndex);
      // console.log("for drag", dragIndex);
      // const { selection } = editor;
      // for (const [element, path] of Editor.nodes(editor, {
      //   at: selection,
      //   match: (n) => Editor.isBlock(editor, n) && n.type !== "docs",
      // })) {
      //   console.log("Drag path", path);
      // }
    },
    drop(item, monitor) {
      const dragIndex = ReactEditor.findPath(editor, item.element);
      const hoverIndex = ReactEditor.findPath(editor, element);
      if (dragPosition === "Top") hoverIndex[0] = hoverIndex[0] - 1;
      Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
      // console.log("for hover", hoverIndex);
      // console.log("for drag", dragIndex);
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
    // marginTop: "-8px",
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
              {/* <span
                ref={upwardRef}
                contentEditable={false}
                style={{ borderTop: "5px solid cyan", ...line }}
              /> */}
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
              {/* <span
                ref={downwardRef}
                contentEditable={false}
                style={{ borderTop: "5px solid cyan", ...line }}
              /> */}
            </div>
          </div>
          <CustomDragLayer />
        </>
      )}
    </>
  );
};
export default DNDBlock;
