
angular.module('filters', []).
/**
 * Format Number digits
 * @Param num
 * @Param length, 2 
 * @return string
 */
    filter('digits', function () {
        return function (num, length) {
            if (isNaN(length)) {
                length = 2;
            }
            num = num.toString();
            while (num.length < length) {
                num = "0" + num;                
            }
            return num;
        };
    });
