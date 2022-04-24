var FileInfo = function() {

    var Utils = require('../services/utils'),
    	mongoose = require('mongoose'),
    	Schema = require('mongoose').Schema;

    var fileInfoSchema = new Schema({
        sign_name: {
            type: String,
            required: [true, 'sign_name required'],
            trim: true,
            lowercase: true
        },
        file_id: {
            type: String,
            required: [true, 'file_id required'],
            unique: true
        },
        insertion_date: { type: Date, default: Date.now }
    });
    
    var fileInfoModel = mongoose.model('FileInfo', fileInfoSchema,'FileInfo');
    
    var _upsert = (fileInfo, success, fail) => {

        if (!(fileInfo.sign_name && fileInfo.file_id)) {
            return console.error('fileInfo.sign_name is required');
        }

        var query = {file_id: fileInfo.file_id, sign_name: fileInfo.sign_name, insertion_date: Utils.getDate()};

        fileInfoModel.findOneAndUpdate(query, fileInfo, { upsert: true , new: true}, (err,newDoc) => {
            if(err){
                console.error('error while _upsert : ' + err)
                return fail(err);
            }
            //console.log(newDoc + ' fileInfo inserted')
            success(newDoc)
        });
    }

    var _deleteAllOldRecords = (success, fail) => {

        var query = {insertion_date: {$lte: Utils.getDate()}};

        fileInfoModel.deleteMany(query,(err, removed) => {
            if(err){
                console.error('error while _deleteOldRecordsBySignName: ' + err)
                return fail(err);
            }
            // console.log('audio info remove removed: ' + removed);
            success(removed)
        });
    }

    var _findBySignName = function(sign_name, success, fail) {
        
        var start = new Date();
        start.setHours(0,0,0,0);
        
        var end = new Date();
        end.setHours(23,59,59,999);

        fileInfoModel.findOne({sign_name: sign_name, insertion_date: {$gte: start, $lt: end} }, (err, doc) => {
            if (err) {
                console.error('error while _findBySignName: ' + err);
                return fail(err)
            }
            // console.log('findBySignName found: ' + doc)
            success(doc)
        });
    }

    var _findAllEntriesOfToday = function(success, fail) {
        
        var start = new Date();
        start.setHours(0,0,0,0);
        
        var end = new Date();
        end.setHours(23,59,59,999);

        var query = {insertion_date: {$gte: start, $lt: end}};
        fileInfoModel.find(query, (err, results) => {
            if (err) {
                console.error('error while _findAllEntriesOfToday: ' + err);
                return fail(err)
            } 
            success(results)
        });
    }

    return {
        findBySignName: _findBySignName,
        findAllEntriesOfToday: _findAllEntriesOfToday,
        deleteAllOldRecords: _deleteAllOldRecords,
        upsert: _upsert,
        model: fileInfoModel,
        schema: fileInfoSchema
    }
}()

module.exports = FileInfo;