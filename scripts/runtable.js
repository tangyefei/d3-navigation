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

function formatGraphic(t, x, y, id, attrs) {
    var k = null,
        g = svg.append('g')
            .attr("transform", "translate(" + x + "," + y + ")")
            .attr('id', id)
            .append(t);

        for(k in attrs)
            g.attr(("" + k), attrs[k]);
    };

function formatGraphUnit() {
    svg = d3.select("body").append("svg")
        .attr("width", config.diameter)
        .attr("height", config.diameter)

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

formatTurntable();
