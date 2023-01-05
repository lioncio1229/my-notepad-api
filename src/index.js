import express from 'express';
import cors from 'cors';
import sessions from 'express-session';
import { OAuth2Client } from 'google-auth-library';
import connect from './services/connection.js';
import notesRouter from './routes/notes.router.js';
import usersRouter from './routes/users.router.js';
import usersServices from './services/users.services.js';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

const {NODE_ENV, SECRET_KEY, CLIENT_ID} = process.env;

const app = express();
const PORT = NODE_ENV === 'development' ? 3000 : process.env.PORT;
const oneDay = 1000 * 60 * 60 * 24;

const client = new OAuth2Client(CLIENT_ID);

if(NODE_ENV === 'development')
{
    const delay = async (req, res, next) => {
        await new Promise((resolve) => {
            setTimeout(resolve, 200);
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
    name : 'mnp.sid',
    saveUninitialized: true,
    cookie: { maxAge: oneDay},
    resave: true
}

if(NODE_ENV === 'production')
{
    app.set('trust proxy', 1);
    sessionObj.cookie.secure = true;
    sessionObj.cookie.sameSite = 'none';
}

app.use(sessions(sessionObj));

app.get('/', (req, res) => {
    fs.readFile('public/index.html', (err, data) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(data.toString());
    });
});

//Authenticate User
app.post('/api/v1/auth/google', async (req, res) => {
    try{
        const {token} = req.body;
        
        const ticket = await client.verifyIdToken({
            idToken : token,
            audience : CLIENT_ID,
        });
        const {sub : _id, name, email, picture} = ticket.getPayload();
        req.session._id = _id;
        
        const user = await usersServices.upsetUser({_id, name, email, picture});
        res.send(user);
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
});

app.use('/api/user', usersRouter.router);
app.use('/api/notes', notesRouter.router);

connect();
app.listen(PORT, ()=> console.log(`Listening on host ${PORT}`));
