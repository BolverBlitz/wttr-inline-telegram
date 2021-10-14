const pg = require('pg');

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

pool.query(`CREATE TABLE IF NOT EXISTS chats (
    chatid bigint PRIMARY KEY,
    city text DEFAULT 'Nürnberg',
    enabled boolean DEFAULT False,
    lang text DEFAULT 'en',
    lastpush TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`, (err, result) => {
    if (err) {console.log(err)}
});

/**
 * 
 * @param {bigint} chatid 
 * @param {string} city 
 * @param {boolean} enabled 
 * @param {string} lang 
 * @returns 
 */
let WriteNewChat = function(chatid, city, enabled, lang) {
    return new Promise(function(resolve, reject) {
        pool.query('INSERT INTO chats (chatid, city, enabled, lang) VALUES ($1,$2,$3,$4)',[
            chatid, city, enabled, lang
        ], (err, result) => {
            if (err) {reject(err)}
            resolve(result);
        });
    });
}

let write = {
    chat: {
      new: WriteNewChat
    }
}

module.exports = {
    write
};