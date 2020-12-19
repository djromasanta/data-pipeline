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
                    screen_time: "",
                    calories: ""

	};
    //column, table, column date, conditions, cond_value
    var date = req.query.date;

	dbViews.getDashboardScores("AVG(score_total)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(sleep_score => {
		result.sleep_score = sleep_score + "%";

		dbViews.getDashboardScores("AVG(summary_value)", "rescuetime_daily_summary_tbl", "activity_date", "summary_category", "productivity_pulse", "=", date).then(productivity_pulse => {
			result.productivity_pulse = productivity_pulse;

			dbViews.getDashboardScores("AVG(steps)", "oura_activity_tbl", "summary_date", "", "", "", date).then(steps => {
				result.steps = steps;

				dbViews.getDashboardScores("AVG(score)", "oura_activity_tbl", "summary_date", "", "", "", date).then(activity_score => {
					result.activity_score = activity_score + "%";;

					dbViews.getDashboardScores("AVG(duration)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(sleep_duration => {
						result.sleep_time = utilities.getTimeformat(sleep_duration);

						dbViews.getDashboardScores("SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "", "", "", date).then(screen_time => {
							result.screen_time = utilities.getTimeformat(screen_time);

							dbViews.getDashboardScores("AVG(cal_total)", "oura_activity_tbl", "summary_date", "", "", "", date).then(calories => {
                                result.calories = calories;
    
                                res.send(result);
                            });	

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
    var date = req.query.date;
	//column, table, column date, conditions, cond_value
	dbViews.getDashboardScores("AVG(score_efficiency)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(efficiency => {
        result.efficiency = efficiency + "%";
        
        dbViews.getDashboardScores("AVG(score_disturbances)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(disturbances => {
            result.disturbances = disturbances + "%";

            dbViews.getDashboardScores("AVG(score_rem)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(rem_sleep => {
                result.rem_sleep = rem_sleep + "%";

                dbViews.getDashboardScores("AVG(score_deep)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(deep_sleep => {
                    result.deep_sleep = deep_sleep + "%";

                    dbViews.getDashboardScores("AVG(score_latency)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(sleep_latency => {
                        result.sleep_latency = sleep_latency + "%";

                        dbViews.getDashboardScores("AVG(hr_average)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(avg_heart_rate => {
                            result.avg_heart_rate = avg_heart_rate;

                            dbViews.getDashboardScores("AVG(breath_average)", "oura_sleep_tbl", "summary_date", "", "", "", date).then(avg_breathing => {
                                result.avg_breathing = avg_breathing;
                                
                                res.send(result);
                            });
                    
                        });
                
                    });
            
                });
        
            });
    
        });

    });

});

router.get('/activitycontributor', function(req, res) {
    var result = { 
        score_stay_active: "",
        score_move_every_hour: "",
        score_meet_daily_targets: "",
        score_training_frequency: "",
        score_training_volume: ""
    };
    var date = req.query.date;
    dbViews.getDashboardScores("AVG(score_stay_active)", "oura_activity_tbl", "summary_date", "", "", "", date).then(score_stay_active => {
        result.score_stay_active = score_stay_active + "%";

        dbViews.getDashboardScores("AVG(score_move_every_hour)", "oura_activity_tbl", "summary_date", "", "", "", date).then(score_move_every_hour => {
            result.score_move_every_hour = score_move_every_hour + "%";

            dbViews.getDashboardScores("AVG(score_meet_daily_targets)", "oura_activity_tbl", "summary_date", "", "", "", date).then(score_meet_daily_targets => {
                result.score_meet_daily_targets = score_meet_daily_targets + "%";

                dbViews.getDashboardScores("AVG(score_training_frequency)", "oura_activity_tbl", "summary_date", "", "", "", date).then(score_training_frequency => {
                    result.score_training_frequency = score_training_frequency + "%";

                    dbViews.getDashboardScores("AVG(score_training_volume)", "oura_activity_tbl", "summary_date", "", "", "", date).then(score_training_volume => {
                        result.score_training_volume = score_training_volume + "%";
                        
                        res.send(result);
                    });
                    
                });
                
            });
            
        });
        
    });
});

router.get('/rescuetimesummary', function(req, res) {
    var result = { 
        productive_time: "",
        productive_percent: "",
        distracting_time: "",
        distracting_percent: "",
        top_activities: []
    };
    var date = req.query.date;
    
    dbViews.getDashboardScores("SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "productivity", "0", ">=", date).then(productive_time => {
        result.productive_time = utilities.getTimeformat(productive_time);
        
        dbViews.getDashboardScores("SUM(time_spent_seconds)", "rescuetime_analytics_tbl", "activity_date", "productivity", "0", "<", date).then(distracting_time => {
            result.distracting_time = utilities.getTimeformat(distracting_time);

            dbViews.getDashboardScores("AVG(summary_value)", "rescuetime_daily_summary_tbl", "activity_date", "summary_category", "all_productive_percentage", "=", date).then(productive_percent => {
                result.productive_percent = productive_percent + "%";

                dbViews.getDashboardScores("AVG(summary_value)", "rescuetime_daily_summary_tbl", "activity_date", "summary_category", "all_distracting_percentage", "=", date).then(distracting_percent => {
                    result.distracting_percent = distracting_percent + "%";
                
                    //category, column, table, con_date, order
                    dbViews.getCategory("summary_category", "AVG(summary_value)", "rescuetime_daily_summary_tbl", "activity_date", "ASC", date).then(top_activities => {
                        result.top_activities = top_activities;
                        
                        res.send(result);
                    });

                });
            
            });
            
            
        });
    });
});


router.get('/datetype', function(req, res) {
    var result = { 
        productive_time: "",
        productive_percent: "",
        distracting_time: "",
        distracting_percent: "",
        top_activities: []
    };
    
    dbViews.getDates(req.query.datetype).then(datelist => {
        //result.productive_time = utilities.getTimeformat(productive_time);
        res.send(datelist);
    });
});


module.exports = router;