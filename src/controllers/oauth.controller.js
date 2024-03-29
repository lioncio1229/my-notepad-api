import usersServices from '../services/users.services.js';
import oauthServices from '../services/oauth.services.js';
import {client, CLIENT_ID} from '../config.js';

async function authenticate(req, res)
{
    try{
        const {authCode} = req.body;
        const result = await client.getToken(authCode);
        client.setCredentials(result.tokens);

        const {refresh_token, id_token} = result.tokens;

        const ticket = await client.verifyIdToken({
            idToken : id_token,
            audience : CLIENT_ID,
        });

        const {sub : _id, name, email, picture} = ticket.getPayload();
        await oauthServices.upsertRefreshToken(_id, refresh_token);

        req.session._id = _id;
        await usersServices.upsetUser({_id, name, email, picture});
        res.send(id_token);
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
}

async function generateTokenId(req, res)
{
    try{
        const refreshToken = await oauthServices.getRefreshTokenWithId(req.session._id);
        client.setCredentials({
            refresh_token: refreshToken
        });
        
        const obj = await client.refreshAccessToken();
        res.send(obj.credentials.id_token);
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
}

export default {authenticate, generateTokenId};