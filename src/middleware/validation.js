import {client, CLIENT_ID} from '../config.js';

async function validation(req, res, next)
{
    try{
        const {authorization} = req.headers;
        if(authorization)
        {
            const tokenId = authorization.split(' ')[1];

            await client.verifyIdToken({
                idToken : tokenId,
                audience : CLIENT_ID,
            });
            next();
            return;
        }
        throw new Error('Authorization Required');
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
}

export default validation;
