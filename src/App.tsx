import React, { useCallback, useRef, useState } from "react";
import useMovieSearch from "./useMovieSearch";

export const App = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { movies, error, hasMore, loading, search } = useMovieSearch(
    query,
    pageNumber
  );

  const observer = useRef<IntersectionObserver>();

  const lastBookElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      observer.current?.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        className="search"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button>search</button>
      </form>

      {movies.map((movie, index) => {
        if (movies.length === index + 1) {
          return (
            <div key={movie.id} ref={lastBookElementRef}>
              <h3>{movie.title}</h3>
            </div>
          );
        }

        return (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
          </div>
        );
      })}

      {loading && <div>loading...</div>}

      {error && <div>error</div>}
    </>
  );
};
