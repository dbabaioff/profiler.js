(function(window, undefined) {'use strict';
    var ht        = window.ht || (window.ht = {}),
        groups    = {},
        times     = {},
        groupKeys = [],
        options   = {};

    const TOTAL_KEY = 'TOTAL';

    ht.profiler = {
        config: function(opts = {}) {
            Object.assign(options, opts);
        },

        group: function(key) {
            groupKeys.push(key);

            groups[currentKey()] = {};
        },

        groupEnd: function() {
            let currentKey = groupKeys.pop(),
                results    = formatResults(currentKey);

            if (typeof options.log === 'function') {
                options.log('profiler', results);
            }

            printResults(results);
        },

        time: function(key) {
            if (options.debugEnabled) {
                console.log('%ctime:', 'color: #ff6666; font-size: 12px; font-weight: bold', key);
            }

            times[key] = {
                start: window.performance.now(),
                end: 0
            };
        },

        timeEnd: function(key) {
            if (times[key]) {
                times[key].end = window.performance.now();

                if (options.debugEnabled) {
                    console.log('%ctimeEnd:', 'color: green;  font-size: 12px; font-weight: bold', key);
                }

                printResults({
                    [key]: {
                        [TOTAL_KEY]: times[key].end - times[key].start
                    }
                });
            }
        },

        start: function(key) {
            if (groups[currentKey()]) {
                if (options.debugEnabled) {
                    console.log('%cstart:', 'color: darkcyan; font-size: 12px; font-weight: bold', key);
                }

                groups[currentKey()][key] = {
                    start: window.performance.now(),
                    end: 0
                };
            }

        },

        end: function(key) {
            if ((groups[currentKey()] || {})[key]) {
                groups[currentKey()][key].end = window.performance.now();

                if (options.debugEnabled) {
                    console.log('%cend:', 'color: darkcyan; font-size: 12px; font-weight: bold', key);
                }
            }
        }
    };

    ///////////////////////////////////////

    function formatResults(currentKey) {
        var results = {
            [currentKey]: {}
        };

        let total = 0;

        for (let key in groups[currentKey]) {
            results[currentKey][key] = groups[currentKey][key].end - groups[currentKey][key].start;

            total += results[currentKey][key];
        }

        results[currentKey][TOTAL_KEY] = total;

        return results;
    }

    function printResults(results) {
        if (options.debugEnabled) {
            window.console.table(results);
        }
    }

    function currentKey() {
        return groupKeys[groupKeys.length - 1]  || null;
    }
}(typeof window !== 'undefined' ? window : global));
