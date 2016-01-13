var diameter = 1100,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .value(function(d) {return d.size;})
    .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("/heirarchy", function(error, json) {
    if (error) throw error;

    console.log(json)

    var node = svg.selectAll(".node")
      .data(bubble.nodes(flatten(json))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.name + ": " + format(d.size); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .attr("class", function(d) {
            if ( d.size >= 180 ) color = 'hot';
            else if ( d.size >= 140 ) color = 'warm';
            else if ( d.size >= 80 ) color = 'neutral';
            else color = 'cold';
            return color;
      });

  node.append("text")
      .style("font-size", function(d) {return Math.max((2*d.r-8)/d.name.length*1.5, 1) + "px"; })
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function flatten(root) {
    var nodes = [];
    for (var node in root) {
        nodes.push({name: node, size: root[node]});
    }
    return {children: nodes};
}
