import { useEffect, useState } from "react";
import { NewsMovies } from "./new";
import { Navbar } from "./NavBar";
import { Input } from "./NavBar";
import ListMovies from "./ListMovies";
import { SummaryMovies } from "./MoviesSelected";
import { KEY, KEY_TWO, URL } from "./data";
import { Main, BoxMovies, ShowMovies, LoadError, LoadingMovie } from "./Main";
export default function App() {
  const [movie, setMovie] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [movieSelected, setMoviesSelected] = useState([]);
  const [idSelected, setIdSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movieClicked, setMovieClicked] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setError("");
        setLoading(true);
        const resp = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${KEY_TWO}`,
          { signal: controller.signal }
        );
        if (!resp.ok) {
          throw new Error("error in get the movie");
        }
        const data = await resp.json();
        if (!data) {
          throw new Error("error in get the movie");
        }
        const dataMovies = data.results
          .map((movies) => ({
            Title: movies.title,
            Poster: `https://image.tmdb.org/t/p/w500${movies.poster_path}`,
            Type: "movie",
            Year: movies.release_date,
            imdbID: `${movies.id}`,
          }))
          .filter((movie, i) => movie.Title.length < 20);

        const sendMoviesList = dataMovies.filter((movie, i) => {
          return !moviesList.some((el) => el.imdbID === movie.imdbID);
        });
        setMoviesList(sendMoviesList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }
    if (moviesList.length > 0) return;
    fetchData();
    return function () {
      controller.abort();
    };
  }, [moviesList]);

  useEffect(() => {
    async function fechdata() {
      try {
        setError("");
        setLoading(true);
        const resp = await fetch(`${URL}${KEY}&s=${movie}`);
        if (!resp.ok) {
          throw new Error("error with the server");
        }
        const data = await resp.json();
        if (data.Response === "False") {
          throw new Error("Sorry please try again with other name.");
        }
        setMoviesList(data.Search);
      } catch (err) {
        setMovie("");
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (movie === "") {
      return;
    }
    fechdata();
  }, [movie]);

  return (
    <>
      <NewsMovies />
      <Navbar>
        <Input setMovie={setMovie} />
      </Navbar>

      <Main onHover={setHover} onMovieClicked={setMovieClicked}>
        <BoxMovies onMovies={setMoviesList} reset={false}>
          {loading && <LoadingMovie />}
          {!loading && error === "" && (
            <ListMovies
              moviesList={moviesList}
              onIdSelected={setIdSelected}
              onhover={setHover}
            />
          )}
          {error && <LoadError error={error} />}
        </BoxMovies>
        {hover && movieClicked !== "" && (
          <ShowMovies movieClicked={movieClicked} onHover={setHover} />
        )}
        <BoxMovies onMovies={setMoviesSelected} reset={true}>
          <SummaryMovies
            idSelected={idSelected}
            onHover={setHover}
            onMovieClicked={setMovieClicked}
            movieSelected={movieSelected}
            onMoviesSelected={setMoviesSelected}
          />
        </BoxMovies>
      </Main>
    </>
  );
}
