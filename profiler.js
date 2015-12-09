(function(window, document, undefined) {
    'use strict';

    var ht     = window.ht || (window.ht = {}),
        groups = {},
        currentGroup = null,
        options = {};

    const TOTAL_KEY = 'TOTAL';

    ht.profiler = {
        config: function(opts = {}) {
            Object.assign(options, opts);
        },

        time: function(key) {
            currentGroup = key;

            groups[currentGroup] = {};
        },

        timeEnd: function() {
            let results = formatResults(groups);

            if (typeof options.log === 'function') {
                options.log('profiler', results);
            }

            printResults(results);

            currentGroup = null;
        },

        start: function(key) {
            groups[currentGroup][key] = {
                start: window.performance.now(),
                end: 0
            };
        },

        end: function(key) {
            groups[currentGroup][key].end = window.performance.now();
        }
    };

    ///////////////////////////////////////

    function formatResults(groups) {
        var results = {
            [currentGroup]: {}
        };

        let total = 0;

        for (let key in groups[currentGroup]) {
            results[currentGroup][key] = groups[currentGroup][key].end - groups[currentGroup][key].start;

            total += results[currentGroup][key];
        }

        results[currentGroup][TOTAL_KEY] = total;

        return results;
    }

    function printResults(results) {
        window.console.table(results);
    }
}(typeof window !== 'undefined' ? window : global, document));

/*
ht.profiler.time('1');

ht.profiler.start('A');
var x = 1;
ht.profiler.end('A');

ht.profiler.start('B');
var z = 2;
ht.profiler.end('B');

ht.profiler.time('2');

ht.profiler.start('A');
var xx = 1;
ht.profiler.end('A');

ht.profiler.start('B');
var zz = 2;
ht.profiler.end('B');
ht.profiler.timeEnd();

ht.profiler.timeEnd();
*/