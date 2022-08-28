import express from 'express';
import cors from 'cors';
import connect from './src/services/connection.js';
import notesRouter from './src/routes/notes.router.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>MY NOTEPAD API</h1>');
});

app.use('/notes', notesRouter.router);

connect();
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));