(function(window){
    'use strict'
    var svg, g, offsetX = 0, offsetY = 0, config = {
        'diameter': 480,
        'lazyMillSeconds': 1000,
        'rots': [0, 0,0], // leavies rotate angles
        'turntable': {
            "rounds": [
                {'id': 'round1', 'class': 'inner-circle', 'radius': 0.2},
                {'id': 'round2', 'class': 'midd-circle', 'radius': 0.5},
                {'id': 'round3', 'class': 'outer-circle', 'radius': 1.0}
            ],
            'pointer': {
                'id': 'pointer', 'class': 'rect', 'attrs': {'width': 0.2, 'height': 10}
            }
        },
        // TODO try to merge confs and datas together
        'leafConfs': [
            null,
            {'class': 'dnode', 'radius': 0.5},
            {'class': 'tnode',  'radius': 0.8}
        ],
        'leafDatas': [
            null,
            null,
            null
        ],
        'teamNameOffset': 60
    };

    var tree = d3.layout.tree()
        .size([360, config.diameter / 2 * config.turntable.rounds[1]['radius'] + 9])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var nbaData, teamCollection = {}, divisionTeams;


    /****************************************** TRUN_TABLE ******************************************************/
    function formatGraphUnit(t, x, y, id, attrs) {
        var k = null,
            g = svg.append('g')
                .attr("transform", "translate(" + x + "," + y + ")")
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

    /****************************************** LEAVIES ******************************************************/

    function processData(data) {
        if(data && data.children && data.children.length) {
            for (var i = 0; i < data.children.length; i++) {
                var division = data.children[i]['name'];
                var teams = data.children[i]['children'];
                teamCollection[division] = teams;
                divisionTeams = divisionTeams || {'name': division, 'children': teams};
                delete data.children[i]['children'];
            };
        }
    }

    function formatNodesByRound(touchCircleNum) {
        var cont = config['leafConfs'][touchCircleNum - 1];
        var data = config['leafDatas'][touchCircleNum - 1];
        var unitAngle = 360 / data.children.length;

        svg.selectAll("." + cont.class).remove();

        var nodes = tree.nodes(data);
        var node = svg.selectAll("." + cont.class)
              .data(nodes)
          .enter().append("g")
              .attr("class", cont.class)
              .attr("transform", function(d) { return "rotate(" + (d.x - unitAngle / 2) + ")translate(" + (cont.radius * config.diameter / 2 - config.teamNameOffset) + ")";})

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) { return d.name; });
      };

      function rotateLeavies(circleNum, angle) {
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

        svg.selectAll("." + clz).transition().duration(Math.abs(angle) / 45 * 1000)
            .attr("transform", function(d) { return "rotate(" + (d.x - unitAngle / 2 + rot) + ")translate(" + radius + ")"; });
      };

    /****************************************** Prototype ******************************************************/

      function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
      }

      function Vector(x, y) {
        this.x = x;
        this.y = y;
      };

      Vector.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      };

      Vector.prototype.getRotateAngle = function(toVector) {
        var epsilon = 1.0e-6;
        var angle = 0;
        var norVec1 = new Vector(0, 0),
         norVec2 = new Vector(0, 0);

        norVec1.x = this.x / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        norVec1.y = this.y / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        norVec2.x = toVector.x / Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y, 2));
        norVec2.y = toVector.y / Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y, 2));

        var dotProd = (norVec1.x * norVec2.x) + (norVec1.y * norVec2.y);
        if (Math.abs(dotProd - 1.0) <= epsilon) {
         angle = 0;
        } else if (Math.abs(dotProd + 1.0) <= epsilon) {
         angle = Math.PI;
        } else {
         var cross = 0;
         angle = Math.acos(dotProd);
         cross = (norVec1.x * norVec2.y) - (norVec2.x * norVec1.y);
         if (cross < 0) // this rotate clockwise to toVector
           angle = 2 * Math.PI - angle;
        }

        return angle * (180 / Math.PI);
      }

      function getAngleBetweenVectors(v1, v2) {
        var angle = v1.getRotateAngle(v2);
        var angle = (angle > 180 ? (angle - 360) : angle);

        return angle;
      };

      function getCircleNumBelongTo(pX, pY) {
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

      /****************************************** Events ******************************************************/
        var centerPoint = new Point();
        var mouseUpPoint = new Point();
        var touchCircleNum;

        function initCenterPosition() {
            var $svg = $('svg');
            centerPoint.x = $svg.position().left  + parseFloat($svg.attr('width') / 2);
            centerPoint.y = $svg.position().top  + parseFloat($svg.attr('height') / 2);
        }

        function bindEvents() {
            initCenterPosition();

            $(document).on('click', function(e) {
                mouseUpPoint.x = event.x;
                mouseUpPoint.y = event.y;
                // Tricky: the scroll bar would cause the event.x not expected
                touchCircleNum = getCircleNumBelongTo(event.x, event.y);

                if(touchCircleNum !== 2 && touchCircleNum !== 3) return;

                var v1 = new Vector(1, 0);
                var v2 = new Vector(mouseUpPoint.x - centerPoint.x, mouseUpPoint.y - centerPoint.y);
                var angle = getAngleBetweenVectors(v1, v2);
                var len = config['leafDatas'][touchCircleNum - 1]['children'].length;
                var unitAngle = 360 / len;
                var name, index;

                // for both round two and three, update outside
                rotateLeavies(touchCircleNum, - angle);

                // for round two, update outside
                if(touchCircleNum == 2) {
                    setTimeout(function(){
                        index = (config['rots'][touchCircleNum - 1] / unitAngle) % len
                        index = parseInt(index >= 0 ? index : (index + len));
                        name = nbaData.children[index]['name'];
                        config['leafDatas'][2] = {'name': name, 'children': teamCollection[name]};
                        formatNodesByRound(touchCircleNum + 1);
                    }, config.lazyMillSeconds);
                }
            });
        }

        d3.json("data/nba.json", function(error, root) {
            nbaData = root;
            processData(nbaData);
            config['leafDatas'][1] = nbaData;
            config['leafDatas'][2] = divisionTeams;
            formatNodesByRound(2);
            formatNodesByRound(3);
        });

        formatTurntable();
        bindEvents();
})(window);
