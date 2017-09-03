angular.module("brewskey.directives").directive("accountPicker", [
	"$ionicModal",
	"Restangular",
	function($ionicModal, rest) {
		return {
			link: function(scope) {
				scope.searchAccounts = _.map(scope.accounts, function(account) {
					return _.assign({}, account, { selected: true });
				});

				scope.$watch(
					"searchAccounts",
					function(searchAccounts) {
						scope.accounts = _.filter(scope.searchAccounts, function(account) {
							return account.selected;
						});
					},
					true
				);

				scope.$watch("searchQuery", function(searchQuery) {
					if (!searchQuery) {
						return;
					}

					scope.loading = true;

					rest
						.one("/api/v2/accounts/")
						.get({
							$filter:
								"(contains(userName,'" +
								searchQuery +
								"'))or(contains(email,'" +
								searchQuery +
								"'))",
							$select: "id,userName"
						})
						.then(
							function(response) {
								scope.loading = false;
								if (!response || !response.value) {
									return;
								}

								scope.searchAccounts = _.chain(scope.accounts)
									.concat(response.value)
									.uniqBy("id")
									.value();
							},
							function(error) {
								scope.loading = false;
							}
						);
				});

				scope.toggleAccount = function(accountIndex) {
					const selected = scope.searchAccounts[accountIndex].selected;
					_.merge(scope.searchAccounts[accountIndex], { selected: !selected });
				};

				$ionicModal
					.fromTemplateUrl("templates/modals/account-picker.html", {
						scope: scope,
						animation: "slide-in-up"
					})
					.then(function(modal) {
						scope.modal = modal;
					});

				scope.openModal = function() {
					scope.modal.show();
				};

				scope.closeModal = function() {
					scope.modal.hide();
				};

				scope.resetAccounts = function() {
					scope.accounts = [];
					scope.searchQuery = null;
					scope.searchAccounts = [];
				};
			},
			restrict: "E",
			scope: {
				accounts: "=",
				isDisabled: "<"
			},
			templateUrl: "templates/directives/account-picker.html"
		};
	}
]);
