import express from 'express';
import cors from 'cors';
import connect from './src/services/connection.js';
import notesRouter from './src/routes/notes.router.js';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.NODE_ENV === 'development' ? 3000 : process.env.PORT;

app.use(cors());
app.use(express.static('public'))
app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
    fs.readFile('public/index.html', (err, data) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(data.toString());
    });
});

app.use('/notes', notesRouter.router);

connect();
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));