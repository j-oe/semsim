/** 
	fastclass 
	BIND MODULE
	(c) 2016 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT

*/

define(['config/params', 'view/ui', 'controller/store', 'controller/local', 'helper/util', 'helper/l10n'], 
	function (config, ui, store, local, util, l) {
	var bind = {


		showDiffModal: function () {
			ui.e('diff-modal').classList.add('active');

			ui.click(['diff-modal-x', 'diff-modal-overlay', 'diff-modal-cancel'], function (e){
				ui.loading(e.target.id, false);
				ui.e('diff-modal').classList.remove('active');
			});
		},

		showLoadModal: function (data) {
			// init load modal
			ui.e('load-modal').classList.add('active');
			ui.show('no-local-models');
			ui.hide('load_localModel');

			ui.click(['load-modal-x', 'load-modal-overlay'], function (e){
				ui.loading(e.target.id, false);
				ui.e('load-modal').classList.remove('active');
			});

			// get default panel
			if (data && data.length > 0) {
				bind.showLocalModels(data);
				refreshModal('from-browser');
			} else {
				refreshModal('from-filesystem');
			}	

			// render tabs and panels
			ui.q('#load-modal .tab-item').forEach(function (elem) {
				elem.addEventListener('click', function (e) {
					e.preventDefault();
					refreshModal(e.target.id);
				});
			});

			function refreshModal (activeTabID) {
				ui.q('#load-modal .tab-item a').forEach( function (tab) {
					tab.classList.remove('active');
					ui.hide('load-' + tab.id);
				});

				ui.e(activeTabID).classList.add('active');
				ui.show('load-' + activeTabID, 'flex');
			}		
		},

		showSettingsModal: function () {
			var params = config.getWritableConfig();

			ui.empty('settings');

			Object.keys(params).forEach(function(key) {
				var param = params[key];

				var row = ui.create('tr'),
					label = ui.create('th'),
					setting = ui.create('td');

				label.innerText = param.label;
				ui.append(row, [label, setting]);

				switch (param.type) {
					case 'list':
						var list = ui.create('select');
						list.id = 'setting-' + key;
						
						ui.append(setting, list);
						
						ui.append(ui.e('settings'), row);

						// build list with available options
						util.requireCSS('vendor/selectize.css');
						require(['selectize'], function (selectize) {
							$('#setting-' + key).selectize({
								items: [config.getParam(key)],
								options: param.values,
								maxItems: 1,
								onChange: function (val) {
									config.setParam(key, val);
								}
							});
						});
						break;

					case 'range':
						var slider = ui.create('input');
						
						slider.id = 'setting-' + key;
						slider.type = 'range';
						slider.value = config.getParam(key);
						slider.min = param.values.min;
						slider.max = param.values.max;
						slider.step = param.values.step;

						slider.classList.add('slider');
						slider.classList.add('tooltip');

						slider.dataset.tooltip = config.getParam(key);
						
						ui.append(setting, slider);
						ui.append(ui.e('settings'), row);

						ui.bind('setting-' + key, 'input', function(e) {
							var value = e.target.value;
							slider.dataset.tooltip = value;
							config.setParam(key, parseFloat(value));
						});
						break;

					case 'boolean':
						var group = ui.create('label'),
							input = ui.create('input'),
							icon = ui.create('i');

						group.classList.add('form-switch');
						icon.classList.add('form-icon');
						
						input.type = 'checkbox';
						input.checked = config.getParam(key);
						input.id = 'setting-' + key;

						var state = (config.getParam(key)) ? 'aktiv' : 'inaktiv',
							textnode = ui.create('span');

						textnode.innerText = state;

						ui.append(group, [input, icon, textnode]);

						ui.append(setting, group);
						ui.append(ui.e('settings'), row);

						ui.bind('setting-' + key, 'change', function(e) {
							var value = e.target.checked;
							textnode.innerText = (value) ? 'aktiv' : 'inaktiv';
							config.setParam(key, value);
						});
						break;

					case 'string':
						var text = ui.create('input');

						text.classList.add('form-input');
						
						text.type = 'text';
						text.value = config.getParam(key);
						text.id = 'setting-' + key;

						ui.append(setting, text);
						ui.append(ui.e('settings'), row);

						ui.bind('setting-' + key, 'blur', function(e) {
							var value = e.target.value;
							config.setParam(key, value);
						});
						break;

					default:
						console.log('skipping complex object');

				}

				// init load modal
				ui.e('set-modal').classList.add('active');
				ui.loading('change_set');

				ui.click(['set-modal-x', 'set-modal-overlay'], function (e){
					ui.loading(e.target.id, false);
					ui.loading('change_set', false);
					ui.e('set-modal').classList.remove('active');
				});

				
			});
		},

		showLocalModels: function (models) {
			ui.hide('no-local-models');
			ui.show('load_localModel');
			// lazy requiring dependecy-heavy selectitze plugin
			util.requireCSS('vendor/selectize.css');
			require(['selectize'], function (selectize) {

				function toDataObj (dataArray) {
					return dataArray.map(function (item) {
						return {text: item.name, value: item.id};
					});
				}

				$('#localModel').selectize({
					options: toDataObj(models),
					selectOnTab: true
				});
			});
		},

		closeModalAndContinue: function (modal, nextView, unload) {
			// stop loading animation on buttons
			if (unload) ui.loading(unload, false);
			// close modal 
			ui.e(modal).classList.remove('active');
			// move on
			if (nextView) {
				window.location.hash = nextView;
				if (nextView === 'training') {
					ui.unlockPanels();
				}
			}
		},

		printReportAnalysis: function (report) {
			window.location.hash = 'report';

			ui.show(['reportAnalysis', 'manageReport']);
			ui.hide(['importFile_rp', 'panelTitle_rp', 'xmlAnalysis_rp', 'reportSettings']);

			if (report.meta.reportName) ui.e('report-name').innerText = report.meta.reportName;

			var timeInSec = Math.round(report.meta.timeElapsed / 10) / 100,
				objects = report.data.sources.length,
				combinations = (objects * (objects - 1)) / 2,
				distribution = report.data.results.map(function(i) { return i[0]; });

			ui.content({
				'rA_idf': report.data.results.length,
				'rA_cnt': objects,
				'rA_com': combinations,
				'rA_tme': timeInSec + 's'
			});

			// lazy requiring plot module
			require(['view/plot'], function (plot) {
				plot.histogramSimDist('rA_histogramChart', distribution);
				plot.forceDirectedGraph('rA_graph', report.data.mapping);
				plot.dataTableSimilarities('rA_table', report.data);
				bind.enableDiffingBtns();
				bind.enableGroupBtns();
			});
		},

		enableDiffingBtns: function () {
			ui.qA('.diff').forEach(function(btn){
				btn.addEventListener('click', function (e) {
					e.preventDefault();
					bind.showDiffingViewWithWorker(e.target.dataset, e.target.id);
				});
			}); 
		},

		enableGroupBtns: function () {
			ui.qA('.group').forEach(function(btn){
				btn.addEventListener('click', function (e) {
					e.preventDefault();
					require(['view/plot'], function (plot) {
						plot.filterDataTableSimilarities('rA_table', e.target.innerText);
					});
				});
			}); 
		},

		showDiffingViewWithWorker: function (diffingData, id) {
			ui.loading(id);

			var sourceID = diffingData.source,
				targetID = diffingData.target,
				sourceTxt, targetTxt,
				sourceDsc, targetDsc;

			/* get text from input data */
			store.repSimilarModules.data.sources.forEach(function(module){
				if (module.xid === sourceID) {
					sourceTxt = module.txt;
					sourceDsc = module.dsc;
				}
				if (module.xid === targetID) {
					targetTxt = module.txt;
					targetDsc = module.dsc;
				}
			});


			var diffWorker = new Worker(config.getParam('dfWorkerURL'));

			diffWorker.addEventListener('error', function (err) {
				ui.showModal(l('work_proc_pdf'));
			});

			diffWorker.addEventListener('message', function (msg) {
				if (msg.data.ready) {
					diffWorker.postMessage(['diffData', sourceTxt, targetTxt]);
				} else {
					var output = msg.data[0];

					diffWorker.terminate();

					/* render diff */
					ui.empty('diff-body');

					var	outputElem = ui.e('diff-body'),
						outputFrag = document.createDocumentFragment();

					var plus = 0, minus = 0;

					output.forEach(function(part){
						var mod = (part.added || part.removed) ? true : false,
							color = part.added ? 'text-primary' : part.removed ? 'text' : 'text-secondary',
							span = document.createElement('span');
					  	span.classList.add(color);
					  	if (mod) span.classList.add('mod');
					  	if (part.added) plus++;
					  	if (part.removed) minus++;
					  	span.appendChild(document.createTextNode(part.value));
					  	outputFrag.appendChild(span);
					});

					var title = sourceDsc,
						titleAlt = '';
					if (sourceDsc !== targetDsc) titleAlt = '<br/>' + targetDsc;

					ui.content({
						'diff-details-t': title,
						'diff-details-ta': titleAlt,
						'diff-details-a': diffingData.source,
						'diff-details-b': diffingData.target,
						'diff-details-v': util.percent(diffingData.value, 1, 4),
						'diff-details-p': '+' + plus,
						'diff-details-m': '-' + minus
					});

					ui.empty('diff-details-weighted-content');
					if (store.repSimilarModules.meta.weightedElements &&
						store.repSimilarModules.meta.weightedElements.length !== 0) {
						ui.show('diff-details-weighted');
						
						store.repSimilarModules.meta.weightedElements.forEach(function (elem){
							var weightedElement = ui.create('small');
							weightedElement.classList.add('label','label-warning');
							weightedElement.innerText = elem;
							ui.append(ui.e('diff-details-weighted-content'), weightedElement);	
						});
					} else {
						ui.hide('diff-details-weighted');
					}

					/* show diff */
					outputElem.appendChild(outputFrag);
					bind.showDiffModal();

					ui.loading(id);
				}				
			});
		},

		resetXMLoptions: function (classify) {
			var suffix = (classify) ? '_cl' : '';

			// lazy requiring dependecy-heavy selectitze plugin
			util.requireCSS('vendor/selectize.css');
			require(['selectize'], function (selectize) {
				var selectAttrInstance = $('#xmlAttr' + suffix).selectize();
					selectElemInstance = $('#xmlElem' + suffix).selectize();

				if (selectAttrInstance && selectElemInstance) {
					selectAttrInstance[0].selectize.clearOptions();
					selectElemInstance[0].selectize.clearOptions();
				}
			});
		},

		printXMLoptions: function (xmlMap, target) {
			var suffix = '';
			if (target === 'classify') suffix = '_cl';
			if (target === 'report') suffix = '_rp';

			var sortedElements = Object.keys(xmlMap).sort();
			
			// lazy requiring dependecy-heavy selectitze plugin
			util.requireCSS('vendor/selectize.css');
			require(['selectize'], function (selectize) {

				ui.show('xmlAnalysis' + suffix);

				if (target !== 'classify') {
					var signalsEnabled = config.getParam('signalsEnabled');

					ui.show('showSignalSelection' + suffix);
					ui.e('showSignalSelection' + suffix).checked = config.getParam('signalsEnabled');

					if (signalsEnabled) {
						$('#signalSelection' + suffix).show();
					}

					ui.click('showSignalSelection' + suffix, function() {
						config.setParam('signalsEnabled', ui.e('showSignalSelection' + suffix).checked);
						$('#signalSelection' + suffix).toggle();
					});

					$('#xmlElemSignal' + suffix).selectize({
						options: toDataObj(sortedElements)
					});

					ui.content('signalWeightValue' + suffix, config.getParam('signalWeighting')+  'x');
					ui.e('signalWeight' + suffix).value = config.getParam('signalWeighting');

					ui.bind('signalWeight' + suffix, 'input', function (e) {
						var signalWeight = e.target.value;
						config.setParam('signalsEnabled', true); 
						config.setParam('signalWeighting', signalWeight); 
						ui.content('signalWeightValue' + suffix, signalWeight + 'x'); 
					});
				}
				
				$('#xmlAttr' + suffix).selectize({
					options: [],
					onChange: function (val) {
						if (val !== '') {
							ui.show('import_xml' + suffix);
						} else {
							ui.hide('import_xml' + suffix);
						}
					}
				});

				$('#xmlElem' + suffix).selectize({
					options: toDataObj(sortedElements),
					selectOnTab: true,
					onChange: function () {
						updateAttributes();
					}
				});

				function toDataObj (dataArray) {
					return dataArray.map(function (item) {
						return {text: item, value: item};
					});
				}

				function getValidAttributes () {
					var selectedElements = [],
						validAttributes = [];

					ui.q('#xmlElem' + suffix +' option:checked').forEach(function (item) {
						selectedElements.push(item.value);
					});

					for (var i = 0; i < selectedElements.length; i++) {
						/* jshint loopfunc: true */
						var currentElement = selectedElements[i],
							elementAttrs = Object.keys(xmlMap[currentElement]);
						// if more than one element, find intersection between attributes
						if (i > 0) {
							validAttributes = validAttributes.filter(function (n) {
							    return elementAttrs.includes(n);
							});
						} else {
							validAttributes = validAttributes.concat(elementAttrs);
						} 
					}

					return toDataObj(validAttributes.sort());				
				}

				function updateAttributes () {
					var	validAttributes = getValidAttributes(),
						selectInstance = $('#xmlAttr' + suffix).selectize();

					selectInstance[0].selectize.clearOptions();
					selectInstance[0].selectize.addOption(validAttributes);
					selectInstance[0].selectize.refreshOptions();
				}
			});
		},

		getXMLoptions: function (target) {
			var suffix = '';
			if (target === 'classify') suffix = '_cl';
			if (target === 'report') suffix = '_rp';

			var selectOption = ui.e('xmlAttr' + suffix).value,
				selectElements = [], signalElements = [];

			ui.q('#xmlElem' + suffix + ' option:checked').forEach(function (entry) {
				selectElements.push(entry.value);
			});	

			if (target !== 'classify') {
				ui.q('#xmlElemSignal' + suffix + ' option:checked').forEach(function (entry) {
					signalElements.push(entry.value);
				});
			}

			store.xmlParsingSettings = [selectElements, selectOption, signalElements];
			return store.xmlParsingSettings;
		}
	};

	// fix scoping
	return bind;
});