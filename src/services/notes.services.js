import {client} from "./connection.js";
import { getUsersCollections } from "./users.services.js";


function handleError(googleId)
{
    if(!client) throw new Error("Not connected to database.");
    if(!googleId) throw new Error("Session is terminated. Please Login.");
}

const getNotes = async (googleId) => {
    handleError(googleId);

    const user = await getUsersCollections().findOne({_id : googleId});
    if(!user) throw new Error("Can't find user");

    return user.notes;
};

const getNote = async (googleId, noteId) => {
    handleError(googleId);

    const user = await getUsersCollections().findOne({_id : googleId});
    if(!user) throw new Error("Can't find user");

    const note = user.notes.find(note => note._id === noteId);

    if(note) return note;
    throw new Error("Can't find note");
}

const addNote = async (googleId, note) => {
    handleError(googleId);
    
    await getUsersCollections().updateOne({_id : googleId}, {$push : {notes : note}});
    return note;
}

const addNotes = async (googleId, notes) => {
    handleError(googleId);

    await getUsersCollections().updateOne({_id : googleId}, {$push : {notes : {$each : notes}}});
    return notes;
}

const deleteNote = async (googleId, noteId) => {
    handleError(googleId);

    const result = await getUsersCollections().updateOne({_id : googleId}, {$pull : {notes : {_id : noteId}}});
    if(result.modifiedCount > 0) return noteId;
    throw new Error('Note id not found');
}

const deleteAll = async (googleId) => {
    handleError(googleId);

    await getUsersCollections().updateOne({_id : googleId}, {$set : {notes : []}});
};

const updateNote = async (googleId, updatedNote) => {
    handleError(googleId);

    const id = updatedNote._id;
    const filter = { _id : googleId, 'notes._id' : id};
    const updatedDoc = {
        $set : {'notes.$' : {...updatedNote, _id : id}}
    };

    const result = await getUsersCollections().updateOne(filter, updatedDoc);

    if(result && result.matchedCount > 0)
        return updatedNote;
    
    throw new Error('Update Field');
}

export default {
  getNote,
  getNotes,
  addNote,
  addNotes,
  updateNote,
  deleteNote,
  deleteAll,
};