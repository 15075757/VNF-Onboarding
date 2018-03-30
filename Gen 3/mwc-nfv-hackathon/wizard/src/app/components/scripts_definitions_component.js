/*###########################################################################
##
# Copyright 2017-2018 VMware Inc.
# This file is part of VNF-ONboarding
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# For those usages not covered by the Apache License, Version 2.0 please
# contact:  osslegalrouting@vmware.com
 
##
 
######################################################################### */
const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/scripts_definitions.html'),
  controller: function (dataService,authService,$scope) {
    "ngInject";

   
    this.DEFAULT_INPUT_TYPE = 'text';
    this.INPUT_PLACEHOLDER = 'Type here';
    this.FORM_SUBMIT_CLASS = '';
    this.SCRIPT_INFO_TOOLTIP = TOOLTIPS.SCRIPT_INFO_TOOLTIP;
    $scope.files = [];
    this.upload_response = false;
    $("#Upload_Files").prop("disabled",true);


  this.scriptsInputsconfig= dataService.getScripts();
	var config = dataService.getVnfDefinition();
	this.OrchType = config.OrchType;
	var scriptsInputs; 
	
	if (this.OrchType == 'OSM 3.0' || this.OrchType == 'RIFT.ware 5.3'){	
		 
		this.scriptsInputs = {
			create: this.scriptsInputsconfig['create']
			};
		this.scriptsInputs['create'].text = "Cloud Init Script ";
		this.scriptsInputs['create'].tooltip = TOOLTIPS.INIT;;
		
		
	} else{
		 this.scriptsInputs = {
			create: emptyToString(this.scriptsInputsconfig['create']),
			configure: emptyToString(this.scriptsInputsconfig['configure']),
			delete: emptyToString(this.scriptsInputsconfig['delete'])
		 };
	 	
	 }
	 
	 console.log(this.scriptsInputs);
	 console.log(this.OrchType );
	 
	this.isOSM = function(){
		
		return this.OrchType == 'OSM 3.0'; 
	}

    this.empty = function (x) {
      return x == undefined || x === '' || x == null;
    };

    function emptyToString (x) {
      return x == undefined || x == null ? '' : x;
    }

    this.forms = {};

    dataService.setSubmitCallback(() => {
      this.FORM_SUBMIT_CLASS = 'submit';
      const isValid = this.forms.scriptsForm.$valid;
      var config_final = {};
    if (isValid) {

		if (this.OrchType == 'OSM 3.0' || this.OrchType == 'RIFT.ware 5.3'){

			config_final = {
					create: emptyToString(this.scriptsInputs['create'].value)
					
					
				};
				
		}else{
			 config_final = {
					create: emptyToString(this.scriptsInputs['create'].value),
					config: emptyToString(this.scriptsInputs['configure'].value),
					delete: emptyToString(this.scriptsInputs['delete'].value)
					
				};
		
	 	
	 }	

      dataService.setScripts(config_final);
      console.log(config_final);
     }
      return isValid;
    });

    $scope.setFiles = function (element) {
      $("#Upload_Files").prop("disabled",false);
      $scope.files.push(element.files[0]);
    };

    $scope.uploadFile = function () {
      console.log('In upload file: $scope.files');
      console.log($scope.files);
      var fd = new FormData();

      angular.forEach($scope.files, function (file) {
        fd.append('file', file);
      });
      var session_key = authService.getSessionKey();
      var username = authService.getUserName();
      console.log(session_key,username)
      if ($scope.files.length) {
        this.upload_response = true;
        var objXhr = new XMLHttpRequest();
        objXhr.open("POST", 'http://' + location.hostname + ':5000' + '/backend' + '/upload');
        objXhr.setRequestHeader('Authorization', session_key);
        objXhr.setRequestHeader('username', username);
        objXhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("uploadresponse").innerHTML =
            this.responseText;
          }
       };
 
        objXhr.send(fd);
      } else {
        alert('Please choose files to upload..')
      }
      
    }   

      
  }
};
