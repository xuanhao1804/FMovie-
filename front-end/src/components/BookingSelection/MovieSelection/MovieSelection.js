import { useSelector } from "react-redux"
import "./MovieSelection.scss"
import { Col, Row } from "antd"
import FilmsCard from "../../FilmsCard/FilmsCard"
import { MovieService } from "../../../services/MovieService"
import { useEffect, useState } from "react"

const MovieSelection = ({ selectedCity, selectedMovie, setSelectedMovie, movieSelectionRef, showtimeSelectionRef }) => {

    const { movies } = useSelector((state) => state)
    const [availableMovies, setAvailableMovies] = useState([])

    const getMoviesInCity = async () => {
        const response = await MovieService.fetchMovieByCityService({ city: selectedCity })
        console.log(response)
        if (response.status === 200) {
            setAvailableMovies(response.data)
        } else {
            setAvailableMovies([])
        }
    }

    useEffect(() => {
        if (selectedCity && selectedCity._id) {
            getMoviesInCity()
        }
    }, [selectedCity])

    return (
        <div className="movie-selection selection-section" ref={movieSelectionRef}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-semibold">
                    Chọn Phim
                </span>
                {/* <span style={{ aspectRatio: "1" }}>
                    <i className="bg-primary text-white p-1 rounded-circle fa-solid fa-plus"></i>
                </span> */}
            </div>
            <div>
                <Row>
                    {movies && availableMovies && availableMovies.length > 0 &&
                        availableMovies.map((item, index) => {
                            const movie = movies.playingMovies?.find(movie => movie._id === item)
                            if (movie) {
                                return (
                                    <Col span={6} style={{ marginBottom: "0.5rem", padding: "0.25rem" }}>
                                        <div className="movie-selection-item" onClick={() => {
                                            setSelectedMovie(movie)
                                            showtimeSelectionRef.current.scrollIntoView();
                                        }} >
                                            {movie._id === selectedMovie._id &&
                                                <>
                                                    <div className="movie-selection-item-selected">
                                                    </div>
                                                    <i className="movie-selection-item-selected-icon text-green fa-solid fa-circle-check"></i>
                                                </>
                                            }
                                            <FilmsCard _id={movie._id} image={movie.image} limit={movie.limit} star={movie.rating} video={movie.video} />
                                        </div>
                                    </Col>
                                )
                            }
                            return (
                                <></>
                            )
                        })
                    }
                </Row>
            </div>
        </div >
    )
}

export default MovieSelection