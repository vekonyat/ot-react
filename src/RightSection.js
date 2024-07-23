import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

import { AppContext } from "./AppContext";



const MemoizedDraggableItem = React.memo(({ id, index, text, name }) => (
  <Draggable draggableId={id.toString()} index={index} key={id}>
    {(provided, snapshot) => (
      <li
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className={`draggable-item ${snapshot.isDragging ? "dragging" : ""}`}
      >
        <div className="rectangle">{text}</div>
      </li>
    )}
  </Draggable>
));

function RightSection() {
  const [blokkok, setBlokkok] = useState([]);
  const [rightBlokkok, setRightBlokkok] = useState([]);
  const [comps, setComps] = useState([]);
  const [resetState, setResetSate] = useState();
  const { selectedAm, selectedUgyfel } = useContext(AppContext);

  useEffect(() => {
    const fetchComps = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/getcomps");
        const formattedServices = response.data.map((comps) => ({
          id: comps.id,
          name: comps.name,
          text: comps.text,
          rel_path: comps.rel_path,
        }));

        setComps(formattedServices);
        setBlokkok(formattedServices); // Blokkok állapot frissítése a betöltött adatokkal
        setRightBlokkok([]);
      } catch (error) {
        console.error("There was an error fetching the services!", error);
      }
    };

    fetchComps();
  }, [resetState]);

  function triggerResetState() {
    setResetSate(!resetState);
  }

  function handleOnDragEnd(result) {
    console.log("Drag Ended");
    const { source, destination } = result;
    console.log("Source:", source);
    console.log("Destination:", destination);

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

  const handleLetoltesButtonClick = async () => {
    const body = {
      rightBlokkok,
      amName: selectedAm ? selectedAm.label : null,
      mobil: selectedAm ? selectedAm.mobil : null,
      email: selectedAm ? selectedAm.email : null,
      ugyfel: selectedUgyfel ? selectedUgyfel.label : null,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/compsDownload",
        body,
        {
          responseType: "blob", // A válasz típusának beállítása blob-ra
        }
      );
      const fileName = "output.docx";

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute("download", fileName); // Beállítjuk a letöltendő fájl nevét
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App panel right-section ">
      <header className="drag-drop-header">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="blokkok">
            {(provided) => (
              <div
                className="droppable-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="h2">Választható elemek</h2>
                <p className="lead">
                  Helyezd a választható elemeket a tervezőbe!
                </p>
                <ul className="droppable-list1">
                  {blokkok.map(({ id, name, text }, index) => (
                    <MemoizedDraggableItem
                      key={id}
                      id={id}
                      index={index}
                      text={text}
                      name={name}
                    />
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
          <div>
            <button
              onClick={handleLetoltesButtonClick}
              disabled={!rightBlokkok[0]}
              className="button buttonv2 margin-left" // Apply the CSS class for margin
            >
              Letöltés
            </button>
            <br />
            <button
              onClick={triggerResetState}
              disabled={!rightBlokkok[0]}
              className="button buttonv2 margin-left" // Apply the CSS class for margin
            >
              Alaphelyzet
            </button>
          </div>
          <Droppable droppableId="rightBlokkok">
            {(provided) => (
              <div
                className="droppable-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="h2">Tervező</h2>
                <ul className="droppable-list2">
                  {rightBlokkok.map(({ id, name, text }, index) => (
                    <MemoizedDraggableItem
                      key={id}
                      id={id}
                      index={index}
                      text={text}
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
