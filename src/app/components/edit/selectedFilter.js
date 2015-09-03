angular.module('gong.edit', ['restangular', 'ngSanitize'])
    .filter('selectedFilter', function () {
        return function (incItems, value) {
            var out = [{}];

            if(value){
                for(x=0; x<incItems.length; x++){
                    if (typeof(value.incItems[x]) !== 'undefined')
                        if(value.incItems[x] != false) {
                            out.push(incItems[x]);
                            console.log('test');
                        }
                }
                return out;
            }
            else if(!value){
                return incItems
            }
        };
    });
