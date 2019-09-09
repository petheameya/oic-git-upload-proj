//var checkRepo = require('./checkGitRepoExistModule');
var downloadInt = require('./downloadIntegrationModule');
var checkRepo = require('./checkRepoExistsGitApi');
var uploadIntFile = require('./uploadFileToGit');

var integrationVersion = '1.0';
var integrationName = "LOADPDHEMEABULKUPDATESBETA";
var oicUrl = "https://swoicdev1-sherwinwilliamsoci.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/integrations/";
var gitRepo = "OicTestRepo";
var authToken = "9807913a004842f99e7bf78ef7e49180e183d85f";
var repoOrg = "SW-GSC-IT";
var oicUserName = "Geaintsoadev1";
var oicPassword = "SellmorepaintSOA18*";
var branch = "master";
var checkinComment = "Test checkin comment";

function executeSteps(){

    var versionString = ( "00" + integrationVersion.split(".")[0]).substr(1, 2) + "." + (integrationVersion.split(".")[1] + "00").substr(1, 2) + '.0000';            
    var fileName = integrationName + "_" + versionString + '.iar';

    checkRepo.setAuthToken(authToken);
    checkRepo.setGitRepo(gitRepo);
    checkRepo.setRepoOrg(repoOrg);
    //checkRepo.setVerbose(false);
    checkRepo.checkForRepo()
        .then((response) => {
            console.log("Repository exists- " + response);
            downloadInt.setOicUrl(oicUrl);
            downloadInt.setIntegrationName(integrationName);
            downloadInt.setIntegrationVersion(integrationVersion);
            downloadInt.setOicUserName(oicUserName);
            downloadInt.setOicPassword(oicPassword);
            downloadInt.setVerbose(false);
            return downloadInt.downloadIntegration();
                //.then((result) => {console.log("Integration Downloded- " + result)})
        })
        .then((response) => {
            console.log("File Downloaded- " + response);
            uploadIntFile.setGitRepo(gitRepo);
            uploadIntFile.setAuthToken(authToken);
            uploadIntFile.setRepoOrg(repoOrg);
            uploadIntFile.setFileName(fileName);
            uploadIntFile.setBranch(branch);
            uploadIntFile.setCheckinComment(checkinComment);
            uploadIntFile.uploadFile()
                .then((result) => {console.log("Integration File Upload, result- " + result)});
        })
        .catch((errResopnse) => console.log("Error- " + errResopnse));
}

executeSteps();
