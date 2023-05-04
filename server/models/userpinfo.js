const pool = require('../dbconfig')

module.exports = class PInfoModel {

    async get(userid) {
        
        const requestUPID = `SELECT users.id,
                                    users.username,
                                    users.email,
                                    user_personal_info.first_name,
                                    user_personal_info.last_name,
                                    user_personal_info.date_of_birth,
                                    user_personal_info.phone_number
                                FROM users
                                JOIN user_personal_info
                                ON users.id = user_personal_info.userid
                                WHERE users.id = $1;`;
        try {
            const results = await pool.query(requestUPID, [userid])

            if (!results.rows || results.rows.length < 1) {
                return null;
            }

        

            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
       
    }

    async create(client, data) {

            const { userid ,first_name, last_name, date_of_birth, phone_number} = data;
            const querypInfo = `INSERT INTO user_personal_info 
                         (userid, first_name, last_name, date_of_birth, phone_number) 
                         VALUES ($1, $2, $3, $4, $5) RETURNING *`;

            const results = await client.query(querypInfo, [userid ,first_name, last_name, date_of_birth, phone_number]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            } 
                
            return results.rows[0];
    }

    async update(data){
        
        const { first_name, last_name, date_of_birth, phone_number, userid } = data;
        const querypInfo = ` UPDATE user_personal_info 
                             SET first_name = $1,
                                 last_name = $2,
                                 date_of_birth = $3,
                                 phone_number = $4
                             WHERE userid = $5
                             RETURNING *;`
        try{    
            const results = await pool.query(querypInfo, [first_name, last_name, date_of_birth, phone_number, userid])

            if (!results.rows || results.rows.length < 1) {
                return null;
            } 
                
            return results.rows[0];
                
        }catch(error){
            throw new Error(error);
        }
    }  
}

