var Sign = function(){
    
    const path = require('path'),
        fs = require('fs'),
        request = require('request'),
        fileinfo = require('../model/fileinfo'),
        Utils = require('../services/utils.js'),
        messages = Utils.messages;

    var _getSignListKeyboardMarkup = function() {

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

    downloadAudio = function(msg, audioFileInfo, resolve, reject) {
        try{
            let url = Utils.getHoroscopeUrl(audioFileInfo.sign_name),
            statusCode,
            audioStream;

        audioFileInfo.filepath = path.join('/tmp', audioFileInfo.sign_name.toLowerCase() + '.mp3');
        audioStream = fs.createWriteStream(audioFileInfo.filepath);

        audioStream.on('finish', function() {
            if (statusCode !== 200) {
                reject('Status code: ' + statusCode + ' - url: ' + url);
            } else {
                console.log('uploading ' + audioFileInfo.filepath + ' to telegram server');
                //return the file audio
                resolve(audioFileInfo);
            }
        })

        request
            .get(url, { headers: { 'user-agent': 'node.js' } })
            .on('response', function(response) {
                statusCode = response.statusCode;
                // console.log(response.headers['content-type']) // 'image/png'
            })
            .on('error', function(err) {
                console.error('Error while downloading the file from url: ' + url + ' - \n' + err)
                reject(messages.genericErrorMessage);
            })
            .pipe(audioStream);
        }
        catch(e){
            reject(e)
        }
    },

    _retrieveAudio = function(msg) {

        //check the file has been already updated on telegram
        return new Promise(
            function(resolve, reject) {

                try {
                    
                    var audioFileInfo = {
                        sign_name: msg.text
                    };

                    fileinfo.findBySignName(audioFileInfo.sign_name, function(doc) {
                            if (doc) {
                                audioFileInfo.file_id = doc.file_id;
                                resolve(audioFileInfo);
                            } else {
                                //else download the file
                                return downloadAudio(msg, audioFileInfo, resolve, reject);
                            }
                        },
                        function(err) {
                            console.error('Error during fileInfo.findBySignName: ' + err)
                            reject('Error during fileInfo.findBySignName: ' + err)
                        })
                } catch(e) {
                    console.error('Error retrieveAudio : ' + e)
                    reject(e);
                }

            }
        )
    },

    _insertFileInfo = function(audioFileInfo){
         fileinfo.upsert(audioFileInfo, (doc) => {
                console.log('New fileinfo added: ' + JSON.stringify(audioFileInfo))
            }, (err) => {
                console.error('Error during inserting a new file Info: ' + err)
            })
    },

    _isZodiacSign = function(signName) {
        return signName && Utils.getZodiacSigns().includes(signName.toLowerCase());
    }

    return {
        getSignListKeyboardMarkup : _getSignListKeyboardMarkup,
        retrieveAudio : _retrieveAudio,   
        isZodiacSign : _isZodiacSign,
        insertFileInfo: _insertFileInfo
    }
}()

module.exports = Sign; 