angular.module('jqui', [])
    .directive('jquiSlider', function ($parse) {
        return {
            link: function (scope, element, attrs) {
                var slider = $(element).slider({
                    range: "min",
                    min: $parse(attrs.min)(scope),
                    max: $parse(attrs.max)(scope),
                    value: $parse(attrs.value)(scope),
                    slide: function (event, ui) {
                        scope.$apply(function () {
                            $parse(attrs.value).assign(scope, ui.value);
                        });
                    }
                });
                $scope.$watch(attrs.value, function (newval) {
                    slider.value(newval);
                });
            }
        };
    });
