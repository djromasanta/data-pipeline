const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');
const CSVToJSON = require('csvtojson');
const fs = require('fs');

const request = require('request');
const api_config = require('../api_keys.json');

//Data Processor Controller
const Data_Proc = require('../controller/data_processor');
const data_processor = new Data_Proc();

//Utilities Controller
const UtilSource = require('../controller/utilities');
const utilities = new UtilSource(); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
		console.log(file);
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, "nomie" + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'text/csv') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage });


//Oura Client
var oura = require('oura');

let start = utilities.getSecondPreviousDate();
let end = utilities.getPreviousDate();


router.post('/upload', upload.single('file-upload'), (req, res) => {
    if (req.session.loggedin) {
        

        CSVToJSON().fromFile('public/uploads/nomie.csv').then(nomie => {
            const path = './public/uploads/nomie.csv';

            var comp_nomie = [
                'epoch',
                'start',
                'end',
                'offset',
                'tracker',
                'value',
                'note',
                'lat',
                'lng',
                'location',
                'score'];
            var up_nomie = Object.keys(nomie[0]);
    
            if(JSON.stringify(comp_nomie.sort()) === JSON.stringify(up_nomie.sort())){
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //file removed
                    for(var i=0; i < nomie.length; i++) {
                        data_processor.nomieData(nomie[i], utilities.getDate()).then(result => {
                            
                        });
                    }
                });

                res.render('import', {status: "success"});
            } else {
                res.render('import', {status: "failed"});
            }
            
    
            

        }).catch(err => {
            // log error if any
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
	
});

router.get('/upload', (req, res) => {
	if (req.session.loggedin) {
        res.redirect('/import');
    } else {
        res.redirect('/');
    }
});

router.get('/csv', function(req, res) {
	
	
});


module.exports = router;



// client.personalInfo().then(function (user) {
    //     console.log(JSON.stringify(user, null, 1))

    //     res.send({
    //         "status": 200,
    //         "result": user
    //     });

    // }).catch(function(error){
    //     console.error(error)
    // });