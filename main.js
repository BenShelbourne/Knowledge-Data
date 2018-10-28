angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);


function mainCtrl($scope, $http){
    
    $scope.mysparqlendpoint = "http://localhost:5820/Aircomfort/query?query="
    
    
    //First dropdown
    $scope.dropdown1 = [];  
    $scope.fromLocationQuery = "SELECT ?location WHERE {?x rdf:type ac:Location . ?x rdfs:label ?location}"

    console.log($scope.mysparqlendpoint+encodeURI($scope.fromLocationQuery).replace(/#/g, '%23'));
    $http( {
        method: "GET",
        url : $scope.mysparqlendpoint+encodeURI($scope.fromLocationQuery).replace(/#/g, '%23'),
        headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'},
        
    } )
    
    .success(function(data, status ) {

        angular.forEach(data.results.bindings, function(val)
        {
            $scope.dropdown1.push(val.location.value);
        })
        console.log("Dropdown 1: " + $scope.dropdown1);
    })
   
    
    .error(function(error ){
        console.log('Error');
    });
    
    
    
    //Second dropdown
    function secondDropdown(fromLocation){
        $scope.dropdown2 = [];
        $scope.toLocationQuery = "SELECT ?location WHERE{?flight rdf:type ac:Flightroute.?from rdfs:label '"+fromLocation+"'.?flight ac:From_location ?from.?flight ac:To_location ?to . ?to rdfs:label ?location . }"

        console.log($scope.mysparqlendpoint+encodeURI($scope.toLocationQuery).replace(/#/g, '%23'));

        $http( {
            method: "GET",
            url : $scope.mysparqlendpoint+encodeURI($scope.toLocationQuery).replace(/#/g, '%23'),
            headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'},
        } )

        .success(function(data, status ) {

            angular.forEach(data.results.bindings, function(val)
            {
                $scope.dropdown2.push(val.location.value);
            })
            console.log("Dropdown 2 : " + $scope.dropdown2);
        })


        .error(function(error ){
            console.log('Error');
        });
    
    
    }
    
    //To determine comfort 
    function height(){
        var height = document.getElementById("height").value;
        var pitch = 33;
        height = ((height/2)-5)/2.54;
        height = (pitch/height)*100;
        console.log(height);
        
        return height;
    }  
    
    
    
    //check all optionals
    function checkbox(){
        var wifi = document.getElementById("wifi").checked;
        var power = document.getElementById("power").checked;
        var aSeat = document.getElementById("aSeat").checked;
        var wSeat = document.getElementById("wSeat").checked;  

        if(wifi == true){
            console.log("Wifi is checked")
            wifiQuery();

        }

        if(power == true){
            console.log("Power is checked")

        }

        if(aSeat == true){
            console.log("Aisle Seat is checked")

        }

        if(wSeat == true){
            console.log("Window Seat is checked")

        }
}
        
    function wifiQuery(){
        $scope.wifi = true;
    }
    
    function output(){
        $scope.airline = [];
        $scope.aircraft = [];
        $scope.airlineQuery = "SELECT ?airline ?aircraft WHERE{?flight rdf:type ac:Flightroute.?flight ac:From_location ?from .?from rdfs:label'"+$scope.fromLocation+"'.?flight ac:To_location ?to .  ?to rdfs:label '"+$scope.toLocation+"' .  ?flight ac:Has_Airline ?air . ?air rdfs:label ?airline .?air ac:Has_aircraft ?airc . ?airc rdfs:label ?aircraft}"

        console.log($scope.mysparqlendpoint+encodeURI($scope.airlineQuery).replace(/#/g, '%23'));

        $http( {
            method: "GET",
            url : $scope.mysparqlendpoint+encodeURI($scope.airlineQuery).replace(/#/g, '%23'),
            headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'},
        } )

        .success(function(data, status ) {

            angular.forEach(data.results.bindings, function(val)
            {
                $scope.airline.push(val.airline.value);
                $scope.aircraft.push(val.aircraft.value);
            })
            console.log("Airlines : " + $scope.airline);
            console.log("Aircraft : " + $scope.aircraft);
            var table = document.getElementById("outputTable");
            for (i = 0; i < $scope.airline.length; i++){
                var row = table.insertRow(i+1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = $scope.airline[i];
                cell2.innerHTML = $scope.aircraft[i];
                cell3.innerHTML = height() + "%";
            }
            
            
        })


        .error(function(error ){
            console.log('Error');
        });
    
    
    
    }
    
    
    
    
    //when submit button is pressed
    document.getElementById("submit").onclick = function fun(){
        height();
        checkbox();
        output();
    }
    
    document.getElementById("submitFromLocation").onclick = function fn(){
        $scope.fromLocation = document.getElementsByClassName("fromElements")[0].innerHTML;
        secondDropdown(document.getElementsByClassName("fromElements")[0].innerHTML);
    }
    
    document.getElementById("submitToLocation").onclick = function f(){
        $scope.toLocation = document.getElementsByClassName("toElements")[1].innerHTML;
        document.getElementById("toLocation").innerHTML = $scope.toLocation;
        console.log($scope.toLocation);
    }
    
	
    
}




