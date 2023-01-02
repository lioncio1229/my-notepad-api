import usersServices from '../services/users.services.js';


async function getUser(req, res)
{
    try
    {
        const googleId = req.session._id;
        const result = await usersServices.getUser(googleId);
        res.status(200).send(result);
    }
    catch(e)
    {
        res.status(400).send(`Can't get user. <br><br>${e.message}`);
    }
}

async function upsetUser(req, res)
{
    try
    {
        const user = req.body;
        await usersServices.upsetUser(user);
        res.status(200).send(user);
    }
    catch(e)
    {
        res.status(400).send(`Can't add/update user. <br><br>${e.message}`);
    }
}

 async function deleteUser(req, res)
{
    try
    {
        const { _id } = req.params;
        const resultId = await usersServices.deleteUser(_id);
        if(resultId)
            res.status(200).send(resultId);
        else 
            res.status(404).send(`Can't delete user with the id of ${_id}. ID not found`);
    }
    catch(e)
    {
        res.status(400).send(`Can't delete user. <br><br>${e.message}`);
    }
}

async function deleteAll(req, res)
{
    try
    {
        await usersServices.deleteAll();
        res.status(200).send('All users deleted');
    }
    catch(e)
    {
        res.status(400).send(`Can't delete all users. <br><br>${e.message}`);
    }
}

export default { getUser, upsetUser, deleteUser, deleteAll};