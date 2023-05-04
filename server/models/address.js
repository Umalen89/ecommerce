const pool = require('../dbconfig');

module.exports = class AddressModel {
    async getAll(userid){
        try{
            const results = await pool.query('SELECT id, postcode, street, city, county FROM addresses WHERE userid = $1', [userid]);

            if (!results.rows) {
                return null;
              }
            
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
        
    }

    async getSingle(data) {
        try{
            const {userid, addressid} = data;
            const results = await pool.query('SELECT id, postcode, street, city, county FROM addresses WHERE id = $1 AND userid = $2', [addressid, userid])

            if (!results.rows || results.rows.length < 1) {
                return null;
              }
        
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async checkIfExists(data){
        try{
            const { userid, postcode, street, city, county } = data;
            const results = await pool.query(`SELECT id, postcode, street, city, county FROM addresses 
                                              WHERE postcode = $1 AND street = $2 AND city = $3 AND county = $4 AND userid = $5`,
                                             [postcode, street, city, county, userid]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            }

            return results;

        }catch(error){
            throw new Error(error);
        }
    } 

    async create(data){
        try{
            const {userid, postcode, street, city, county } = data;
    
            const results = await pool.query('INSERT INTO addresses (userid, postcode, street, city, county) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                                            [userid, postcode, street, city, county]);
        
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                    
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }


    async delete(data) {
        try{

            const {addressid, userid} = data;
            const results = await pool.query('DELETE FROM addresses WHERE id=$1 AND userid=$2 RETURNING *', [addressid, userid]);
            
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                                    
            return results.rows[0];
        
        }catch(error){
            throw new Error(error);
        }
        
    }
}

