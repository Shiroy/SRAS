sras.controller('getTextDialog', ['$scope', '$modalInstance', 'question', 'title', function($scope, $modalInstance, question, title){
    $scope.question = question;
    $scope.title = title;

    $scope.response = '';

	$scope.ok = function() {
		$modalInstance.close($scope.response);
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
}]);

function openGetTextDialog(modal, title, question){
    return modal.open({
        animation: true,
        template: loadView('getTextDialog'),
        controller: 'getTextDialog',
        resolve: {
            title: function() {return title;},
            question: function() {return question;}
        }
    });
}
