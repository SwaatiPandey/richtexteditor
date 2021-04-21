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
