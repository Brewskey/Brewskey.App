angular.module('tappt.directives')
.directive('pourChart', ['converter',
    function (converter) {
        return {
            link: function (scope, element) {
                scope.$watch('pours', function (pours, oldValue) {
                    var groupedPours = _.groupBy(pours, function (item) {
                        var dateMoment = moment.utc(item.pourDate);
                        return dateMoment.dayOfYear();
                    });
                    scope.series = ['Pints per day'];

                    if (_.keys(groupedPours).length > 10) {
                        groupedPours = _.groupBy(pours, function (item) {
                            var dateMoment = moment.utc(item.pourDate);
                            return dateMoment.week();
                        });
                        scope.series = ['Pints per week'];

                    }

                    if (_.keys(groupedPours).length > 10) {
                        groupedPours = _.groupBy(pours, function (item) {
                            var dateMoment = moment.utc(item.pourDate);
                            return dateMoment.month();
                        });
                        scope.series = ['Pints per month'];
                    }

                    var pourSets = _.sortBy(
                        _.map(groupedPours, function(group) {
                            return {
                                date: moment.utc(group[0].pourDate),
                                pulses: _.sumBy(group, 'pulses'),
                            }
                        }),
                        function(item) {
                            return item.date.valueOf();
                        }
                    );

                    scope.labels = _.map(pourSets, function (item) {
                        return item.date.format('l');
                    });

                    var pints = _.map(pourSets, function (item) {
                        return Math.round(converter.translateToPints(item.pulses));
                    });
                    var ounces = _.map(pourSets, function (item) {
                        return converter.translateToOunces(item.pulses);
                    });

                    scope.data = [pints];


                    var v = 0;
                }, true);
            },
            restrict: 'E',
            scope: {
                pours: '=',
            },
            template: '<canvas id="line" class="chart chart-bar" chart-data="data" chart-labels="labels" chart-legend="true" chart-series="series"></canvas>',
        };
    }]);
