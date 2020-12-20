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
    
    async getDashboardScores(column, table, con_date, conditions, cond_value, cond_symbol, date_val) {

        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);
            var columnName = "";

            let date_cond = `${con_date} = (SELECT MAX(${con_date}) FROM ${table} LIMIT 1)`;
            let other_cond = `AND ${conditions} ${cond_symbol} '${cond_value}'`;
            
            if(date_val != "" && date_val != "undefined"){
                date_cond = `${con_date} LIKE '%${date_val}%'`;
            } 

            if(conditions == ""){
                other_cond = "";
            }

            console.log(`SELECT ${column} AS result FROM ${table} WHERE ${date_cond} ${other_cond} LIMIT 1`);
            const rows = await query(`SELECT ${column} AS result FROM ${table} WHERE ${date_cond} ${other_cond} LIMIT 1`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];      
                columnName = result.result
            });

            if(columnName == "" || columnName == null){
                columnName = 0;
            }
            return Math.round(columnName);
            
		} catch (error) {

			console.log(error);
			return 1;
		}
  
    }

    async getCategory(category, column, table, con_date, order, date_val) {

        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);


            let date_cond = `${con_date} = (SELECT MAX(${con_date}) FROM ${table} LIMIT 1)`;
            let category_list = `AND summary_category 
            IN (
                'business_percentage',
                'communication_and_scheduling_percentage',
                'design_and_composition_percentage',
                'entertainment_percentage',
                'news_percentage',
                'reference_and_learning_percentage',
                'shopping_percentage',
                'social_networking_percentage',
                'software_development_percentage',
                'utilities_percentage',
                'uncategorized_percentage'
                ) `;
            let data = [];

            if(date_val != "" && date_val != "undefined"){
                date_cond = `${con_date} LIKE '%${date_val}%'`;
            } 
          
            const rows = await query(`SELECT ${category} AS category, ${column} AS value 
            FROM ${table} WHERE ${date_cond} ${category_list}
            GROUP by ${category} ORDER BY category ${order};`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];
                data.push({
                    "category": utilities.formatCategory(result.category),
                    "value": Math.round(result.value) + "%"
                })
            });

            return data;
            
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

    async getDates(dateType) {

        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);

            let data = [];
          
            const rows = await query(`SELECT LEFT(summary_date, ${dateType}) AS result FROM oura_activity_tbl GROUP BY LEFT(summary_date, ${dateType}) ORDER BY result DESC;`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];
                data.push(result.result)
            });

            return data;
            
		} catch (error) {

			console.log(error);
			return 1;
		}
  
    }


    //FOR DATA VIEW
    async getClientInfo(){
        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);
            let data = [];
          
            const rows = await query(`SELECT DISTINCT client_name AS result FROM data_pipeline_tbl_cols;`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];
                data.push(result.result)
            });

            return data;
            
		} catch (error) {

			console.log(error);
			return 1;
		}
    }

    async getTableInfo(table){
        try {
            const con = await dbCon.connectToDb();
            // node native promisify
            const query = util.promisify(con.query).bind(con);
            let data = [];
          
            const rows = await query(`SELECT DISTINCT client_tbl_name AS result FROM data_pipeline_tbl_cols WHERE client_name = '${table}';`);
            
            Object.keys(rows).forEach(function(key) {
                var result = rows[key];
                data.push(result.result)
            });

            return data;
            
		} catch (error) {

			console.log(error);
			return 1;
		}
    }
}

module.exports = DBViews;