
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Lightbulb,
  Heart,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  X,
  FileText,
  Clock,
  CheckCircle2,
  StickyNote,
  Sparkles,
  Menu,
  Save,
  FolderOpen
} from "lucide-react";

import "./App.css";

const initialNotes = [
  {
    id: 1,
    title: "Welcome to NoteSpace ✨",
    content: "Your thoughts deserve a beautiful space. Create your first note, organize your ideas and keep everything in one place.",
    category: "Personal",
    color: "purple",
    pinned: true,
    date: new Date().toISOString()
  },
  {
    id: 2,
    title: "React Learning Goals",
    content: "Learn React components, props, useState, useEffect, forms, API integration and build real-world projects.",
    category: "Study",
    color: "blue",
    pinned: false,
    date: new Date().toISOString()
  },
  {
    id: 3,
    title: "Project Ideas",
    content: "Build a portfolio website, task management application and an interactive 3D website using Three.js.",
    category: "Ideas",
    color: "yellow",
    pinned: false,
    date: new Date().toISOString()
  },
  {
    id: 4,
    title: "Weekly Work Plan",
    content: "Complete the React assignment, practice JavaScript and update the GitHub repository.",
    category: "Work",
    color: "pink",
    pinned: false,
    date: new Date().toISOString()
  }
];

const categories = [
  { name: "All Notes", icon: LayoutDashboard },
  { name: "Personal", icon: Heart },
  { name: "Work", icon: Briefcase },
  { name: "Study", icon: BookOpen },
  { name: "Ideas", icon: Lightbulb }
];

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("notespace-notes");
      return saved ? JSON.parse(saved) : initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [activeCategory, setActiveCategory] = useState("All Notes");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Personal",
    color: "purple"
  });

  useEffect(() => {
    localStorage.setItem("notespace-notes", JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes
    .filter(note => {
      const matchesCategory =
        activeCategory === "All Notes" ||
        note.category === activeCategory;

      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const openCreateModal = () => {
    setEditingNote(null);
    setForm({
      title: "",
      content: "",
      category: "Personal",
      color: "purple"
    });
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    if (editingNote) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingNote.id
            ? { ...note, ...form }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        ...form,
        pinned: false,
        date: new Date().toISOString()
      };

      setNotes(prev => [newNote, ...prev]);
    }

    setShowModal(false);
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const togglePin = (id) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      )
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const categoryCount = (category) => {
    if (category === "All Notes") return notes.length;
    return notes.filter(note => note.category === category).length;
  };

  return (
    <div className="app-container">

      {/* SIDEBAR */}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <StickyNote size={24} />
          </div>
          <div>
            <h2>NoteSpace</h2>
            <span>YOUR SECOND BRAIN</span>
          </div>
          <button
            className="close-mobile"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section">
          <p className="section-label">WORKSPACE</p>

          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activeCategory === name ? "active" : ""
              }`}
              onClick={() => {
                setActiveCategory(name);
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
              <span className="nav-count">
                {categoryCount(name)}
              </span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={22} />
            </div>
            <h3>Your ideas matter.</h3>
            <p>Keep your thoughts organized and let creativity flow.</p>
          </div>

          <div className="profile">
            <div className="avatar">N</div>
            <div>
              <h4>My Workspace</h4>
              <p>Personal Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={23} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> {activeCategory}
          </div>

          <div className="topbar-right">
            <div className="status-indicator">
              <span></span> All changes saved
            </div>
          </div>
        </header>

        <section className="dashboard">

          {/* WELCOME SECTION */}

          <div className="welcome-section">
            <div>
              <div className="welcome-tag">
                <Sparkles size={14} /> YOUR PERSONAL THINKING SPACE
              </div>

              <h1>
                Make space for
                <span> great ideas.</span>
              </h1>

              <p>
                Capture your thoughts, organize your world,
                and turn ideas into something meaningful.
              </p>
            </div>

            <button className="create-button" onClick={openCreateModal}>
              <Plus size={20} />
              Create a note
            </button>
          </div>

          {/* STATISTICS */}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple-bg">
                <FileText size={21} />
              </div>
              <div>
                <p>Total Notes</p>
                <h2>{notes.length}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue-bg">
                <Pin size={21} />
              </div>
              <div>
                <p>Pinned Notes</p>
                <h2>{notes.filter(n => n.pinned).length}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange-bg">
                <FolderOpen size={21} />
              </div>
              <div>
                <p>Categories</p>
                <h2>{new Set(notes.map(n => n.category)).size}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green-bg">
                <CheckCircle2 size={21} />
              </div>
              <div>
                <p>Organized</p>
                <h2>{notes.length}</h2>
              </div>
            </div>
          </div>

          {/* NOTES HEADER */}

          <div className="notes-header">
            <div>
              <h2>
                {activeCategory === "All Notes"
                  ? "Your Notes"
                  : activeCategory}
              </h2>
              <p>All your thoughts, in one beautiful place.</p>
            </div>

            <div className="search-box">
              <Search size={19} />
              <input
                type="text"
                placeholder="Search your notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* NOTES GRID */}

          {filteredNotes.length > 0 ? (
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <article
                  className={`note-card note-${note.color}`}
                  key={note.id}
                >
                  <div className="note-card-top">
                    <span className="category-badge">
                      {note.category}
                    </span>

                    {note.pinned && (
                      <span className="pinned-label">
                        <Pin size={13} /> Pinned
                      </span>
                    )}
                  </div>

                  <h3>{note.title}</h3>

                  <p className="note-content">
                    {note.content}
                  </p>

                  <div className="note-footer">
                    <span className="note-date">
                      <Clock size={14} />
                      {formatDate(note.date)}
                    </span>

                    <div className="note-actions">
                      <button
                        title={note.pinned ? "Unpin note" : "Pin note"}
                        onClick={() => togglePin(note.id)}
                      >
                        <Pin
                          size={17}
                          fill={note.pinned ? "currentColor" : "none"}
                        />
                      </button>

                      <button
                        title="Edit note"
                        onClick={() => openEditModal(note)}
                      >
                        <Edit3 size={17} />
                      </button>

                      <button
                        title="Delete note"
                        className="delete-action"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <StickyNote size={38} />
              </div>
              <h3>No notes found</h3>
              <p>
                {search
                  ? "Try another search term."
                  : "Your space is waiting for your first idea."}
              </p>
              {!search && (
                <button className="create-button" onClick={openCreateModal}>
                  <Plus size={18} /> Create your first note
                </button>
              )}
            </div>
          )}

          <footer className="dashboard-footer">
            <p>Made for your thoughts. Made with NoteSpace ✨</p>
            <span>{notes.length} notes in your workspace</span>
          </footer>

        </section>
      </main>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="note-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  {editingNote ? "UPDATE YOUR THOUGHT" : "NEW CREATION"}
                </span>
                <h2>
                  {editingNote ? "Edit your note" : "Create a note"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <label>NOTE TITLE</label>
              <input
                className="form-input"
                type="text"
                placeholder="Give your note a title..."
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
                autoFocus
                maxLength={100}
              />

              <label>YOUR THOUGHTS</label>
              <textarea
                className="form-textarea"
                placeholder="Start writing your thoughts here..."
                value={form.content}
                onChange={e =>
                  setForm({ ...form, content: e.target.value })
                }
                rows={7}
              />

              <label>CHOOSE CATEGORY</label>
              <select
                className="form-input"
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Ideas">Ideas</option>
              </select>

              <label>NOTE COLOR</label>
              <div className="color-options">
                {["purple", "blue", "yellow", "pink", "green"].map(color => (
                  <button
                    type="button"
                    key={color}
                    className={`color-option ${color} ${
                      form.color === color ? "selected" : ""
                    }`}
                    onClick={() => setForm({ ...form, color })}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button">
                  <Save size={17} />
                  {editingNote ? "Save Changes" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
