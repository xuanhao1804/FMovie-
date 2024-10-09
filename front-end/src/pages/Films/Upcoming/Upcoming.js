import { Col, Row } from "antd"
import FilmsCard from "../../../components/FilmsCard/FilmsCard"
import { useEffect, useState } from "react"
import { films } from "../../../data"

const Upcoming = () => {

    const [upcomingFilms, setUpcomingFilms] = useState([])
    useEffect(() => {
        const upcoming = films.filter(film => film.isPlaying === false)
        setUpcomingFilms(upcoming)
    }, [])

    return (
        <div className="content-height-padding">
            <Row>
                {upcomingFilms && upcomingFilms.length > 0 &&
                    upcomingFilms.map((item, index) => {
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

export default Upcoming