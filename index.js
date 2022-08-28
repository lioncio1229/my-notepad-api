import express, { json } from 'express';
import cors from 'cors';
import connect from './src/services/connection.js';
import { addNote, getNotes, getNote, deleteNote, updateNote } from './src/services/notes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>MY NOTEPAD API</h1>');
});

app.get('/notes', async (req, res) => {
    const result = await getNotes();
    res.send(result);
});

app.get('/notes/:id', async (req, res) => {
    const result = await getNote(req.params.id);
    res.status(202).send(result);
});

app.post('/notes', async (req, res) => {
    const newNote = req.body.newNote;
    await addNote(newNote);
    res.send(newNote);
});

app.delete('/notes/', async (req, res) => {
    const id = req.body.id;

    await deleteNote(id);
    res.send(id);
});

app.put('/notes', async (req, res) => {
    const updatedNote = req.body;
    await updateNote(updatedNote);
    res.send(updatedNote);
});

connect();
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));