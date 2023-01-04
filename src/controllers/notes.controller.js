import notesServices from '../services/notes.services.js';

async function getNotes(req, res)
{
    try
    {
        const result = await notesServices.getNotes(req.session._id);
        res.status(200).send(result);
    }
    catch(e)
    {
        res.status(400).send(`Can't fetch notes. <br><br> ${e.message}`);
    }
}

 async function getNote(req, res)
{
    try
    {
        const googleId = req.session._id;
        const noteId = req.params._id;
        const result = await notesServices.getNote(googleId, noteId);
        res.status(200).send(result);
    }
    catch(e)
    {
        res.status(400).send(`Can't get note. <br><br>${e}`);
    }
}

 async function addNote(req, res)
{
    try
    {
        const googleId = req.session._id;
        let newNote = req.body;
        newNote = await notesServices.addNote(googleId, newNote);
        res.status(200).send(newNote);
    }
    catch(e)
    {
        res.status(400).send(`Can't add note. <br><br>${e.message}`);
    }
}

 async function addNotes(req, res)
{
    try
    {
        const googleId = req.session._id;
        let {notes} = req.body;
        notes = await notesServices.addNotes(googleId, notes);
        res.status(200).send(notes);
    }
    catch(e)
    {
        res.status(400).send(`Can't add notes. <br><br>${e.message}`);
    }
}

 async function deleteNote(req, res)
{
    try
    {
        const googleId = req.session._id;
        const noteId = req.params._id;
        const resultId = await notesServices.deleteNote(googleId, noteId);
        res.status(200).send(resultId);
    }
    catch(e)
    {
        res.status(400).send(`Can't delete note. <br><br>${e.message}`);
    }
}

async function deleteAll(req, res)
{
    try
    {
        const googleId = req.session._id;
        await notesServices.deleteAll(googleId);
        res.status(200).send('All notes deleted');
    }
    catch(e)
    {
        res.status(400).send(`Can't delete all notes. <br><br>${e.message}`);
    }
}

 async function updateNote(req, res)
{
    try
    {
        const googleId = req.session._id;
        const note = req.body;

        const updatedNote = await notesServices.updateNote(googleId, note);
        res.status(200).send(updatedNote);
    }
    catch(e)
    {
        res.status(400).send(`Can't update note. <br><br>${e.message}`);
    }
}

export default {
  getNotes,
  getNote,
  addNote,
  addNotes,
  deleteNote,
  updateNote,
  deleteAll,
};