import { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import "./Dashboard.css";

const FONTS = [
    { label: "Inter (Default)", value: "Inter, sans-serif" },
    { label: "Playfair Display", value: "'Playfair Display', serif" },
    { label: "Lora", value: "'Lora', serif" },
    { label: "Nunito", value: "'Nunito', sans-serif" },
    { label: "Roboto Mono", value: "'Roboto Mono', monospace" },
    { label: "Dancing Script", value: "'Dancing Script', cursive" },
];

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFont, setSelectedFont] = useState(FONTS[0].value);

    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingContent, setEditingContent] = useState("");
    const [editingFont, setEditingFont] = useState(FONTS[0].value);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [createError, setCreateError] = useState("");
    const [apiError, setApiError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false, list: false });
    const editorRef = useRef(null);

    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState({ open: false, noteId: null, noteTitle: "" });

    // ── Fetch notes ──────────────────
    const fetchNotes = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setNotes(data);
            setApiError("");
        } catch (err) {
            setApiError("Could not load notes. Please check your connection and try again.");
            console.log("Failed to fetch notes", err);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    // ── Search ───────────────────────────
    const handleSearch = async (query) => {
        const token = localStorage.getItem("token");
        setIsSearching(!!query);
        try {
            if (!query) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                setNotes(data);
                setApiError("");
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/search?query=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setNotes(data);
            setApiError("");
        } catch (err) {
            setApiError("Search failed. Please check your connection and try again.");
            console.log("Failed to search notes", err);
        }
    };

    // ── Create ───────────────────────────
    const handleCreateNote = async (e) => {
        e.preventDefault();
        setCreateError("");

        const plainText = content.replace(/<[^>]*>/g, "").trim();
        if (!plainText) {
            setCreateError("Note content cannot be empty.");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title, content, font: selectedFont })
            });
            const newNote = await res.json();
            setNotes([newNote, ...notes]);
            setTitle("");
            setContent("");
            setSelectedFont(FONTS[0].value);
            if (editorRef.current) editorRef.current.innerHTML = "";
            setShowModal(false);
        } catch (err) {
            console.log("Failed to create note", err);
        }
    };

    // ── Edit ─────────────────────────────
    const startEditing = (note) => {
        setEditingNoteId(note._id);
        setEditingTitle(note.title);
        setEditingContent(note.content);
        setEditingFont(note.font || FONTS[0].value);
    };

    const handleUpdate = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: editingTitle, content: editingContent, font: editingFont })
            });
            const updatedNote = await res.json();
            setNotes(notes.map(n => n._id === id ? updatedNote : n));
            setEditingNoteId(null);
        } catch (err) {
            console.log("Failed to update note", err);
        }
    };

    // ── Delete (with dialog) ─────────────
    const confirmDelete = (note) => {
        setDeleteDialog({ open: true, noteId: note._id, noteTitle: note.title });
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${deleteDialog.noteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notes.filter(n => n._id !== deleteDialog.noteId));
        } catch (err) {
            console.log("Failed to delete note", err);
        } finally {
            setDeleteDialog({ open: false, noteId: null, noteTitle: "" });
        }
    };

    const syncFormats = () => {
        setActiveFormats({
            bold: document.queryCommandState("bold"),
            italic: document.queryCommandState("italic"),
            underline: document.queryCommandState("underline"),
            list: document.queryCommandState("insertUnorderedList"),
        });
    };

    const execFormat = (cmd) => {
        document.execCommand(cmd);
        syncFormats();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const getFontLabel = (fontVal) => {
        return FONTS.find(f => f.value === fontVal)?.label || "";
    };

    return (
        <>
            <Navbar />
            <div className="dashboard">

                {/* Header */}
                <div className="dashboard-header">
                    <h1>Your Notes</h1>
                    <p>Capture ideas, thoughts, and everything in between.</p>
                </div>

                {/* Search — single instance */}
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by title or content…"
                        value={searchQuery}
                        onChange={(e) => {
                            const v = e.target.value;
                            setSearchQuery(v);
                            handleSearch(v);
                        }}
                    />
                </div>

                {/* API Error Banner */}
                {apiError && (
                    <div className="api-error-banner">
                        <span className="api-error-icon">⚠️</span>
                        <div>
                            <p className="api-error-msg">{apiError}</p>
                        </div>
                        <button className="btn-retry" onClick={() => { setApiError(""); fetchNotes(); }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Notes List */}
                <div className="notes-section">
                    <h2>All Notes ({notes.length})</h2>
                    {notes.length === 0 ? (
                        <div className="notes-empty">
                            {isSearching ? (
                                <>
                                    <span>🔎</span>
                                    No notes matching <strong>"{searchQuery}"</strong> were found.
                                </>
                            ) : (
                                <>
                                    <span>📭</span>
                                    No notes yet. Click <strong>+ Add Note</strong> to get started!
                                </>
                            )}
                        </div>
                    ) : (
                        <ul className="notes-list">
                            {notes.map(note => (
                                <li key={note._id}>
                                    {editingNoteId === note._id ? (
                                        <div className="note-edit-card">
                                            <input
                                                className="edit-input"
                                                value={editingTitle}
                                                placeholder="Note title"
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                            />
                                            <textarea
                                                className="edit-textarea"
                                                value={editingContent}
                                                placeholder="Note content"
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                style={{ fontFamily: editingFont }}
                                            />
                                            <div className="font-picker-row">
                                                <label>Font:</label>
                                                <select
                                                    className="font-select"
                                                    value={editingFont}
                                                    onChange={(e) => setEditingFont(e.target.value)}
                                                >
                                                    {FONTS.map(f => (
                                                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={() => handleUpdate(note._id)}>✓ Save</button>
                                                <button className="btn-cancel" onClick={() => setEditingNoteId(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="note-card"
                                            style={{ fontFamily: note.font || FONTS[0].value }}
                                        >
                                            <p className="note-meta">
                                                {formatDate(note.createdAt)}
                                                {note.font && note.font !== FONTS[0].value && (
                                                    <span className="note-font-label">{getFontLabel(note.font)}</span>
                                                )}
                                            </p>
                                            <h3>{note.title}</h3>
                                            <p dangerouslySetInnerHTML={{ __html: note.content }} />
                                            <div className="note-actions">
                                                <button className="btn-edit" onClick={() => startEditing(note)}>✏️ Edit</button>
                                                <button className="btn-delete" onClick={() => confirmDelete(note)}>🗑 Delete</button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* ── Floating Add Note Button ── */}
            <button className="fab-btn" onClick={() => setShowModal(true)} title="Add Note">
                <span className="fab-icon">+</span>
                <span className="fab-label">Add Note</span>
            </button>

            {/* ── Add Note Modal ── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Note</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreateNote}>
                            <input
                                className="note-input"
                                type="text"
                                placeholder="Note title…"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <div className="font-picker-row">
                                <label>Font style:</label>
                            </div>
                            <div className="font-preview">
                                {FONTS.map(f => (
                                    <button
                                        key={f.value}
                                        type="button"
                                        className={`font-chip ${selectedFont === f.value ? "active" : ""}`}
                                        style={{ fontFamily: f.value }}
                                        onClick={() => setSelectedFont(f.value)}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            <div className="editor-toolbar">
                                <button type="button" className={`toolbar-btn ${activeFormats.bold ? "toolbar-active" : ""}`} onMouseDown={(e) => { e.preventDefault(); execFormat("bold"); }}><b>B</b></button>
                                <button type="button" className={`toolbar-btn ${activeFormats.italic ? "toolbar-active" : ""}`} onMouseDown={(e) => { e.preventDefault(); execFormat("italic"); }}><i>I</i></button>
                                <button type="button" className={`toolbar-btn ${activeFormats.underline ? "toolbar-active" : ""}`} onMouseDown={(e) => { e.preventDefault(); execFormat("underline"); }}><u>U</u></button>
                                <button type="button" className={`toolbar-btn ${activeFormats.list ? "toolbar-active" : ""}`} onMouseDown={(e) => { e.preventDefault(); execFormat("insertUnorderedList"); }}>• List</button>
                            </div>

                            <div
                                ref={editorRef}
                                className="content-editor"
                                contentEditable
                                suppressContentEditableWarning
                                data-placeholder="Write your note here…"
                                onKeyUp={syncFormats}
                                onMouseUp={syncFormats}
                                onInput={(e) => {
                                    setContent(e.currentTarget.innerHTML);
                                    setCreateError("");
                                }}
                                style={{ fontFamily: selectedFont }}
                            ></div>

                            {createError && <p className="editor-error">{createError}</p>}

                            <div className="modal-footer">
                                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-create" type="submit">+ Add Note</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {deleteDialog.open && (
                <div className="dialog-overlay" onClick={() => setDeleteDialog({ open: false, noteId: null, noteTitle: "" })}>
                    <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-icon">🗑️</div>
                        <h3>Delete Note?</h3>
                        <p>
                            Are you sure you want to delete <strong>"{deleteDialog.noteTitle}"</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="dialog-actions">
                            <button
                                className="btn-dialog-cancel"
                                onClick={() => setDeleteDialog({ open: false, noteId: null, noteTitle: "" })}
                            >
                                Cancel
                            </button>
                            <button className="btn-dialog-delete" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
