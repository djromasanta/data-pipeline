// Call the dataTables jQuery plugin
$(document).ready(function() {
    $.ajax({
        url: "/main/v1/daily", success: function(result){
            console.log(result);
            var test = {
                "sleep_score": "88",
                "productivity_pulse": "",
                "steps": "4679",
                "activity_score": "",
                "sleep_time": "8.616666666666667",
                "screen_time": "0.405"
                }
            $("#sleep-score").text(result.sleep_score);
            $("#productivity-pulse").text(result.productivity_pulse);
            $("#steps").text(result.steps);
            $("#mood-score").text("");
            $("#sleep-time").text(result.sleep_time);
            $("#screen-time").text(result.screen_time);
            $("#activity-score").text(result.activity_score);
            $("#heart-rate").text("");
        }
    });

    $.ajax({
        url: "/main/v1/sleepcontributor", success: function(result){
            console.log(result);
            var test = {
                "efficiency": "90%",
                "disturbances": "75%",
                "rem_sleep": "95%",
                "deep_sleep": "96%",
                "sleep_latency": "70%",
                "avg_heart_rate": "64.56%",
                "avg_breathing": "16.375%"
                }
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
        url: "/main/v1/rescuetimesummary", success: function(result){
            console.log(result);
            var test = {
                "productive_time": "0:24:13",
                "distracting_time": "0:0:5",
                "top_activities": [
                    {
                    "category": "Meetings",
                    "value": "0:9:50"
                    }
                ]
            }

            $("#productive-time-span").text(result.productive_time);
            $("#distracting-time-span").text(result.distracting_time);

            for(var i=0; i<result.top_activities.length; i++){
                var html_block = '<h4 class="small font-weight-bold">' +result.top_activities[i].category+ '<span class="float-right" id="efficiency-span">' +result.top_activities[i].value+ '</span></h4>';
                $("#top-activities").append(html_block);
            }
        }
    });
});
  