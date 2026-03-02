const Note = require("../models/Notes")

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and Content are required" })
        }
        const note = await Note.create({
            title,
            content,
            user: req.user.userId
        })
        res.status(201).json(note)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getUserNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
        res.json(notes)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }


}

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        }

        if (note.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        note.title = req.body.title || note.title;
        note.content = req.body.content || note.content;
        if (req.body.font) note.font = req.body.font;

        const updatedNote = await note.save()
        res.json(updatedNote)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        }
        if (note.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        await note.deleteOne()
        res.json({ message: "Note deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}


exports.searchNotes = async (req, res) => {
    try {
        const { query } = req.query;
        const notes = await Note.find({
            user: req.user.userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } }
            ]
        })
        res.json(notes)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}