const pool = require('../dbconfig')

module.exports = class ProductCategoryModel {
    async getCategories(){
        try{
            const results = await pool.query('SELECT * FROM categories ORDER BY id ASC')
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
               
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
    }

    async getProductsOfCategory(categoryid){
        try{
            const results = await pool.query('SELECT * FROM products WHERE categoryid = $1', [categoryid])
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                    
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
    }

    async getProduct(id){
        try{
            const results = await pool.query('SELECT * FROM products WHERE id = $1', [id])
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                    
            return results.rows[0];
        }catch(error){
            throw new Error(error);
        }
    }

    async searchProducts(searchQuery){
        try{

            const query = '%' + searchQuery + '%';
            
            const results = await pool.query('SELECT * FROM products WHERE name LIKE $1', [query]);
            
            if (!results.rows || results.rows.length < 1) {
                return null;
            }
                
            return results.rows;
        }catch(error){
            throw new Error(error);
        }
    }
}
