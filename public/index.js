angular.module("anagram", [])

    .config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('//');
        $interpolateProvider.endSymbol('//');
    })

    .controller("wrapperController", [
        '$scope',
        function($scope) {
            $scope.currentTab = 'main';

            $scope.changeTab = function(tab) {
                $scope.currentTab = tab;
            };
        }
    ])

    .controller("navController", [
        '$scope',
        function($scope) {

        }
    ])

    .controller("bonusController", [
        '$scope',
        '$http',
        function($scope, $http) {

            $scope.reset = function(word) {
                if ($scope.results) {
                    $scope.results = null;
                }
                // $scope[word] = null;
            };

            $scope.find = function() {
                var query = $scope.word;
                $http.get("/api", {"params":{"query": query}})
                    .then(function(response) {
                        data = response.data;
                        results = data.l;
                        if (results.indexOf(query) >= 0) {
                            var index = results.indexOf(query);
                            results.splice(index, 1);
                        }
                        $scope.results = results;
                        // console.log($scope.results)
                    })
                    .catch(function(err) {

                    });
            };

        }
    ])

    .controller("mainController", [
        '$scope',
        function($scope) {

            $scope.reset = function(word) {
                if ($scope.answer) {
                    $scope.answer = null;
                }
                // $scope[word] = null;
            };

            $scope.solve = function() {
                if ($scope.firstWord && $scope.secondWord) {
                    a = $scope.firstWord.toLowerCase().split("").sort();
                    b = $scope.secondWord.toLowerCase().split("").sort();
                    if (a.join("") === b.join("")) {
                        $scope.answer = "right";
                    }
                    else {
                        $scope.answer = "wrong";
                    }
                }
                else {
                    $scope.answer = "blank";
                }
            };
        }
    ]);