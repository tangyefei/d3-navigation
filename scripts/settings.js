(function(window){
    'use strict'

    var _export = {
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


    window.navigation = window.navigation || {};
    window.navigation.config = window.navigation.config || _export;
})(window);