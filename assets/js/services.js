//********DON'T TOUCH HERE*********//
var appServices = angular.module('appServices', []);

appServices.factory('AuthenticationService', function() {
  var auth = {
    isAuthenticated: false,
    isAdmin: false
  }

  return auth;
});

appServices.factory('TokenInterceptor', function($q, $window, $location, AuthenticationService) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    /* Set Authentication.isAuthenticated to true if 200 received */
    response: function(response) {
      if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
        AuthenticationService.isAuthenticated = true;
      }
      return response || $q.when(response);
    },

    /* Revoke client authentication if 401 is received */
    responseError: function(rejection) {
      if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
        delete $window.sessionStorage.token;
        AuthenticationService.isAuthenticated = false;
        $location.path("/admin/login");
      }

      return $q.reject(rejection);
    }
  };
});
//********END*********//

appServices.factory('PostService', function($http, $window) {
  return {

    //Categories
    getCategories: function() {
      return pirl.api.get($http, $window, "/categories");
    },
    postCategory: function() {
      return pirl.api.post($http, $window, "/category");
    },
    deleteCategory: function(category) {
      return pirl.api.delete($http, $window, "/category/" + category.id);
    },
    patchCategory: function(category) {
      return pirl.api.patch($http, $window, "/categories/" + category.id);
    },

    // Pages
    postPage: function() {
      return pirl.api.post($http, $window, "/page");
    },
    deletePage: function(page) {
      return pirl.api.delete($http, $window, "/page/" + page.id);
    },
    getPage: function(id) {
      return pirl.api.get($http, $window, "/page/" + id);
    },
    getPages: function() {
      return pirl.api.get($http, $window, "/pages");
    },
    getPagesCategory: function(category) {
      return pirl.api.get($http, $window, "/pages/category/" + category.id);
    },

    // Revisions
    postRevision: function(page) {
      return pirl.api.post($http, $window, "/page/" + page.id + "/revision");
    },
    getLatestRevision: function(page) {
      return pirl.api.get($http, $window, "/page/" + page.id + "/revision/latest");
    },
    getRevisions: function(page) {
      return pirl.api.get($http, $window, "/page/" + page.id + "/revisions");
    },
    getRevisionsStatus: function(page, status) {
      return pirl.api.get($http, $window, "/page/" + page.id + "/revisions/status/" + status.id);
    },
    deleteRevision: function(revision) {
      return pirl.api.delete($http, $window, "/revision/" + revision.id);
    },
    getRevision: function(revision) {
      return pirl.api.get($http, $window, "/revision/" + revision.id);
    },
    patchRevision: function(revision, status) {
      return pirl.api.patch($http, $window, "/revision/" + revision.id + "/status/" + status.id);
    },
    getSearch: function() {
      return pirl.api.get($http, $window, "/search");
    },

    // Security
    postLoginCheck: function() {
      return pirl.api.post($http, $window, "/login_check");
    },
    patchUserAdmin: function(user) {
      return pirl.api.patch($http, $window, "/user/" + user.id + "/admin");
    },
    patchUserDisabled: function(user) {
      return pirl.api.patch($http, $window, "/user/" + user.id + "/disabled");
    },
    patchUserEnabled: function(user) {
      return pirl.api.patch($http, $window, "/user/" + user.id + "/enabled");
    },

    // Users
    patchProfile: function() {
      return pirl.api.patch($http, $window, "/profile");
    },
    postUser: function() {
      return pirl.api.post($http, $window, "/user");
    },
    getUser: function(user) {
      return pirl.api.get($http, $window, "/user/" + user.id);
    },
    getUsers: function() {
      return pirl.api.get($http, $window, "/users");
    },

    // Old
    createPage: function(page) {
      return pirl.api.post($http, $window, "/page", page);
    },
    read: function(id) {
      return $http.get(options.api.base_url + '/page/' + {'id': id});
    },
    update: function(page) {
      return $http.put(options.api.base_url + '/page', {'page': page});
    },
    delete: function(id) {
      return $http.delete(options.api.base_url + '/page/' + id);
    },

  };
});

//********DON'T TOUCH HERE*********//
appServices.factory('UserService', function($http) {
  return {
    signIn: function(username, password) {
      return $http.post(options.api.base_url + '/login_check', {
        _username: username,
        _password: password
      })
    },

    logOut: function() {
      return $http.get(options.api.base_url + '/user/logout');
    },

    register: function(email, username, password, password_confirmation) {
      return $http.post(options.api.base_url + '/user', {
        email: email,
        username: username,
        password: password,
        password_confirmation: password_confirmation
      });
    }
  }
});
//********END*********//
