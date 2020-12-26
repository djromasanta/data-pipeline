var mysql = require('mysql');
var moment = require('moment');
const util = require('util');

class DBConnection {
    constructor() {
        
    }
    
    async connectToDb(){
        try { 
            var con = mysql.createConnection({
                host: "mysql.dashboard.patrifriedman.com",
                user: "dh_4xgs38",
                password: "ib6M2yY6",
                database: "datapipeline",
                port: 3306
            });
    
            return con;
        } catch (error) {

			console.log(error);
			return 1;
		}
        
    }

    async insertData(table_name, data) {

        try { 
            var con = await this.connectToDb();
            var cols = await this.getColumnName(table_name);
            con.query(`INSERT INTO ${table_name} (${cols}) VALUES ${data}`, function (err, result, fields) {
                if(err && err.code == "ER_DUP_ENTRY") {
                    return err.code;
                } else {
                    if (err) throw err;
                }
                return result;
                
                
            });
        } catch (error) {

			console.log(error);
			return 1;
		}
        
    }

    async insertFitbitToken(accessToken, refreshToken) {

        try { 
            var con = await this.connectToDb();
            
           
            con.query(`INSERT INTO fitbit_token_tbl (access_token, refresh_token, date_created) VALUES ('${accessToken}', '${refreshToken}', NOW())`, function (err, result, fields) {
                if (err) throw err;
                //console.log(result);
                
                return result;
            });
        } catch (error) {

			console.log(error);
			return 1;
		}
        
    }

    async getFitbitToken() {

        try {
            const con = await this.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);
            var columnName = "";
            var tokens = {};
            const rows = await query(`SELECT * FROM fitbit_token_tbl ORDER BY id DESC LIMIT 1`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];      
                //columnName = columnName + result.client_column_name + ",";
                tokens = {"access_token": result.access_token, "refresh_token": result.refresh_token}
            });

            return tokens;
            
		} catch (error) {

			console.log(error);
			return 1;
		}
  
    }

    async deleteData(table_name, data) {

        try { 
            var con = await this.connectToDb();
            //var cols = await this.getColumnName(table_name);
              
            con.query(`DELETE FROM ${table_name} WHERE activity_date IN (${data})`, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                //return result;
            });
        } catch (error) {

			console.log(error);
			return 1;
		}
        
    }

    async getColumnName(table_name) {

        try {
            const con = await this.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);
            var columnName = "";

            const rows = await query(`SELECT * FROM data_pipeline_tbl_cols WHERE client_tbl_name = '${table_name}'`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];      
                columnName = columnName + "`" + result.client_column_name + "`" + ","
            });

            return columnName.slice(0, -1);
            
		} catch (error) {

			console.log(error);
			return 1;
		}
  
    }

}

module.exports = DBConnection;