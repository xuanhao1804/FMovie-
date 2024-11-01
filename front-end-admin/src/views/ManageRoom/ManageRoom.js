import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Table, Button, Space, message, Modal, Tag } from 'antd';
import "./ManageRoom.scss"
import CreateRoomModal from "./CreateRoomModal/CreateRoomModal";
import EditRoomModal from "./EditRoomModal/EditRoomModal";

const ManageRoom = () => {

    const { cinemaId } = useParams()
    const [rooms, setRooms] = useState([])
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(true)
    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState(null)

    const fetchRoomByCinemas = async () => {
        const { data } = await axios.post("http://localhost:9999/cinema/get-rooms/", {
            cinemaId: cinemaId
        })
        setRooms(data.data.rooms)
    }

    useEffect(() => {
        fetchRoomByCinemas()
    }, [cinemaId])

    const columns = [
        {
            title: 'Tên phòng',
            dataIndex: 'name',
        },
        {
            title: 'Các khu',
            dataIndex: 'areas',
            render: (_, { areas }) => (
                <div className="manage-room-table-area-list">
                    {
                        areas.map((item, index) => {
                            return (
                                <Tag>{"Khu " + item.name + " - " + item.seats.length + " ghế"}</Tag>
                            )
                        })
                    }
                </div>
            )
        },
        {
            render: (_, record) => (
                <Space size="middle">
                    <Button style={{ background: "#e8d90c" }} type="primary" onClick={() => {
                        setSelectedRoom(record)
                        setIsOpenEditModal(true)
                    }}>Chỉnh sửa</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="manage-room">
                <div className="manage-room-header">
                    <div>Quản lí phòng</div>
                    <Button onClick={() => setIsOpenCreateModal(true)} type="primary">Tạo mới</Button>
                </div>
                <div>
                    {rooms.length > 0 &&
                        <Table dataSource={rooms} columns={columns} />
                    }
                </div>
            </div>
            <CreateRoomModal isModalOpen={isOpenCreateModal} setIsOpenModal={setIsOpenCreateModal} availableRoom={rooms.map(room => {
                return room.name
            })} cinemaId={cinemaId} setRooms={setRooms} />
            <EditRoomModal isModalOpen={isOpenEditModal} setIsOpenModal={setIsOpenEditModal} room={selectedRoom} availableRoom={rooms.map(room => {
                return room?.name !== selectedRoom?.name ? room.name : null
            })} setRooms={setRooms} setSelectedRoom={setSelectedRoom} />
        </>
    )
}

export default ManageRoom