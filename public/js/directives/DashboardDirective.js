angular.module('DashboardDirective', [])

.directive('number', function() {
    return {
        restrict: 'EA',
        scope: {
            updated: "=",
            data: "=",
            shown: "="
        },
        link: function(scope, Element, Attrs){
            scope.$watch('updated', function(data) {
                if(typeof scope.data.dimension != 'undefined'){

                    var dimension = scope.data.dimension(function(d) {return d.order_id;}),
                    group = dimension.groupAll().reduce(
                        function (p, v) {
                            if (v.order_id in p.payment){
                                 p.payment[v.order_id]++;
                            }else {
                                p.payment[v.order_id] = 1;
                                p.total_count++;

                                if(v.payment_type == 'Ezlink'){
                                    ++p.ezlink;
                                }else{
                                    ++p.cash;
                                }
                       
                                var today = moment(new Date()).format("YYYY-MM-DD")
                                var transaction_date = moment(v.transaction_date).format("YYYY-MM-DD")
                                //console.log(transaction_date)

                                //if(moment(v.transaction_date, "YYYY-MM-DD").isSame(moment(new Date() ,"YYYY-MM-DD")) ){
                                if(moment(transaction_date).isSame(today) ){
                                    ++p.today_count
                                }
                            }

                            p.total_revenue += v.food_price;
                            var today = moment(new Date()).format("YYYY-MM-DD")
                            var transaction_date = moment(v.transaction_date).format("YYYY-MM-DD")

                            if(moment(transaction_date).isSame(today) ){
                                p.today_revenue += v.food_price;
                            }
                            return p;
                        },
                        function (p, v) {
                            p.payment[v.order_id]--;
                            if(p.payment[v.order_id] == 0){
                                delete p.payment[v.order_id];
                                p.total_count--;

                                if(v.payment_type == 'Ezlink'){
                                    p.ezlink--;
                                }else{
                                    p.cash--;
                                }
                                var today = moment(new Date()).format("YYYY-MM-DD")
                                var transaction_date = moment(v.transaction_date).format("YYYY-MM-DD")

                                if(moment(transaction_date).isSame(today) ){
                                    --p.today_count
                                }
                            }

                            p.total_revenue -= v.food_price;
                            var today = moment(new Date()).format("YYYY-MM-DD")
                            var transaction_date = moment(v.transaction_date).format("YYYY-MM-DD")

                            if(moment(transaction_date).isSame(today) ){
                                p.today_revenue -= v.food_price;
                            }

                            return p;
                        },
                        function () { return {payment:{}, total_count:0, today_count:0, total_revenue:0, today_revenue:0, ezlink:0, cash:0}; }
                    );
                }
                scope.renderChart(dimension, group, scope.shown)
            }, true);
            scope.renderChart = function(dimension, group, shown ){
                d3.select(Element[0]).selectAll("*").remove();

                if(dimension != null && group != null){
                    //console.log(group.top(Infinity))

                    var chart = dc.numberDisplay(Element[0]);
                    chart
                        
                        .formatNumber(d3.format(",d"))
                        .valueAccessor(function (p) {
                            if(shown == "total_order"){
                                return p.total_count;
                            }else if (shown == "today_order" ){
                                return p.today_count;
                            }else if (shown == "total_revenue" ){
                                return p.total_revenue;
                            }else if (shown == "today_revenue" ){
                                return p.today_revenue;
                            }else if (shown == "cash" ){
                                return p.cash;
                            }else if (shown == "ezlink" ){
                                return p.ezlink;
                            }
                        })
                        .group(group);

                        if (shown == "total_revenue" || shown == "today_revenue" ){
                            chart.formatNumber(d3.format("$,.2f"));
                        }
                        
                    chart.render();

                }else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-family:Raleway; font-size: 18px;font-weight: 100;">No Data Available.</span></div>');
                }
            }
        }
    }
})

.directive('rowChart', function() {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
        },
        link: function(scope, Element, Attrs){
            scope.$watch('data', function(data) {
          

                if(typeof data != 'undefined'){
                    var dimension = data.dimesion,
                        group = data.group,
                        color = data.color;
                }
                scope.renderChart(dimension, group, color)
            }, true);

            scope.renderChart = function(dimension, group, color){
                d3.select(Element[0]).selectAll("*").remove();                

                if(dimension != null && group != null){
                    var chart = dc.rowChart(Element[0]);
                    chart
                        .x(d3.scale.linear().domain([6,20]))
                        .elasticX(true)
                        .dimension(dimension)
                        .group(group)
                        .valueAccessor(function (p) {
                            return p.value;
                        })
                    chart.ordinalColors(color)
                    chart.xAxis().tickFormat(d3.format(',d'))
                    chart.ordering(function(d) { return -d.value; })
                    chart.render();
                }else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-family:Raleway; font-size: 18px;font-weight: 100;">No Data Available.</span></div>');
                }
            };
            scope.print_filter = function(filter) {
                var f = eval(filter);
                if (typeof(f.length) != "undefined") {}else{}
                if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
                if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
                console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
            };
        }
    }
})

.directive('rowChartByCount', function() {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
        },
        link: function(scope, Element, Attrs){
            scope.$watch('data', function(data) {
                if(typeof data != 'undefined'){
                    var dimension = data.dimesion,
                        group = data.group,
                        color = data.color;
                }
                scope.renderChart(dimension, group, color)
            }, true);

            scope.renderChart = function(dimension, group, color){
                d3.select(Element[0]).selectAll("*").remove();
          
                if(dimension != null && group != null){
                    var chart = dc.rowChart(Element[0]);
                    chart
                        .x(d3.scale.linear().domain([6,20]))
                        .elasticX(true)
                        .dimension(dimension)
                        .group(group)
                        .valueAccessor(function (p) {
                            return p.value.count;
                        })
                    chart.ordinalColors(color)
                    chart.xAxis().tickFormat(d3.format(',d'))
                    chart.ordering(function(d) { return -d.value.count; })
                    chart.render();
                }else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-family:Raleway; font-size: 18px;font-weight: 100;">No Data Available.</span></div>');
                }
            };
            scope.print_filter = function(filter) {
                var f = eval(filter);
                if (typeof(f.length) != "undefined") {}else{}
                if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
                if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
                console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
            };
        }
    }
})

.directive('lineChart', function() {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
        },
        link: function(scope, Element, Attrs){
            scope.$watch('data', function(data) {
          
                if(typeof data != 'undefined'){
                    var dimension = data.dimesion,
                        group = data.group,
                        color = data.color;
                }
                
                scope.renderChart(dimension, group, color)
            }, true);

            scope.renderChart = function(dimension, group, color){
                d3.select(Element[0]).selectAll("*").remove();                

                if(dimension != null && group != null){
                    var chart = dc.lineChart(Element[0]);
                    chart
                        .width(400)
                        .x(d3.scale.linear().domain([0,23]))
                        //.x(d3.scale.ordinal())
                        //.xUnits(dc.units.ordinal)
                        //.elasticX(true)
                        .dimension(dimension)
                        .group(group)
                        .valueAccessor(function (p) {
                            return p.value.count;
                        })
                        .xAxisLabel('Hour of the day')
                    chart.ordinalColors(color)
                    //chart.xAxis().ticks(23)
                    //chart.xAxis().tickFormat(d3.format(',d'))
                    //chart.ordering(function(d) { return -d.value; })
                    chart.render();
                }else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-family:Raleway; font-size: 18px;font-weight: 100;">No Data Available.</span></div>');
                }
            };
            scope.print_filter = function(filter) {
                var f = eval(filter);
                if (typeof(f.length) != "undefined") {}else{}
                if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
                if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
                console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
            };
        }
    }
})

.directive('lineChartDay', function() {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
        },
        link: function(scope, Element, Attrs){
            scope.$watch('data', function(data) {
          
                if(typeof data != 'undefined'){
                    var dimension = data.dimesion,
                        group = data.group,
                        color = data.color;
                }
                
                scope.renderChart(dimension, group, color)
            }, true);

            scope.renderChart = function(dimension, group, color){
                d3.select(Element[0]).selectAll("*").remove();                

                if(dimension != null && group != null){
                    var chart = dc.lineChart(Element[0]);
                    chart
                        .width(400)
                        //.x(d3.scale.linear().domain([0,23]))
                        .x(d3.scale.linear().domain([1,7]))
                        //.xUnits(dc.units.ordinal)
            
                        .dimension(dimension)
                        .group(group)
                        .valueAccessor(function (p) {
                            return p.value.count;
                        })
                        .xAxisLabel('Day of the week')
                    chart.ordinalColors(color)
                    chart.xAxis().ticks(7).tickFormat(function(l) { 
                        if(l == 1){return "Mon"}
                        if(l == 2){return "Tue"}
                        if(l == 3){return "Wed"}
                        if(l == 4){return "Thu"}
                        if(l == 5){return "Fri"}
                        if(l == 6){return "Sat"}
                        if(l == 7){return "Sun"}
                     })
                    //chart.xAxis().tickFormat(d3.format(',d'))
                    //chart.ordering(function(d) { return -d.value; })
                    chart.render();
                }else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-family:Raleway; font-size: 18px;font-weight: 100;">No Data Available.</span></div>');
                }
            };
            scope.print_filter = function(filter) {
                var f = eval(filter);
                if (typeof(f.length) != "undefined") {}else{}
                if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
                if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
                console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
            };
        }
    }
})