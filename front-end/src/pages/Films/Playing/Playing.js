import { Col, Row } from "antd"
import FilmsCard from "../../../components/FilmsCard/FilmsCard"

const Playing = () => {
    return (
        <div className="content-height-padding">
            <Row>
                <Col span={6} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                    <FilmsCard />
                </Col>
                <Col span={6} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                    <FilmsCard />
                </Col>   <Col span={6} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                    <FilmsCard />
                </Col>   <Col span={6} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                    <FilmsCard />
                </Col>   <Col span={6} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                    <FilmsCard />
                </Col>
            </Row>
        </div>
    )
}

export default Playing