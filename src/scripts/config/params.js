/** 
	fastclass
	MAIN CONFIGURATION
	(c) 2017 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT

*/

define(['controller/local'], function(local) {
	/* config singleton */

	var params = {

		nrOfNgrams: {
			label: 'Word groups',
			value: undefined,
			defaultValue: -2,
			writable: true,
			type: 'list',
			values: [{
				text: 'n = {1,2,3}',
				value: -3
			},{
				text: 'n = {1,2}',
				value: -2
			},{
				text: 'n = 1',
				value: 1
			},{
				text: 'n = 2',
				value: 2
			},{
				text: 'n = 3',
				value: 3
			},{
				text: 'n = 4',
				value: 4
			}]
		},

		similarityCalc: {
			label: 'Similarity measurement',
			value: undefined,
			defaultValue: 'cosine',
			writable: false,
			type: 'list',
			values: [{
				text: 'Kosinus',
				value: 'cosine'
			},{
				text: 'L1 / Manhattan',
				value: 'l1'
			},{
				text: 'Testmaß',
				value: 'custom'
			}]
		},

		normalizeWeights: {
			label: 'Normalization',
			value: undefined,
			defaultValue: true,
			writable: false,
			type: 'boolean'
		},

		minNrOfTokens: {
			label: 'Minimum number of tokens',
			value: undefined,
			defaultValue: 1,
			writable: true,
			type: 'range',
			values: {
				min: 0,
				max: 5,
				step: 1
			}
		},

		minLengthOfTokens: {
			label: 'Minimum token character length',
			value: undefined,
			defaultValue: 0,
			writable: true,
			type: 'range',
			values: {
				min: 0,
				max: 10,
				step: 1
			}
		},

		tokenWeighting: {
			label: 'Token weighting',
			value: undefined,
			defaultValue: 1,
			writable: false,
			type: 'range',
			values: {
				min: 1,
				max: 100,
				step: 0.5
			}
		},

		signalsEnabled: {
			label: 'Semantic weighting',
			value: undefined,
			defaultValue: false,
			writable: true,
			type: 'boolean'
		},

		signalWeighting: {
			label: 'Weighting quantifier',
			value: undefined,
			defaultValue: 10,
			writable: true,
			type: 'range',
			values: {
				min: 1,
				max: 100,
				step: 0.5
			}
		},

		similarityThreshold: {
			label: 'Similarity threshold',
			value: undefined,
			defaultValue: 90,
			writable: true,
			type: 'range',
			values: {
				min: 0,
				max: 100,
				step: 0.5
			}
		},

		verboseReporting: {
			label: 'Verbose reporting',
			value: undefined,
			defaultValue: false,
			writable: false,
			type: 'boolean'
		},

		appIRI: {
			label: "Identifier der Anwendung",
			value: 'http://semsim.fastclass.de',
			writable: false,
			type: 'string'
		},

		appName: {
			label: "Name der Anwendung",
			value: 'semsim Demo',
			writable: false,
			type: 'string'
		},

		smWorkerURL: {
			value: 'scripts/worker/similarities-worker.js',
			writable: false,
			type: 'string'
		},

		dfWorkerURL: {
			value: 'scripts/worker/diffing-worker.js',
			writable: false,
			type: 'string'
		},

		demoFiles: {
			value: {
				fcr: {
					en: 'res/data/example.fcr'
				}
			},
			writable: false
		}
		
	};

	var methods =  {
		setParam: function (key, value, internal) {
			if (params.hasOwnProperty(key)) {
				if (params[key].writable) {
					params[key].value = value;
					if (!internal) {
						local.saveSettings(methods.getConfig());
					}
				}
			} else {
				console.log('tried to set unknown param: ', key);
			}
		},

		getParam: function (key) { 
			if (params.hasOwnProperty(key)) {
				if (params[key].value === undefined) {
					return params[key].defaultValue;
				} else {
					return params[key].value;
				}
			} else {
				console.log('tried to get unknown param: ', key);
			}
		},

		getCompleteConfig: function (key) { 
			return params;
		},

		getWritableConfig: function (key) { 
			var writableConfigObj = {};

			Object.keys(params).forEach(function (key) {
				if (params[key].writable) {
					writableConfigObj[key] = params[key];
				}
			});

			return writableConfigObj;
		},

		getConfig: function () { 
			var configObj = {};

			Object.keys(params).forEach(function (key) {
				configObj[key] = methods.getParam(key);
			});

			return configObj;
		},

		loadConfig: function (config) {
			Object.keys(config).forEach(function (key) {
				methods.setParam(key, config[key], true);
			});
		},

		resetConfig: function () {
			Object.keys(params).forEach(function (key) {
				methods.setParam(key, params[key].defaultValue, true);
			});
		}
	};

	return methods;
});