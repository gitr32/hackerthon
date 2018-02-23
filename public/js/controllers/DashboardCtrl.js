angular.module('DashboardCtrl', [])
    .controller('DashboardController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdSidenav',  '$q',function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdSidenav, $q) {
        var vm = this;

        /*var ref = firebase.database().ref().child('Transactions');
        vm.transaction = $firebaseArray(ref);
        
        var obj = {};
        obj["09-10-2017 08:30"] = {"Char Kway Teow":{payment_type: "ezlink", price: 3.5, qty: 1, size:"l"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-10-2017 12:00"] = {"Oyster Omellette":{payment_type: "ezlink", price: 7, qty: 1, size:"m"}, "Oyster Omellette":{payment_type: "ezlink", price: 16, qty: 2, size:"s"}, "Char Kway Teow":{payment_type: "ezlink", price: 7, qty: 2, size:"l"} }
        vm.transaction.$add(obj)
        obj = {};
        obj["09-10-2017 12:30"] = {"Oyster Omellette":{payment_type: "cash", price: 7, qty: 1, size:"m"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-10-2017 18:30"] = {"Hokkien Mee":{payment_type: "ezlink", price: 3, qty: 1, size:"s"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-11-2017 11:45"] = {"Char Kway Teow":{payment_type: "ezlink", price: 2.5, qty: 1, size:"s"}, "Oyster Omellette":{payment_type: "ezlink", price: 12, qty: 2, size: "s"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-11-2017 12:00"] = {"Char Kway Teow":{payment_type: "cash", price: 3, qty: 1, size:"m"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-12-2017 12:20"] = {"Char Kway Teow":{payment_type: "ezlink", price: 7, qty: 1, size:"l"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-12-2017 12:25"] = {"Hokkien Mee":{payment_type: "ezlink", price: 4, qty: 1, size:"l"}}
        vm.transaction.$add(obj)
        obj = {};
        obj["09-12-2017 12:30"] = {"Char Kway Teow":{payment_type: "cash", price: 3, qty: 1, size:"m"}, "Hokkien Mee":{payment_type: "ezlink", price: 8, qty: 2, size:"l"}}
        vm.transaction.$add(obj)*/

        vm.colors ={
            "blue": ["#4BABB4"],
            "two_blues":['#4BABB4', '#2B6267']
        }

        vm.selected_data = {
            "total_order": "total_order",
            "today_order": "today_order",
            "total_revenue": "total_revenue",
            "today_revenue": "today_revenue",
            "cash": "cash",
            "ezlink": "ezlink",
            "popular_food": "popular_food",
            "popular_food_data":{},
            "monthly_by_revenue": {},
            "best_performing_day": {},
            "best_performing_hour": {},
            "ezlink_vs_cash": {},
            "ezlink_vs_cash_by_month": {},
            "weekend_vs_weekday": "weekend_vs_weekday"
        }
        vm.result = []
        vm.updated = [];

        var transactionRef = firebase.database().ref().child('Transaction');
        

            transactionRef.on("value", function(snapshot) {
                var result = [];
                var keys = Object.keys(snapshot.val());

                keys.forEach(function(key, index){
                    result[index] = {};
                    
                    var date_key = Object.keys(snapshot.val()[key])[0]
                    result[index][date_key] = snapshot.val()[key][date_key]
                    result[index].$id = key;
                })
                //console.log(result);
                refreshReport(result);

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
    
        initController();
        function initController () {
            vm.visitsLoading = true;
            $q.when()
                .then(function(){
                    return getTransactions();
                })
                .then(function(transactions){
                    generateDataForInit(transactions);
                })
                .then(function(){
                    generateDataForDashboard();
                    vm.visitsLoading = false;
                })
        }
        
        function refreshReport(transactions){
            $q.when()
                .then(function(){
                    generateDataForInit(transactions);
                })
                .then(function(){
                    generateDataForDashboard();
                })
        }

        function getTransactions(){
            var _defer = $q.defer();
            
            var transaction_array = $firebaseArray(transactionRef);
            //console.log("Transactions : ", transaction_array);

            transaction_array.$loaded().then(function(){
                //console.log(transaction_array)
                if (transaction_array) {
                    _defer.resolve(transaction_array);
                } else {
                    _defer.reject();
                }
            })
            return _defer.promise;
        }

        

        function generateDataForInit(transaction_array){   
            //console.log(transaction_array);
            var result = []
            transaction_array.forEach(function(element, index) {
                var order_date = Object.keys(element)[0];
                
                /*Object.keys(element[order_date]).forEach(function(food, index){
                    var element_obj = {}
                    element_obj.order_id = element.$id;
                    element_obj.transaction_date = moment(order_date).format("YYYY-MM-DD hh:mm");
                    element_obj.day_of_the_week = moment(element_obj.transaction_date, 'YYYY-MM-DD hh:mm').format("ddd");
                    element_obj.month_of_the_week = moment(element_obj.transaction_date, 'YYYY-MM-DD hh:mm').format("MMM");
                    element_obj.hour_of_the_week = moment(element_obj.transaction_date, 'YYYY-MM-DD hh:mm').format("h A");
                    element_obj.food_name = food;
                    element_obj.food_price = element[order_date][food].price;
                    element_obj.food_qty = element[order_date][food].qty;
                    element_obj.food_size = element[order_date][food].size
                    element_obj.payment_type = element[order_date][food].payment_type;
                    result.push(element_obj);
                })*/

                Object.keys(element[order_date]).forEach(function(cartItem, cartIndex){
                    var element_obj = {};
                    if(cartIndex == 0){
                        element_obj.order_id = element.$id;
                        element_obj.transaction_date = moment(order_date, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm");
                        element_obj.day_of_the_week = moment(element_obj.transaction_date, 'YYYY-MM-DD HH:mm').format("ddd");
                        element_obj.day_of_the_week_no = moment(element_obj.transaction_date, 'YYYY-MM-DD HH:mm').day();
                        element_obj.month_of_the_week = moment(element_obj.transaction_date, 'YYYY-MM-DD HH:mm').format("MMM");
                        element_obj.hour_of_the_week = moment(element_obj.transaction_date, 'YYYY-MM-DD HH:mm').format("h A");
                        element_obj.hour_of_the_week_no = moment(element_obj.transaction_date, 'YYYY-MM-DD HH:mm').format("HH");
                        element_obj.total_price = element[order_date].total;
                        element_obj.payment_type = element[order_date].payment_type;
                        //console.log("TESTTT")
                        //console.log(element[order_date])
                        //console.log(cartItem)
                        element[order_date][cartItem].forEach(function(foodCart, foodCartIndex){
                            foodCart.forEach(function(foodItem, foodIndex){
                                if(foodIndex > 0){
                                    Object.keys(foodItem).forEach(function(foodSize, foodSizeIndex){
                                        if(foodItem[foodSize].amount != 0){
                                            var food_element_obj = angular.copy(element_obj);
                                            food_element_obj.food_size = foodSize;
                                            food_element_obj.food_price = foodItem[foodSize].amount
                                            food_element_obj.food_qty = foodItem[foodSize].qty;
                                            result.push(food_element_obj);
                                        }
                                    })
                                }else{
                                    element_obj.food_name = foodItem;
                                }
                            })
                        })
                    }   
                })

                
                    
            });
            //console.log(result)
            vm.result = crossfilter(result);

            var ndx = vm.result;
            var dimension = ndx.dimension(function(d) {return d.food_name;});
            var group = dimension.group().reduceSum(function(d) {return d.food_qty});
            vm.updated = group.top(Infinity);
 
        }
        function generateDataForDashboard() {

            createBestDayWidget();
            createBestHourWidget();
            createPopularFoodWidget();            
            createMonthlyRevenueWidget();
            createEzlinkVsCashWidget();
            createMonthlyEzlinkVsCashWidget();
        }

        function createPopularFoodWidget(){
            var ndx = vm.result;
            var dimension = ndx.dimension(function(d) {return d.food_name;});
            var group = dimension.group().reduceSum(function(d) {return d.food_qty});

            vm.selected_data.popular_food_data.dimesion = dimension;
            vm.selected_data.popular_food_data.group = group;
            vm.selected_data.popular_food_data.data = group.top(Infinity);
            vm.selected_data.popular_food_data.color = vm.colors.blue;
        }
        
        function createMonthlyRevenueWidget(){
            var ndx = vm.result;
            var dimension = ndx.dimension(function(d) {return d.month_of_the_week;});
            var group = dimension.group().reduceSum(function (d) {
                return d.total_price;
            });

            vm.selected_data.monthly_by_revenue.dimesion = dimension;
            vm.selected_data.monthly_by_revenue.group = group;
            vm.selected_data.monthly_by_revenue.data = group.top(Infinity);
            vm.selected_data.monthly_by_revenue.color = vm.colors.blue;

        }

        function createBestDayWidget(){
            var ndx = vm.result;
            var dimension = ndx.dimension(function(d) {return d.day_of_the_week_no;});
            var group = dimension.group().reduce(
                function (p, v) {
                    if (v.order_id in p.payment){
                         p.payment[v.order_id]++;
                    }else {
                        p.payment[v.order_id] = 1;
                        p.count++;
                    }
                    return p;
                },
                function (p, v) {
                    p.payment[v.order_id]--;
                    if(p.payment[v.order_id] == 0){
                        delete p.payment[v.order_id];
                        p.count--;
                    }
                    return p;
                },
                function () { return {payment:{}, count:0}; }
            );
            
            //print_filter(dimension)
            /*group.all().forEach(function(data, index){
                data.value = data.value.count;
            })*/

            vm.selected_data.best_performing_day.dimesion = dimension;
            vm.selected_data.best_performing_day.group = group;
            vm.selected_data.best_performing_day.data = group.top(Infinity);
            console.log(group.top(Infinity));
            vm.selected_data.best_performing_day.color = vm.colors.blue;
        }

        function createBestHourWidget(){
            var ndx = vm.result;
            var hour_dimension = ndx.dimension(function(d) {return d.hour_of_the_week_no;});
            var hour_dimension_2 = ndx.dimension(function(d) {return d.hour_of_the_week;});
            var hour_group = hour_dimension.group().reduce(
                function (p, v) {
                    if (v.order_id in p.payment){
                         p.payment[v.order_id]++;
                    }else {
                        p.payment[v.order_id] = 1;
                        p.count++;
                    }
                    return p;
                },
                function (p, v) {
                    p.payment[v.order_id]--;
                    if(p.payment[v.order_id] == 0){
                        delete p.payment[v.order_id];
                        p.count--;
                    }
                    return p;
                },
                function () { return {payment:{}, count:0}; }
            );
            var hour_group_2 = hour_dimension_2.group().reduce(
                function (p, v) {
                    if (v.order_id in p.payment){
                         p.payment[v.order_id]++;
                    }else {
                        p.payment[v.order_id] = 1;
                        p.count++;
                    }
                    return p;
                },
                function (p, v) {
                    p.payment[v.order_id]--;
                    if(p.payment[v.order_id] == 0){
                        delete p.payment[v.order_id];
                        p.count--;
                    }
                    return p;
                },
                function () { return {payment:{}, count:0}; }
            );

            /*hour_group.all().forEach(function(data, index){
                data.value = data.value.count;
            })*/

            /*var result = [];
            hour_group.all().forEach(function(data, index){
                console.log(data)
                var grp = {};
                grp.key = data.key;
                grp.value = data.value.count;
                result.push(grp);
                
            })
            print_filter(result)*/
            vm.selected_data.best_performing_hour.dimesion = hour_dimension;
            vm.selected_data.best_performing_hour.group = hour_group;
            vm.selected_data.best_performing_hour.data = hour_group.top(Infinity);
            console.log(hour_group.top(Infinity));
            //console.log(hour_group_2.top(Infinity));
            vm.selected_data.best_performing_hour.color = vm.colors.blue;
        }

        function createEzlinkVsCashWidget(){
            var ndx = vm.result;
            var dimension = ndx.dimension(function(d) {return d.payment_type;});
            var group = dimension.group().reduceSum(function (d) {
                return d.total_price;
            });

            vm.selected_data.ezlink_vs_cash.dimesion = dimension;
            vm.selected_data.ezlink_vs_cash.group = group;
            vm.selected_data.ezlink_vs_cash.data = group.top(Infinity);
            vm.selected_data.ezlink_vs_cash.color = vm.colors.two_blues;
        }

        function createMonthlyEzlinkVsCashWidget(){
            var ndx = vm.result;
            var dimension = ndx.dimension(function(d) {return [d.payment_type, d.month_of_the_week];});
            var group = dimension.group().reduceSum(function (d) {
                return d.total_price;
            });

            vm.selected_data.ezlink_vs_cash_by_month.dimesion = dimension;
            vm.selected_data.ezlink_vs_cash_by_month.group = group;
            vm.selected_data.ezlink_vs_cash_by_month.data = group.top(Infinity);
            vm.selected_data.ezlink_vs_cash_by_month.color = vm.colors.blue;
        }

        function print_filter(filter) {
            var f=eval(filter);
            if (typeof(f.length) != "undefined") {}else{}
            if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
            if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
            console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
        }
    }]);