var GitHub = require('github-api');
var fs = require('fs');

const self = this;
var gitRepo = "";
var authToken = "";
var repoOrg = "";
var fileName = "";
var branch = "";
var checkinComment = "";

/*var gh = new GitHub({
    token : '9807913a004842f99e7bf78ef7e49180e183d85f',
},
'https://github.sherwin.com/api/v3');

var repository = gh.getRepo('SW-GSC-IT', 'OicTestRepo');

//Buffer.from(fs.createReadStream('./exports/LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar'), 'binary').toString('base64')
repository.writeFile('master', 'LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar', Buffer.from(fs.readFileSync('./exports/LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar', 'binary'), 'binary').toString('base64'), 'This is a test file', { encode : false});
//repository.writeFile('master', 'LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar', 'This is a test file', fs.createReadStream('./exports/LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar'), { encode : true});
*/

module.exports = {
    setGitRepo : function(gitRepo){
        //console.log("Setting git repo to- " + gitRepo);
        self.gitRepo = gitRepo;
    },
    setAuthToken : function(authToken){
        //console.log("Setting authtoken to " + authTokenToSet);
        self.authToken = authToken;
    },   
    getGitRepo : function(){
        console.log(self.gitRepo);
    },
    setRepoOrg: function(repoOrg){
        self.repoOrg = repoOrg;
    },
    setFileName : function(fileName){
        self.fileName = fileName;
    },
    setBranch : function(branch){
        self.branch = branch;
    },
    setCheckinComment : function(checkinComment){
        self.checkinComment = checkinComment;
    },
    uploadFile : function() {
        return new Promise((resolve, reject) => {
            var gh = new GitHub({
                token : self.authToken,
            },
            'https://github.sherwin.com/api/v3');

            var repository = gh.getRepo(self.repoOrg, self.gitRepo);

            repository.writeFile(self.branch, 
                self.fileName, 
                Buffer.from(fs.readFileSync('./exports/' + self.fileName, 'binary'), 'binary').toString('base64'),//Buffer.from(fs.readFileSync('./exports/LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar', 'binary'), 'binary').toString('base64'), 
                self.checkinComment, 
                { encode : false})
            .then((response) => {
                resolve("FileUploadeSuccessfully.");
            })
            .catch((err) => {
                reject("ErrorUploadingFile- " + err);
            })
        });
    }
};
