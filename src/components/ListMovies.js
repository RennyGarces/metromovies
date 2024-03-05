import { useEffect, useState } from "react";
import NotImage from "../images/NotImage.webp";
export default function ListMovies({ moviesList, onIdSelected }) {
  return (
    <ul className="list">
      {moviesList?.map(
        (movie) =>
          movie.Type === "movie" && (
            <MovieRender
              movie={movie}
              key={movie.imdbID}
              onIdSelected={onIdSelected}
            />
          )
      )}
    </ul>
  );
}
function MovieRender({ movie, onIdSelected }) {
  function handleMovie(movieId) {
    onIdSelected(movieId);
  }
  return (
    <li className="list-elements" onClick={() => handleMovie(movie.Title)}>
      <img
        src={movie.Poster === "N/A" ? NotImage : movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <div>
        <h3>{movie.Title}</h3>
      </div>
    </li>
  );
}
