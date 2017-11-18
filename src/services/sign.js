import Utils from '../services/utils'

const path = require('path')
const fs = require('fs')
const request = require('request')
const messages = Utils.messages;

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

    getHoroscope: function(signName) {

        var info = {
            date: Utils.getDate(),
            sign_name: signName,
            filepath: path.join('/tmp', signName.toLowerCase() + '.mp3'),
            url: Utils.getOroscopoUrl(signName.toLowerCase())
        };

        return new Promise(
            function(resolve, reject) {

                var options = {
                    headers: { 'user-agent': 'node.js' }
                }

                var audioStream = fs.createWriteStream(info.filepath)
                audioStream.on('finish', function() {
                    console.log('uploading ' + info.filepath + ' to telegram server');
                    resolve(info);
                })

                debugger;

                request
                    .get(info.url, options)
                    .on('error', function(err) {
                        console.error('Error while downloading the file', err)
                        reject(messages.genericErrorMessage);
                    })
                    .pipe(audioStream);
            });
    },

    isZodiacSign: function(signName) {
        return signName && Utils.getZodiacSigns().includes(signName.toLowerCase());
    }
}