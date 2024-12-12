/*----- Import necessary hooks from React and other dependencies -----*/

import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeImage from '../assets/Anim 1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

  /*----- State Management -----*/

function Home() {
    const [search, setSearch] = useState("");
    const [answer, setAnswer] = useState("");
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    
    // Advanced search states
    const [rating, setRating] = useState('');
    const [year, setYear] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');

    /*----- API Configuration -----*/

    const API_BASE_URL = 'https://api.jikan.moe/v4';

    /*----- Event Handlers -----*/

   const handleSearch = async (e) => {
        e.preventDefault();
        setShowDetails(false); // Reset details view
        
        setIsLoading(true);
        try {
            // Build search parameters
            const searchParams = {
                limit: 10,
                sfw: true
            };

            // Only add parameters if they have values
            if (search.trim()) searchParams.q = search.trim();
            if (rating) searchParams.rating = rating;
            if (year) searchParams.start_year = year;
            if (status) searchParams.status = status;
            if (sort) searchParams.order_by = sort;
            if (selectedGenre) searchParams.genres = selectedGenre;

            console.log('Search params:', searchParams);

            const response = await axios.get(`${API_BASE_URL}/anime`, {
                params: searchParams
            });

            console.log('API Response:', response.data);

            if (response.data.data.length > 0) {
                const anime = response.data.data[0];
                setSelectedAnime(anime);
                setAnswer(generateAnswer(anime));
                resetFilters();
                setSearch("");
            } else {
                setSelectedAnime(null);
                setAnswer("No anime found matching your criteria.");
                setSearch("");
            }
        } catch (error) {
            console.error('Search error:', error);
            setSelectedAnime(null);
            setAnswer("Error searching for anime. Please try again.");
            setSearch("");
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

    const resetFilters = () => {
        setRating('');
        setYear('');
        setStatus('');
        setSort('');
        setSelectedGenre('');
        setShowAdvancedSearch(false);
    };

    const generateAnswer = (anime) => {
        if (!anime) return "";
        return `${anime.title} is a ${anime.type} that was released in ${anime.year || 'unknown year'}. 
                It has a rating of ${anime.score || 'N/A'}/10 and ${anime.episodes || 'unknown number of'} episodes. 
                ${anime.synopsis ? anime.synopsis.split('.')[0] + '.' : ''}`;
    };

    // Fetch genres when component mounts
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/genres/anime`);
                setGenres(response.data.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    /*----- Optimized Image Component -----*/
    const OptimizedImage = ({ src, alt, className }) => {
        const [loaded, setLoaded] = useState(false);
        
        return (
            <div className={`image-container ${className}`}>
                <img
                    src={src}
                    alt={alt}
                    className={`placeholder ${loaded ? 'loaded' : ''}`}
                    style={{ width: '300px', height: 'auto' }}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = AnimeImage;
                    }}
                />
                <img
                    src={src}
                    alt={alt}
                    className={`full-image ${loaded ? 'loaded' : ''}`}
                    onLoad={() => setLoaded(true)}
                    loading="lazy"
                    srcSet={`${src} 300w, ${src} 600w, ${src} 900w`}
                    sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = AnimeImage;
                    }}
                />
            </div>
        );
    };

    /*----- Render Component -----*/

    return (
        <section className="body-wrapper">
            <section className={`hero-content ${isLoading ? 'loading' : ''}`}>
                <h1 className='hero-title'>Ask me a question</h1>
                <p className='hero-subtitle'>about  { "Anime" }</p>

                <div className="search-section">
                    <section className={`search-bar ${isLoading ? 'disabled' : ''}`}>
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="search-icon"
                            size="2x"
                        />
                        <input 
                            type="text" 
                            placeholder="Search anime by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            className="filter-btn"
                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            disabled={isLoading}
                        >
                            <FontAwesomeIcon icon={faFilter} />
                        </button>
                        <button 
                            className="searchBtn" 
                            onClick={handleSearch}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="loading-spinner"></div>
                            ) : 'Search'}
                        </button>
                    </section>

                    {showAdvancedSearch && (
                        <div className="advanced-search fade-in">
                            <div className="filter-group">
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)}
                                    className="filter-select"
                                    disabled={isLoading}
                                >
                                    <option value="">Any Rating</option>
                                    <option value="g">G - All Ages</option>
                                    <option value="pg">PG - Children</option>
                                    <option value="pg13">PG-13 - Teens 13+</option>
                                    <option value="r17">R - 17+</option>
                                </select>

                                <input 
                                    type="number"
                                    placeholder="Year (e.g., 2023)"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="filter-input"
                                    min="1917"
                                    max="2024"
                                    disabled={isLoading}
                                />

                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="filter-select"
                                    disabled={isLoading}
                                >
                                    <option value="">Any Status</option>
                                    <option value="airing">Currently Airing</option>
                                    <option value="complete">Completed</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>

                                <select 
                                    value={sort} 
                                    onChange={(e) => setSort(e.target.value)}
                                    className="filter-select"
                                    disabled={isLoading}
                                >
                                    <option value="">Sort By</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="rank">Rank</option>
                                    <option value="favorites">Favorites</option>
                                </select>

                                <select 
                                    value={selectedGenre} 
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Any Genre</option>
                                    {genres.map((genre) => (
                                        <option key={genre.mal_id} value={genre.mal_id}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>

                                <button 
                                    className="reset-btn"
                                    onClick={resetFilters}
                                    disabled={isLoading}
                                >
                                    Reset Filters
                                </button>
                                <button 
                                    className="search-filter-btn"
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : 'Search with Filters'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="anime-card skeleton fade-in">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {answer && !showDetails && (
                            <div className="answer-section fade-in">
                                <p className="answer">{answer}</p>
                                {selectedAnime && (
                                    <button 
                                        className="show-more-btn"
                                        onClick={() => setShowDetails(true)}
                                    >
                                        Show More Details
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {showDetails && selectedAnime && (
                            <div className="anime-card slide-in">
                                <button 
                                    className="close-btn"
                                    onClick={() => {
                                        setShowDetails(false);
                                        setSelectedAnime(null);
                                        setAnswer("");
                                    }}
                                >
                                    ×
                                </button>
                                <OptimizedImage 
                                    src={selectedAnime.images?.jpg?.image_url || AnimeImage}
                                    alt={selectedAnime.title}
                                    className="anime-image"
                                />
                                <div className="anime-info">
                                    <h2 className="anime-title">{selectedAnime.title}</h2>
                                    <p className="anime-type">{selectedAnime.type} • {selectedAnime.episodes} Episodes</p>
                                    <p className="anime-score">Score: {selectedAnime.score}/10</p>
                                    <p className="anime-status">Status: {selectedAnime.status}</p>
                                    <p className="anime-synopsis">{selectedAnime.synopsis}</p>
                                    {selectedAnime.trailer?.url && (
                                        <a 
                                            href={selectedAnime.trailer.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="watch-trailer-btn"
                                        >
                                            Watch Trailer
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
            <img src={AnimeImage} alt="Anime character" className="anime-image" />
        </section>
        
    );
}

export default Home;