import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import logo from './logo.svg';
import './App.css';
import React from 'react';
import Select from 'react-select';

// Possible ratings options
var ratings = ['not seen', 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

var MovieRating = function (_React$Component) {
  _inherits(MovieRating, _React$Component);

  function MovieRating(props) {
    _classCallCheck(this, MovieRating);

    var _this = _possibleConstructorReturn(this, (MovieRating.__proto__ || Object.getPrototypeOf(MovieRating)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.state = { genreId: null };
    return _this;
  }

  // Handle a change in each selector


  _createClass(MovieRating, [{
    key: 'handleChange',
    value: function handleChange(selector, event) {
      if (selector == "movie") {
        this.props.handleMovieUpdate(this.props.id, event.value);
      } else if (selector == "rating") {
        this.props.handleRatingUpdate(this.props.id, event.value);
      } else if (selector == "genre") {
        this.setState({ genreId: event.value });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var movies = this.props.movies;
      var genreId = this.state.genreId;
      var genres = this.props.genres;
      var genre_name = void 0;

      // If we have a specified genre, then filter by that genre only
      if (genreId !== null) {

        // Get the genre name
        genre_name = this.props.genres.filter(function (x) {
          return x.genreId === genreId;
        });
        if (genre_name.length > 0) {
          genre_name = genre_name[0].genre_name;
        }
      } else {
        genre_name = "All";
      }

      if (genre_name !== "All") {
        movies = movies.filter(function (x) {
          return x.genres.split("|").includes(genre_name);
        });
      }

      var moviesPlaceholder = movies && movies.length > 0 ? "Type in a movie title..." : "Loading Movies...";
      var genresPlaceholder = genres && genres.length > 0 ? "Genre:" : "Loading Genres...";

      return React.createElement(
        'div',
        { className: 'movie-rating' },
        React.createElement(
          'div',
          { className: 'selectors' },
          React.createElement(Select, { className: 'genre selector', id: this.props.name,
            placeholder: genresPlaceholder,
            onChange: function onChange(event) {
              return _this2.handleChange("genre", event);
            },
            options: genres.map(function (genre) {
              return { value: genre.genreId, label: genre.genre_name };
            })
          }),
          React.createElement(Select, { className: 'movie selector', id: this.props.name,
            placeholder: moviesPlaceholder,
            onChange: function onChange(event) {
              return _this2.handleChange("movie", event);
            },
            options: movies.map(function (movie) {
              return { value: movie.movieId, label: movie.title };
            })
          }),
          React.createElement(Select, { className: 'rating selector', id: this.props.name,
            placeholder: 'Rating:',
            onChange: function onChange(event) {
              return _this2.handleChange("rating", event);
            },
            options: ratings.map(function (rating, i) {
              return { value: rating, label: rating };
            })
          })
        )
      );
    }
  }]);

  return MovieRating;
}(React.Component);

var PredictedRatingsDisplay = function (_React$Component2) {
  _inherits(PredictedRatingsDisplay, _React$Component2);

  function PredictedRatingsDisplay(props) {
    _classCallCheck(this, PredictedRatingsDisplay);

    var _this3 = _possibleConstructorReturn(this, (PredictedRatingsDisplay.__proto__ || Object.getPrototypeOf(PredictedRatingsDisplay)).call(this, props));

    _this3.state = { genreId: null };
    _this3.handleGenreChange = _this3.handleGenreChange.bind(_this3);
    _this3.filterRatingsByGenre = _this3.filterRatingsByGenre.bind(_this3);
    return _this3;
  }

  _createClass(PredictedRatingsDisplay, [{
    key: 'handleGenreChange',
    value: function handleGenreChange(event) {
      this.setState({ genreId: parseInt(event.value) });
    }
  }, {
    key: 'filterRatingsByGenre',
    value: function filterRatingsByGenre() {
      var filteredRatings = this.props.predictedRatings;
      var genre_name = void 0;
      var genreId = this.state.genreId;

      // If we have a specified genre, then filter by that genre only
      if (genreId !== null) {
        // Try to get the genre name from the id
        genre_name = this.props.genres.filter(function (x) {
          return x.genreId === genreId;
        });

        if (genre_name.length > 0) {
          genre_name = genre_name[0].genre_name;
        }
      } else {
        genre_name = "All";
      }

      if (genre_name !== "All") {
        filteredRatings = filteredRatings.filter(function (x) {
          return x.genreId === genreId;
        });
      }
      // If we aren't filtering by genre we need to remove duplicate movies
      else {
          var ratingsDeDuped = [];

          var _loop = function _loop(i) {
            var currentRating = filteredRatings[i];
            // If the current rating already exists in the de duplicated ratings don't add it
            if (ratingsDeDuped.filter(function (x) {
              return x.movieId === currentRating.movieId;
            }).length === 0) {
              ratingsDeDuped.push(currentRating);
            }
          };

          for (var i = 0; i < filteredRatings.length; i++) {
            _loop(i);
          }
          filteredRatings = ratingsDeDuped;
        }

      return filteredRatings;
    }
  }, {
    key: 'render',
    value: function render() {

      var genresPlaceholder = this.props.genres && this.props.genres.length > 0 ? "Genre:" : "Loading Genres...";

      var ratingsToDisplay = this.filterRatingsByGenre();
      ratingsToDisplay = ratingsToDisplay.slice(0, 20);

      // Different scenarios for which ratings display object we want to show
      var ratingsDisplayObject = void 0;

      // If there is a submission error display an error message
      if (this.props.submissionError == true && this.props.loadingPredictions == false) {
        ratingsDisplayObject = React.createElement(
          'div',
          { className: 'predicted-ratings-error' },
          React.createElement(
            'h3',
            null,
            'Unable to fetch recommendations: please try rating more movies'
          )
        );
      }
      // If predictions are loading display loader
      else if (this.props.loadingPredictions == true) {
          ratingsDisplayObject = React.createElement('div', { className: 'loader' });
        }
        // If results successfully loaded without error display the results
        else if (this.props.submissionError == false && this.props.loadingPredictions == false) {
            ratingsDisplayObject = React.createElement(
              'div',
              { className: 'ratings-results' },
              ratingsToDisplay.map(function (rating, i) {
                return React.createElement(
                  'div',
                  { className: 'rating' },
                  React.createElement(
                    'div',
                    { className: 'movie-img-title' },
                    React.createElement(
                      'div',
                      { className: 'movie-title', key: i },
                      rating.title
                    ),
                    React.createElement(
                      'div',
                      { className: 'movie-img' },
                      React.createElement('img', { src: "https://image.tmdb.org/t/p/w500/" + rating.poster_path })
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: 'movie-score' },
                    'Score: ',
                    rating.adjusted_rating
                  )
                );
              })
            );
          }

      return React.createElement(
        'div',
        { className: 'predicted-ratings' },
        React.createElement(Select, { className: 'genre selector', id: this.props.name,
          placeholder: genresPlaceholder,
          onChange: this.handleGenreChange,
          options: this.props.genres.map(function (genre) {
            return { value: genre.genreId, label: genre.genre_name };
          })
        }),
        React.createElement(
          'div',
          { className: 'ratings-results-container' },
          ratingsDisplayObject
        )
      );
    }
  }]);

  return PredictedRatingsDisplay;
}(React.Component);

var App = function (_React$Component3) {
  _inherits(App, _React$Component3);

  function App(props) {
    _classCallCheck(this, App);

    var _this4 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this4.handleSubmit = _this4.handleSubmit.bind(_this4);
    _this4.handleMovieUpdate = _this4.handleMovieUpdate.bind(_this4);
    _this4.handleRatingUpdate = _this4.handleRatingUpdate.bind(_this4);
    _this4.fetchMoviesRequest = _this4.fetchMoviesRequest.bind(_this4);
    _this4.fetchGenresRequest = _this4.fetchGenresRequest.bind(_this4);
    _this4.handleNumNeighborsUpdate = _this4.handleNumNeighborsUpdate.bind(_this4);
    _this4.handleEngineUpdate = _this4.handleEngineUpdate.bind(_this4);
    _this4.handleMinSupportUpdate = _this4.handleMinSupportUpdate.bind(_this4);
    _this4.handleNumFactorsUpdate = _this4.handleNumFactorsUpdate.bind(_this4);
    _this4.handleNumEpochsUpdate = _this4.handleNumEpochsUpdate.bind(_this4);
    _this4.handlePopularityBoostUpdate = _this4.handlePopularityBoostUpdate.bind(_this4);
    _this4.fetchMoviePredictions = _this4.fetchMoviePredictions.bind(_this4);
    _this4.fetchMovieImgs = _this4.fetchMovieImgs.bind(_this4);

    var initial_ratings = {};
    for (var i = 0; i < 10; i++) {
      initial_ratings[i] = { movieId: null, rating: null };
    }
    _this4.state = {
      movies: [], genres: [], movie_ratings: initial_ratings, predictedRatings: [],
      loadingPredictions: false, num_neighbors: 40, min_support: 3, engine: 'svd',
      submissionError: false, n_factors: 100, n_epochs: 20, popularity_boost: 10
    };
    return _this4;
  }

  // Function to fetch the movies data from the database via the server


  _createClass(App, [{
    key: 'fetchMoviesRequest',
    value: function fetchMoviesRequest() {
      var _this5 = this;

      var genre = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var movies_url = "/api/movies?";
      // Optional genre and limit query parameters
      if (genre !== null & genre !== 'null') {
        movies_url += 'genre=' + encodeURIComponent(genre);
      }
      if (limit !== null & limit !== 'null') {
        movies_url += '&limit=' + encodeURIComponent(limit);
      }
      fetch(movies_url, { method: "GET" }).then(function (res) {
        return res.json();
      }).then(function (res) {
        _this5.setState({ movies: res });
      }).catch(function (error) {
        console.log("Fetch movies request error:", error);
      });
    }

    // Function to fetch the genres data from the database via the server

  }, {
    key: 'fetchGenresRequest',
    value: function fetchGenresRequest() {
      var _this6 = this;

      fetch('/api/genres?', { method: "GET" }).then(function (res) {
        return res.json();
      }).then(function (res) {
        // Add one more genre for All genres
        var lastGenreId = res.reduce(function (prev, current) {
          return prev.genreId > current.genreId ? prev.genreId : current.genreId;
        });
        res.unshift({ genreId: lastGenreId + 1, genre_name: "All" });

        _this6.setState({ genres: res });
      }).catch(function (error) {
        console.log("Fetch genres request error:", error);
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.fetchGenresRequest();
      // Fetch 1000 movies to display while we wait for all movies to load for a better user experience
      this.fetchMoviesRequest(null, 1000);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Fetch all movies
      this.fetchMoviesRequest();
    }

    // Function to get movie predictions from the recommendation system

  }, {
    key: 'fetchMoviePredictions',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var ratings_list, numRatings, engine, body, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                // Get all rated movies
                ratings_list = Object.values(this.state.movie_ratings);

                ratings_list = ratings_list.filter(function (x) {
                  return x.rating && x.rating !== "not seen" && x.movieId;
                });

                // Remove duplicates
                ratings_list = ratings_list.filter(function (value, index, self) {
                  return index === self.findIndex(function (t) {
                    return t.movieId === value.movieId;
                  });
                });

                numRatings = ratings_list.length;
                engine = this.state.engine;

                // If there are no rated movies return null

                if (!(numRatings === 0)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', null);

              case 7:
                body = {
                  ratings: ratings_list
                };


                if (engine === 'svd') {
                  body.model_params = {
                    n_factors: parseInt(this.state.n_factors),
                    n_epochs: parseInt(this.state.n_epochs),
                    popularity_boost: parseInt(this.state.popularity_boost)
                  };
                } else if (engine === 'knn') {
                  body.model_params = {
                    min_support: parseInt(this.state.min_support),
                    num_neighbors: parseInt(this.state.num_neighbors),
                    popularity_boost: parseInt(this.state.popularity_boost)
                  };
                }

                _context.next = 11;
                return fetch('/movie_recommendation/' + this.state.engine, {
                  method: "POST",
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body)
                }).then(function (res) {
                  if (!res.ok) {
                    var message = 'An error has occured: ' + response.status;
                    throw new Error(message);
                  }
                  return res.json();
                }).then(function (res) {
                  if (res.status == 200) {
                    // Round the adjusted rating
                    res.data.map(function (x) {
                      x.adjusted_rating = Math.round(x.adjusted_rating * 100) / 100;
                    });
                    return res.data;
                  } else if (res.status == 400 || res.status == 500) {
                    return null;
                  }
                }).catch(function (error) {
                  console.log("Fetch movie recommendations error: ", error);
                  return null;
                });

              case 11:
                response = _context.sent;
                return _context.abrupt('return', response);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchMoviePredictions() {
        return _ref.apply(this, arguments);
      }

      return fetchMoviePredictions;
    }()
  }, {
    key: 'fetchMovieImgs',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(predictedRatings) {
        var movieIds, response;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                // Get unique movie ids
                movieIds = predictedRatings.map(function (x) {
                  return x.movieId;
                });

                movieIds = [].concat(_toConsumableArray(new Set(movieIds)));

                _context2.next = 4;
                return fetch('/api/movie_imgs', {
                  method: "POST",
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ movieIds: movieIds })
                }).then(function (res) {
                  if (!res.ok) {
                    var message = 'An error has occured: ' + response.status;
                    throw new Error(message);
                  }
                  console.log("status: ", res.status);
                  return res.json();
                }).catch(function (error) {
                  console.log("Fetch movie images error: ", error);
                  return null;
                });

              case 4:
                response = _context2.sent;
                return _context2.abrupt('return', response);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchMovieImgs(_x3) {
        return _ref2.apply(this, arguments);
      }

      return fetchMovieImgs;
    }()

    // When a movie is selected

  }, {
    key: 'handleMovieUpdate',
    value: function handleMovieUpdate(id, movie) {
      var updatedRatings = this.state.movie_ratings;
      updatedRatings[id].movieId = movie;

      var numRatings = Object.keys(updatedRatings).length;
      // If all of the movie ratings are filled in, add another rating options
      if (Object.keys(updatedRatings).filter(function (x) {
        return updatedRatings[x].rating !== null && updatedRatings[x].rating !== "not seen" && updatedRatings[x].movieId !== null;
      }).length === numRatings) {
        updatedRatings[numRatings] = { movieId: null, rating: null };
      }

      this.setState({ movie_ratings: updatedRatings });
    }

    // When a rating is selected

  }, {
    key: 'handleRatingUpdate',
    value: function handleRatingUpdate(id, rating) {
      var updatedRatings = this.state.movie_ratings;
      updatedRatings[id].rating = rating;

      var numRatings = Object.keys(updatedRatings).length;
      // If all of the movie ratings are filled in, add another rating options
      if (Object.keys(updatedRatings).filter(function (x) {
        return updatedRatings[x].rating !== null && updatedRatings[x].rating !== "not seen" && updatedRatings[x].movieId !== null;
      }).length === numRatings) {
        updatedRatings[numRatings] = { movieId: null, rating: null };
      }

      this.setState({ movie_ratings: updatedRatings });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _this7 = this;

      this.setState({ submissionError: false, loadingPredictions: true });

      this.fetchMoviePredictions().then(function (predictions) {
        if (predictions !== null) {

          // Assign an empty poster_path to all of the predictions
          predictions.map(function (x) {
            x.poster_path = null;
          });

          _this7.fetchMovieImgs(predictions).then(function (predictionsImages) {
            if (predictionsImages !== null) {
              // Create look up by movie id and poster path
              var predictionsImagesObj = {};
              predictionsImages.map(function (x) {
                predictionsImagesObj[x.movieId] = x.poster_path;
              });

              // Assign a poster_path to each movie by id
              predictions.map(function (x) {
                if (predictionsImagesObj.hasOwnProperty(x.movieId)) {
                  x.poster_path = predictionsImagesObj[x.movieId];
                }
              });
            }

            // Whether we have the images or not we still want to update the predicted ratings
            _this7.setState({ submissionError: false, loadingPredictions: false, predictedRatings: predictions });
          }).catch(function (error) {
            console.log(error);
            // If something goes wrong fetching the images we should still update the predicted ratings
            _this7.setState({ submissionError: false, loadingPredictions: false, predictedRatings: predictions });
          });
        } else {
          // If we weren't about to fetch predictions should show an error
          _this7.setState({ submissionError: true, loadingPredictions: false });
        }
      }).catch(function (error) {
        // If something went wrong fetching the predictions we should show an error
        _this7.setState({ submissionError: true, loadingPredictions: false });
      });
    }
  }, {
    key: 'handleNumNeighborsUpdate',
    value: function handleNumNeighborsUpdate(event) {
      this.setState({ num_neighbors: event.target.value });
    }
  }, {
    key: 'handleMinSupportUpdate',
    value: function handleMinSupportUpdate(event) {
      this.setState({ min_support: event.target.value });
    }
  }, {
    key: 'handleEngineUpdate',
    value: function handleEngineUpdate(event) {
      this.setState({ engine: event.target.value });
    }
  }, {
    key: 'handleNumFactorsUpdate',
    value: function handleNumFactorsUpdate(event) {
      this.setState({ n_factors: event.target.value });
    }
  }, {
    key: 'handleNumEpochsUpdate',
    value: function handleNumEpochsUpdate(event) {
      this.setState({ n_epochs: event.target.value });
    }
  }, {
    key: 'handlePopularityBoostUpdate',
    value: function handlePopularityBoostUpdate(event) {
      this.setState({ popularity_boost: event.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var movie_ratings = this.state.movie_ratings;

      return React.createElement(
        'div',
        { className: 'App' },
        React.createElement(
          'h2',
          null,
          'Rate some movies to get started!'
        ),
        React.createElement(
          'div',
          { className: 'movie-ratings' },
          Object.keys(movie_ratings).map(function (key, i) {
            return React.createElement(MovieRating, { id: key, movieId: movie_ratings.movieId, rating: movie_ratings.rating, movies: _this8.state.movies,
              genres: _this8.state.genres,
              handleMovieUpdate: _this8.handleMovieUpdate,
              handleRatingUpdate: _this8.handleRatingUpdate });
          })
        ),
        React.createElement(
          'form',
          { className: 'prediction-form' },
          React.createElement(
            'div',
            { className: 'prediction-options' },
            React.createElement(
              'div',
              { className: 'engines-option' },
              React.createElement(
                'label',
                { 'for': 'engines-selector' },
                'Recommendation engine: '
              ),
              React.createElement(
                'select',
                { name: 'engines-selector', id: 'engines-selector',
                  className: 'engines selector',
                  onChange: this.handleEngineUpdate },
                React.createElement(
                  'option',
                  { value: 'svd' },
                  'SVD'
                ),
                React.createElement(
                  'option',
                  { value: 'knn' },
                  'User Based KNN'
                )
              )
            ),
            this.state.engine === 'knn' && React.createElement(
              'div',
              { className: 'num-neighbors-option' },
              React.createElement(
                'label',
                { 'for': 'num-neighbors' },
                'Number of neighbors (1-100): '
              ),
              React.createElement('input', { type: 'number', id: 'num-neighbors-input', name: 'num-neighbors',
                min: '1', max: '100', defaultValue: this.state.num_neighbors, step: '1',
                className: 'num-neighbors selector',
                onChange: this.handleNumNeighborsUpdate
              })
            ),
            this.state.engine === 'knn' && React.createElement(
              'div',
              { className: 'min-support-option' },
              React.createElement(
                'label',
                { 'for': 'min-support' },
                'Minimum support (1-10): '
              ),
              React.createElement('input', { type: 'number', id: 'num-neighbors-input', name: 'min-support',
                className: 'min-support selector',
                min: '1', max: '10', defaultValue: this.state.min_support, step: '1',
                onChange: this.handleMinSupportUpdate
              })
            ),
            this.state.engine === 'svd' && React.createElement(
              'div',
              { className: 'num-factors-option' },
              React.createElement(
                'label',
                { 'for': 'num-factors' },
                'Number of factors (1-200): '
              ),
              React.createElement('input', { type: 'number', id: 'num-factors-input', name: 'num-factors',
                min: '1', max: '200', defaultValue: this.state.n_factors, step: '1',
                className: 'num-factors selector',
                onChange: this.handleNumFactorsUpdate
              })
            ),
            this.state.engine === 'svd' && React.createElement(
              'div',
              { className: 'num-epochs-option' },
              React.createElement(
                'label',
                { 'for': 'num-epochs' },
                'Number of epochs (1-100): '
              ),
              React.createElement('input', { type: 'number', id: 'num-epochs-input', name: 'num-epochs',
                min: '1', max: '100', defaultValue: this.state.n_epochs, step: '1',
                className: 'num-epochs selector',
                onChange: this.handleNumEpochsUpdate
              })
            ),
            React.createElement(
              'div',
              { className: 'popularity-boost-option' },
              React.createElement(
                'label',
                { 'for': 'num-epochs' },
                'Popularity Boost (1-100): '
              ),
              React.createElement('input', { type: 'number', id: 'popularity-boost-input', name: 'popularity-boost',
                min: '0', max: '100', defaultValue: this.state.popularity_boost, step: '1',
                className: 'popularity-boost selector',
                onChange: this.handlePopularityBoostUpdate
              })
            )
          ),
          React.createElement(
            'button',
            { className: 'submit', type: 'button', onClick: this.handleSubmit },
            'Submit'
          )
        ),
        React.createElement(
          'h2',
          null,
          'Your recommended movies are:'
        ),
        React.createElement(PredictedRatingsDisplay, { predictedRatings: this.state.predictedRatings,
          genres: this.state.genres,
          loadingPredictions: this.state.loadingPredictions,
          submissionError: this.state.submissionError
        })
      );
    }
  }]);

  return App;
}(React.Component);

export default App;