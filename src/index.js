import express from 'express';
import cors from 'cors';
import sessions from 'express-session';
import connect from './services/connection.js';
import notesRouter from './routes/notes.router.js';
import usersRouter from './routes/users.router.js';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

const {NODE_ENV, SECRET_KEY} = process.env;

const app = express();
const PORT = NODE_ENV === 'development' ? 3000 : process.env.PORT;
const oneDay = 1000 * 60 * 60 * 24;

if(NODE_ENV === 'development')
{
    const delay = async (req, res, next) => {
        await new Promise((resolve) => {
            setTimeout(resolve, 900);
        });
        next();
    };
    app.use(delay);
}

const corsOptions = {
    credentials: true,
    origin: true,
};

app.use(cors(corsOptions));
app.use(express.static('public'))
app.use(express.urlencoded());
app.use(express.json());

const sessionObj = {
    secret: SECRET_KEY,
    name : 'mnp_id',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}

if(NODE_ENV === 'production')
{
    app.set('trust proxy', 1);
    sessionObj.cookie.secure = true;
}

app.use(sessions(sessionObj));

app.get('/', (req, res) => {
    fs.readFile('public/index.html', (err, data) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(data.toString());
    });
});

app.use('/api/user', usersRouter.router);
app.use('/api/notes', notesRouter.router);

connect();
app.listen(PORT, ()=> console.log(`Listening on host ${PORT}`));