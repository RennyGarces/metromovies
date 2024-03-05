import { useState, useEffect } from "react";
import { KEY, URL } from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faSquareShareNodes,
  faHeartPulse,
  faGlasses,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import NotImage from "../images/NotImage.webp";
export function SummaryMovies({
  idSelected,
  onHover,
  onMovieClicked,
  movieSelected,
  onMoviesSelected,
}) {
  const [errorMovie, setErrorMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (movieSelected.some((movie) => movie.imdbID === idSelected)) {
      return;
    }
    async function fechdataArray() {
      try {
        setErrorMovie(null);
        setLoading(true);
        const resp = await fetch(`${URL}${KEY}&t=${idSelected}`);
        if (!resp.ok) {
          throw new Error("error with the server");
        }
        const data = await resp.json();

        if (!data.Response || data.Response === "False")
          throw new Error("Issues with the server");
        const movieData = {
          actors: data.Actors,
          awards: data.Awards,
          boxoffice: data.BoxOffice,
          country: data.Country,
          director: data.Director,
          genre: data.Genre,
          language: data.Language,
          metascore: data.Metascore,
          plot: data.Plot,
          poster: data.Poster,
          production: data.Production,
          rated: data.Rated,
          ratings: data.Ratings,
          released: data.Released,
          runtime: data.Runtime,
          title: data.Title,
          type: data.Type,
          website: data.Website,
          writer: data.Writer,
          year: data.Year,
          imdbID: data.imdbID,
          imdbrating: data.imdbRating,
          imdbvotes: data.imdbVotes,
          yourRating: 0,
        };
        onMoviesSelected((movie) => {
          if (movie.some((m) => m.imdbID === movieData.imdbID)) {
            return movie;
          } else {
            return [...movie, movieData];
          }
        });
      } catch (error) {
        setErrorMovie(error.message);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (idSelected === "") return;
    fechdataArray();
  }, [idSelected]);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMovie(null), 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [errorMovie]);

  return (
    <>
      {movieSelected.length > 0 && (
        <div className="sumary-movie-selected">
          <div>
            <h2>FILMS YOU SELECTED</h2>
            <FontAwesomeIcon icon={faGlasses} style={{ color: "red" }} />
            <p className="your-rating">{movieSelected.length} movies</p>
          </div>
        </div>
      )}
      {errorMovie && (
        <div className="error-iformation-movie">
          At this moment we don't get this movie information, but we are working
          on this, please try again later.
        </div>
      )}

      <ListMoviesSelected
        movieSelected={movieSelected}
        onHover={onHover}
        onMovieClicked={onMovieClicked}
      />
    </>
  );
}

function ListMoviesSelected({ movieSelected, onHover, onMovieClicked }) {
  const [movieClicked, setMovieClicked] = useState(null);

  useEffect(() => {
    if (!movieClicked) return;
    document.title = `${movieClicked}`;

    return function () {
      document.title = "MetroMovies";
    };
  }, [movieClicked]);

  function handleHover(movie) {
    onHover((bol) => !bol);
    onMovieClicked(movie);
    setMovieClicked(movie.title);
  }
  return (
    <>
      <ul className="list">
        {movieSelected.map((movie, i) => (
          <li
            className="list-elements"
            movie={movie}
            key={movie.imdbID}
            onClick={() => handleHover(movie)}
          >
            <div>
              <img
                src={movie.poster === "N/A" ? NotImage : movie.poster}
                alt={`${movie.title} poster`}
              />
              <div className="share-movies">
                <p className="your-rating">share</p>
                <FontAwesomeIcon
                  icon={faSquareShareNodes}
                  className="your-rating"
                />
                <div className="share-icons">
                  <div>
                    <a
                      href={`mailto:?subject=Check out this movie&body=${encodeURIComponent(
                        "Here is the link to the movie :): " +
                          `https://www.imdb.com/title/${movie.imdbID}/`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </div>
                  <div>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        "Check out this movie I go from : " +
                          `https://www.imdb.com/title/${movie.imdbID}/`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} />
                    </a>
                  </div>
                  <div>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `https://www.imdb.com/title/${movie.imdbID}/`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>
                  </div>
                  <div>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        `https://www.imdb.com/title/${movie.imdbID}/`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3>{movie.title}</h3>
              <p>{movie.genre}</p>
              <FontAwesomeIcon icon={faFilm} />
              <p> {movie.year !== "N/A" ? movie.year : ""}</p>
              <p>{movie.rated !== "N/A" ? movie.rated : ""}</p>
              <p>
                {movie?.ratings.length > 0
                  ? movie?.ratings.find((el) => {
                      return el;
                    })?.Value
                  : "No rated"}
              </p>
              <div className="your-rating">
                {movie?.yourRating > 0 ? (
                  <FontAwesomeIcon icon={faHeartPulse} />
                ) : (
                  ""
                )}
                <span>
                  {movie?.yourRating > 0
                    ? `Your rating ${movie.yourRating}`
                    : ""}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
