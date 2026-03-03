# 📝 NotesReal

A full-stack notes application where users can register, log in, and manage personal notes with rich-text formatting, custom fonts, and real-time search — all inside a clean, modern UI.

---

## ✨ Features

- 🔐 **Authentication** — Register & Login with JWT (stored in a secure 1-day cookie)
- 📝 **Create Notes** — Rich-text editor with Bold, Italic, Underline, and Bullet List
- 🔤 **Font Picker** — Choose from 6 font styles per note
- ✏️ **Edit Notes** — Inline editing with font change support
- 🗑️ **Delete Notes** — Confirm dialog before deleting
- 🔍 **Search** — Real-time search by title or content
- ⏳ **Loading States** — Spinner shown while fetching, saving, and deleting
- ✅ **Success Toasts** — Animated notifications after creating or deleting notes
- ⚠️ **Error Handling** — Inline errors and retry banner for failed API calls
- 📱 **Responsive** — Works across screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router DOM, Vanilla CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + js-cookie (1-day expiry, SameSite=Strict) |
| Fonts | Google Fonts (Inter, Playfair Display, Lora, Nunito, Roboto Mono, Dancing Script) |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo

```bash
git clone https://github.com/piduguvishnuvardhanreddy/notesapplication.git
cd notesapplication
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/notesreal
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

```bash
npm run dev       # starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev       # starts on http://localhost:5173
```

---

## 🔑 API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and receive a JWT token |

### Notes *(require `Authorization: Bearer <token>` header)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Fetch all notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/api/notes/search?query=...` | Search notes |

---

## � Live URL

| Service | URL |
|---------|-----|
| Frontend | https://notesapplication-navy.vercel.app |
| Backend API | https://notesapplication-backend.onrender.com |

---

> Made with ❤️ using React + Node.js + MongoDB
