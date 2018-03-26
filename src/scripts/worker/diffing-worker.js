/* 
	fastclass
	DIFFING WORKER MODULE
	(c) 2018 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT
*/

//>>excludeStart("importScripts", pragmas.importScripts);
importScripts('../../vendor/require.js');
require.config({
	baseUrl: '../../core',
	paths: {
		diff: '../vendor/diff'
	}
});
//>>excludeEnd("importScripts");

require(['diff'], function (diff) {

	// post message when ready
	self.postMessage({ready: true});

	var worker = {

		diffData: function (sourceTxt, targetTxt) {
			var output = diff.diffWords(sourceTxt, targetTxt);
			self.postMessage([output]);
		}

	};

	self.addEventListener('message', function (msg) {
		var functionName = msg.data[0],
			functionArguments = msg.data.splice(1);
		if (worker.hasOwnProperty(functionName)) {
			worker[functionName].apply(this, functionArguments);
		} else {
			throw new Error('No function with name: ' + functionName);
		}
	});
});