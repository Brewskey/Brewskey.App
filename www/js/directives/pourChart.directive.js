angular.module('brewskey.directives')
.directive('pourChart', [
    function () {
        var translateFromUtc = function (dateTime) {
            return moment.utc(dateTime).local();
        }
        return {
            link: function (scope, element) {
                scope.$watch('pours', function (pours, oldValue) {
                    if (!pours || pours.length === 0) {
                        return;
                    }

                    var data;
                    var pourSets;
                    var groupedPours = _.groupBy(pours, function (item) {
                        var dateMoment = translateFromUtc(item.pourDate);
                        return dateMoment.dayOfYear();
                    });

                    if (_.keys(groupedPours).length <= 1) {
                        pourSets = _.map(pours, function(pour) {
                            return {
                                date: translateFromUtc(pour.pourDate),
                                ounces: pour.ounces,
                            };
                        }).reverse();
                        scope.series = ['Ounces'];
                        data = _.map(pourSets, function (item) {
                            return item.ounces;
                        });
                        scope.labels = _.map(pourSets, function (item) {
                            return item.date.format('M/D/YY LT');
                        });
                    } else {
                        scope.series = ['Ounces per day'];

                        if (_.keys(groupedPours).length > 10) {
                            groupedPours = _.groupBy(pours, function(item) {
                                var dateMoment = translateFromUtc(item.pourDate);
                                return dateMoment.week();
                            });
                            scope.series = ['Ounces per week'];

                        }

                        if (_.keys(groupedPours).length > 10) {
                            groupedPours = _.groupBy(pours, function(item) {
                                var dateMoment = translateFromUtc(item.pourDate);
                                return dateMoment.month();
                            });
                            scope.series = ['Ounces per month'];
                        }

                        pourSets = _.sortBy(
                            _.map(groupedPours, function(group) {
                                return {
                                    date: translateFromUtc(group[0].pourDate),
                                    ounces: _.sumBy(group, 'ounces'),
                                }
                            }),
                            function(item) {
                                return item.date.valueOf();
                            }
                        );
                        data = _.map(pourSets, function (item) {
                            return Math.round(item.ounces);
                        });
                        scope.labels = _.map(pourSets, function (item) {
                            return item.date.format('l');
                        });
                    }

                    scope.data = [data];
                }, true);
            },
            restrict: 'E',
            scope: {
                pours: '=',
            },
            template: '<canvas id="line" class="chart chart-bar" chart-data="data" chart-labels="labels" chart-legend="true" chart-series="series"></canvas>',
        };
    }]);
