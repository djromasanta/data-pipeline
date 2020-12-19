// Call the dataTables jQuery plugin
$(document).ready(function() {
    getData("");

    $("#duration-option").change(function() {
        durationSetup($("#duration-option").val());
    });

    $("#date-input").change(function() {
        getData($("#date-input").val());
    });

    $("#date-input-my").hide();
    $("#date-input-my").change(function() {
        getData($("#date-input-my").val());
    });
});


function durationSetup(value) {
    $("#date-input-my").hide();
    $("#date-input").hide();

    if(value == "daily"){
        
        $("#date-input").show();
    } else if(value == "monthly") {
        getDateList("7");
        
    } else {
        getDateList("4");
        
    }
    
}

function getDateList(dateType){
    $("#date-input-my").empty();
    $.ajax({
        url: "/main/v1/datetype?datetype="+dateType, 
        success: function(result){
            
            for(var i=0; i<result.length; i++){
                html_block = `<option value="${result[i]}">${result[i]}</option>`;
                $("#date-input-my").append(html_block);
            }
            
        }, 
        complete: function(data) {
            $("#date-input-my").show();
            getData($("#date-input-my").val());
        }
    });
}

function getData(date){
    $.ajax({
        url: "/main/v1/daily?date="+date, success: function(result){
            
            $("#sleep-score").text(result.sleep_score);
            $("#productivity-pulse").text(result.productivity_pulse);
            $("#steps").text(result.steps);
            $("#mood-score").text("");
            $("#sleep-time").text(result.sleep_time);
            $("#screen-time").text(result.screen_time);
            $("#activity-score").text(result.activity_score);
            $("#calories-burned").text(result.calories);
        }
    });

    $.ajax({
        url: "/main/v1/sleepcontributor?date="+date, success: function(result){
            
            $("#efficiency-span").text(result.efficiency);
            $("#disturbances-span").text(result.disturbances);
            $("#rem-sleep-span").text(result.rem_sleep);
            $("#deep-sleep-span").text(result.deep_sleep);
            $("#sleep-latency-span").text(result.sleep_latency);
            $("#heart-rate-span").text(result.avg_heart_rate);
            $("#breathing-span").text(result.avg_breathing);

            $("#efficiency-width").css({"width": result.efficiency});
            $("#disturbances-width").css({"width": result.disturbances});
            $("#rem-sleep-width").css({"width": result.rem_sleep});
            $("#deep-sleep-width").css({"width": result.deep_sleep});
            $("#sleep-latency-width").css({"width": result.sleep_latency});
            $("#heart-rate-width").css({"width": result.avg_heart_rate});
            $("#breathing-width").css({"width": result.avg_breathing});
        }
    });

    $.ajax({
        url: "/main/v1/activitycontributor?date="+date, success: function(result){
            
            $("#stay-active-span").text(result.score_stay_active);
            $("#move-every-hour-span").text(result.score_move_every_hour);
            $("#meet-daily-goals-span").text(result.score_meet_daily_targets);
            $("#training-frequency-span").text(result.score_training_frequency);
            $("#training-volume-span").text(result.score_training_volume);

            $("#stay-active-width").css({"width": result.score_stay_active});
            $("#move-every-hour-width").css({"width": result.score_move_every_hour});
            $("#meet-daily-goals-width").css({"width": result.score_meet_daily_targets});
            $("#training-frequency-width").css({"width": result.score_training_frequency});
            $("#training-volume-width").css({"width": result.score_training_volume});
        }
    });

    $.ajax({
        url: "/main/v1/rescuetimesummary?date="+date, success: function(result){
            

            $("#productive-time-span").text(result.productive_time);
            $("#productive-percent-span").text(result.productive_percent);
            $("#distracting-time-span").text(result.distracting_time);
            $("#distracting-percent-span").text(result.distracting_percent);

            $("#top-activities").empty();
            for(var i=0; i<result.top_activities.length; i++){
                var html_block = '<h4 class="small font-weight-bold">' +result.top_activities[i].category+ '<span class="float-right" id="efficiency-span">' +result.top_activities[i].value+ '</span></h4>';
                $("#top-activities").append(html_block);
            }
        }
    });
}