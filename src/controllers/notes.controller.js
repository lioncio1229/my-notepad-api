import notesServices from '../services/notes.services.js';

async function getNotes(req, res)
{
    try
    {
        const result = await notesServices.getNotes();
        res.status(200).send(result);
    }
    catch(e)
    {
        res.status(400).send(`Can't fetch notes. <br><br>${e}`);
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
        res.status(400).send(`Can't get note. <br><br>${e}`);
    }
}

 async function addNote(req, res)
{
    try
    {
        const newNote = req.body;
        await notesServices.addNote(newNote);
        res.status(200).send(newNote);
    }
    catch(e)
    {
        res.status(400).send(`Can't add note. <br><br>${e}`);
    }
}

 async function deleteNote(req, res)
{
    try
    {
        const id = req.params._id;
        const resultId = await notesServices.deleteNote(id);
        if(resultId)
            res.status(200).send(resultId);
        else 
        res.status(404).send(`Can't delete note with the id of ${id}. ID not found`);
    }
    catch(e)
    {
        res.status(400).send(`Can't delete note. <br><br>${e}`);
    }
}

async function deleteAll(req, res)
{
    try
    {
        await notesServices.deleteAll();
        res.status(200).send('All notes deleted');
    }
    catch(e)
    {
        res.status(400).send(`Can't delete all notes. <br><br>${e}`);
    }
}

 async function updateNote(req, res)
{
    try
    {
        const note = req.body;
        const updatedNote = await notesServices.updateNote(note);
        if(updatedNote)
            res.status(200).send(updatedNote);
        else
            res.status(404).send(`Note not found`);
    }
    catch(e)
    {
        res.status(400).send(`Can't update note. <br><br>${e}`);
    }
}

export default { getNotes, getNote, addNote, deleteNote, updateNote, deleteAll};