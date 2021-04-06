import { useEditor } from "slate-react";
import { Editor } from "slate";

const Capitalize = (props) => {
  let editor = useEditor();
  console.log(editor.normalizeNode);
  if (editor.selection) {
    const { selection } = editor;
    const text = Editor.string(editor, selection);
    let newText = "";
    const textArray = text.split(" ");
    textArray.forEach((text, i) => {
      if (
        text.charAt(0) === text.charAt(0).toUpperCase() &&
        text.charAt(1) !== text.charAt(1).toUpperCase()
      ) {
        if (i !== 0) newText = newText + " ";
        newText = newText + text.toLowerCase();
      } else {
        if (i !== 0) newText = newText + " ";
        newText =
          newText + text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }
    });
    Editor.deleteFragment(editor);
    Editor.insertText(editor, newText);
  }
  return (
    <div {...props.attributes}>
      <span>{props.children}</span>
    </div>
  );
};
export default Capitalize;
