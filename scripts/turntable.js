(function(window){
    'use strict'

    var _export = {};
    var centerPoint = new Point();
    var config = window.navigation.config;

    function formatGraphUnit(t, x, y, id, attrs) {
        var k = null,
            g = window.navigation.svg.append('g')
                .attr("transform", "translate(" + x + "," + y + ")")
                .attr('id', id)
                .append(t);

        for(k in attrs)
            g.attr(("" + k), attrs[k]);
    };

    _export.formatTurntable = function() {
        window.navigation.svg = d3.select("body").append("svg")
            .attr("width", config.diameter)
            .attr("height", config.diameter)
        .append("g")
            .attr("transform", "translate(" + config.diameter / 2 + "," + config.diameter / 2 + ")");

        var round, d, id, x, y, cls, radius, attrs;

        for(var i = config.turntable.rounds.length - 1; i >=0; i --) {
            round = config.turntable.rounds[i];
            d = config.diameter;
            id = round['id'];
            x = 0,
            y = 0,
            cls = round['class'];
            radius = round['radius']  *  (d / 2);
            attrs = {'r': radius, 'class': cls};

            formatGraphUnit('circle', x, y, cls, attrs)
        }

        cls = config.turntable.pointer.class;
        config.turntable.pointer.attrs.width = config.diameter / 2 * config.turntable.pointer.attrs.width;
        formatGraphUnit('rect', x, y - config.turntable.pointer.attrs.height / 2, cls, config.turntable.pointer.attrs)
    };


    _export.initCenterPosition = function() {
        var $svg = $('svg');
        centerPoint.x = $svg.position().left  + parseFloat($svg.attr('width') / 2);
        centerPoint.y = $svg.position().top  + parseFloat($svg.attr('height') / 2);
    }

     _export.getCircleNumBelongTo = function(pX, pY) {
            var vect = new Vector(pX - centerPoint.x, pY - centerPoint.y);
            var length = vect.length();
            var innerRadius = config.diameter / 2 * config.turntable.rounds[0]['radius'];
            var middleRadius = config.diameter / 2 * config.turntable.rounds[1]['radius'];
            var outerRadius = config.diameter / 2 * config.turntable.rounds[2]['radius'];

            if(length < innerRadius) {
                return 1;
            } else if(length < middleRadius) {
                  return 2;
            } else if(length < outerRadius) {
                return 3;
            }
            return -1;
      };

    _export.centerPoint =  centerPoint;

    window.navigation = window.navigation || {};
    window.navigation.turntable = _export;

})(window);