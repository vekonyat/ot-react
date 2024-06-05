import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import finalBlokkok from "./finalblokkok";
import "./RightSection.css";

const MemoizedDraggableItem = React.memo(({ id, index, thumb, name }) => (
  <Draggable key={id} draggableId={id} index={index}>
    {(provided) => (
      <li
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className="draggable-item"
      >
        <div>
          <img className="thumb" src={thumb} alt={`${name} Thumb`} />
        </div>
      </li>
    )}
  </Draggable>
));

function RightSection() {
  const [blokkok, setBlokkok] = useState(finalBlokkok);
  const [rightBlokkok, setRightBlokkok] = useState([]);

  function handleOnDragEnd(result) {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(
        source.droppableId === "blokkok" ? blokkok : rightBlokkok
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === "blokkok") {
        setBlokkok(items);
      } else {
        setRightBlokkok(items);
      }
    } else {
      const sourceItems = Array.from(
        source.droppableId === "blokkok" ? blokkok : rightBlokkok
      );
      const destItems = Array.from(
        destination.droppableId === "blokkok" ? blokkok : rightBlokkok
      );
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === "blokkok") {
        setBlokkok(sourceItems);
        setRightBlokkok(destItems);
      } else {
        setRightBlokkok(sourceItems);
        setBlokkok(destItems);
      }
    }
  }

  return (
    <div className="right-section">
      <header className="drag-drop-header">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="blokkok">
            {(provided) => (
              <div className="droppable-container">
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="droppable-list"
                >
                  {blokkok.map(({ id, name, thumb }, index) => (
                    <MemoizedDraggableItem
                      key={id}
                      id={id}
                      index={index}
                      thumb={thumb}
                      name={name}
                    />
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>

          <Droppable droppableId="rightBlokkok">
            {(provided) => (
              <div className="droppable-container">
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="droppable-list"
                >
                  {rightBlokkok.map(({ id, name, thumb }, index) => (
                    <MemoizedDraggableItem
                      key={id}
                      id={id}
                      index={index}
                      thumb={thumb}
                      name={name}
                    />
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  );
}

export default RightSection;
