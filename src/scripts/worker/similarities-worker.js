/* 
	fastclass
	SIMILARITIES WORKER MODULE
	(c) 2017 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT
*/

//>>excludeStart("importScripts", pragmas.importScripts);
importScripts('../../vendor/require.js');
require.config({
	baseUrl: '../../core',
	paths: {
		helper: '../scripts/helper'
	}
});
//>>excludeEnd("importScripts");

require(['utilities/similarities', 'helper/util'], function (similarity, util) {

	// post message when ready
	self.postMessage({ready: true});

	var worker = {

		findSimilar: function (inputArray, options) {
			var startTime = performance.now();

			// start simiarity analysis
			var result = similarity.analyze(inputArray, options),
				map = worker.d3MapData(result);

			var stopTime = performance.now(), 
				timeElapsed = stopTime - startTime;

			self.postMessage([result, timeElapsed, map]);
		},

		d3MapData: function (similarities) {
			var nodes = [],
				d3Map = {nodes: [], links: []};

			for (var i = 0; i < similarities.length; i++) {
				var a = similarities[i][1][0],
					b = similarities[i][1][1],
					v = similarities[i][0];

				if (nodes.indexOf(a) === -1) {
					nodes.push(a);
					d3Map.nodes.push({id: a, group: 1});
				}

				if (nodes.indexOf(b) === -1) {
					nodes.push(b);
					d3Map.nodes.push({id: b, group: 1});
				}
				
				d3Map.links.push({
					source: a, target: b, value: util.round(v, 10)
				});
			}

			return d3Map;
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