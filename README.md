# 📝 NotesReal

A full-stack notes application built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can register, log in, and manage personal notes with rich text formatting, custom fonts, and smart search — all inside a clean, modern UI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Register & Login with JWT-secured sessions |
| 📝 **Create Notes** | Rich-text editor with Bold, Italic, Underline, and Bullet List |
| 🔤 **Font Picker** | Choose from 6 fonts per note — saved and displayed correctly |
| ✏️ **Edit Notes** | Inline editing with font change support |
| 🗑️ **Delete Notes** | Confirm dialog before deleting |
| 🔍 **Search** | Real-time search by title or content |
| ➕ **Floating Button** | Fixed "+ Add Note" button opens a smooth popup modal |
| ⏳ **Loading States** | Spinner shown while fetching, saving, updating, and deleting notes |
| ✅ **Success Toasts** | Animated toast notifications after creating or deleting a note |
| ⚠️ **Error States** | Inline error messages and retry banner for failed API calls |
| 🍪 **Cookie Auth** | Auth token stored in a secure 1-day cookie (`SameSite=Strict`) |
| 📱 **Responsive** | Works across screen sizes |

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **React Router DOM** — client-side routing
- **Vanilla CSS** — custom light theme with glassmorphism Navbar
- **Google Fonts** — Inter, Playfair Display, Lora, Nunito, Roboto Mono, Dancing Script

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **cors**, **dotenv**

---

## 📁 Project Structure

```
NotesReal/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register & Login logic
│   │   └── noteController.js   # CRUD + Search for notes
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT token verification
│   ├── models/
│   │   ├── User.js             # User schema (username, email, password)
│   │   └── Notes.js            # Note schema (title, content, font, user)
│   ├── routes/
│   │   ├── authRoutes.js       # POST /api/auth/register, /login
│   │   └── noteRoutes.js       # GET/POST/PUT/DELETE /api/notes
│   ├── .env                    # Environment variables (not committed)
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Dashboard/      # Main notes view + floating add button
        │   ├── Login/          # Login page
        │   ├── Register/       # Registration page
        │   ├── Navbar/         # Top navigation bar
        │   └── ProtectedRoute/ # Auth guard for dashboard
        ├── utils/
        │   └── cookie.js       # Cookie helpers: setCookie / getCookie / removeCookie
        ├── App.jsx             # Routes definition
        ├── main.jsx            # App entry point (BrowserRouter)
        └── index.css           # Global CSS variables & light theme
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/NotesReal.git
cd NotesReal
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/notesreal
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

> 💡 Replace `MONGO_URI` with your Atlas connection string if using the cloud.

Start the backend:

```bash
npm run dev        # Uses nodemon — auto-restarts on file save
# or
npm start          # Plain node (no auto-restart)
```

The backend runs at **http://localhost:5000**

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173** (or 5174 if 5173 is in use).

---

## 🔑 API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and receive a JWT token |

### Notes (all require `Authorization: Bearer <token>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes for the logged-in user |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note (title, content, font) |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/api/notes/search?query=...` | Search notes by title or content |

---

## 🎨 UI Highlights

- **Light theme** — white background, purple accent (`#6b46f6`), soft card shadows
- **Glassmorphism Navbar** — frosted glass effect with backdrop blur
- **Floating Action Button** — fixed `+ Add Note` button (bottom-right), opens modal popup
- **Modal Popup** — smooth slide-up animation, blurred backdrop, closes on outside click
- **Rich-text toolbar** — Bold / Italic / Underline / Bullet List buttons with active state highlighting
- **Font chips** — clickable font selector that previews each font family
- **Delete dialog** — confirm before deleting any note
- **Search empty state** — different message when searching vs. when no notes exist at all

---

## 🔐 Security

- Passwords are **hashed with bcrypt** before storing in MongoDB
- API routes are protected by **JWT middleware** — requests without a valid token are rejected
- JWT token is stored in a **secure cookie** (`auth_token`) with:
  - **1-day expiry** — auto-logged out after 24 hours
  - **`SameSite=Strict`** — prevents cross-site request forgery
  - **`path=/`** — available app-wide
- Cookie is set/read/deleted via `src/utils/cookie.js` — no `localStorage` used

---

## 🗺️ Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Redirects to `/login` | Public |
| `/login` | Login page | Public |
| `/register` | Registration page | Public |
| `/dashboard` | Notes dashboard | 🔒 Protected |

---

## 🐞 Known Bugs Fixed During Development

| Bug | Fix Applied |
|-----|-------------|
| Wrong import for note routes in `server.js` | Changed `authRoutes` → `noteRoutes` |
| `new User.create()` invalid syntax | Changed to `await User.create()` |
| `editingId` used but never defined | Renamed to `editingNoteId` |
| Search ran twice on empty query | Added `return` after fetching all notes |
| Font not saved on note edit | Added `note.font = req.body.font` in `updateNote` |
| ContentEditable div not clearing after save | Used `useRef` to reset `innerHTML` |
| Page height locked, notes overflowed | Changed `height: 100%` → `min-height: 100%` |

---

## 📦 Dependencies

### Backend
```json
"bcryptjs", "cors", "dotenv", "express", "jsonwebtoken", "mongoose"
"devDependencies": "nodemon"
```

### Frontend
```json
"react", "react-dom", "react-router-dom", "axios"
"devDependencies": "vite", "@vitejs/plugin-react"
```

---

## 🙋 Author

Built by **Vishn** — a full-stack notes app project.

---

> Made with ❤️ using React + Node.js + MongoDB
