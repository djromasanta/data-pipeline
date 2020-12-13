const express = require('express');
const router = express.Router();

const request = require('request');
const api_config = require('../api_keys.json');

//Utilities Controller
const UtilSource = require('../controller/utilities');
const utilities = new UtilSource();

//Database Views
const DBViews = require('../model/db_views');
const dbViews = new DBViews(); 



router.get('/daily', function(req, res) {
	var result = { 
					sleep_score: "", 
					productivity_pulse: "",
					steps: "",
					activity_score: "",
					sleep_time: "",
					screen_time: ""

	};
	//column, table, column date, conditions, cond_value
	dbViews.getDashboardScores("score_total", "oura_sleep_tbl", "summary_date", "", "", "").then(sleep_score => {
		result.sleep_score = sleep_score + "%";

		dbViews.getDashboardScores("summary_value", "rescuetime_daily_summary_tbl", "activity_date", "summary_category", "productivity_pulse", "=").then(productivity_pulse => {
			result.productivity_pulse = productivity_pulse;

			dbViews.getDashboardScores("steps", "oura_activity_tbl", "summary_date", "", "", "").then(steps => {
				result.steps = steps;

				dbViews.getDashboardScores("score", "oura_activity_tbl", "summary_date", "", "", "").then(activity_score => {
					result.activity_score = activity_score + "%";;

					dbViews.getDashboardScores("duration", "oura_sleep_tbl", "summary_date", "", "").then(sleep_duration => {
						result.sleep_time = utilities.getTimeformat(sleep_duration);

						dbViews.getDashboardScores("SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "", "", "").then(screen_time => {
							result.screen_time = utilities.getTimeformat(screen_time);

							res.send(result);
						});	

					});	
				});	

			});

		});	

	});

});


router.get('/sleepcontributor', function(req, res) {
	var result = { 
                    efficiency: "",
                    disturbances: "",
                    rem_sleep: "",
                    deep_sleep: "",
                    sleep_latency: "",
                    avg_heart_rate: "",
                    avg_breathing: ""

	};
	//column, table, column date, conditions, cond_value
	dbViews.getDashboardScores("score_efficiency", "oura_sleep_tbl", "summary_date", "", "", "").then(efficiency => {
        result.efficiency = efficiency + "%";
        
        dbViews.getDashboardScores("score_disturbances", "oura_sleep_tbl", "summary_date", "", "", "").then(disturbances => {
            result.disturbances = disturbances + "%";

            dbViews.getDashboardScores("score_rem", "oura_sleep_tbl", "summary_date", "", "", "").then(rem_sleep => {
                result.rem_sleep = rem_sleep + "%";

                dbViews.getDashboardScores("score_deep", "oura_sleep_tbl", "summary_date", "", "", "").then(deep_sleep => {
                    result.deep_sleep = deep_sleep + "%";

                    dbViews.getDashboardScores("score_latency", "oura_sleep_tbl", "summary_date", "", "", "").then(sleep_latency => {
                        result.sleep_latency = sleep_latency + "%";

                        dbViews.getDashboardScores("hr_average", "oura_sleep_tbl", "summary_date", "", "", "").then(avg_heart_rate => {
                            result.avg_heart_rate = avg_heart_rate + "%";

                            dbViews.getDashboardScores("breath_average", "oura_sleep_tbl", "summary_date", "", "", "").then(avg_breathing => {
                                result.avg_breathing = avg_breathing + "%";
                                
                                res.send(result);
                            });
                    
                        });
                
                    });
            
                });
        
            });
    
        });

    });


    router.get('/rescuetimesummary', function(req, res) {
        var result = { 
            productive_time: "",
            distracting_time: "",
            top_activities: []
        };
        dbViews.getDashboardScores("SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "productivity", "0", ">=").then(productive_time => {
            result.productive_time = utilities.getTimeformat(productive_time);
            
            dbViews.getDashboardScores("SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "productivity", "0", "<").then(distracting_time => {
                result.distracting_time = utilities.getTimeformat(distracting_time);
                
                //category, column, table, con_date, order
                dbViews.getTopActivities("category", "SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "DESC").then(top_activities => {
                    result.top_activities = top_activities;
                    
                    res.send(result);
                });
            });
        });
    });

    // Efficiency 
    // Select score_efficiency FROM oura_sleep_tbl where summary_date = '';

    // Disturbances
    // Select score_disturbances FROM oura_sleep_tbl where summary_date = '';

    // REM Sleep
    // Select score_rem FROM oura_sleep_tbl where summary_date = '';

    // Deep Sleep
    // Select score_deep FROM oura_sleep_tbl where summary_date = '';

    // Sleep Latency
    // Select score_latency FROM oura_sleep_tbl where summary_date = '';

    // AVG Heart Rate
    // Select hr_average FROM oura_sleep_tbl where summary_date = '';
    // AVG Breathing
    // Select breath_average FROM oura_sleep_tbl where summary_date = '';


});



module.exports = router;