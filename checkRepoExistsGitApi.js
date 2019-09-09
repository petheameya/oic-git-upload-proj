var GitHub = require('github-api');

const self = this;
var gitRepo = "";
var authToken = "";
var repoOrg = "";
var isVerbose = false;

module.exports = {
    setGitRepo : function(gitRepo){
        //console.log("Setting git repo to- " + gitRepo);
        self.gitRepo = gitRepo;
    },
    setAuthToken : function(authTokenToSet){
        //console.log("Setting authtoken to " + authTokenToSet);
        self.authToken = authTokenToSet;
    },   
    getGitRepo : function(){
        console.log(self.gitRepo);
    },
    setRepoOrg: function(repoOrg){
        self.repoOrg = repoOrg;
    },
    checkForRepo : function (){
        return new Promise(function(resolve, reject){
            var gh = new GitHub({
                token : self.authToken
            },
            'https://github.sherwin.com/api/v3'
            );

            var orgRepo = gh.getOrganization(self.repoOrg);

            var repository = gh.getRepo(self.repoOrg, self.gitRepo);

            repository.getDetails(function(err, details){
                if(err){
                    reject("Repo finding error- " + err);
                }else{
                    if(details['name'] == self.gitRepo){
                        resolve("RepoExists");
                    }else{
                        reject("UnableToFindRepo");
                    }
                }
            });
        })
    }
}