/** 
	fastclass 
	PLOT MODULE
	(c) 2016 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT

*/

define(['d3', 'helper/l10n', 'helper/util'], function (d3, l, util) {
	// expose d3 as global to fix missing dependency in d3pie
	window.d3 = d3;

	var plot =  {
		histogramSimDist: function (element, data) {
			// lazy requiring MetricsGraphic module
			util.requireCSS('vendor/metricsgraphics.css');
			require(['mg'], function (MG) {

				MG.data_graphic({
					data: data,
					chart_type: 'histogram',
					width: 280,
					height: 100,
					left: 25,
					right: 10,
					bottom: 25,
					top: 15,
					min_x: 0,
					max_x: 1,
					bins: 20,
					bar_margin: 0,
					y_extended_ticks: true,
					axes_not_compact: true,
					target: '#' + element
				});
			});
		},

		dataTableSimilarities: function (element, data) {
			var tbody = d3.select('#' + element + ' table tbody'),
				links = data.mapping.links;

			function getTitleForId (id) {
				return data.sources.filter(function(module){
					return module.xid === id;
				})[0].dsc;
			}

			links.forEach(function (obj, index) {
				var row = tbody.append('tr')
							.attr('data-source', obj.source)
							.attr('data-target', obj.target);

				var rownr = row.append('td').text(index + 1),
					source = row.append('td').append('button').text(obj.source)
						.attr('class', 'group btn btn-link'),
					target = row.append('td').append('button').text(obj.target)
						.attr('class', 'group btn btn-link'),
					value = row.append('td').text(util.percent(obj.value, 1, 2));
				
				var diffBtn = row.append('td').append('button').text('Compare');

				diffBtn.attr('class', 'btn btn-sm diff')
					.attr('data-value', obj.value)
					.attr('data-source', obj.source)
					.attr('data-target', obj.target)
					.attr('id', obj.target + '-' +  obj.source);
			});
			
		},

		filterDataTableSimilarities: function (element, condition) {
			// clean to default
			d3.select('#' + element + ' table tbody')
				.selectAll('tr').attr('style', 'display: table-row');
			d3.select('#' + element + ' div').selectAll('*').remove();


			// filter if condition is set
			if (condition) {
				var cluster = [];

				d3.select('#' + element + ' table tbody')
					.selectAll('tr').each(function(){
					
					if (this.dataset.source !== condition && 
						this.dataset.target !== condition) {
						this.style.display = 'none';
					} else {
						cluster.push(this.dataset.source);
						cluster.push(this.dataset.target);
					}
				});

				d3.select('#' + element + ' div')
					.append('label').attr('class', 'chip').text(condition)
					.append('button').attr('class', 'btn btn-clear').attr('id', 'tablefilter')
					.on('click', function(){
						plot.filterDataTableSimilarities('rA_table');
						plot.highlightNodesInGraph('rA_graph', []);

					});

				plot.highlightNodesInGraph('rA_graph', cluster, condition);
			}
		},

		highlightNodesInGraph: function(element, cluster, condition) {
			d3.selectAll('#' + element + ' circle').attr('fill', "black");

			if (cluster.length > 0) {
				d3.selectAll("#" + element + ' circle').each(function () {
					var nodeEl = d3.select(this),
						nodeId = nodeEl.attr('id');

					if (nodeId === condition) {
						nodeEl.attr('fill', '#32b643');
					} else if (cluster.indexOf(nodeId) !== -1) {
						nodeEl.attr('fill', '#5764c6');
					} else {
						nodeEl.attr('fill', 'grey');
					}
				});
			}
		},

		forceDirectedGraph: function(element, data) {
			var svg = d3.select("#" + element),
				width = 900,
				height = 600;

			var graph = util.copyObject(data);

			var color = d3.scaleOrdinal(d3.schemeCategory20);

			var simulation = d3.forceSimulation()
				.force("link", d3.forceLink().id(function(d) { return d.id; }))
				.force("charge", d3.forceManyBody().strength(-3))
				.force("center", d3.forceCenter(width / 2, height / 2));

			var div = d3.select("body").append("div")
				.attr("class", "graph-tooltip")
				.style("opacity", 0);

			var link = svg.append("g")
				.attr("class", "graph-links")
				.selectAll("line")
				.data(graph.links)
				.enter().append("line")
				.attr("stroke-width", function(d) { return d.value * 3; });

			var node = svg.append("g")
				.attr("class", "graph-nodes")
				.selectAll("circle")
				.data(graph.nodes)
				.enter().append("circle")
				.attr("r", countConnected)
				.attr("id", function(d) { return d.id; });
				//.attr("fill", function(d) { return color(d.group); })
				/*.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended));*/

			node.append("title")
				.text(function(d) { return 'Object: ' + d.id; });

/*			node.on('mouseover', function(){
				d3.select(this).attr('fill', "#5764c6");
			});

			node.on('mouseout', function(){
				d3.select(this).attr('fill', "black");
			});*/

			node.on('click', function(){
				d3.selectAll('#' + element + ' circle').attr('fill', "black");
				plot.filterDataTableSimilarities('rA_table', d3.select(this).attr('id'));
			});

			simulation
				.nodes(graph.nodes)
				.on("tick", ticked);

			simulation.force("link")
				.links(graph.links);

			function countConnected (d) {
				var counter = 0,
					links = graph.links;
				for (var l = 0; l < links.length; l++) {
					if (links[l].source === d.id || links[l].target === d.id) { 
						counter++;
					}
				}
				
				return 3 + counter * 0.6;
			}

			function ticked() {
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			}

			function dragstarted(d) {
				if (!d3.event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			}

			function dragged(d) {
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			}

			function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			}

		}	
	};

	return plot;
});