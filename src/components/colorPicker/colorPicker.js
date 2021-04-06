// // import React, { useState, useRef } from "react";
// // import { useEditor } from "slate-react";
// // import { SketchPicker } from "react-color";
// // import { Editor, Transforms } from "slate";

// // export const ColorPicker = (props) => {
// //   console.log(props);
// //   const editor = useEditor();
// //   const selection = useRef(null);
// //   const [setdisplayColorPicker] = useState(false);
// //   const [color, setColor] = useState({
// //     r: 36,
// //     g: 97,
// //     b: 181,
// //     a: 1,
// //   });

// //   // const handleMouseDown = (event) => {
// //   Editor.addMark(editor, "color", true);
// //   // editor.setFakeSelection();
// //   selection.current = editor.selection;
// //   setdisplayColorPicker(true);
// //   // };
// //   const setTextColor = (color, event, selection) => {
// //     const { rgb } = color;
// //     if (selection) {
// //       //Transforms.select(editor,selection)
// //       Editor.addMark(editor, "color", true);
// //       for (const [element, path] of Editor.nodes(editor, {
// //         at: selection.current,
// //         match: (n) => n.color,
// //       })) {
// //         if (element) {
// //           let attrs = { ...element.attrs } || {};

// //           attrs.style = {
// //             ...attrs.style,
// //             color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
// //           };

// //           Transforms.setNodes(editor, { attrs }, { at: path });
// //         }
// //       }
// //     }
// //   };

// //   return (
// //     <div style={{ position: "relative" }}>
// //       {/* {props.children({
// //         handleMouseDown,
// //         active: true,
// //       })} */}
// //       {/* {displayColorPicker ? ( */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           zIndex: "2",
// //         }}
// //       >
// //         <div
// //           style={{
// //             position: "fixed",
// //             top: "0px",
// //             right: "0px",
// //             bottom: "0px",
// //             left: "0px",
// //           }}
// //           onClick={() => {
// //             Transforms.unwrapNodes(editor, {
// //               at: selection.current,
// //               match: (n) => n.type === "editor-selection",
// //             });
// //             selection.current = null;
// //             setdisplayColorPicker(false);
// //           }}
// //         />
// //         <SketchPicker
// //           color={color}
// //           onChange={(color, event) => {
// //             event.preventDefault();
// //             setColor(color.rgb);
// //           }}
// //           onChangeComplete={(color, event) => {
// //             //event.preventDefault();
// //             console.log(color);
// //             setTextColor(color, event, selection);
// //           }}
// //         />
// //       </div>
// //       {/* ) : null} */}
// //     </div>
// //   );
// // };

// import { SketchPicker } from "react-color";
// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useMemo,
//   useState,
// } from "react";
// import { createEditor, Text } from "slate";
// import { Slate, Editable, withReact } from "slate-react";
// import { Editor, Transforms } from "slate";
// export const ColorPicker = (props) => {
//   const editor = useMemo(() => withReact(createEditor()), []);
//   const [value, setValue] = useState([
//     {
//       type: "paragraph",
//       children: [
//         {
//           text: "A line of text in a paragraph. A line of text in a paragraph.",
//         },
//       ],
//     },
//   ]);
//   const selection = useRef(null);
//   const [displayColorPicker, setdisplayColorPicker] = useState(false);
//   const [color, setColor] = useState({
//     r: 36,
//     g: 97,
//     b: 181,
//     a: 1,
//   });
//   const handleMouseDown = (props) => {
//     Editor.addMark(editor, "color", true);
//     selection.current = editor.selection;
//     setdisplayColorPicker(true);
//   };
//   const setTextColor = (color, event, selection) => {
//     const { rgb } = color;
//     if (selection) {
//       //Transforms.select(editor,selection)
//       Editor.addMark(editor, "color", true);
//       for (const [element, path] of Editor.nodes(editor, {
//         at: selection.current,
//         match: (n) => n.color,
//       })) {
//         if (element) {
//           let attrs = { ...element.attrs } || {};
//           attrs.style = {
//             ...attrs.style,
//             color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
//           };
//           Transforms.setNodes(editor, { attrs }, { at: path });
//         }
//       }
//     }
//   };
//   const renderElement = useCallback((props) => {
//     return <DefaultElement {...props} />;
//   }, []);
//   return (
//     <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
//       <div>
//         <div style={{ position: "relative", touchAction: "none" }}>
//           <button
//             className="fontButton"
//             onMouseDown={(event) => {
//               handleMouseDown();
//             }}
//           >
//             FontColor
//           </button>
//           {displayColorPicker ? (
//             <div
//               style={{
//                 position: "absolute",
//                 zIndex: "2",
//               }}
//             >
//               <div
//                 style={{
//                   position: "fixed",
//                   top: "0px",
//                   right: "0px",
//                   bottom: "0px",
//                   left: "0px",
//                 }}
//                 onClick={() => {
//                   Transforms.unwrapNodes(editor, {
//                     at: selection.current,
//                     match: (n) => n.type === "editor-selection",
//                   });
//                   selection.current = null;
//                   setdisplayColorPicker(false);
//                 }}
//               />
//               <SketchPicker
//                 color={color}
//                 onChange={(color, event) => {
//                   // event.preventDefault();
//                   setColor(color.rgb);
//                 }}
//                 onChangeComplete={(color, event) => {
//                   console.log(color);
//                   setTextColor(color, event, selection);
//                 }}
//               />
//             </div>
//           ) : null}
//         </div>
//       </div>
//       <Editable editor={editor} renderElement={renderElement} />
//     </Slate>
//   );
// };
// const DefaultElement = (props) => {
//   console.log(props);
//   // props.element.children.map((child) => {
//   //   if (child.attrs)
//   //     return (
//   //       <p
//   //         style={{
//   //           color: child.attrs.style.color,
//   //           backgroundColor: "red",
//   //         }}
//   //         {...props.attributes}
//   //       >
//   //         {props.children}
//   //       </p>
//   //     );
//   //   else return <p {...props.attributes}>{props.children}</p>;
//   // });
//   // return <p {...props.attributes}>{props.children}</p>;
//   // if (props.children.attrs)
//   //   return (
//   //     <p
//   //       style={{
//   //         color: props.children.attrs.style.color,
//   //         backgroundColor: "red",
//   //       }}
//   //       {...props.attributes}
//   //     >
//   //       {props.children}
//   //     </p>
//   //   );
//   // else return <p {...props.attributes}>{props.children}</p>;
//   return <p {...props.attributes}>{props.children}</p>;
// };
// export default ColorPicker;
