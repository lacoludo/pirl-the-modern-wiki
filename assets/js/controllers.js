var appControllers = angular.module('appControllers', []);

appControllers.controller('homeController', [
  '$scope',
  '$sce',
  'PostService',
  function homeController($scope, $sce, PostService) {

    $scope.posts = [];

    PostService.getPages().then(pages => {
      const getLatestRevisionsAsArray = pages.map(page => PostService.getLatestRevision(page).catch(error => {}));

      const getLatestRevisions = Promise.all(getLatestRevisionsAsArray);

      getLatestRevisions.then(latestRevisions => {
        const gamesPages = [];
        const moviesPages = [];
        const tvPages = [];

        // for (const i in pages) {
        //   const page = pages[i];
        // }

        // for (const page of pages) {
        for (const iPage in pages) {
          // if (page.category.name === "Jeu vidéo") {
          //   gamesPages.push(page);
          // }
          // else if (page.category.name === "Film") {
          //   moviesPages.push(page);
          // }
          // else if (page.category.name === "TV") {
          //   tvPages.push(page);
          // }

          const page = pages[iPage];
          var latestRevision = latestRevisions[iPage];

          if (latestRevision === '') {
            latestRevision = {
              title: "/!\\ No latest revision /!\\"
            };
          }

          page.latestRevision = latestRevision;

          if (page.category === undefined || page.category === null) {
            continue;
          }

          //if (page.category !== null) {
          switch (page.category.name) {
            case "Jeu vidéo":
              gamesPages.push(page);
              break;
            case "Film":
              moviesPages.push(page);
              break;
            case "TV":
              tvPages.push(page);
              break;
          }
          //}
        }

        $scope.pages = {
          games: gamesPages,
          movies: moviesPages,
          tv: tvPages
        };

        $scope.$apply();

        //alert(JSON.stringify($scope.pages, null, 4));
      });
    });

    // PostService.getCategories().then(categories => {
    //   $scope.categories = categories;
    // });

    // PostService.findAllPublished().success(function(data) {
    //   for (var postKey in data) {
    //     data[postKey].content = $sce.trustAsHtml(data[postKey].content);
    //   }
    //
    //   $scope.posts = data;
    // }).error(function(data, status) {
    //   console.log(status);
    //   console.log(data);
    // });

    // $scope.showSearchBar = function() {
    //   alert("in");
    //     $("body").toggleClass("top-search-active");
    //     $("top-search").find('input').focus();
    //     return false;
    // };
  }
]);

appControllers.controller('pageController', [
  '$scope',
  '$routeParams',
  '$location',
  '$sce',
  'PostService',
  //'LikeService',
  function pageController($scope, $routeParams, $location, $sce, PostService/*, LikeService*/) {

    $scope.page = {};
    var id = $routeParams.id;

    //$scope.isAlreadyLiked = LikeService.isAlreadyLiked(id);

    PostService.getPage(id).then(function(page) {
      //data.content = $sce.trustAsHtml(data.content);
      $scope.page = page;

      PostService.getLatestRevision(page).then(function(revision) {
        $scope.page.latestRevision = revision;

      });
    });

  }
]);

appControllers.controller('AdminPostListCtrl', [
  '$scope',
  'PostService',
  function AdminPostListCtrl($scope, PostService) {
    $scope.posts = [];

    // PostService.findAll().success(function(data) {
    //   $scope.posts = data;
    // });

    PostService.getPages().then(function(pages) {
      $scope.pages = pages;
    });

    // $scope.updatePublishState = function updatePublishState(post, shouldPublish) {
    //   if (post != undefined && shouldPublish != undefined) {

    //     PostService.changePublishState(post._id, shouldPublish).success(function(data) {
    //       var posts = $scope.posts;
    //       for (var postKey in posts) {
    //         if (posts[postKey]._id == post._id) {
    //           $scope.posts[postKey].is_published = shouldPublish;
    //           break;
    //         }
    //       }
    //     }).error(function(status, data) {
    //       console.log(status);
    //       console.log(data);
    //     });
    //   }
    // }

    $scope.deletePage = function deletePage(page) {
      if (page != undefined) {

        PostService.delete(page).success(function(data) {
          var posts = $scope.page;
          for (var postKey in posts) {
            if (posts[postKey].page == page) {
              $scope.page.splice(postKey, 1);
              break;
            }
          }
        }).error(function(status, data) {
          console.log(status);
          console.log(data);
        });
      }
    }
  }
]);

appControllers.controller('AdminPostCreateCtrl', [
  '$scope',
  '$location',
  'PostService',
  function AdminPostCreateCtrl($scope, $location, PostService) {
    $('#textareaContent').wysihtml5({"font-styles": true});

    $scope.post = {
      title: "",
      category: "",
      content: ""
    };

    $scope.save = function save(post) {
      if (post != undefined && post.title != undefined && post.category != undefined) {

        var content = $('#textareaContent').val();
        if (content != undefined) {
          post.content = content;

          // if (shouldPublish != undefined && shouldPublish == true) {
          //     post.is_published = true;
          // } else {
          //     post.is_published = false;
          // }

          PostService.createPage(post).then(function(data) {
            $location.path("/admin");
          }).catch(function(status, data) {
            console.log(post)
            console.log(status);
            console.log(data);
          });
        }
      }
    }
  }
]);

// appControllers.controller('AdminCategoryCreateCtrl', [
//   '$scope',
//   '$location',
//   'PostService',
//   function AdminPostCreateCtrl($scope, $location, PostService) {
//     $('#textareaContent').wysihtml5({"font-styles": true});
//
//     $scope.category = {
//       name: "",
//     };
//
//     $scope.save = function save(category) {
//       if (category.name != undefined) {
//
//         var content = $('#textareaContent').val();
//         if (content != undefined) {
//           category.content = content;
//
//           // if (shouldPublish != undefined && shouldPublish == true) {
//           //     post.is_published = true;
//           // } else {
//           //     post.is_published = false;
//           // }
//
//           PostService.postCategory(category).then(function(data) {
//             $location.path("/admin");
//           }).catch(function(status, data) {
//             console.log(category)
//             console.log(status);
//             console.log(data);
//           });
//         }
//       }
//     }
//   }
// ]);

appControllers.controller('AdminPostEditCtrl', [
  '$scope',
  '$routeParams',
  '$location',
  '$sce',
  'PostService',
  function AdminPostEditCtrl($scope, $routeParams, $location, $sce, PostService) {
    $scope.post = {};
    var id = $routeParams.id;

    PostService.read(id).success(function(data) {
      $scope.post = data;
      $('#textareaContent').wysihtml5({"font-styles": false});
      $('#textareaContent').val($sce.trustAsHtml(data.content));
    }).error(function(status, data) {
      $location.path("/admin");
    });

    $scope.save = function save(post) {
      if (post !== undefined && post.title !== undefined && post.title != "") {

        var content = $('#textareaContent').val();
        if (content !== undefined && content != "") {
          post.content = content;

          // if (shouldPublish != undefined && shouldPublish == true) {
          //     post.is_published = true;
          // } else {
          //     post.is_published = false;
          // }

          // string comma separated to array
          // if (Object.prototype.toString.call(post.tags) !== '[object Array]') {
          //     post.tags = post.tags.split(',');
          // }

          PostService.update(post).success(function(data) {
            $location.path("/admin");
          }).error(function(status, data) {
            console.log(status);
            console.log(data);
          });
        }
      }
    }
  }
]);
// Don't touch here
appControllers.controller('AdminUserCtrl', [
  '$scope',
  '$location',
  '$window',
  'UserService',
  'AuthenticationService',
  function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {

    //Admin User Controller (signIn, logOut)
    $scope.signIn = function signIn(username, password) {
      if (username != null && password != null) {

        UserService.signIn(username, password).success(function(data) {
          AuthenticationService.isAuthenticated = true;
          $window.sessionStorage.token = data.token;
          $location.path("/admin");
        }).error(function(status, data) {
          console.log(status);
          console.log(data);
        });
      }
    }

    $scope.logOut = function logOut() {
      if (AuthenticationService.isAuthenticated) {

        UserService.logOut().success(function(data) {
          AuthenticationService.isAuthenticated = false;
          delete $window.sessionStorage.token;
          $location.path("/");
        }).error(function(status, data) {
          console.log(status);
          console.log(data);
        });
      } else {
        $location.path("/admin/login");
      }
    }

    $scope.register = function register(email, username, password, password_confirmation) {
      if (AuthenticationService.isAuthenticated) {
        $location.path("/admin");
      } else {
        UserService.register(email, username, password, password_confirmation).success(function(data) {
          $location.path("/admin/login");
        }).error(function(status, data) {
          console.log(status);
          console.log(data);
        });
      }
    }
  }
]);

// appControllers.controller('PostListTagCtrl', ['$scope', '$routeParams', '$sce', 'PostService',
//     function PostListTagCtrl($scope, $routeParams, $sce, PostService) {

//         $scope.posts = [];
//         var tagName = $routeParams.tagName;

//         PostService.findByTag(tagName).success(function(data) {
//             for (var postKey in data) {
//                 data[postKey].content = $sce.trustAsHtml(data[postKey].content);
//             }
//             $scope.posts = data;
//         }).error(function(status, data) {
//             console.log(status);
//             console.log(data);
//         });

//     }
// ]);

// appControllers.controller("PDController", function ($scope, PDService, $rootScope) {
//     $scope.Title = "Personal Details List";
//     $rootScope.loading = true;
//     $scope.GetPersonalDetails = PDService.GetAll().then(function (d) {
//         $scope.PersonalDetails = d;
//         $rootScope.loading = false;
//     });
// });

// appControllers.controller("AdminPostCreateCtrl", function ($scope, PDService, $rootScope) {
//     $scope.Title = "Create - Personal Details";

//     $scope.Create = function () {
//         $rootScope.loading = true;
//         PDService.Insert($scope.category, $scope.title, $scope.content).then(function (d) {
//             $scope.CreateMessage = d;
//             $rootScope.loading = false;
//         });
//     };
// });

appControllers.controller('SearchController', function($scope, $http, $timeout, $location, $window, UserService) {
  $scope.searchText = null;
  $scope.change = function(text) {
    valtosend = $scope.searchText;
    $http.get('http://wiki.remi-mavillaz.fr/search?_format=json&limit=5&search=' + valtosend).then(function(result) {
      $scope.entries = result.data;
    });
  };
});
