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

}

module.exports = Utilities;