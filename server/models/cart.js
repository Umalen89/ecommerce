const pool = require('../dbconfig');

module.exports = class CartModel {
    async get(userid){
        try{
            const results = await pool.query('SELECT * FROM carts WHERE userid = $1', 
                        [userid])
    
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                    
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async create(client, userid){
            const results = await client.query('INSERT INTO carts VALUES ($1, 0) RETURNING *', [userid]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                    
            return results.rows[0];
    }

    async update(client, data){
        try{
            const { cartid, total_cart_price } = data;
            
            const results = await client.query('UPDATE carts SET total_cart_price = $1 WHERE userid = $2 RETURNING *', [total_cart_price, cartid]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                    
            return results.rows[0];
        } catch(error){
            throw new Error(error);
        }
    }
}