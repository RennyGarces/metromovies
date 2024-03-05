import { useEffect, useState, useRef } from "react";
import {
  faHeart,
  faFaceSmile,
  faFaceSadCry,
} from "@fortawesome/free-solid-svg-icons";
import NotImage from "../images/NotImage.webp";
import loadingImage from "../images/tenor.gif";
import errorGif from "../images/error.gif";
import Stars from "./Stars";
import { KEY_TWO } from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export function Main({ children, onHover, onMovieClicked }) {
  return (
    <main className="container m-auto row gap-5">
      <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-center  gap-4 col">
        {children}
      </div>
      <RatingThisWeek onHover={onHover} onMovieClicked={onMovieClicked} />
    </main>
  );
}

export function BoxMovies({ children, onMovies }) {
  function handleReset() {
    onMovies([]);
  }
  return (
    <div>
      <button className="btn-clear" onClick={() => handleReset()}>
        reset
      </button>
      <div className="box neon-effect box-list">{children}</div>
    </div>
  );
}

export function LoadError({ error }) {
  return (
    <div className="error ">
      <p>{error}</p>
      <img src={errorGif} alt="error gif" className="neon-effect" />
    </div>
  );
}

export function LoadingMovie() {
  return (
    <div className="loader">
      <img src={loadingImage} alt="loading..." />
    </div>
  );
}

function RatingThisWeek({ onHover, onMovieClicked }) {
  const [moviesList, setMoviesList] = useState([]);
  const [show, setShow] = useState(false);
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  function handleShow() {
    setShow((e) => !e);
  }
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovie() {
      try {
        if (moviesList.length > 0) {
          return;
        }
        const resp = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${KEY_TWO}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${year}&primary_release_month=${month}`,
          { signal: controller.signal }
        );
        if (!resp.ok) {
          throw new Error(" Problem with the server");
        }
        const data = await resp.json();
        const newMovies = data.results.map((el) => ({
          title: el.title,
          id: el.id,
          original: el.original_language,
          overview: el.overview,
          poster: `https://image.tmdb.org/t/p/w500${el.poster_path}`,
          date: el.release_date,
          listNew: true,
        }));

        setMoviesList(newMovies);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error.message);
        }
      }
    }
    fetchMovie();
    return function () {
      controller.abort();
    };
  }, []);

  function handleHover(movie) {
    onHover((bol) => !bol);
    onMovieClicked(movie);
  }

  return (
    <aside className="col-sm-12">
      <button onClick={handleShow} className="summary scroll_title">
        Click here to know the {moviesList.length} most popular movies this
        month
      </button>
      {show && (
        <div className="scroll_title-list">
          {moviesList.map((movie, i) => (
            <span
              onClick={() => handleHover(movie)}
              className="scroll_title  scroll-movie"
              key={movie.id}
            >
              <p>
                {i + 1} {movie.title}{" "}
              </p>
            </span>
          ))}
        </div>
      )}
      <div className="box neon-effect scroll_box">
        <ul className="list scroll_list">
          {moviesList.map((movie) => (
            <li
              className="list-elements  scroll_li"
              key={movie.id}
              onClick={() => handleHover(movie)}
            >
              <img
                src={movie.poster === "N/A" ? NotImage : movie.poster}
                alt={`${movie.title} poster`}
              />
              <div>
                <h2>{movie.title}</h2>
                <p>Release: {movie.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function ShowMovies({ movieClicked, onHover }) {
  const [trueBtn, setTrueBtn] = useState(true);
  const [getStartRating, setGetStartRating] = useState(0);
  useEffect(() => {
    if (!movieClicked) return;
    document.title = `${movieClicked.title}`;

    return function () {
      document.title = "MetroMovies";
    };
  }, [movieClicked]);

  function handleShow(stars) {
    setTrueBtn(false);
    movieClicked.yourRating = stars;
  }
  const ref = useRef();
  useEffect(() => {
    function handleLeave(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onHover((bol) => !bol);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        onHover(() => false);
      }
    }

    document.addEventListener("mousedown", handleLeave);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleLeave);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onHover]);

  return (
    <div
      ref={ref}
      className="show-movie neon-effect  flex-lg-row flex-md-column"
    >
      <div className="flex-fill show-movie-rating">
        <button className="btn-show" onClick={() => onHover((open) => !open)}>
          {" "}
          CLOSE
        </button>
        <img
          src={movieClicked.poster === "N/A" ? NotImage : movieClicked.poster}
          alt="poster movie"
        />
        {!movieClicked.listNew && (
          <div className="stars">
            {movieClicked.yourRating === 0 && (
              <Stars
                maxRating={10}
                color={"#ffff00"}
                fontSize={"10px"}
                height={"1rem"}
                definedRating={0}
                getStartRating={setGetStartRating}
                message={["Bad", "Regular", "Good", "Excellent"]}
                movesStars={trueBtn}
              />
            )}
            {getStartRating > 0 && trueBtn ? (
              <button
                className="btn-add"
                onClick={() => handleShow(getStartRating)}
              >
                RATE
              </button>
            ) : (
              ""
            )}
            {movieClicked.yourRating > 0 && (
              <div className="your-rating">
                {movieClicked.yourRating >= 7 && (
                  <FontAwesomeIcon icon={faHeart} />
                )}
                {movieClicked.yourRating > 4 && movieClicked.yourRating < 7 && (
                  <FontAwesomeIcon icon={faFaceSmile} />
                )}
                {movieClicked.yourRating <= 4 && (
                  <FontAwesomeIcon
                    style={{ color: " #cf9c9c" }}
                    icon={faFaceSadCry}
                  />
                )}
                <p>Your Rating {movieClicked.yourRating}</p>
              </div>
            )}
          </div>
        )}
        <p>
          {movieClicked.plot === "N/A" || movieClicked === undefined
            ? ""
            : movieClicked.plot}
        </p>
      </div>
      <div className="flex-fill show-movie-information">
        {movieClicked.overview ? (
          <>
            <h2>{movieClicked.title}</h2>
            <p>{movieClicked.overview}</p>
          </>
        ) : (
          <>
            <p>
              {movieClicked.actors === "N/A"
                ? ""
                : `Actors: ${movieClicked.actors}`}
            </p>
            <p>
              {movieClicked.awards === "N/A"
                ? ""
                : `Awards: ${movieClicked.awards}`}
            </p>
            <p>
              {movieClicked.boxoffice === "N/A"
                ? ""
                : `Box Office: ${movieClicked.boxoffice}`}
            </p>
            <p>
              {movieClicked.country === "N/A"
                ? ""
                : `Country: ${movieClicked.country}`}
            </p>
            <p>
              {movieClicked.director === "N/A"
                ? ""
                : `Director: ${movieClicked.director}`}
            </p>
            <p>
              {movieClicked.genre === "N/A"
                ? ""
                : `Genre: ${movieClicked.genre}`}
            </p>
            <p>
              {movieClicked.language === "N/A"
                ? ""
                : `Language: ${movieClicked.language}`}
            </p>
            <p>
              {movieClicked.metascore === "N/A"
                ? ""
                : `Metascore: ${movieClicked.metascore}`}
            </p>
            <p>
              {movieClicked.rated === "N/A"
                ? ""
                : `Rated: ${movieClicked.rated}`}
            </p>
            <p>
              {movieClicked.released === "N/A"
                ? ""
                : `Released: ${movieClicked.released}`}
            </p>
            <p>
              {movieClicked.runtime === "N/A"
                ? ""
                : `Runtime: ${movieClicked.runtime}`}
            </p>
            <p>
              {movieClicked.title === "N/A"
                ? ""
                : `Title: ${movieClicked.title}`}
            </p>
            <p>
              {movieClicked.writer === "N/A"
                ? ""
                : `Writer: ${movieClicked.writer}`}
            </p>
            <p>
              {movieClicked.year === "N/A" ? "" : `Year: ${movieClicked.year}`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
