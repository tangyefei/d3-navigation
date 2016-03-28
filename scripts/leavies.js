(function(window){
    'use strict'

    var _export = {}, tree, diagonal;
    var config = window.navigation.config;

    function _initTree() {
        tree = d3.layout.tree()
            .size([360, config.diameter / 2 * config.turntable.rounds[1]['radius'] + 9])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
    }

    _export.formatNodesByRound = function(touchCircleNum) {
        if(!tree) _initTree();
        var cont = config['leafConfs'][touchCircleNum - 1];
        var data = config['leafDatas'][touchCircleNum - 1];
        var unitAngle = 360 / data.children.length;

        window.navigation.svg.selectAll("." + cont.class).remove();

        var nodes = tree.nodes(data);
        var node = window.navigation.svg.selectAll("." + cont.class)
              .data(nodes)
          .enter().append("g")
              .attr("class", cont.class)
              .attr("transform", function(d) { return "rotate(" + (d.x - unitAngle / 2) + ")translate(" + (cont.radius * config.diameter / 2 - config.teamNameOffset) + ")";})

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) { return d.name; });
        return this;
      };

    _export.rotateLeavies = function(circleNum, angle) {
        var len = config['leafDatas'][circleNum - 1]['children'].length;
        var rot = config.rots[circleNum - 1];
        var clz = config.leafConfs[circleNum - 1]['class'];
        var radius = config.leafConfs[circleNum - 1]['radius'] * config.diameter / 2 -  config.teamNameOffset;
        var alpha = 0;
        var unitAngle = 360 / len;
        var angle = Math.round(angle / unitAngle) * unitAngle;

        rot += angle;
        rot = rot % 360;
        config['rots'][circleNum - 1] = rot;

        window.navigation.svg.selectAll("." + clz).transition().duration(Math.abs(angle) / 45 * 1000)
            .attr("transform", function(d) { return "rotate(" + (d.x - unitAngle / 2 + rot) + ")translate(" + radius + ")"; });
      };

    window.navigation = window.navigation || {};
    window.navigation.leavies = _export;
})(window);
