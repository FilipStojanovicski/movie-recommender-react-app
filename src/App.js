import logo from './logo.svg';
import './App.css';
import React from 'react';
import Select from 'react-select'


const ratings = ['not seen', 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];

class MovieRating extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { genreId: null }
  }

  handleChange(selector, event) {
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

    console.log("FILTER RATINGS BY GENRE");
    console.log(this.state);
    // If we have a specified genre, then filter by that genre only
    if (genreId !== null) {
      console.log("We have a genre Id");
      // Get the genre name
      genre_name = this.props.genres.filter((x) => x.genreId === genreId);
      console.log("GENRE NAME");
      console.log(genre_name);
      if (genre_name.length > 0) {
        console.log("No matches found");
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
    // Otherwise we remove duplicate movies
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
    console.log(this.state);

    let genresPlaceholder = (this.props.genres && this.props.genres.length > 0) ?
      "Genre:" : "Loading Genres...";

    let ratingsToDisplay = this.filterRatingsByGenre();
    ratingsToDisplay = ratingsToDisplay.slice(0, 20);

    let ratingsDisplayObject;

    // If there is a submission error display error
    if (this.props.submissionError == true && this.props.loadingPredictions == false){
      ratingsDisplayObject = <div className="predicted-ratings-error">
        <h3>Unable to fetch recommendations: please try rating more movies</h3>
      </div>
    } 
    // If predictions are loading display loader
    else if (this.props.loadingPredictions == true) {
      ratingsDisplayObject = <div className="loader"></div>;
    } 
    // If results successfully loaded without error display results
    else if (this.props.submissionError == false && this.props.loadingPredictions == false){
      ratingsDisplayObject = <div className="ratings-results">
        {ratingsToDisplay.map((rating, i) => {
          return <div className="rating">
            <div className="title" key={i}>{rating.title}</div><div className="movie-img">{rating.adjusted_rating}</div>
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

    let initial_ratings = {}
    for (let i = 0; i < 10; i++) {
      initial_ratings[i] = { movieId: null, rating: null };
    }
    this.state = {
      movies: [], genres: [], movie_ratings: initial_ratings, predictedRatings: [],
      loadingPredictions: false, num_neighbors: 40, min_support: 3, engine: 0,
      submissionError: false
    };
  }

  fetchMoviesRequest(genre = null, limit = null) {
    let movies_url = "/api/movies?"
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
      );
  }

  fetchGenresRequest() {
    fetch(`/api/genres?`, { method: "GET" })
      .then(res => res.json()).then(
        res => {
          // Add one more genre for all genres
          let lastGenreId = res.reduce(function (prev, current) {
            return (prev.genreId > current.genreId) ? prev.genreId : current.genreId
          })
          res.unshift({ genreId: lastGenreId + 1, genre_name: "All" })
          this.setState({ genres: res })
        }
      );
  }

  componentWillMount() {
    this.fetchGenresRequest();
    this.fetchMoviesRequest(null, 1000);
  }

  componentDidMount() {
    this.fetchMoviesRequest();
  }


  handleMovieUpdate(id, movie) {
    let updatedRatings = this.state.movie_ratings;
    updatedRatings[id].movieId = movie

    let numRatings = Object.keys(updatedRatings).length;
    // If all of the movie ratings are full, add another rating options
    if (
      Object.keys(updatedRatings).filter((x) => {
        return (updatedRatings[x].rating && updatedRatings[x].rating !== "not seen")
          && (updatedRatings[x].movieId)
      }).length === numRatings) {
      updatedRatings[numRatings] = { movieId: null, rating: null };
    }

    this.setState({ movie_ratings: updatedRatings });
  }

  handleRatingUpdate(id, rating) {
    let updatedRatings = this.state.movie_ratings;
    updatedRatings[id].rating = rating

    let numRatings = Object.keys(updatedRatings).length;
    // If all of the movie ratings are full, add another rating options
    if (
      Object.keys(updatedRatings).filter((x) => {
        return (updatedRatings[x].rating && updatedRatings[x].rating !== "not seen")
          && (updatedRatings[x].movieId)
      }).length === numRatings) {
      updatedRatings[numRatings] = { movieId: null, rating: null };
    }

    this.setState({ movie_ratings: updatedRatings });
  }

  handleSubmit() {

    console.log('submit');

    let ratings_list = Object.values(this.state.movie_ratings);
    ratings_list = ratings_list.filter((x) => {
      return (x.rating && x.rating !== "not seen" && x.movieId)
    })

    let numRatings = ratings_list.length;
    let engine = this.state.engine;
    let min_support = parseInt(this.state.min_support);
    let num_neighbors = parseInt(this.state.num_neighbors);

    if (numRatings === 0){
      this.setState({submissionError: true})
      console.log("Not enough movies");
      return;
    }

    let body =
    {
      ratings: ratings_list,
      engine: engine,
      min_support: min_support,
      num_neighbors: num_neighbors
    }

    console.log(body);

    this.setState({ submissionError: false, loadingPredictions: true})

    fetch(`/movie_recommendation/svd`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        return res.json()
      }
      ).then(
        res => {
          console.log(res);
          if (res.status == 200) {
            this.setState({ predictedRatings: res.data, loadingPredictions: false })
          } else if (res.status == 400){
            this.setState({submissionError: true, loadingPredictions: false })
          } else if (res.status == 500){
            this.setState({submissionError: true, loadingPredictions: false })
          }
          
        }
      ).catch(
        (error) => {
          console.log(error);
          this.setState({submissionError: true, loadingPredictions: false })

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

  render() {
    console.log("app state");
    console.log(this.state);
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
                onChange={this.handleEngineUpdate}
              >
                <option defaultValue="0">User Based KNN</option>
              </select>
            </div>

            <div className='num-neighbors-option'>
              <label for="num-neighbors">Number of neighbors (1-100): </label>
              <input type="number" id="num-neighbors-input" name="num-neighbors"
                min="1" max="100" defaultValue='40' step='1'
                className="num-neighbors selector"
                onChange={this.handleNumNeighborsUpdate}
              />
            </div>

            <div className='min-support-option'>
              <label for="min-support">Minimum support (1-10): </label>
              <input type="number" id="num-neighbors-input" name="min-support"
                className="min-support selector"
                min="1" max="10" defaultValue='3' step='1'
                onChange={this.handleMinSupportUpdate}
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
