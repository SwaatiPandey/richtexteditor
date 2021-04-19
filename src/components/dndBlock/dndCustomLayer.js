import { useDragLayer } from "react-dnd";

export const CustomDragLayer = (props) => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    })
  );
  const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    textAlign: "left",
    left: "1rem",
    top: 0,
    width: "100%",
    height: "100%",
  };
  function getItemStyles(initialOffset, currentOffset) {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }
    let { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  }
  function renderItem() {
    if (item)
      return (
        <div style={{ opacity: isDragging ? 0.1 : 1 }}>
          {item.element.children[0].text}
        </div>
      );
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};
