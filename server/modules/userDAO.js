'use strict';
const crypto = require('crypto');

class userDAO
{
    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('StudyPlan.db', (err) => {
            if (err) throw err;
        });
    }

     getUser = (code, password) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM student WHERE code = ?';
          this.db.get(sql, [code], (err, row) => {
            if (err) { 
              reject(err); 
            }
            else if (row === undefined) { 
              resolve(false); 
            }
            else {
              const student = {id: row.id, code:row.code, name: row.name, lastName:row.lastName, email: row.email};
            
              crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
                if (err) reject(err);
                if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                  resolve(false);
                else
                  resolve(student);
              });
            }
          });
        });
      };

}

module.exports=userDAO;