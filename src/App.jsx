import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

function App() {
  const [notes, setNotes] = useState([]);

  // Try to retrieve notes from localStorage, fallback to an empty array
  // const localStorageNotes = localStorage.getItem("notes");
  // const initialNotes = localStorageNotes ? JSON.parse(localStorageNotes) : [];

  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    // Fetch data from the server on component mount
    fetch("http://localhost:3001/api/notes")
      .then((response) => response.json())
      .then((data) => {
        // Update local storage and state
        localStorage.setItem("notes", JSON.stringify(data));
        setNotes(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const updateDatabaseAndLocalStorage = (updatedNotes) => {
    // Update local storage and state
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };

    fetch("http://localhost:3001/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedNotes = [data, ...notes];
        updateDatabaseAndLocalStorage(updatedNotes);
        setActiveNote(data.id);
      });
  };

  const onDeleteNote = (noteId) => {
    fetch(`http://localhost:3001/api/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedNotes = notes.filter(({ id }) => id !== data.id);
        updateDatabaseAndLocalStorage(updatedNotes);
        setActiveNote(null);
      });
  };

  const onUpdateNote = (updatedNote) => {
    fetch(`http://localhost:3001/api/notes/${updatedNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedNotes = notes.map((note) => (note.id === data.id ? data : note));
        updateDatabaseAndLocalStorage(updatedNotes);
      });
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;
