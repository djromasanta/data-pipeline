var mysql = require('mysql');
var moment = require('moment');
const util = require('util');

const DBConnection = require('./database');
const dbCon = new DBConnection(); 

//Utilities Controller
const UtilSource = require('../controller/utilities');
const utilities = new UtilSource();

class DBViews {
    constructor() {
        
    }
    
    async getDashboardScores(column, table, con_date, conditions, cond_value, cond_symbol) {

        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);
            var columnName = "";

            let date_cond = `${con_date} = (SELECT MAX(${con_date}) FROM ${table} LIMIT 1)`;
            let other_cond = `AND ${conditions} ${cond_symbol} '${cond_value}'`;

            if(conditions == ""){
                other_cond = "";
            }

            const rows = await query(`SELECT ${column} AS result FROM ${table} WHERE ${date_cond} ${other_cond}`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];      
                columnName = columnName + result.result + ","
            });

            return columnName.slice(0, -1);
            
		} catch (error) {

			console.log(error);
			return 1;
		}
  
    }

    async getTopActivities(category, column, table, con_date, order) {

        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);


            let date_cond = `${con_date} = (SELECT MAX(${con_date}) FROM ${table} LIMIT 1)`;
            let data = [];
          
            const rows = await query(`SELECT ${category} AS category, ${column} AS value 
            FROM ${table} WHERE ${date_cond} 
            GROUP by ${category} ORDER BY value ${order} LIMIT 5;`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];
                data.push({
                    "category": result.category,
                    "value": utilities.getTimeformat(result.value)
                })
            });

            return data;
            
		} catch (error) {

			console.log(error);
			return 1;
		}
  
    }

}

module.exports = DBViews;