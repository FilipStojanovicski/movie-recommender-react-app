import logo from './logo.svg';
import './App.css';
import React from 'react';
import Select from 'react-select'

// Possible ratings options
const ratings = ['not seen', 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

class MovieRating extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { genreId: null }
  }

  // Handle a change in each selector
  handleChange(selector, event) {
    if (selector == "movie") {
      this.props.handleMovieUpdate(this.props.id, event.value);
    } else if (selector == "rating") {
      this.props.handleRatingUpdate(this.props.id, event.value);
    } else if (selector == "genre") {
      this.setState({ genreId: event.value });
    }
  }

  render() {
    let movies = this.props.movies;
    let genreId = this.state.genreId;
    let genres = this.props.genres;
    let genre_name;

    // If we have a specified genre, then filter by that genre only
    if (genreId !== null) {

      // Get the genre name
      genre_name = this.props.genres.filter((x) => x.genreId === genreId);
      if (genre_name.length > 0) {
        genre_name = genre_name[0].genre_name;
      }
    } else {
      genre_name = "All"
    }

    if (genre_name !== "All") {
      movies = movies.filter((x) => {
        return x.genres.split("|").includes(genre_name);
      })
    }

    let moviesPlaceholder = (movies && movies.length > 0) ?
      "Type in a movie title..." : "Loading Movies..."
    let genresPlaceholder = (genres && genres.length > 0) ?
      "Genre:" : "Loading Genres..."


    return (
      <div className='movie-rating'>
        <div className='selectors'>
          <Select className="genre selector" id={this.props.name}
            placeholder={genresPlaceholder}
            onChange={event => this.handleChange("genre", event)}
            options={genres.map((genre) => {
              return { value: genre.genreId, label: genre.genre_name }
            }
            )}
          />
          <Select className="movie selector" id={this.props.name}
            placeholder={moviesPlaceholder}
            onChange={event => this.handleChange("movie", event)}
            options={movies.map((movie) => {
              return { value: movie.movieId, label: movie.title }
            }
            )}
          />
          <Select className="rating selector" id={this.props.name}
            placeholder="Rating:"
            onChange={event => this.handleChange("rating", event)}
            options={ratings.map((rating, i) => {
              return { value: rating, label: rating }
            }
            )}
          />
        </div>
      </div>)
  }
}

class PredictedRatingsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { genreId: null }
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.filterRatingsByGenre = this.filterRatingsByGenre.bind(this);
  }

  handleGenreChange(event) {
    this.setState({ genreId: parseInt(event.value) });
  }


  filterRatingsByGenre() {
    let filteredRatings = this.props.predictedRatings;
    let genre_name;
    let genreId = this.state.genreId;

    // If we have a specified genre, then filter by that genre only
    if (genreId !== null) {
      // Try to get the genre name from the id
      genre_name = this.props.genres.filter((x) => x.genreId === genreId);

      if (genre_name.length > 0) {
        genre_name = genre_name[0].genre_name;
      }
    } else {
      genre_name = "All"
    }

    if (genre_name !== "All") {
      filteredRatings = filteredRatings.filter((x) => {
        return x.genreId === genreId
      })
    }
    // If we aren't filtering by genre we need to remove duplicate movies
    else {
      let ratingsDeDuped = []
      for (let i = 0; i < filteredRatings.length; i++) {
        let currentRating = filteredRatings[i];
        // If the current rating already exists in the de duplicated ratings don't add it
        if ((ratingsDeDuped.filter((x) => x.movieId === currentRating.movieId)).length === 0) {
          ratingsDeDuped.push(currentRating);
        }
      }
      filteredRatings = ratingsDeDuped;
    }

    return filteredRatings;
  }

  render() {

    let genresPlaceholder = (this.props.genres && this.props.genres.length > 0) ?
      "Genre:" : "Loading Genres...";

    let ratingsToDisplay = this.filterRatingsByGenre();
    ratingsToDisplay = ratingsToDisplay.slice(0, 20);

    // Different scenarios for which ratings display object we want to show
    let ratingsDisplayObject;

    // If there is a submission error display an error message
    if (this.props.submissionError == true && this.props.loadingPredictions == false) {
      ratingsDisplayObject =
          <div className="predicted-ratings-error">
            <h3>Unable to fetch recommendations: please try rating more movies</h3>
          </div>
    }
    // If predictions are loading display loader
    else if (this.props.loadingPredictions == true) {
      ratingsDisplayObject = <div className="loader"></div>;
    }
    // If results successfully loaded without error display the results
    else if (this.props.submissionError == false && this.props.loadingPredictions == false) {
      ratingsDisplayObject =
          <div className="ratings-results">
            {ratingsToDisplay.map((rating, i) => {
              return <div className="rating">
                <div className="movie-img-title">
                  <div className="movie-title" key={i}>{rating.title}</div>
                  <div className="movie-img">
                    <img src={"https://image.tmdb.org/t/p/w500/" + rating.poster_path}></img></div>
                </div>
                <div className="movie-score">Score: {rating.adjusted_rating}</div>
              </div>
            }
            )}
          </div>
    }

    return (
      <div className="predicted-ratings">
        <Select className="genre selector" id={this.props.name}
          placeholder={genresPlaceholder}
          onChange={this.handleGenreChange}
          options={this.props.genres.map((genre) => {
            return { value: genre.genreId, label: genre.genre_name }
          }
          )}
        />
        <div className="ratings-results-container">
        {ratingsDisplayObject}
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMovieUpdate = this.handleMovieUpdate.bind(this);
    this.handleRatingUpdate = this.handleRatingUpdate.bind(this);
    this.fetchMoviesRequest = this.fetchMoviesRequest.bind(this);
    this.fetchGenresRequest = this.fetchGenresRequest.bind(this);
    this.handleNumNeighborsUpdate = this.handleNumNeighborsUpdate.bind(this);
    this.handleEngineUpdate = this.handleEngineUpdate.bind(this);
    this.handleMinSupportUpdate = this.handleMinSupportUpdate.bind(this);
    this.handleNumFactorsUpdate = this.handleNumFactorsUpdate.bind(this);
    this.handleNumEpochsUpdate = this.handleNumEpochsUpdate.bind(this);
    this.handlePopularityBoostUpdate = this.handlePopularityBoostUpdate.bind(this);
    this.fetchMoviePredictions = this.fetchMoviePredictions.bind(this);
    this.fetchMovieImgs = this.fetchMovieImgs.bind(this)

    let initial_ratings = {}
    for (let i = 0; i < 10; i++) {
      initial_ratings[i] = { movieId: null, rating: null };
    }
    this.state = {
      movies: [], genres: [], movie_ratings: initial_ratings, predictedRatings: [],
      loadingPredictions: false, num_neighbors: 40, min_support: 3, engine: 'svd',
      submissionError: false, n_factors: 100, n_epochs: 20, popularity_boost: 10
    };
  }

  // Function to fetch the movies data from the database via the server
  fetchMoviesRequest(genre = null, limit = null) {
    let movies_url = "/api/movies?"
    // Optional genre and limit query parameters
    if (genre !== null & genre !== 'null') {
      movies_url += `genre=${encodeURIComponent(genre)}`
    }
    if (limit !== null & limit !== 'null') {
      movies_url += `&limit=${encodeURIComponent(limit)}`
    }
    fetch(movies_url, { method: "GET" })
      .then(res => res.json()).then(
        res => {
          this.setState({ movies: res })
        }
      ).catch(
        (error) => {
          console.log("Fetch movies request error:", error);
        }
      );
  }

  // Function to fetch the genres data from the database via the server
  fetchGenresRequest() {
    fetch(`/api/genres?`, { method: "GET" })
      .then(res => res.json()).then(
        res => {
          // Add one more genre for All genres
          let lastGenreId = res.reduce(function (prev, current) {
            return (prev.genreId > current.genreId) ? prev.genreId : current.genreId
          })
          res.unshift({ genreId: lastGenreId + 1, genre_name: "All" })

          this.setState({ genres: res })
        }
      ).catch(
        (error) => {
          console.log("Fetch genres request error:", error);
        }
      );
  }

  componentWillMount() {
    this.fetchGenresRequest();
    // Fetch 1000 movies to display while we wait for all movies to load for a better user experience
    this.fetchMoviesRequest(null, 1000);
  }

  componentDidMount() {
    // Fetch all movies
    this.fetchMoviesRequest();
  }

  // Function to get movie predictions from the recommendation system
  async fetchMoviePredictions() {

    // Get all rated movies
    let ratings_list = Object.values(this.state.movie_ratings);
    ratings_list = ratings_list.filter((x) => {
      return (x.rating && x.rating !== "not seen" && x.movieId)
    })

    // Remove duplicates
    ratings_list = ratings_list.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.movieId === value.movieId)))

    let numRatings = ratings_list.length;
    let engine = this.state.engine;

    // If there are no rated movies return null
    if (numRatings === 0) {
      return null;
    }

    let body = {
      ratings: ratings_list
    }

    if (engine === 'svd') {
      body.model_params = {
        n_factors: parseInt(this.state.n_factors),
        n_epochs: parseInt(this.state.n_epochs),
        popularity_boost: parseInt(this.state.popularity_boost)
      }
    } else if (engine === 'knn') {
      body.model_params = {
        min_support: parseInt(this.state.min_support),
        num_neighbors: parseInt(this.state.num_neighbors),
        popularity_boost: parseInt(this.state.popularity_boost)
      }
    }

    const response = await fetch(`/movie_recommendation/${this.state.engine}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }
        return res.json()
      }
      ).then(
        res => {
          if (res.status == 200) {
            // Round the adjusted rating
            res.data.map((x) => {
              x.adjusted_rating = Math.round(x.adjusted_rating * 100) / 100;
            });
            return res.data;
          } else if (res.status == 400 || res.status == 500) {
            return null;
          }
        }).catch(
          (error) => {
            console.log("Fetch movie recommendations error: ", error);
            return null;
          }
        );

    return response;
  }

  async fetchMovieImgs(predictedRatings) {

    // Get unique movie ids
    let movieIds = predictedRatings.map(x => x.movieId);
    movieIds = [...new Set(movieIds)];


    const response = await fetch(`/api/movie_imgs`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieIds: movieIds })
    })
      .then(res => {
        if (!res.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }
        console.log("status: ", res.status);
        return res.json()
      }).catch(
        (error) => {
          console.log("Fetch movie images error: ", error);
          return null;
        }
      );

    return response;
  }

  // When a movie is selected
  handleMovieUpdate(id, movie) {
    let updatedRatings = this.state.movie_ratings;
    updatedRatings[id].movieId = movie

    let numRatings = Object.keys(updatedRatings).length;
    // If all of the movie ratings are filled in, add another rating options
    if (
      Object.keys(updatedRatings).filter((x) => {
        return (updatedRatings[x].rating !== null && updatedRatings[x].rating !== "not seen")
          && (updatedRatings[x].movieId !== null)
      }).length === numRatings) {
      updatedRatings[numRatings] = { movieId: null, rating: null };
    }

    this.setState({ movie_ratings: updatedRatings });
  }

  // When a rating is selected
  handleRatingUpdate(id, rating) {
    let updatedRatings = this.state.movie_ratings;
    updatedRatings[id].rating = rating

    let numRatings = Object.keys(updatedRatings).length;
    // If all of the movie ratings are filled in, add another rating options
    if (
      Object.keys(updatedRatings).filter((x) => {
        return (updatedRatings[x].rating !== null && updatedRatings[x].rating !== "not seen")
          && (updatedRatings[x].movieId !== null)
      }).length === numRatings) {
      updatedRatings[numRatings] = { movieId: null, rating: null };
    }

    this.setState({ movie_ratings: updatedRatings });
  }

  handleSubmit() {

    this.setState({ submissionError: false, loadingPredictions: true })

    this.fetchMoviePredictions().then((predictions) => {
      if (predictions !== null) {

        // Assign an empty poster_path to all of the predictions
        predictions.map((x) => { x.poster_path = null })

        this.fetchMovieImgs(predictions).then((predictionsImages) => {
          if (predictionsImages !== null) {
            // Create look up by movie id and poster path
            let predictionsImagesObj = {}
            predictionsImages.map((x) => {
              predictionsImagesObj[x.movieId] = x.poster_path
            })

            // Assign a poster_path to each movie by id
            predictions.map((x) => {
              if (predictionsImagesObj.hasOwnProperty(x.movieId)) {
                x.poster_path = predictionsImagesObj[x.movieId];
              }
            })
          }

          // Whether we have the images or not we still want to update the predicted ratings
          this.setState({ submissionError: false, loadingPredictions: false, predictedRatings: predictions })
        }).catch((error) => {
          console.log(error);
          // If something goes wrong fetching the images we should still update the predicted ratings
          this.setState({ submissionError: false, loadingPredictions: false, predictedRatings: predictions })
        }
        )
      }
      else {
        // If we weren't about to fetch predictions should show an error
        this.setState({ submissionError: true, loadingPredictions: false })
      }
    }
    )
      .catch((error) => {
        // If something went wrong fetching the predictions we should show an error
        this.setState({ submissionError: true, loadingPredictions: false })
      }
      );
  }

  handleNumNeighborsUpdate(event) {
    this.setState({ num_neighbors: event.target.value })
  }
  handleMinSupportUpdate(event) {
    this.setState({ min_support: event.target.value })
  }
  handleEngineUpdate(event) {
    this.setState({ engine: event.target.value })
  }
  handleNumFactorsUpdate(event) {
    this.setState({ n_factors: event.target.value })
  }
  handleNumEpochsUpdate(event) {
    this.setState({ n_epochs: event.target.value })
  }
  handlePopularityBoostUpdate(event) {
    this.setState({ popularity_boost: event.target.value })
  }

  render() {

    let movie_ratings = this.state.movie_ratings;
    
    return (
      <div className="App">
        <h2>Rate some movies to get started!</h2>
        <div className='movie-ratings'>
          {Object.keys(movie_ratings).map((key, i) => {
            return <MovieRating id={key} movieId={movie_ratings.movieId} rating={movie_ratings.rating} movies={this.state.movies}
              genres={this.state.genres}
              handleMovieUpdate={this.handleMovieUpdate}
              handleRatingUpdate={this.handleRatingUpdate} />
          })}
        </div>
        <form className='prediction-form'>
          <div className='prediction-options'>
            <div className='engines-option'>
              <label for="engines-selector">Recommendation engine: </label>
              <select name="engines-selector" id="engines-selector"
                className="engines selector"
                onChange={this.handleEngineUpdate}>
                <option value="svd">SVD</option>
                <option value="knn">User Based KNN</option>
              </select>
            </div>
            {this.state.engine === 'knn' &&
              <div className='num-neighbors-option'>
                <label for="num-neighbors">Number of neighbors (1-100): </label>
                <input type="number" id="num-neighbors-input" name="num-neighbors"
                  min="1" max="100" defaultValue={this.state.num_neighbors} step='1'
                  className="num-neighbors selector"
                  onChange={this.handleNumNeighborsUpdate}
                />
              </div>}
            {this.state.engine === 'knn' &&
              <div className='min-support-option'>
                <label for="min-support">Minimum support (1-10): </label>
                <input type="number" id="num-neighbors-input" name="min-support"
                  className="min-support selector"
                  min="1" max="10" defaultValue={this.state.min_support} step='1'
                  onChange={this.handleMinSupportUpdate}
                />
              </div>}
            {this.state.engine === 'svd' &&
              <div className='num-factors-option'>
                <label for="num-factors">Number of factors (1-200): </label>
                <input type="number" id="num-factors-input" name="num-factors"
                  min="1" max="200" defaultValue={this.state.n_factors} step='1'
                  className="num-factors selector"
                  onChange={this.handleNumFactorsUpdate}
                />
              </div>}
            {this.state.engine === 'svd' &&
              <div className='num-epochs-option'>
                <label for="num-epochs">Number of epochs (1-100): </label>
                <input type="number" id="num-epochs-input" name="num-epochs"
                  min="1" max="100" defaultValue={this.state.n_epochs} step='1'
                  className="num-epochs selector"
                  onChange={this.handleNumEpochsUpdate}
                />
              </div>}
            <div className='popularity-boost-option'>
              <label for="num-epochs">Popularity Boost (1-100): </label>
              <input type="number" id="popularity-boost-input" name="popularity-boost"
                min="0" max="100" defaultValue={this.state.popularity_boost} step='1'
                className="popularity-boost selector"
                onChange={this.handlePopularityBoostUpdate}
              />
            </div>
          </div>
          <button className='submit' type="button" onClick={this.handleSubmit}>Submit</button>
        </form>
        <h2>Your recommended movies are:</h2>
        <PredictedRatingsDisplay predictedRatings={this.state.predictedRatings}
          genres={this.state.genres}
          loadingPredictions={this.state.loadingPredictions}
          submissionError={this.state.submissionError}
        />
      </div>
    );
  }
}

export default App;
