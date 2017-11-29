import Utils from '../services/utils'

const   path = require('path'),
        fs = require('fs'),
        request = require('request'),
        fileinfo = require('../model/fileinfo')
        messages = Utils.messages;

module.exports = {

    getSignListKeyboardMarkup: function() {

        return [
            [
                { text: 'Ariete', callback_data: 'Ariete' },
                { text: 'Toro', callback_data: 'Toro' },
                { text: 'Gemelli', callback_data: 'Gemelli' },
                { text: 'Cancro', callback_data: 'Cancro' },
            ],
            [
                { text: 'Leone', callback_data: 'Leone' },
                { text: 'Vergine', callback_data: 'Vergine' },
                { text: 'Bilancia', callback_data: 'Bilancia' },
                { text: 'Scorpione', callback_data: 'Scorpione' },
            ],
            [
                { text: 'Sagittario', callback_data: 'Sagittario' },
                { text: 'Capricorno', callback_data: 'Capricorno' },
                { text: 'Acquario', callback_data: 'Acquario' },
                { text: 'Pesci', callback_data: 'Pesci' },
            ]
        ]
    },

    downloadAudioFile: function(audioFileInfo, resolve, reject){
        var options = {
            headers: { 'user-agent': 'node.js' }
        }
        var audioStream = fs.createWriteStream(audioFileInfo.filepath)
        request.get(audioFileInfo.url, options)
                .on('error', function(err) {
                    console.error('Error while downloading the file: ' + err)
                    reject(err)
                })
                .pipe(audioStream)
                .on('finish', function() {
                    console.log('uploading ' + audioFileInfo.filepath + ' to telegram server');
                    resolve(audioFileInfo);
                })
    },

    retrieveHoroscope: function(signName) {

        var audioFileInfo = {
            date: Utils.getDate(),
            sign_name: signName,
            filepath: path.join('/tmp', signName + '.mp3'),
            url: Utils.getOroscopoUrl(signName),
            telegram_file_id: Utils.getTelegramFileId(signName)
        };

        return new Promise{
            function(resolve, reject){
                //check the file is already on the Telegram servers by checking if it has been previously inserted in the db FileInfo collection
                fileinfo.findById(audioFileInfo.telegram_file_id,function(doc){
                    //TODO
                    if(doc){
                        resolve(doc);
                    }else{
                       return downloadAudioFile(audioFileInfo, resolve, reject)
                    }
                    
                },function(err){
                    //TODO
                    reject(err);
                })
            }
        }
    },

    isZodiacSign: function(signName) {
        return signName && Utils.getZodiacSigns().includes(signName.toLowerCase());
    }
}