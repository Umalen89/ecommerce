const pool = require('../dbconfig')

module.exports = class OrderProductModel {
    async get(orderid){
        try{
            
            const results = await pool.query('SELECT * FROM orders_products WHERE orderid = $1', [orderid]);

            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
    }

    async create(client, data){
        try{
            const { orderid, productid, product_name, qty, total_pp } = data;

            const results =  await client.query('INSERT INTO orders_products (orderid, productid, product_name, qty, total_pp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                                              [orderid, productid, product_name, qty, total_pp])
            
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                                                      
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }
}