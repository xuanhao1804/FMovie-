import { Col, Row } from "antd"
import FilmsCard from "../../../components/FilmsCard/FilmsCard"
import { films } from "../../../data"
import { useEffect, useState } from "react"

const Playing = () => {

    const [playingFilms, setPlayingFilms] = useState([])
    useEffect(() => {
        const playing = films.filter(film => film.isPlaying === true)
        setPlayingFilms(playing)
    }, [])

    return (
        <div className="content-height-padding">
            <Row>
                {playingFilms && playingFilms.length > 0 &&
                    playingFilms.map((item, index) => {
                        return (
                            <Col key={"film" + item.id} span={6} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                                <FilmsCard image={item.imageThumnail} limit={item.limit} star={item.star} />
                            </Col>
                        )
                    })

                }
            </Row>
        </div>
    )
}

export default Playing