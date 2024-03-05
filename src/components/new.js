import { useEffect, useState } from "react";
import { KEY_THREE } from "./data";
export function NewsMovies() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    async function FecthData() {
      try {
        const resp = await fetch(
          `https://newsapi.org/v2/everything?q=movies&pageSize=20&apiKey=${KEY_THREE}`,
          { signal: controller.signal }
        );
        if (!resp.ok) {
          throw new Error("error in get News Movies");
        }
        const data = await resp.json();
        if (!data) {
          throw new Error("error in get News Movies");
        }

        const news = data.articles.map((el, i) => {
          return {
            title: el.title,
            description: el.description,
            url: el.url,
            urlToImage: el.urlToImage,
            id: i,
          };
        });
        setMovies(news);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    }
    FecthData();
    return function () {
      controller.abort();
    };
  }, []);

  return (
    <div className="news-container">
      {movies.map((movie) => (
        <div className="news-card" key={movie.id}>
          <div>
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <a href={movie.url} target="_blank" rel="noreferrer">
              Read more
            </a>
          </div>
          {movie.urlToImage && <img src={movie.urlToImage} alt="news" />}
        </div>
      ))}
    </div>
  );
}
