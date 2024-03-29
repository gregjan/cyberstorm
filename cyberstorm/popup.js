function start() {
	var diameter = 1024;
	var tree = d3.layout.tree()
		.size([ 360, diameter / 2 - 120 ])
		.separation(
			function(a, b) {
				return (a.parent == b.parent ? 1 : 2) / a.depth;
			})
		.children(function(d) {
			return (!d.children || d.children.length === 0) ? null : d.children;
		});

	var diagonal = d3.svg.diagonal.radial().projection(function(d) {
		return [ d.y, d.x / 180 * Math.PI ];
	});

	var svg = d3.select("body").append("svg")
		.attr("width", diameter)
		.attr("height", diameter - 150)
		.append("g")
			.attr("transform","translate(" + diameter / 2 + "," + diameter / 2 + ")");

	var bookmarkTreeNodes = chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
			var nodes = tree.nodes(bookmarkTreeNodes[0]), links = tree
				.links(nodes);

			var link = svg.selectAll(".link")
				.data(links).enter()
					.append("path")
						.attr("class", "link")
						.attr("d", diagonal);
				
			var node = svg.selectAll(".node")
				.data(nodes).enter()
					.append("g")
						.attr("class", "node")
						.attr("transform", 
							function(d) {
								return "rotate("+(d.x-90)+")translate("+d.y	+")";
							});

			node.append("circle")
				.attr("r", 4.5);

			node.append("text")
				.attr("dy", ".31em")
				.attr("text-anchor",
					function(d) {
						return d.x < 180 ? "start" : "end";
					})
				.attr("transform",
					function(d) {
						return d.x < 180 ? "translate(8)"
							: "rotate(180)translate(-8)";
					})
				.text(
					function(d) {
						return d.title;
					});
			});

	d3.select(self.frameElement).style("height", diameter - 150 + "px");
}

document.addEventListener('DOMContentLoaded', function() {
	start();
});