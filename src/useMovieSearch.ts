import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Movie, SearchResult } from "./types";

export default function useMovieSearch(query: string, pageNumber: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setMovies([]);
  }, [query]);

  useEffect(() => {
    if (pageNumber === 1) return;

    search();
  }, [pageNumber]);

  const search = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await axios.get<SearchResult>(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            query,
            page: pageNumber,
            api_key: import.meta.env.VITE_TMDB_API_KEY,
          },
        }
      );

      setMovies((prevMovies) => [...prevMovies, ...data.results]);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [query, pageNumber]);

  return { loading, error, movies, hasMore, search };
}
