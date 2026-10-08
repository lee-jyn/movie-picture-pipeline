// 루트 컴포넌트: 백엔드(REACT_APP_MOVIE_API_URL)에서 받은 영화 목록과 선택한 영화의 상세를 표시
import React, { useState } from 'react';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import './App.css';

export default function App() {
  // 목록에서 선택한 영화 (선택 전에는 null)
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="container">
      <h1>Movie List</h1>

      <MovieList onMovieClick={handleMovieClick} />

      {selectedMovie && (
        <>
          <h1>Movie Details</h1>
          <MovieDetails movie={selectedMovie} />
        </>
      )}
    </div>
  );
}
