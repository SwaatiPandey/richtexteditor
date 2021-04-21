// import { useDragLayer, useDragDropManager } from "react-dnd";
// import { useRef } from "react";

// export const CustomDragLayer = (props) => {
//   const dragDropManager = useDragDropManager();
//   const monitor = dragDropManager.getMonitor();
//   const dragLayerRef = useRef(null);
//   var {
//     itemType,
//     isDragging,
//     item,
//     initialOffset,
//     currentOffset,
//     clientOffset,
//   } = useDragLayer((monitor) => ({
//     itemType: monitor.getItemType(),
//     isDragging: monitor.isDragging(),
//     item: monitor.getItem(),
//     initialOffset: monitor.getInitialSourceClientOffset(),
//   }));
//   const layerStyles = {
//     position: "fixed",
//     pointerEvents: "none",
//     zIndex: 100,
//     textAlign: "left",
//     left: "1rem",
//     top: 0,
//     width: "100%",
//     height: "100%",
//   };

//   function renderItem() {
//     if (item) {
//       // console.log(item.element);
//       return (
//         <div style={{ opacity: isDragging ? 0.1 : 1 }}>
//           {item.element.children[0].text}
//         </div>
//       );
//     }
//   }
//   monitor.subscribeToOffsetChange(() => {
//     currentOffset = monitor.getSourceClientOffset();
//     clientOffset = monitor.getClientOffset();
//     if (!initialOffset || !currentOffset || !clientOffset) {
//       return {
//         display: "none",
//       };
//     }
//     // console.log(currentOffset, clientOffset);
//     let { x, y } = clientOffset;
//     const transform = `translate(${x}px, ${y}px)`;
//     // console.log(dragLayerRef);
//     if (dragLayerRef?.current) {
//       dragLayerRef.current.style["transform"] = transform;
//       dragLayerRef.current.style["-webkit-transform"] = transform;
//     }
//   });
//   return (
//     <div style={layerStyles}>
//       {/* <div style={getItemStyles(initialOffset, currentOffset, clientOffset)}> */}
//       <div ref={dragLayerRef}>{renderItem()}</div>
//     </div>
//   );
// };

import React from "react";
import { DragLayer } from "react-dnd";

const renderComponent = (componentType, itemBeingDragged, beingDragged) => {
  switch (componentType) {
    case "DNDBlock":
      console.log(itemBeingDragged);
      return (
        <div style={{ opacity: 0.5 }}>
          {itemBeingDragged.element.children[0].text}
        </div>
      );
    default:
      return null;
  }
};

let subscribedToOffsetChange = false;

let dragPreviewRef = null;

const onOffsetChange = (monitor) => () => {
  if (!dragPreviewRef) return;

  const offset = monitor.getSourceClientOffset();
  if (!offset) return;

  const transform = `translate(${offset.x}px, ${offset.y}px)`;
  dragPreviewRef.style["transform"] = transform;
  dragPreviewRef.style["-webkit-transform"] = transform;
};

export default DragLayer((monitor) => {
  if (!subscribedToOffsetChange) {
    monitor.subscribeToOffsetChange(onOffsetChange(monitor));
    subscribedToOffsetChange = true;
  }

  return {
    itemBeingDragged: monitor.getItem(),
    componentType: monitor.getItemType(),
    beingDragged: monitor.isDragging(),
  };
})(
  class CustomDragLayer extends React.PureComponent {
    componentDidUpdate(prevProps) {
      dragPreviewRef = this.rootNode;
    }

    render() {
      if (!this.props.beingDragged) return null;
      return (
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 100,
            textAlign: "left",
            left: "1rem",
            top: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <div ref={(el) => (this.rootNode = el)}>
            {renderComponent(
              this.props.componentType,
              this.props.itemBeingDragged,
              this.props.beingDragged
            )}
          </div>
        </div>
      );
    }
  }
);

// import React from "react";
// import { DragLayer } from "react-dnd";

// const layerStyles = {
//   position: "fixed",
//   pointerEvents: "none",
//   zIndex: 100,
//   left: 0,
//   top: 0,
//   width: "100%",
//   height: "100%",
// };
// function getItemStyles(props) {
//   const { currentOffset } = props;
//   if (!currentOffset) {
//     return {
//       display: "none",
//     };
//   }

//   const { x, y } = currentOffset;
//   const transform = `translate(${x}px, ${y}px)`;
//   return {
//     transform: transform,
//     WebkitTransform: transform,
//   };
// }

// function CustomDragLayer({ item, itemType, isDragging, currentOffset }) {
//   if (!isDragging) {
//     return null;
//   }

//   function renderItem(type, item) {
//     switch (type) {
//       case "DNDBlock":
//         return (
//           <div style={{ opacity: isDragging ? 0.1 : 1 }}>
//             {item.element.children[0].text}
//           </div>
//         );
//     }
//   }

//   return (
//     <div style={layerStyles}>
//       <div style={getItemStyles(currentOffset)}>
//         {renderItem(itemType, item)}
//       </div>
//     </div>
//   );
// }

// function collect(monitor) {
//   return {
//     item: monitor.getItem(),
//     itemType: monitor.getItemType(),
//     currentOffset: monitor.getSourceClientOffset(),
//     isDragging: monitor.isDragging(),
//   };
// }

// export default DragLayer(collect)(CustomDragLayer);
