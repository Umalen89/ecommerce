const pool = require('../dbconfig')

module.exports = class PasswordModel{

    async get(userid){
        try{

            const results = await pool.query('SELECT password FROM passwords WHERE userid = $1', [userid]);

            if (!results.rows || results.rows.length < 1) {
                return null;
              }
        
            return results.rows[0];

        }catch(error){
            throw new Error(error);
        }
    }

    async create(client, data) {
            const { userid, password } = data

            const results =  await client.query('INSERT INTO passwords (userid, password) VALUES ($1, $2) RETURNING *', [userid, password]);

            if (!results.rows || results.rows.length < 1) {
                return null;
              }
        
            return results.rows[0];
    }

    async update(data) {
        try {
            const { userid, password } = data;
    
            const results = await pool.query('UPDATE passwords SET password = $1 WHERE userid = $2 RETURNING userid', [password, userid]);

            if (!results.rows || results.rows.length < 1) {
                return null;
              }
        
            return results.rows[0];
        } catch(error) {
            throw new Error(error)
        }
    }
}
