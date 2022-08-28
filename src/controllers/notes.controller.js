import notesServices from '../services/notes.services.js';

async function getNotes(req, res)
{
    const result = await notesServices.getNotes();
    res.send(result);
}

 async function getNote(req, res)
{
    const result = await notesServices.getNote(req.params.id);
    res.status(202).send(result);
}

 async function addNote(req, res)
{
    const newNote = req.body;
    await notesServices.addNote(newNote);
    res.send(newNote);
}

 async function deleteNote(req, res)
{
    const id = req.body.id;
    await notesServices.deleteNote(id);
    res.send(id);
}

 async function updateNote(req, res)
{
    const updatedNote = req.body;
    await notesServices.updateNote(updatedNote);
    res.send(updatedNote);
}

export default { getNotes, getNote, addNote, deleteNote, updateNote };