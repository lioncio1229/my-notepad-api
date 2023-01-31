
function testSession(sessionId)
{
    return (req, res, next) => {
        req.session._id = sessionId;
        next();
    } 
}

export {testSession};