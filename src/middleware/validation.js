import oauthServices from '../services/oauth.services.js';

async function validation(req, res, next)
{
    try{
        const {authorization} = req.headers;
        if(authorization)
        {
            const encryptedTokenId = authorization.split(' ')[1];
            const validatedTokenId = await oauthServices.verifyTokenId(encryptedTokenId, req.session._id);
    
            if(!validatedTokenId)
            {
                throw new Error('Validation Failed');
            }
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
