var moment = require('moment');
const DBConnection = require('../model/database');
const dbCon = new DBConnection(); 


class DataProcessor {
    constructor() {
        
    }
    
    async rescueTimeAnalytics(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            values = values + `('${data[i][0]}',  '${data[i][1]}', '${data[i][2]}', '${data[i][3]}', '${data[i][4]}', '${data[i][5]}', '${date}'),`
        }
        await dbCon.insertData("rescuetime_analytics_tbl", values.slice(0, -1));
    }

    async rescueTimeDailySummary(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            
            var dly_sum_id = data[i].id
            var dly_sum_date = data[i].date

            var obj_list = Object.entries(data[i])

            for(var r=0; r < obj_list.length; r++){
                if(obj_list[r][0] == "id" || obj_list[r][0] == "date" ){
                    continue;
                } else {
                    values = values + `('${dly_sum_id}',  '${dly_sum_date}', '${obj_list[r][0]}', '${obj_list[r][1]}'),`
                }
            }
            
            
        }
        await dbCon.insertData("rescuetime_daily_summary_tbl", values.slice(0, -1));
    }

}

module.exports = DataProcessor;