const pool = require('../dbconfig')
const UserModel = require('./user');
const UserInstance = new UserModel();
const PasswordModel = require('./userpswd');
const PasswordInstance = new PasswordModel();
const PInfoModel = require('./userpinfo');
const PInfoInstance = new PInfoModel();
const CartModel = require('./cart')
const CartInstance = new CartModel();
const CartProductModel = require('./cartproduct');
const CartProductInstance = new CartProductModel();
const OrderModel = require('./order');
const OrderInstance = new OrderModel();
const OrderProductModel = require('./orderproduct');
const { check } = require('express-validator');
const OrderProductInstance = new OrderProductModel();


module.exports = class TransactionModel {
     async createUser(user, password, pinfo) {
      let client;
        try {
          client = await pool.connect();
          await client.query('BEGIN');
          
          const userResult = await UserInstance.create(client, user);
          
          if (!userResult) {
            await client.query('ROLLBACK');
            return null;
          }
          
          const passwordResult = await PasswordInstance.create(client, { userid: userResult.id, password });
          
          if (!passwordResult) {
            await client.query('ROLLBACK');
            return null;
          }

          const pinfoResult = await PInfoInstance.create(client, {userid: userResult.id, ...pinfo});

          if (!pinfoResult) {
            await client.query('ROLLBACK');
            return null;
          }

          const cartResult = await CartInstance.create(client, userResult.id)
         
          if (!cartResult) {
            await client.query('ROLLBACK');
            return null;
          }
    
          await client.query('COMMIT');
          client.release();
          return { user: userResult, password: passwordResult, pinfo: pinfoResult, cart:cartResult };
        } catch (error) {
          await client.query('ROLLBACK');
          client.release();
          throw new Error(error);
        }
      }

      async addProductToCart(data){
        let client;
        try{
          client = await pool.connect()
          let productResult;
          const { cart_userid, productid } = data
          
          
          await client.query('BEGIN');
          
          const checkproduct = await CartProductInstance.getSingle({cart_userid, id:productid});
          
          if(checkproduct){
            productResult = await CartProductInstance.update(client, data);
          }else{
            productResult = await CartProductInstance.create(client, data);            
          }
          
          if (!productResult) {
            await client.query('ROLLBACK');
            return null;
          }

          const total_cart_price = await CartProductInstance.getCartSum(client,  cart_userid)
          if (!total_cart_price) {
            await client.query('ROLLBACK');
            return null;
          }

          const results = await CartInstance.update(client, ({cartid: cart_userid, total_cart_price: total_cart_price.sum}))
          
          if (!results) {
            await client.query('ROLLBACK');
            return null;
          }

          await client.query('COMMIT');
          
          return results;
        }catch(error){
          await client.query('ROLLBACK');
          throw new Error(error);
        }finally{
          client.release();
        }

      }

      async deleteProductFromCart(data){
        let client;
        try{
          client = await pool.connect()
          let productResult;
          const { cart_userid, id } = data;
          
          await client.query('BEGIN');
          
          const checkproduct = await CartProductInstance.getSingle({cart_userid, id});
          
          if(checkproduct){
            productResult = await CartProductInstance.deleteSingle(client, data);
          }else{
            await client.query('ROLLBACK');
            return null;            
          }
          
          if (!productResult) {
            await client.query('ROLLBACK');
            return null;
          }

          let total_cart_price = await CartProductInstance.getCartSum(client,  cart_userid)
          
          if (!total_cart_price) {
            await client.query('ROLLBACK');
            return null;
          } else if(total_cart_price.sum === null){ 
            total_cart_price = 0; 
          };
          
          const results = await CartInstance.update(client, ({cartid: cart_userid, total_cart_price}))
          
          if (!results) {
            await client.query('ROLLBACK');
            return null;
          }

          await client.query('COMMIT');
          
          return results;
        }catch(error){
          await client.query('ROLLBACK');
          throw new Error(error);
        }finally{
          client.release();
        }

      }

      async deleteAllFromCart(cart_userid){
        let client;
        try{
          client = await pool.connect()
          let productResult;
          
          await client.query('BEGIN');
          
          productResult = await CartProductInstance.deleteAll(client, cart_userid);
          
          if (!productResult) {
            await client.query('ROLLBACK');
            return null;
          }

          let total_cart_price = 0;

          const results = await CartInstance.update(client, ({cartid: cart_userid, total_cart_price}))
          
          if (!results) {
            await client.query('ROLLBACK');
            return null;
          }

          await client.query('COMMIT');
          
          return results;
        }catch(error){
          await client.query('ROLLBACK');
          throw new Error(error);
        }finally{
          client.release();
        }

      }

      async checkout(data){
        let client;
        const {cart_userid} = data;
        
        try{
          client = await pool.connect();

          await client.query('BEGIN');
          
          const cartItems =  await CartProductInstance.getAll(client, cart_userid);
          
          if(cartItems.length < 1){
            await client.query('ROLLBACK')
            return null;
          }
          
          const orderResult = await OrderInstance.create(client, {userid: cart_userid, ...data});
          
          if (!orderResult){
            await client.query('ROLLBACK')
            return null;
          }

          let orderitems = [];

          for (const item of cartItems) {
            const product =  await client.query('SELECT name FROM products WHERE id = $1', [item.productid]);
            const additem = await OrderProductInstance.create(client, {orderid: orderResult.id, productid:item.productid,
                                               product_name:product.rows[0].name, qty:item.qty, total_pp:item.total_pp})
            orderitems.push(additem);
          }
          

          const productResult = await CartProductInstance.deleteAll(client, cart_userid);

          if (!productResult) {
            await client.query('ROLLBACK');
            return null;
          }

          let total_cart_price = 0;

          const results = await CartInstance.update(client, ({cartid: cart_userid, total_cart_price}))
          
          if (!results) {
            await client.query('ROLLBACK');
            return null;
          }

          await client.query('COMMIT');

          return ({order: orderResult, items: orderitems})
        }catch(error){
          await client.query('ROLLBACK');
          throw new Error(error);
        }finally{
          client.release();
        }
      }
}