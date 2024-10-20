import { useSelector } from "react-redux"
import "./MovieSelection.scss"
import { Col, Row } from "antd"
import FilmsCard from "../../FilmsCard/FilmsCard"

const MovieSelection = ({ avaibleMovies, selectedMovie, setSelectedMovie }) => {

    const { city, movies } = useSelector((state) => state)

    return (
        <div className="movie-selection selection-section">
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
                    {avaibleMovies && movies && avaibleMovies.length > 0 &&
                        avaibleMovies.map((item, index) => {
                            const movie = movies.playingMovies?.find(movie => movie._id === item)
                            console.log(movie)
                            return (
                                <Col span={6} style={{ marginBottom: "0.5rem", padding: "0.25rem" }}>
                                    <div onClick={() => setSelectedMovie(movie._id)} >
                                        <FilmsCard _id={movie._id} image={movie.image} limit={movie.limit} star={movie.rating} video={movie.video} />
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        </div >
    )
}

export default MovieSelection