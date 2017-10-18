"use strict";

var app = angular.module("pirlApp", ["ngRoute", "appControllers", "appServices", "appDirectives"]);

var appServices = angular.module("appServices", []);
var appControllers = angular.module("appControllers", []);
var appDirectives = angular.module("appDirectives", []);

var options = {};
options.api = {};
options.api.base_url = "http://wiki.remi-mavillaz.fr";

app.config(function($routeProvider, $locationProvider) {

  $routeProvider
    .when("/", {
      templateUrl: "tpl/view-home.html",
      controller: "homeController",
    })
    // .when("//", {
    //   templateUrl: "tpl/view-search-results-page.html"
    // })
    .when("/page/:id", {
      templateUrl: "tpl/view-page.html",
      controller: "pageController"
    })
    .when("/view-search-results-page", {
      templateUrl: "tpl/view-search-results-page.html",
      controller: ""
    })
    .when("/admin", {
      templateUrl: "tpl/view-admin-dashboard.html",
      controller: "AdminPostListCtrl",
      access: {requiredAuthentication: true}
    })
    .when("/admin/register", {
      templateUrl: "tpl/view-register.html",
      controller: "AdminUserCtrl"
    })
    .when("/admin/login", {
      templateUrl: "tpl/view-login.html",
      controller: "AdminUserCtrl"
    })
    .when("/admin/logout", {
      templateUrl: "tpl/admin.logout.html",
      controller: "AdminUserCtrl",
      access: {requiredAuthentication: true}
    })
    .when("/admin/post/create", {
      templateUrl: "tpl/admin.post.create.html",
      controller: "AdminPostCreateCtrl",
      access: {requiredAuthentication: true}
    })
    // .when("/admin/post/create-category", {
    //   templateUrl: "tpl/view-admin-category-create.html",
    //   controller: "AdminCategoryCreateCtrl",
    //   access: {requiredAuthentication: true}
    // })
    .when("/admin/post/edit/:id", {
      templateUrl: "tpl/admin.post.edit.html",
      controller: "AdminPostEditCtrl",
      access: {requiredAuthentication: true}
    })
    .otherwise("/", {
      redirectTo: "/"
    });

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });

    //TEST
    // .when("/about",
    // {
    //     templateUrl: "about.html",
    //     controller: "AboutController"
    // })
    // .when("/contact",
    // {
    //     templateUrl: "contact.html",
    //     controller: "ContactController"
    // })
    // .when("/admin/view",
    // {
    //     templateUrl: "tpl/view.html",
    //     controller: "PDController"
    // })
    // .when("/admin/create",
    // {
    //     templateUrl: "tpl/create.html",
    //     controller: "PDControllerCreate"
    // })
    // .when("/admin/edit/:id",
    // {
    //     templateUrl: "tpl/edit.html",
    //     controller: "PDControllerEdit"
    // })
    // .when("/admin/details/:id",
    // {
    //     templateUrl: "tpl/details.html",
    //     controller: "PDControllerDetails"
    // })
    // .when("/admin/delete/:id",
    // {
    //     templateUrl: "tpl/delete.html",
    //     controller: "PDControllerDelete"
    // })

});

// Don"t touch here
app.config(function($httpProvider) {
  $httpProvider.interceptors.push("TokenInterceptor");
});

app.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    //redirect only if both isAuthenticated is false and no token is set
    if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
      $location.path("/admin/login");
    }
  });
});
