import React, { useState } from "react";
import { Registry } from "react-registry";
import { useEditor } from "slate-react";
import { Editor, Transforms } from "slate";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { leafCategories } from "../leafCategories";

export const textTransform = () => {
  const editor = useEditor();
  const [currentFont, setCurrentFont] = useState("Text Case");

  const handleMenuClick = (textTransform) => {
    const { selection } = editor;
    if (
      (textTransform === "Uppercase" || textTransform === "Capitalize") &&
      editor.selection
    ) {
      const { selection } = editor;
      const text = Editor.string(editor, selection);
      let newText = "";
      if (textTransform === "Uppercase") {
        setCurrentFont("Uppercase");
        if (text === text.toUpperCase()) newText = text.toLowerCase();
        else newText = text.toUpperCase();
        Editor.deleteFragment(editor);
        Editor.insertText(editor, newText);
      } else if (textTransform === "Capitalize") {
        setCurrentFont("Capitalize");
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
              newText +
              text.charAt(0).toUpperCase() +
              text.slice(1).toLowerCase();
          }
        });
        Editor.deleteFragment(editor);
        Editor.insertText(editor, newText);
      }
    }
  };
  const capitalization = ["Uppercase", "Capitalize"];
  const menu = (
    <Menu>
      {capitalization.map((font, index) => {
        return (
          <Menu.Item
            onMouseDown={(e) => {
              // console.log(font)
              e.preventDefault();
              handleMenuClick(font);
            }}
            key={font}
          >
            {font}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <React.Fragment>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          style={{
            maxWidth: "125px",
            minWidth: "125px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            margin: "0 5px",
          }}
          onMouseDown={(e) => {
            Editor.addMark(editor, "textTransform", true);
            e.preventDefault();
          }}
        >
          {currentFont}
          <DownOutlined />
        </Button>
      </Dropdown>
    </React.Fragment>
  );
};
Registry.register(
  {
    title: "Text Case",
    template: "",
    toolbar: {
      inHoveringToolbar: false,
    },
    IngressComponent: textTransform,
    isContentStackElement: true,
    category: leafCategories.TEXT_STYLE,
  },
  { id: "text-transform", registry: "leaf" }
);
