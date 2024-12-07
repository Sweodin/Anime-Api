/*----- Import necessary hooks from React and other dependencies -----*/

import { useState } from 'react';
import axios from 'axios';
import AnimeImage from '../assets/Anim 1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

  /*----- State Management -----*/

function Home() {
    const [search, setSearch] = useState("");
    const [answer, setAnswer] = useState("");
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /*----- API Configuration -----*/

    const API_BASE_URL = 'https://api.jikan.moe/v4';

/*----- Event Handlers -----*/

   const handleSearch = async (e) => {
        e.preventDefault();
        if (search.trim() === '') return;

        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/anime`, {
                params: {
                    q: search,
                    limit: 1, 
                    sfw: true
                }
            });

            
            if (response.data.data.length > 0) {
                const anime = response.data.data[0];
                setAnswer(`${anime.title} - ${anime.synopsis.substring(0, 200)}...`);
                setSelectedAnime(null); 
            } else {
                setAnswer("No anime found matching your question.");
            }
        } catch (error) {
            setAnswer("Sorry, I couldn't find an answer to your question.");
            console.error('Error:', error);
        }
        setIsLoading(false);
    };

    const handleDelete = () => {
        setAnswer("");
        setSelectedAnime(null);
        setSearch("");
    };

    const handleAnimeClick = async () => {
        if (!search.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/anime`, {
                params: {
                    q: search,
                    limit: 1,
                    sfw: true
                }
            });
            
            if (response.data.data.length > 0) {
                setSelectedAnime(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setIsLoading(false);
    };

    /*----- Render Component -----*/

    return (
            <section className="body-wrapper">
            <section className="hero-content">
                <h1 className='hero-title'>Ask me a question</h1>
                <p className='hero-subtitle'>about  { "Anime" }</p>

                <div className="search-section">
                <section className="search-bar">
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="search-icon"
                            size="2x"
                        />
                        <input 
                            type="text" 
                            placeholder="Ask about an anime..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="searchBtn" onClick={handleSearch}>
                            Search
                        </button>
                    </section>
                    </div>


                {isLoading && (
                    <div className="loading">Searching...</div>
                )}
                <div className="results-section">
                    {answer && !selectedAnime &&(
                        <div className="answer-box" onClick={handleAnimeClick}>
                            <button className="del-button" onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}>×</button>
                            <p>{answer}</p>
                            <span className="click-more">Click to learn more</span>
                        </div>
                    )}

                    {selectedAnime && (
                    <div className="anime-card">
                        <button className="del-button" onClick={handleDelete}>x</button>
                          
                        <img 
                            src={selectedAnime.images.jpg.image_url} 
                            alt={selectedAnime.title}
                        />
                        <div className="anime-info">
                            <h3>{selectedAnime.title}</h3>
                            <p className="score">⭐ {selectedAnime.score || 'N/A'}</p>
                            <p>Episodes: {selectedAnime.episodes || 'TBA'}</p>
                            <p className="synopsis">{selectedAnime.synopsis}</p>
                            <div className="genres">
                                {selectedAnime.genres?.map(genre => (
                                    <span key={genre.mal_id} className="genre-tag">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                
                </div>
            </section>
        <img src={AnimeImage} alt="Anime character" className="anime-image" />
    </section>
        
    );
}

export default Home;