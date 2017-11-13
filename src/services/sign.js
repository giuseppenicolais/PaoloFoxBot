import Utils from '../services/utils'
import Constants from '../lib/constants'
import Command from '../handlers/command'

const path = require('path')
const fs = require('fs')
const request = require('request')

const messages = Constants.messages;

export default class Sign {

    constructor(name) {
        this._name = name
    }

    getName() {
        return this._name;
    }

    getInfo() {
     var sign_name = this._name;
     
     //console.log(path.join('/tmp', sign_name + '.mp3'));

     var signInfo = {
                date: Utils.getDate(),
                sign_name: sign_name,
                filepath: path.join('/tmp', sign_name + '.mp3'),
                url: messages.url(sign_name)
            }

        return signInfo;
    }

    getOroscopo() {
        
        var info = this.getInfo();

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
                    .on('response', function(response) {
                        console.log('response status code: ' + response.statusCode);
                    })
                    .pipe(audioStream);
            });
    }

}