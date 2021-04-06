import { useEditor } from "slate-react";
import { Editor } from "slate";

const Uppercase = (props) => {
  let editor = useEditor();
  if (editor.selection) {
    const { selection } = editor;
    const text = Editor.string(editor, selection);
    let newText = "";
    if (text === text.toUpperCase()) newText = text.toLowerCase();
    else newText = text.toUpperCase();
    Editor.deleteFragment(editor);
    Editor.insertText(editor, newText);
  }
  return (
    <div {...props.attributes}>
      <span>{props.children}</span>
    </div>
  );
};
export default Uppercase;
