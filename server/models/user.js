const pool = require('../dbconfig');

module.exports = class UserModel {

    async findById(id) {
        try {
          const results = await pool.query('SELECT id, username, email FROM users WHERE id = $1;', [id]);
    
          if (!results.rows || results.rows.length < 1) {
            return null;
          }
    
          return results.rows[0];
        } catch (error) {
          throw new Error(error);
        }
      }

      async findByUsername(username) {
        try {
          const results = await pool.query(
            'SELECT * FROM users  WHERE username = $1;',
            [username]
          );
    
          if (!results.rows || results.rows.length < 1) {
            return null;
          }
    
          return results.rows[0];
        } catch (error) {
          throw new Error(error);
        }
      }

      async findByEmail(email) {
        try {
          const results = await pool.query(
            'SELECT id, username, email, password FROM users JOIN passwords ON users.id = passwords.userid WHERE users.email = $1;',
            [email]
          );
    
          if (!results.rows || results.rows.length < 1) {
            return null;
          }
    
          return results.rows[0];
        } catch (error) {
          throw new Error(error);
        }
      }

      async create(client, data) {
          const {username, email} = data;
          const results = await  client.query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
                                            [username, email]);

          if (!results.rows || results.rows.length < 1) {
            return null;
          }
    
          return results.rows[0];
      }

      async update(data) {
        try{
            const { username, email, id } = data;

            const results = await  pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
                                              [username, email, id])

            if (!results.rows || results.rows.length < 1) {
              return null;
            }
      
            return results.rows[0];

       } catch(error){
            throw new Error(error);
       }
     } 


}



  

  



 


   