define(function(require, exports, module) {
    var config = require('./config');
    var prototype = require('./prototype');
    var leavies = require('./leavies');
    var turntable = require('./turntable');

    var root, teamCollection = {}, divisionTeams;
    var touchCircleNum, clickZone;
    var timeout;

    function processData(data) {
        if(data && data.children && data.children.length) {
            for (var i = 0; i < data.children.length; i++) {
                var division = data.children[i]['name'];
                var teams = data.children[i]['children'];
                teamCollection[division] = teams;
                divisionTeams = divisionTeams || {'name': division, 'children': teams};
                delete data.children[i]['children'];
            };
            config['leafDatas'][1] = data;
            config['leafDatas'][2] = divisionTeams;
        }
    }

    function bindEvents() {
        turntable.initCenterPosition();

        $(document).on('click', function(e) {
            touchCircleNum  = turntable.getCircleNumBelongTo(event.x, event.y);

            if( touchCircleNum !== 2 && touchCircleNum !== 3 ) return;

            // Tricky: the scroll bar would cause the event.x not expected
            var vector = new prototype.Vector(event.x - turntable.centerPoint.x, event.y - turntable.centerPoint.y)
            var angle = vector.getOffsetAngle();
            var len = config['leafDatas'][touchCircleNum - 1]['children'].length;
            var unitAngle = 360 / len;
            var name, index;

            // for both round two and three, update outside
            leavies.rotateLeavies(touchCircleNum, - angle, config);

            // for round two, update outside
            if(touchCircleNum == 2) {
                //Tricky: current change touchCircleNum would affect previous timeout callback
                setTimeout((function(_touchCircleNum){
                    return function() {
                        index = (config['rots'][_touchCircleNum - 1] / unitAngle) % len
                        index = parseInt(index >= 0 ? index : (index + len));
                        name = root.children[index]['name'];
                        config['leafDatas'][2] = {'name': name, 'children': teamCollection[name]};
                        leavies.formatNodesByRound(_touchCircleNum + 1, config);
                    }
                })(touchCircleNum), config.lazyMillSeconds);
            }
        });
    }

    d3.json("data/nba.json", function(error, res) {
        root = res;
        processData(root);
        turntable.formatTurntable();
        leavies.formatNodesByRound(2).formatNodesByRound(3);
        bindEvents();
    });
});