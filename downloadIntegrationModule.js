//const { Curl } = require('node-libcurl');
const { Curl, CurlFeature } = require('node-libcurl');
const fs = require('fs');

var self = this;
var integrationName = "";
var integrationVersion = "";
var oicUrl = "";
var oicUserName = "";
var oicPassword = "";
var isVerbose = false;

module.exports = {
    setIntegrationName : function (integrationName){
        self.integrationName = integrationName;
    },
    setIntegrationVersion : function(integrationVersion){
        self.integrationVersion = integrationVersion;
    },
    setOicUrl : function(oicUrl){
        self.oicUrl = oicUrl;
    },
    setOicUserName : function(oicUserName){
        self.oicUserName = oicUserName;
    },
    setOicPassword : function(oicPassword){
        self.oicPassword = oicPassword;
    },
    setVerbose : function(isVerbose){
        self.isVerbose = isVerbose;
    },
    downloadIntegration : function(){
        return new Promise(function (resolve, reject){
            console.log("Integration Version- " + self.integrationVersion);
            var versionString = ( "00" + self.integrationVersion.split(".")[0]).substr(1, 2) + "." + (self.integrationVersion.split(".")[1] + "00").substr(1, 2) + '.0000';
            
            const fileOutPath = './exports/' + self.integrationName + "_" + versionString + '.iar';

            const fileOut = fs.openSync(fileOutPath, 'w+')

            const curlDownload = new Curl();

            curlDownload.setOpt(Curl.option.URL, self.oicUrl + self.integrationName + '|' + versionString + '/archive');
            //curlDownload.setOpt(Curl.option.USERNAME, '');
            curlDownload.setOpt(Curl.option.USERPWD, self.oicUserName + ":" + self.oicPassword);
            curlDownload.setOpt(Curl.option.SSL_VERIFYHOST, 0);
            curlDownload.setOpt(Curl.option.SSL_VERIFYPEER, 0);
            curlDownload.setOpt(Curl.option.VERBOSE, self.isVerbose);

            curlDownload.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
                let written = 0
            
                if (fileOut) {
                written = fs.writeSync(fileOut, buff, 0, nmemb * size)
                } else {
                /* listing output */
                process.stdout.write(buff.toString())
                written = size * nmemb
                }
            
                return written
            })

            curlDownload.enable(CurlFeature.Raw | CurlFeature.NoStorage)

            curlDownload.on('end', function(statusCode, data, headers){
                //console.log('End');
                //console.log(statusCode);
                //console.log(data);
                //console.log(headers);

                fs.closeSync(fileOut);

                this.close();

                curlDownload.close.bind(curlDownload);

                if(statusCode == 200){
                    resolve("IntegrationDownloaded");
                }else{
                    reject("IntegrationDownloadError- " + statusCode + ":" + data)
                }
            });

            curlDownload.on('error', function(error, errorCode){
                if(isVerbose){
                    console.log('Error');
                    console.log(error);
                    console.log(errorCode);
                }
                fs.closeSync(fileOut);
                curlDownload.close();
                reject(error);
            });

            curlDownload.perform();
        })    
    }
}