const pool = require('../dbconfig')

module.exports = class CartProductModel {
    async getAll(client, cart_userid){
        try{
            let results;
            const query = `SELECT carts_products.productid, products.name, carts_products.qty, carts_products.total_pp
                           FROM carts_products
                           JOIN products ON carts_products.productid = products.id
                           WHERE carts_products.cart_userid = $1`;
            if(!client){ 
                results = await pool.query(query, [cart_userid]);
            }else{
                results = await client.query(query, [cart_userid]);
            }
            
            
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
            const {cart_userid, id} = data;

            const results = await pool.query(`SELECT carts_products.productid, products.name, carts_products.qty, carts_products.total_pp
                                            FROM carts_products
                                            JOIN products ON carts_products.productid = products.id
                                            WHERE carts_products.cart_userid = $1
                                            AND products.id = $2`, [cart_userid, id]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            }
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async getCartSum(client, cart_userid){
        try{
            const results = await client.query('SELECT SUM(total_pp) AS sum FROM carts_products WHERE cart_userid = $1', [cart_userid])
            
            if (!results.rows) {
                return null;
            }
                  
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async create(client, data){
        try{
            const { cart_userid, productid, qty, total_pp } = data;

            const results =  await client.query('INSERT INTO carts_products VALUES ($1, $2, $3, $4) RETURNING *', 
                                                [cart_userid, productid, qty, total_pp]);
            
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async update(client, data){
        try{
            const {cart_userid, productid, qty, total_pp } = data;

            const results = await client.query('UPDATE carts_products SET qty = $3, total_pp = $4 WHERE cart_userid = $1 AND productid = $2 RETURNING *',
                                             [cart_userid, productid, qty, total_pp]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async deleteAll(client, cart_userid){
        try{
            
            const results = await client.query('DELETE FROM carts_products WHERE cart_userid = $1 RETURNING *', [cart_userid]);
            
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                     
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
    }

    async deleteSingle(client, data){
        try{
            const { cart_userid, id} = data;

            const results = await client.query('DELETE FROM carts_products WHERE cart_userid = $1 AND productid = $2 RETURNING *', [cart_userid, id])
        
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }
}