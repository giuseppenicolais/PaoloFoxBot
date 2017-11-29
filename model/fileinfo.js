var FileInfo = function() {

    var Utils = require('../src/services/utils')
    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;

    //chat_id + username + sign should guarantee the uniqueness
    var fileInfoSchema = new Schema({
        telegram_file_id: {
            type: String,
            required: [true, 'telegram_file_id required'],
            trim: true,
            unique: true
        },
        insertion_date: String
    });
    
    var fileInfoModel = mongoose.model('FileInfo', fileInfoSchema);

    var _upsert = (fileInfo, success, fail) => {

        if (!fileInfo.telegram_file_id) {
            return console.error('fileInfo.telegram_file_id is required');
        }

        var date = Utils.getDate();
        var insertion_date = '' + date.day + (date.month+1) + date.year;
        var query = {telegram_file_id: fileInfo.telegram_file_id, insertion_date: insertion_date};

        fileInfoModel.findOneAndUpdate(query, fileInfo, { upsert: true , new: true}, (err,newDoc) => {
            if(err){
                console.error('error while creating : ' + err)
                fail(err);
            }else{
                console.log(newDoc + ' fileInfo inserted')
                success(newDoc)
            }
        });
    }

    var _findById = function(telegram_file_id, success, fail) {
        fileInfoModel.findOne({ telegram_file_id: telegram_file_id }, (err, doc) => {
            if (err) {
                console.error('error while finding fileInfo: ' + err);
                fail(err)
            } else {
                success(doc)
            }
        });
    }

    var _findAllEntriesOfToday = function(success, fail) {
        var date = Utils.getDate();
        var insertion_date = '' + date.day + (date.month+1) + date.year;
        var query = {insertion_date: insertion_date};
        fileInfoModel.find(query, (err, results) => {
            if (err) {
                console.error('error while finding fileInfo: ' + err);
                fail(err)
            } else {
                success(results)
            }
        });
    }

    return {
        findById: _findById,
        findAllEntriesOfToday: _findAllEntriesOfToday,
        upsert: _upsert,
        model: fileInfoModel,
        schema: fileInfoSchema
    }
}()

module.exports = FileInfo;