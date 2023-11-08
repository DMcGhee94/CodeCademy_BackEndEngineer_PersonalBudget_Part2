const db = require('../db.js');

const getAllEnvelopes = async () => {
    const queryString = 'SELECT * FROM ENVELOPES';
    const result = await db.query(queryString);
    return result;
};

const getSpecificEnvelope = async (id) => {
    const queryString = 'SELECT * FROM ENVELOPES WHERE ENVELOPE_ID = $1';
    const parameters = [id];
    const result = await db.query(queryString, parameters);
    return result;
};

const getMaxEnvelopeId = async () => {
    const queryString = 'SELECT MAX(ENVELOPE_ID) as MAX_ID FROM ENVELOPES';
    const result = await db.query(queryString);
    return result;    
};

const createNewEnvelope = async (name, startingBalance) => {
    const maxId = await getMaxEnvelopeId();
    const newId = maxId.rows[0].max_id+1;
    const queryString = 'INSERT INTO ENVELOPES VALUES ($1, $2, $3)';
    const parameters = [newId, name, startingBalance];
    const result = await db.query(queryString, parameters);
    return newId;    
};

const deleteEnvelope = async (id) => {
    const queryString = 'DELETE FROM ENVELOPES WHERE ENVELOPE_ID = $1';
    const parameters = [id];
    const result = await db.query(queryString, parameters);
    return result;
};

const updateEnvelope = async (id, body) => {
    const {name, balance} = body;
    const queryString = 'UPDATE ENVELOPES SET ENVELOPE_NAME = $2, BALANCE = $3 WHERE ENVELOPE_ID = $1';
    const parameters = [id, name, balance];
    const result = await db.query(queryString, parameters);
    const updatedEnvelope = await getSpecificEnvelope(id);
    return updatedEnvelope;
};

module.exports = {
    getAllEnvelopes,
    getSpecificEnvelope,
    createNewEnvelope,
    deleteEnvelope,
    updateEnvelope
};