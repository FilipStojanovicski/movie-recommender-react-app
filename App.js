var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import logo from './logo.svg';
import './App.css';
import React from 'react';
import Select from 'react-select';

var ratings = ['not seen', 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];

var MovieRating = function (_React$Component) {
  _inherits(MovieRating, _React$Component);

  function MovieRating(props) {
    _classCallCheck(this, MovieRating);

    var _this = _possibleConstructorReturn(this, (MovieRating.__proto__ || Object.getPrototypeOf(MovieRating)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.state = { genreId: null };
    return _this;
  }

  _createClass(MovieRating, [{
    key: 'handleChange',
    value: function handleChange(selector, event) {
      if (selector == "movie") {
        this.props.handleMovieUpdate(this.props.id, event.value);
      } else if (selector == "rating") {
        this.props.handleRatingUpdate(this.props.id, event.value);
      } else if (selector == "genre") {
        console.log('genre change');
        console.log(event.value);
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

      console.log("FILTER RATINGS BY GENRE");
      console.log(this.state);
      // If we have a specified genre, then filter by that genre only
      if (genreId !== null) {
        console.log("We have a genre Id");
        // Get the genre name
        genre_name = this.props.genres.filter(function (x) {
          return x.genreId === genreId;
        });
        console.log("GENRE NAME");
        console.log(genre_name);
        if (genre_name.length > 0) {
          console.log("No matches found");
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
      // Otherwise we remove duplicate movies
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
      console.log(this.state);

      var genresPlaceholder = this.props.genres && this.props.genres.length > 0 ? "Genre:" : "Loading Genres...";

      var ratingsToDisplay = this.filterRatingsByGenre();
      ratingsToDisplay = ratingsToDisplay.slice(0, 20);

      var ratingsDisplayObject = void 0;

      // If there is a submission error display error
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
        // If results successfully loaded without error display results
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
                    { className: 'title', key: i },
                    rating.title
                  ),
                  React.createElement(
                    'div',
                    { className: 'movie-img' },
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

    var initial_ratings = {};
    for (var i = 0; i < 10; i++) {
      initial_ratings[i] = { movieId: null, rating: null };
    }
    _this4.state = {
      movies: [], genres: [], movie_ratings: initial_ratings, predictedRatings: [],
      loadingPredictions: false, num_neighbors: 40, min_support: 3, engine: 0,
      submissionError: false
    };
    return _this4;
  }

  _createClass(App, [{
    key: 'fetchMoviesRequest',
    value: function fetchMoviesRequest() {
      var _this5 = this;

      var genre = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var movies_url = "/api/movies?";
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
      });
    }
  }, {
    key: 'fetchGenresRequest',
    value: function fetchGenresRequest() {
      var _this6 = this;

      fetch('/api/genres?', { method: "GET" }).then(function (res) {
        return res.json();
      }).then(function (res) {
        // Add one more genre for all genres
        var lastGenreId = res.reduce(function (prev, current) {
          return prev.genreId > current.genreId ? prev.genreId : current.genreId;
        });
        res.unshift({ genreId: lastGenreId + 1, genre_name: "All" });
        _this6.setState({ genres: res });
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.fetchGenresRequest();
      this.fetchMoviesRequest(null, 1000);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchMoviesRequest();
    }
  }, {
    key: 'handleMovieUpdate',
    value: function handleMovieUpdate(id, movie) {
      var updatedRatings = this.state.movie_ratings;
      updatedRatings[id].movieId = movie;

      var numRatings = Object.keys(updatedRatings).length;
      // If all of the movie ratings are full, add another rating options
      if (Object.keys(updatedRatings).filter(function (x) {
        return updatedRatings[x].rating && updatedRatings[x].rating !== "not seen" && updatedRatings[x].movieId;
      }).length === numRatings) {
        updatedRatings[numRatings] = { movieId: null, rating: null };
      }

      this.setState({ movie_ratings: updatedRatings });
    }
  }, {
    key: 'handleRatingUpdate',
    value: function handleRatingUpdate(id, rating) {
      var updatedRatings = this.state.movie_ratings;
      updatedRatings[id].rating = rating;

      var numRatings = Object.keys(updatedRatings).length;
      // If all of the movie ratings are full, add another rating options
      if (Object.keys(updatedRatings).filter(function (x) {
        return updatedRatings[x].rating && updatedRatings[x].rating !== "not seen" && updatedRatings[x].movieId;
      }).length === numRatings) {
        updatedRatings[numRatings] = { movieId: null, rating: null };
      }

      this.setState({ movie_ratings: updatedRatings });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _this7 = this;

      console.log('submit');

      var ratings_list = Object.values(this.state.movie_ratings);
      ratings_list = ratings_list.filter(function (x) {
        return x.rating && x.rating !== "not seen" && x.movieId;
      });

      var numRatings = ratings_list.length;
      var engine = this.state.engine;
      var min_support = parseInt(this.state.min_support);
      var num_neighbors = parseInt(this.state.num_neighbors);

      if (numRatings === 0) {
        this.setState({ submissionError: true });
        console.log("Not enough movies");
        return;
      }

      var body = {
        ratings: ratings_list,
        engine: engine,
        min_support: min_support,
        num_neighbors: num_neighbors
      };

      console.log(body);

      this.setState({ submissionError: false, loadingPredictions: true });

      fetch('/movie_recommendation', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        return res.json();
      }).then(function (res) {
        console.log(res);
        if (res.status == 200) {
          _this7.setState({ predictedRatings: res.data, loadingPredictions: false });
        } else if (res.status == 400) {
          _this7.setState({ submissionError: true, loadingPredictions: false });
        } else if (res.status == 500) {
          _this7.setState({ submissionError: true, loadingPredictions: false });
        }
      }).catch(function (error) {
        console.log(error);
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
    key: 'render',
    value: function render() {
      var _this8 = this;

      console.log("app state");
      console.log(this.state);
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
                  onChange: this.handleEngineUpdate
                },
                React.createElement(
                  'option',
                  { defaultValue: '0' },
                  'User Based KNN'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'num-neighbors-option' },
              React.createElement(
                'label',
                { 'for': 'num-neighbors' },
                'Number of neighbors (1-100): '
              ),
              React.createElement('input', { type: 'number', id: 'num-neighbors-input', name: 'num-neighbors',
                min: '1', max: '100', defaultValue: '40', step: '1',
                className: 'num-neighbors selector',
                onChange: this.handleNumNeighborsUpdate
              })
            ),
            React.createElement(
              'div',
              { className: 'min-support-option' },
              React.createElement(
                'label',
                { 'for': 'min-support' },
                'Minimum support (1-10): '
              ),
              React.createElement('input', { type: 'number', id: 'num-neighbors-input', name: 'min-support',
                className: 'min-support selector',
                min: '1', max: '10', defaultValue: '3', step: '1',
                onChange: this.handleMinSupportUpdate
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