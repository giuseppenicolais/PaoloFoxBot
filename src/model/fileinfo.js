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
        insertion_date: String
    });
    
    var fileInfoModel = mongoose.model('FileInfo', fileInfoSchema,'FileInfo');
    var date = Utils.getDate();
    var insertion_date = '' + date.day + (date.month+1) + date.year;

    var _upsert = (fileInfo, success, fail) => {

        if (!fileInfo.sign_name) {
            return console.error('fileInfo.sign_name is required');
        }

        var query = {file_id: fileInfo.file_id, sign_name: fileInfo.sign_name, insertion_date: insertion_date};

        fileInfoModel.findOneAndUpdate(query, fileInfo, { upsert: true , new: true}, (err,newDoc) => {
            if(err){
                console.error('error while _upsert : ' + err)
                return fail(err);
            }
            //console.log(newDoc + ' fileInfo inserted')
            success(newDoc)
        });
    }

    var _delete = (fileinfo, success, fail) => {

        if (!(fileinfo.sign_name && fileinfo.insertion_date)) {
            return console.error('fileinfo informations not valid');
        }

        var query = {sign_name: fileinfo.sign_name ,"insertion_date": fileinfo.insertion_date};

        fileInfoModel.remove(query,(err, removed) => {
            if(err){
                console.error('error while _delete: ' + err)
                return fail(err);
            }
            console.log('audio info remove removed: ' + removed);
            success(removed)
        });
    }

    var _findBySignName = function(sign_name, success, fail) {
        fileInfoModel.findOne({sign_name: sign_name, insertion_date: insertion_date },'file_id', (err, doc) => {
            if (err) {
                console.error('error while _findBySignName: ' + err);
                return fail(err)
            } 
            success(doc)
        });
    }

    var _findAllEntriesOfToday = function(success, fail) {
        console.log('_findAllEntriesOfToday.insertion_date: ' + insertion_date)
        var query = {insertion_date: insertion_date};
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
        delete: _delete,
        upsert: _upsert,
        model: fileInfoModel,
        schema: fileInfoSchema
    }
}()

module.exports = FileInfo;