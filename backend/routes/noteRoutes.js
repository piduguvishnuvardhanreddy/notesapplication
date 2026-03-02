const express = require('express'); 

const {createNote, getUserNotes, updateNote , deleteNote , searchNotes} = require("../controllers/noteController")
const authMiddleware = require("../middleware/authMiddleware") 

const router = express.Router();

router.post("/", authMiddleware, createNote) 
router.get("/", authMiddleware, getUserNotes)
router.put("/:id", authMiddleware, updateNote)
router.delete("/:id", authMiddleware, deleteNote)
router.get("/search", authMiddleware, searchNotes)
module.exports = router;