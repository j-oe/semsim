/** 
	fastclass
	WORK MODULE (worker handling)
	(c) 2016 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT

*/


define(['config/params', 'view/ui', 'view/bind', 'controller/store', 'helper/util', 'helper/l10n'], 
	function (config, ui, bind, store, util, l) {

	var work = {

		getSimilarityReport: function (source) {
			if (store.inputDataRp && store.inputDataRp.length !== 0) {
				var simWorker = new Worker(config.getParam('smWorkerURL'));

				simWorker.addEventListener('error', function (err) {
					ui.showModal(l('work_proc_dupes'));
				});

				simWorker.addEventListener('message', function (msg) {
					if (msg.data.ready) {
						simWorker.postMessage(['findSimilar', store.inputDataRp, config.getConfig()]);
					} else {

						store.repSimilarModules.data.sources = store.inputDataRp;
						store.repSimilarModules.meta.reportCreated = util.getDateString();
						store.repSimilarModules.meta.timeElapsed = msg.data[1];
						store.repSimilarModules.conf = config.getConfig();
						store.repSimilarModules.data.results = msg.data[0];
						store.repSimilarModules.data.mapping = msg.data[2];

						if (source === 'xml') {
							store.repSimilarModules.meta.weightedElements = store.xmlParsingSettings[2];
						}

						if (msg.data[0].length > 0) {
							bind.printReportAnalysis(store.repSimilarModules);	
						} else {
							ui.showModal('Überprüfen Sie den eingestellten Grenzwert', 'Keine Ergebnisse');
						}
						

						ui.loading('import_' + source + '_rp');

						simWorker.terminate();
					}				
				});
			} else {
				ui.showModal(l('work_no_userdata'));
				ui.loading('import_' + source + '_rp');
			}
		},

		exportConfig: function () {
			if (config.getConfig()) {
				util.downloadFile(config.getConfig(), 'fastclass_config' + Date.now() + '.json');
				ui.loading('export_set');
			}
		},

		exportSource: function () {
			if (store.inputData) {
				util.downloadFile(store.inputData, 'fastclass_source' + Date.now() + '.json');
				ui.loading('save_source');
			}
		},

		exportMemory: function () {
			if (store.model.data.matrix && Object.keys(store.model.data.matrix).length !== 0) {
				// build ZIP-based FCM format
				require(['zip'], function (JSZip) {
					var zip = new JSZip();

					store.model.conf = config.getConfig();
				
					zip.folder('fastclass')
						.file("model.json", JSON.stringify(store.model));

					zip.generateAsync({
						type:'blob',
						compression: 'DEFLATE',
						compressionOptions : {
							// level between 1 (best speed) and 9 (best compression)
							level: 6 
						}
					}).then(function(content) {
					    util.downloadBlob(content, 
					    	util.createFileName(store.model.meta.modelName) + '.fcm');
					    ui.loading('save_fcm');
					});
				});
			} else {
				ui.showModal(l('work_no_model'));
				ui.loading('save_fcm');
			}
		},

		exportResults: function (stripText) {
			if (store.classifiedData && store.classifiedData.length !== 0) {
				var resultDownload = [].concat(store.classifiedData);
				
				if (stripText) {
					resultDownload.forEach(function(i){ delete i.txt; });
				}

				util.downloadFile(resultDownload, 'fastclass_' + // TODO 
					Date.now() + '.json');
				ui.loading('export_results');
			} else {
				ui.showModal(l('work_no_classdata'));
				ui.loading('export_results');
			}
		},

		exportReport: function () {
			if (store.repProblematicModules && store.repProblematicModules.length !== 0) {
				var reportDownload = [].concat(store.repProblematicModules);
				reportDownload.forEach(function(i){ delete i.txt; });

				util.downloadFile(reportDownload, 'fastclass_problematicModules_' + 
					Date.now() + '.json');
			} else {
				ui.showModal(l('work_no_classdata'));
			}
			ui.loading('export_report', false);
		},

		exportSim: function () {
			if (store.repSimilarModules.data.results && store.repSimilarModules.data.results.length !== 0) {
				var reportDownload = [].concat(store.repSimilarModules.data.results);
				
				util.downloadFile(reportDownload, 'fastclass_similarModules_' + 
					Date.now() + '.json');
			} else {
				ui.showModal(l('work_no_classdata'));
			}
			ui.loading('export_simRep', false);
		},

		exportSimCSV: function () {
			if (store.repSimilarModules.data.results && store.repSimilarModules.data.results.length !== 0) {
				var reportDownload = 'Similarity;Object 1;Object 2\r\n';
				
				store.repSimilarModules.data.results.forEach(function(i){ 
					reportDownload += i[0] + ';' + i[1][0] + ';'  + i[1][1] + '\r\n'; 
				});

				util.downloadFile(reportDownload, 'fastclass_similarModules_' + 
					Date.now() + '.csv', true);
			} else {
				ui.showModal(l('work_no_classdata'));
			}
			ui.loading('export_simRepCSV', false);
		},

		exportSimReport: function () {
			if (store.repSimilarModules.data.results.length !== 0) {
				// build ZIP-based FCM format
				require(['zip'], function (JSZip) {
					var zip = new JSZip();
				
					zip.folder('fastclass')
						.file("report.json", JSON.stringify(store.repSimilarModules));

					zip.generateAsync({
						type:'blob',
						compression: 'DEFLATE',
						compressionOptions : {
							// level between 1 (best speed) and 9 (best compression)
							level: 6 
						}
					}).then(function(content) {
					    util.downloadBlob(content, 
					    	util.createFileName(store.repSimilarModules.meta.reportName) + '.fcr');
					    ui.loading('export_sim_report');
					});
				});
			} else {
				ui.showModal(l('work_no_model'));
				ui.loading('export_sim_report');
			}
		}
	};

	// fix scoping
	return work;
});