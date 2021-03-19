// import { useRef } from "react";
// import { useDrag, useDrop } from "react-dnd";

// import { Editor, Transforms } from "slate";
// import { ReactEditor, useEditor } from "slate-react";

// const handleCheckbox = (e) => {
//   e.preventDefault();
//   this.useState({ checked: false });
// };

const Checkbox = (props) => {
  // console.log(props);
  // const ref = useRef(null);
  // const editor = useEditor();
  // const { element } = props;
  // // const Path = ReactEditor.findPath(editor, element);
  // // console.log(Path);
  // const [{ isDragging }, drag] = useDrag({
  //   item: { type: "Checkbox", element: element },
  //   // item:{} props.element,
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // });
  // const opacity = isDragging ? 0.4 : 1;

  // const [, drop] = useDrop({
  //   accept: "Checkbox",
  //   hover(item, monitor) {
  //     if (!ref.current) {
  //       return;
  //     }
  //     // console.log(item);
  //     // const dragIndex = item.path[0];
  //     // const hoverIndex = Path[0];
  //     const dragIndex = ReactEditor.findPath(editor, item.element);
  //     const hoverIndex = ReactEditor.findPath(editor, element);
  //     console.log("for drag", dragIndex);
  //     console.log("for hover", hoverIndex);
  //   },
  //   drop(item, monitor) {
  //     // const dragIndex = item.path[0];
  //     // const hoverIndex = Path[0];
  //     const dragIndex = ReactEditor.findPath(editor, item.element);
  //     const hoverIndex = ReactEditor.findPath(editor, element);
  //     if (dragIndex === hoverIndex) {
  //       return;
  //     }

  //     moveItem(dragIndex, hoverIndex);
  //     item.path = hoverIndex;
  //   },
  // });

  // const moveItem = (dragIndex, hoverIndex) => {
  //   Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex });
  // };
  // drag(drop(ref));
  return (
    <div
      {...props.attributes}
      style={{
        userSelect: "none",
      }}
      // contentEditable={true}
    >
      <input type="checkbox"></input>
      <span>{props.children}</span>
    </div>
  );
};
export default Checkbox;
