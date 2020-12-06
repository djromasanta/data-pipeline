var mysql = require('mysql');
var moment = require('moment');
const util = require('util');

class DBConnection {
    constructor() {
        
    }
    
    async connectToDb(){
        try { 
            var con = mysql.createConnection({
                host: "mysql.agilatrading.com",
                user: "renzladromacom",
                password: "Mfe*f?BA",
                database: "data_pipeline",
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
            console.log(cols)
            con.query(`INSERT INTO ${table_name} (${cols}) VALUES ${data}`, function (err, result, fields) {
                if (err) throw err;
                //console.log(result);
                
                return result;
            });
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
                columnName = columnName + result.client_column_name + ","
            });

            return columnName.slice(0, -1);
            
		} catch (error) {

			console.log(error);
			return 1;
		}

        
       
    }

}

module.exports = DBConnection;