(function() {

// POST
const post = function($http, $window, resource, data) {
  return $http({
    method: "POST",
    url: options.api.base_url + resource,
    headers: {
      Authorization: $window.sessionStorage.token
    },
    data: data
  })
  .then(function(response) {
    return response.data;
  })
};

// GET
const get = function($http, $window, resource) {
  return $http({
    method: "GET",
    url: options.api.base_url + resource,
    headers: {
      Authorization: $window.sessionStorage.token
    }
  })
  .then(function(response) {
    return response.data;
  })
};

// PATCH
const patch = function($http, $window, resource, data) {
  return $http({
    method: "PATCH",
    url: options.api.base_url + resource,
    headers: {
      Authorization: $window.sessionStorage.token
    },
    data: data
  })
  .then(function(response) {
    return response.data;
  })
};

// DELETE
const $delete = function($http, $window, resource) {
  return $http({
    method: "DELETE",
    url: options.api.base_url + resource,
    headers: {
      Authorization: $window.sessionStorage.token
    }
  })
  .then(function(response) {
    return response.data;
  })
};

window.pirl = window.pirl || {};

window.pirl.api = {
    get: get,
    post: post,
    patch: patch,
    delete: $delete
};
})();
