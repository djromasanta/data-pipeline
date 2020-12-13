var moment = require('moment');

class Utilities {
    constructor() {
        
    }
    
    getApiInfo(apiDetails, apiName){
        var result = apiDetails.find(obj => {
            return obj.api_name === apiName
        })
        return result;
    }

    getPreviousDate(){
        var yesterday = moment().subtract(1, 'days');
        return yesterday.format("YYYY-MM-DD");
    }

    getSecondPreviousDate(){
        var yesterday = moment().subtract(2, 'days');
        return yesterday.format("YYYY-MM-DD");
    }

    getTimeformat(secs) {   
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return hours+":"+minutes+":"+seconds;
    }

}

module.exports = Utilities;