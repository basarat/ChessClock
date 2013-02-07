angular.module('bui', [])
    .directive('buiSlider', function ($parse) {
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
    })
    // Based on angularjs UI project
    .directive('buiModal', ['$timeout', function ($timeout) {
        return {
            restrict: 'EAC',
            link: function (scope, elm, attrs, model) {
                //helper so you don't have to type class="modal hide"
                elm.addClass('modal hide');
                elm.on('shown', function () {
                    elm.find("[autofocus]").focus();
                });
                scope.$watch(attrs.expression, function (value) {
                    elm.modal(value && 'show' || 'hide');
                });
                //If bootstrap animations are enabled, listen to 'shown' and 'hidden' events
                elm.on(jQuery.support.transition && 'shown' || 'show', function () {
                    $timeout(function () {
                        model.$setViewValue(true);
                    });
                });
                elm.on(jQuery.support.transition && 'hidden' || 'hide', function () {
                    $timeout(function () {
                        model.$setViewValue(false);
                    });
                });
            }
        };
    }]);
