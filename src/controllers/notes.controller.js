import notesServices from '../services/notes.services.js';

async function getNotes(req, res)
{
    try
    {
        const result = await notesServices.getNotes();
        res.send(result);
    }
    catch(e)
    {
        res.send(`Can't fetch notes. <br><br>${e}`);
    }
}

 async function getNote(req, res)
{
    try
    {
        const result = await notesServices.getNote(req.params._id);
        res.status(200).send(result);
    }
    catch(e)
    {
        res.send(`Can't get note. <br><br>${e}`);
    }
}

 async function addNote(req, res)
{
    try
    {
        const newNote = req.body;
        await notesServices.addNote(newNote);
        res.send(newNote);
    }
    catch(e)
    {
        res.send(`Can't add note. <br><br>${e}`);
    }
}

 async function deleteNote(req, res)
{
    try
    {
        const resultId = await notesServices.deleteNote(req.body._id);
        res.send(resultId);
    }
    catch(e)
    {
        res.send(`Can't delete note. <br><br>${e}`);
    }
}

 async function updateNote(req, res)
{
    try
    {
        const note = req.body;
        const updatedNote = await notesServices.updateNote(note);
        res.send(updatedNote);
    }
    catch(e)
    {
        res.send(`Can't update note. <br><br>${e}`);
    }
}

export default { getNotes, getNote, addNote, deleteNote, updateNote };