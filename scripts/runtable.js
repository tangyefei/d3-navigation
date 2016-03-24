(function(window){
    'use strict'
    var svg, g, offsetX = 0, offsetY = 0, config = {
        'diameter': 480,
        'turntable': {
            "rounds": [
                {'id': 'round1', 'class': 'inner-circle', 'radius': 0.2},
                {'id': 'round2', 'class': 'midd-circle', 'radius': 0.5},
                {'id': 'round3', 'class': 'outer-circle', 'radius': 1.0}
            ]
        }
    };

    /****************************************** TRUN_TABLE ******************************************************/
    function formatGraphUnit(t, x, y, id, attrs) {
        var k = null,
            g = svg.append('g')
                // .attr("transform", "translate(" + x + "," + y + ")")
                .attr('id', id)
                .append(t);

            for(k in attrs)
                g.attr(("" + k), attrs[k]);
        };

    function formatTurntable() {
        svg = d3.select("body").append("svg")
            .attr("width", config.diameter)
            .attr("height", config.diameter)
        .append("g")
            .attr("transform", "translate(" + config.diameter / 2 + "," + config.diameter / 2 + ")");

        for(var i = config.turntable.rounds.length - 1; i >=0; i --) {
            var round = config.turntable.rounds[i];
            var d = config.diameter;
            var x = d / 2;
            var y = d / 2;
            var cls = round['class'];
            var radius = round['radius']  *  (d / 2);
            var attrs = {'r': radius, 'class': cls};

            formatGraphUnit('circle', x, y, cls, attrs)
        }
    };

    /****************************************** LEAVIES ******************************************************/
    var tree = d3.layout.tree()
        .size([360, config.diameter / 2 * config.turntable.rounds[1]['radius'] + 9])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    d3.json("data/nba.json", function(error, root) {

      var nodes = tree.nodes(root),
          links = tree.links(nodes);

      var link = svg.selectAll(".link")
          .data(links)
        .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

      var node = svg.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";})

      node.append("circle")
          .attr("r", 4.5);

      node.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
          .text(function(d) { return d.name; });
    });

    formatTurntable();

})(window);
