import { Col, Row, Space } from "antd"
import FilmsCard from "../../../components/FilmsCard/FilmsCard"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Playing = () => {

    const state = useSelector((state) => state)

    return (
        <div className="content-height-padding">
            <Row>
                {state.movies.playingMovies && state.movies.playingMovies.length > 0 &&
                    state.movies.playingMovies.map((item, index) => {
                        return (
                            <Col key={"film" + item.id} span={6} style={{ marginBottom: "1rem", padding: "1rem" }}>
                                <FilmsCard _id={item._id} image={item.image} limit={item.limit} star={item.rating} video={item.video} />
                            </Col>
                        )
                    })

                }
            </Row>
        </div>
    )
}

export default Playing