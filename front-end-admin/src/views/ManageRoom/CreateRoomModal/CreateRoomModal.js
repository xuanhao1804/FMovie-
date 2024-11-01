import { Button, Col, Input, Modal, Row, Space, message } from "antd"
import "./CreateRoomModal.scss"
import { useState } from "react"
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCrown, faX, faCheck, faL } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const CreateRoomModal = ({ isModalOpen, setIsOpenModal, availableRoom, cinemaId, setRooms }) => {

    let typeTimeout;

    const [messageApi, contextHolder] = message.useMessage();
    const [roomName, setRoomName] = useState("")
    const [areas, setAreas] = useState([
        { name: "", col: 1, totalSeat: 0, seats: [] }
    ])


    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            messageApi.open({
                type: 'error',
                content: 'Tên phòng KHÔNG thể để trống',
                style: {
                    marginTop: '90vh',
                },
            });
        } else {
            let checkRoomName = "Phòng "
            if (roomName.includes(checkRoomName)) {
                checkRoomName = roomName
            } else {
                checkRoomName += roomName
            }
            const checkRoomFrom = availableRoom.map(room => room.toLowerCase())
            if (checkRoomFrom.includes(checkRoomName.toLocaleLowerCase().replace(/\s+/g, ' ').trim())) {
                messageApi.open({
                    type: 'error',
                    content: `Tên phòng đã tồn tại: ${availableRoom.toString()}`,
                    style: {
                        marginTop: '90vh',
                    },
                });
                return
            }
            else {
                if (areas.length < 1) {
                    messageApi.open({
                        type: 'error',
                        content: 'Cần ít nhất 1 khu vực cho phòng: ' + roomName,
                        style: {
                            marginTop: '90vh',
                        },
                    });
                    return
                } else {
                    for (let index = 0; index < areas.length; index++) {
                        if (!areas[index].name) {
                            messageApi.open({
                                type: 'error',
                                content: 'Tên khu KHÔNG thể để trống',
                                style: {
                                    marginTop: '90vh',
                                },
                            });
                            return
                        }
                        if (areas[index].seats.length < 5) {
                            messageApi.open({
                                type: 'error',
                                content: 'Cần ít nhất 5 ghế cho khu ' + areas[index].name,
                                style: {
                                    marginTop: '90vh',
                                },
                            });
                            return
                        }
                    }
                    const { data } = await axios.post("http://localhost:9999/room/create", {
                        cinemaId: cinemaId,
                        roomName: roomName.includes("Phòng ") ? roomName.replace(/\s+/g, ' ').trim() : ("Phòng " + roomName).replace(/\s+/g, ' ').trim(),
                        areas: areas.map(({ totalSeat, ...rest }) => rest)
                    })
                    setRooms(prevRooms => [...prevRooms, {
                        name: data.room.name,
                        areas: data.room.areas
                    }]);
                    messageApi.open({
                        type: 'success',
                        content: data.message,
                        style: {
                            marginTop: '90vh',
                        },
                    });
                    setIsOpenModal(false)
                    setRoomName("")
                    setAreas([
                        { name: "", col: 1, totalSeat: 0, seats: [] }
                    ])
                }
            }

        }
    }
    const handleCancel = () => {
        setIsOpenModal(false);
    };

    const buildSeats = (index) => {
        clearTimeout(typeTimeout);
        typeTimeout = setTimeout(() => {
            let areaArray = [...areas]
            if (+areaArray[index].totalSeat % +areaArray[index].col !== 0) {
                areaArray[index].totalSeat = areaArray[index].totalSeat + (+areaArray[index].col - (+areaArray[index].totalSeat % +areaArray[index].col))
            }
            areaArray[index].seats = Array.from({ length: +areaArray[index].totalSeat }, (v, i) => ({
                position: i + 1,
                isEnable: true,
                isVip: false
            }));
            setAreas(areaArray);
        }, 1000)
    }

    const handleChangeArea = (value, attribute, index) => {
        let areaArray = [...areas]
        switch (attribute) {
            case "name":
                areaArray[index][attribute] = value
                setAreas(areaArray)
                break;
            case "col":
                if (value > 0) {
                    areaArray[index][attribute] = +value
                    setAreas(areaArray)
                    buildSeats(index)
                }
                break;
            case "totalSeat":
                areaArray[index][attribute] = +value
                setAreas(areaArray)
                buildSeats(index)
                break;
            default: break;
        }
    }

    const handleRemoveArea = (index) => {
        let areaArray = [...areas]
        areaArray.splice(index, 1)
        setAreas(areaArray)
    }

    const handleCheckVipSeat = (areaIndex, seatIndex) => {
        let areaArray = [...areas]
        areaArray[areaIndex].seats[seatIndex].isVip = !areaArray[areaIndex].seats[seatIndex].isVip
        setAreas(areaArray)
    }

    const handleChangeSeatStatus = (areaIndex, seatIndex) => {
        let areaArray = [...areas]
        areaArray[areaIndex].seats[seatIndex].isEnable = !areaArray[areaIndex].seats[seatIndex].isEnable
        setAreas(areaArray)
    }

    return (
        <>
            <Modal style={{ marginTop: "1.4rem", marginRight: "2rem" }}
                title="Tạo phòng mới"
                open={isModalOpen}
                onOk={() => handleCreateRoom()}
                onCancel={handleCancel}
                width={1200}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleCreateRoom()}>
                        Xác nhận
                    </Button>,
                ]}>

                <div className="create-room-modal">
                    <div className="create-room-modal-header">
                        <Input value={roomName} onChange={(event) => setRoomName(event.target.value)} addonBefore="Tên phòng" />
                        <div className="d-flex gap-1">
                            <Input disabled value={areas.length} type="number" style={{ width: "15rem" }} addonBefore="Số khu" />
                            <PlusOutlined onClick={() => setAreas(areas =>
                                [
                                    ...areas,
                                    { name: "", col: 1, totalSeat: 0, seats: [] }
                                ]
                            )} style={{ fontSize: "1.2rem", backgroundColor: "#52c41a", color: "white", width: "2rem", aspectRatio: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.25rem" }} />
                        </div>
                    </div>
                    <div className="create-room-modal-area-list">
                        <Row>
                            {
                                areas && areas.length > 0 &&
                                areas.map((area, index) => {
                                    return (
                                        <Col span={24 / areas.length}>
                                            <div className="create-room-modal-area">
                                                <div className="create-room-modal-area-name">
                                                    <Input onChange={(event) => handleChangeArea(event.target.value, "name", index)} style={{ width: "7rem" }} addonBefore="Khu" value={area.name} />
                                                    <Input onChange={(event) => handleChangeArea(event.target.value, "col", index)} style={{ width: "7rem" }} addonBefore="Cột" type="number" value={area.col} />
                                                    <Input onChange={(event) => handleChangeArea(event.target.value, "totalSeat", index)} style={{ width: "8.5rem" }} addonBefore="Số ghế" type="number" value={area.totalSeat} />
                                                    <MinusOutlined onClick={() => handleRemoveArea(index)} style={{ fontSize: "1.2rem", backgroundColor: "#f81d22", color: "white", width: "2rem", aspectRatio: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.25rem" }} />
                                                </div>
                                                {
                                                    !area.name && area.col && area.seats.length > 0 &&
                                                    <span style={{ color: "#f81d22" }}>Chưa nhập tên khu vực</span>
                                                }
                                            </div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                    <div className="create-room-modal-seats-list">
                        <Row>
                            {
                                areas && areas.length > 0 &&
                                areas.map((area, areaIndex) => {
                                    return (
                                        <Col span={24 / areas.length}>
                                            <div className="create-room-modal-seats">
                                                {area.col !== 0 && area.seats && area.seats.length > 0 && area.seats.map((seat, seatIndex) => {
                                                    return (
                                                        <div className={seat.isEnable ? "create-room-modal-seats-item" : "create-room-modal-seats-item create-room-modal-seats-item-disable"} style={{ flex: `1 0 calc(${(100 / area.col)}%)`, placeItems: "center" }}>
                                                            <FontAwesomeIcon icon={faCrown} onClick={() => handleCheckVipSeat(areaIndex, seatIndex)} className={seat.isVip === true ? "create-room-modal-seats-item-icon create-room-modal-seats-item-vip" : "create-room-modal-seats-item-icon"} />
                                                            <span> {area.name + seat?.position}</span>
                                                            {
                                                                seat.isEnable ?
                                                                    <FontAwesomeIcon onClick={() => handleChangeSeatStatus(areaIndex, seatIndex)} icon={faCheck} className="create-room-modal-seats-item-icon-enable" />
                                                                    :
                                                                    <FontAwesomeIcon onClick={() => handleChangeSeatStatus(areaIndex, seatIndex)} icon={faX} className="create-room-modal-seats-item-icon-disable" />
                                                            }
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                    <div className="create-room-modal-footer">
                        <Button onClick={() => setAreas(prevAreas =>
                            prevAreas.map(area => ({
                                ...area,
                                seats: area.seats.map(seat => ({
                                    ...seat,
                                    isEnable: true
                                }))
                            }))
                        )} style={{ backgroundColor: "rgb(82, 196, 26)" }} type="primary">Sử dụng tất cả</Button>
                        <div className="create-room-modal-annotate">
                            <Space size={"small"}>
                                <FontAwesomeIcon style={{ cursor: "auto" }} className="create-room-modal-seats-item-icon create-room-modal-seats-item-vip" icon={faCrown} />
                                <span >Ghế Vip</span>
                            </Space>
                            <Space size={"small"}>
                                <FontAwesomeIcon className="create-room-modal-seats-item-icon-enable create-room-modal-seats-item-icon-enable-annotate" style={{ cursor: "auto" }} icon={faCheck} />
                                <span >Đang sử dụng</span>
                            </Space>
                            <Space size={"small"}>
                                <FontAwesomeIcon className="create-room-modal-seats-item-icon-disable create-room-modal-seats-item-icon-disable-annotate" style={{ cursor: "auto" }} icon={faX} />
                                <span>Đang bảo trì</span>
                            </Space>
                        </div>
                    </div>
                </div>
            </Modal >
            {contextHolder}
        </>
    )
}

export default CreateRoomModal