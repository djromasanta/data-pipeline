var moment = require('moment');
const DBConnection = require('../model/database');
const dbCon = new DBConnection(); 


class DataProcessor {
    constructor() {
        
    }
    
    /** Start Rescuetime **/
    async rescueTimeAnalytics(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            values = values + `('${data[i][0]}',  '${data[i][1]}', '${data[i][2]}', '${data[i][3]}', '${data[i][4]}', '${data[i][5]}', '${date}'),`
        }
        await dbCon.deleteData("rescuetime_analytics_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("rescuetime_analytics_tbl", values.slice(0, -1));
    }

    async rescueTimeDailySummary(data, date){
        var values = "";
        var date_list = "";
        for(var i=0; i < data.length; i++) {
            
            var dly_sum_id = data[i].id
            var dly_sum_date = data[i].date

            var obj_list = Object.entries(data[i]);

            date_list = date_list + `'${dly_sum_date}',`;

            for(var r=0; r < obj_list.length; r++){
                if(obj_list[r][0] == "id" || obj_list[r][0] == "date" ){
                    continue;
                } else {
                    values = values + `('${dly_sum_id}',  '${dly_sum_date}', '${obj_list[r][0]}', '${obj_list[r][1]}'),`;
                }
            }
            
        }

        await dbCon.deleteData("rescuetime_daily_summary_tbl", date_list.slice(0, -1));
        await this.delay();
        await dbCon.insertData("rescuetime_daily_summary_tbl", values.slice(0, -1));
        
    }
    /** End Rescuetime **/


    /** Start Fitbit **/

    async getFitbitToken(access_token, refresh_token){
        
        var tokens = await dbCon.getFitbitToken();
        return tokens;
    }

    async fitbitToken(access_token, refresh_token){
        
        await dbCon.insertFitbitToken(access_token, refresh_token);
    }


    async fitbitHeartRate(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            values = values + `('${data[i].max}',  '${data[i].min}', '${data[i].name}', '${date}'),`
        }
    
        await dbCon.deleteData("fitbit_heartrate_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("fitbit_heartrate_tbl", values.slice(0, -1));
    }

    async fitbitSleepRate(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            values = values + `('${data[i].dateOfSleep}',  '${data[i].duration}', '${data[i].efficiency}',
                                '${data[i].isMainSleep}',  '${data[i].logId}', '${data[i].minutesAfterWakeup}',
                                '${data[i].minutesAsleep}',  '${data[i].minutesAwake}', '${data[i].minutesToFallAsleep}',
                                '${data[i].startTime}',  '${data[i].timeInBed}', '${data[i].type}', '${date}'),`
        }
       
        await dbCon.deleteData("fitbit_sleep_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("fitbit_sleep_tbl", values.slice(0, -1));
    }

    async fitbitSleepSummary(data, date){
        var values = `('${data["totalMinutesAsleep"]}', '${data["totalSleepRecords"]}', '${data["totalTimeInBed"]}', '${date}'),`;
        
        await dbCon.deleteData("fitbit_sleep_summary_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("fitbit_sleep_summary_tbl", values.slice(0, -1));
    }

    async fitbitCalories(data, date){

        var values = `('${data["value"]}',  '${data["dateTime"]}'),`;

        await dbCon.deleteData("fitbit_calories_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("fitbit_calories_tbl", values.slice(0, -1));
    }

    async fitbitSteps(data, date){

        var values = `('${data["value"]}',  '${data["dateTime"]}'),`;

        await dbCon.deleteData("fitbit_steps_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("fitbit_steps_tbl", values.slice(0, -1));
    }

    /** End Fitbit **/


    /** Start Oura **/
    async ouraSleepRate(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            values = values + `('${data[i].awake}', '${data[i].bedtime_end}', '${data[i].bedtime_end_delta}', '${data[i].bedtime_start}', '${data[i].bedtime_start_delta}', '${data[i].breath_average}', '${data[i].deep}', 
                                '${data[i].duration}', '${data[i].efficiency}', '${data[i].hr_average}', '${data[i].hr_lowest}', '${data[i].hypnogram_5min}', '${data[i].is_longest}', '${data[i].light}', 
                                '${data[i].midpoint_at_delta}', '${data[i].midpoint_time}', '${data[i].onset_latency}', '${data[i].period_id}', '${data[i].rem}', '${data[i].restless}', '${data[i].rmssd}', 
                                '${data[i].score}', '${data[i].score_alignment}', '${data[i].score_deep}', '${data[i].score_disturbances}', '${data[i].score_efficiency}', '${data[i].score_latency}', '${data[i].score_rem}', 
                                '${data[i].score_total}', '${data[i].summary_date}', '${data[i].temperature_delta}', '${data[i].temperature_deviation}', '${data[i].temperature_trend_deviation}', '${data[i].timezone}', '${date}'
            ),`;

        }
       
        await dbCon.deleteData("oura_sleep_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("oura_sleep_tbl", values.slice(0, -1));
    }

    async ouraActivity(data, date){
        var values = "";
        for(var i=0; i < data.length; i++) {
            values = values + `('${data[i].average_met}', '${data[i].cal_active}', '${data[i].cal_total}', '${data[i].class_5min}', '${data[i].daily_movement}', '${data[i].day_end}', '${data[i].day_start}', 
                                '${data[i].high}', '${data[i].inactive}', '${data[i].inactivity_alerts}', '${data[i].low}', '${data[i].medium}', '${data[i].met_min_high}', '${data[i].met_min_inactive}', 
                                '${data[i].met_min_low}', '${data[i].met_min_medium}', '${data[i].non_wear}', '${data[i].rest}', '${data[i].rest_mode_state}', '${data[i].score}', '${data[i].score_meet_daily_targets}', 
                                '${data[i].score_move_every_hour}', '${data[i].score_recovery_time}', '${data[i].score_stay_active}', '${data[i].score_training_frequency}', '${data[i].score_training_volume}', '${data[i].steps}', '${data[i].summary_date}', 
                                '${data[i].target_calories}', '${data[i].target_km}', '${data[i].target_miles}', '${data[i].timezone}', '${data[i].to_target_km}', '${data[i].to_target_miles}', '${data[i].total}', '${date}'
            ),`;

        }
       
        await dbCon.deleteData("oura_activity_tbl", `'${date}'`);
        await this.delay();
        await dbCon.insertData("oura_activity_tbl", values.slice(0, -1));
    }
    /** End Oura **/


    async nomieData(data, date){
        var values = `('${data.epoch}', '${data.start}', '${data.end}', '${data.offset}', '${data.tracker}', 
                        '${data.value}', '${data.note}', '${data.lat}', '${data.lng}', '${data.location}', 
                        '${data.score}', '${date}'
                    ),`;
       
        // await dbCon.deleteData("oura_activity_tbl", `'${date}'`);
        // await this.delay();
        let result = await dbCon.insertData("nomie_app_tbl", values.slice(0, -1));
        return result;
    }


    async delay() {
        return new Promise((resolve, reject) => {
                setTimeout(resolve, 1000);
        });
    }

}

 

module.exports = DataProcessor;


