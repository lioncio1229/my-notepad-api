import {client} from "./connection.js";

export const getRefreshTokenCollection = () => {
    try
    {
        return client.db('my_notepad').collection('refresh_tokens');
    }
    catch(e) 
    {
        console.log(e.message);
    }
};

function handleError()
{
    if(!client) throw new Error("Not connected to database.");
}

async function getRefreshTokenWithId(_id)
{
    handleError();
    const res = await getRefreshTokenCollection().findOne({_id});
    return res?.refreshToken;
}

async function setRefreshToken(_id, refreshToken)
{
    handleError();
    await getRefreshTokenCollection().insertOne({_id, refreshToken});
}

async function updateRefreshToken(_id, refreshToken) {
    handleError();
    await getRefreshTokenCollection().updateOne({ _id }, {$set : {refreshToken}});
}

async function upsertRefreshToken(_id, refreshToken)
{
    handleError();
    const res = await getRefreshTokenWithId(_id);
    if(res)
    {
        updateRefreshToken(_id, refreshToken);
        return;
    }
    setRefreshToken(_id, refreshToken);
}

export default {upsertRefreshToken, getRefreshTokenWithId};