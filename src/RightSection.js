import React from "react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function RightSection() {

  const finalBlokkok = [
    {
      id: 'bevezeto',
      name: 'bevezeto',
      thumb: 'bevezeto.png'
    },
    {
      id: 'altalanos',
      name: 'altalanos',
      thumb: 'altalanos.png'
    },
    {
      id: 'muszaki',
      name: 'muszaki',
      thumb: 'muszaki.png'
    },
    {
      id: 'kerajanlat',
      name: 'kerajanlat',
      thumb: 'kerajanlat.png'
    },
    {
      id: 'referenciak',
      name: 'referenciak',
      thumb: 'referenciak.png'
    }
  ]
  const [blokkok, updateBlokkok] = useState(finalBlokkok);
  
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(blokkok);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateBlokkok(items);
  }

  return (
    <div className="right-section">
      <header>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="blokkok">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {blokkok.map(({ id, name, thumb }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div>
                            <img className="thumb" src={thumb} alt={`${name} Thumb`} />
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  );

}

export default RightSection;