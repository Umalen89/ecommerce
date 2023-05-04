const pool = require('../dbconfig')
const moment = require('moment');

module.exports = class OrderModel {
    async getSingle(data) {
        try{
            
            const {id, userid} = data;
            const results = await pool.query('SELECT * FROM orders WHERE id = $1 AND userid = $2', [id, userid]);
            
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async getAll(userid) {
        try{
            const results = await pool.query('SELECT * FROM orders WHERE userid = $1', [userid]);

            if (!results.rows) {
                return null;
            }
                                                      
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
    }

    async create(client, data){
        try{
           
            const { userid, total_price, del_postcode, del_street, del_city, del_county } = data;
            const order_date = moment.utc().toISOString();
            const status = 'PENDING';
            const modified = moment.utc().toISOString();
            const insertdata = [userid, order_date, total_price, status, modified, del_postcode, del_street, del_city, del_county]
            
            const results = await client.query(`INSERT INTO orders (userid, order_date, total_price, status, modified,  del_postcode, del_street, del_city, del_county) 
                                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, insertdata);
                                              
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];

        }catch(error){
            throw new Error(error);
        }
    }

    async update(data){
        try{
            const { id, status } = data;
            const modified = moment.utc().toISOString();

            const results = await pool.query('UPDATE orders SET status = $1, modified = $2 WHERE id = $3 RETURNING *', [status, modified, id]);
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }
}