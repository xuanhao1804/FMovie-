import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;

const ViewBooking = () => {
    const [data, setData] = useState([]);
    const [popcornData, setPopcornData] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        {
            title: 'Mã đặt vé',
            dataIndex: 'orderCode',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={
                    status === 'paid' ? 'blue' :
                        status === 'pending' ? 'orange' :
                            status === 'end' ? 'green' :
                                'red'
                }>
                    {status === 'pending' ? 'Chờ thanh toán' :
                        status === 'paid' ? 'Chờ lấy vé' :
                            status === 'end' ? 'Đã lấy vé' :
                                'Hủy'}
                </Tag>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
        },
        {
            title: 'Giá tiền (VND)',
            dataIndex: 'total_price',
        },
        {
            title: 'Tên người đặt',
            dataIndex: 'createdBy',
            render: (createdBy) => createdBy ? createdBy.fullname : 'N/A',
        },
        {
            title: 'Ghế',
            dataIndex: 'seats',
            render: (seats) => seats.map(seat => `${seat.area}${seat.position}`).join(', '),
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showDetailsModal(record)}>Xem chi tiết</Button>
                </Space>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/booking/get-all');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    const fetchPopcornData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/popcorn/get-all');
            if (response.status === 200) {
                setPopcornData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching popcorn data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchPopcornData();
    }, []);

    const showDetailsModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    // Filtered data based on search query
    const filteredData = data.filter(booking => {
        const query = searchQuery.toLowerCase();
        const orderCode = booking.orderCode ? String(booking.orderCode) : '';
        const createdByName = booking.createdBy ? booking.createdBy.fullname : '';

        return (
            orderCode.includes(query) ||
            createdByName.toLowerCase().includes(query)
        );
    });

    return (
        <div className="booking-view">
            <h2>Danh sách đặt vé</h2>
            <Search
                placeholder="Tìm kiếm mã đơn hàng hoặc tên người đặt vé"
                onSearch={(value) => setSearchQuery(value)}
                style={{ marginBottom: 20, width: 400 }}
            />
            <Table columns={columns} dataSource={filteredData} rowKey="_id" pagination={{ pageSize: 10 }} />

            <Modal
                title="Chi tiết đặt vé"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        đóng
                    </Button>
                ]}
            >
                {selectedBooking && (
                    <div>
                        <p><strong>Mã đặt vé:</strong> {selectedBooking.orderCode}</p>
                        <p><strong>Trạng thái:</strong> {selectedBooking.status}</p>
                        <p><strong>Ngày:</strong> {selectedBooking.createdAt}</p>
                        <p><strong>Giá tiền:</strong> {selectedBooking.total_price} VND</p>
                        <p><strong>Ghế:</strong> {selectedBooking.seats.map(seat => `${seat.area}${seat.position}`).join(', ')}</p>
                        <p><strong>Bỏng nước:</strong></p>
                        {selectedBooking.popcorns.length > 0 ? (
                            <ul>
                                {selectedBooking.popcorns.map((p) => {
                                    const popcorn = popcornData.find(item => item._id === p._id);
                                    return (
                                        <li key={p._id}>
                                            {popcorn ? `${popcorn.name} - Số lượng: ${p.quantity}` : `Popcorn not found (Qty: ${p.quantity})`}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>Không có</p>
                        )}

                        {selectedBooking.transaction && (
                            <>
                                <h3>Transaction Details</h3>
                                <p><strong>Tên tài khoản nhận:</strong> {selectedBooking.transaction.accountNumber}</p>
                                <p><strong>số tiền:</strong> {selectedBooking.transaction.amount} VND</p>
                                <p><strong>Reference:</strong> {selectedBooking.transaction.reference}</p>
                                <p><strong>Ngày giao dịch:</strong> {selectedBooking.transaction.transactionDateTime}</p>
                                <p><strong>Trạng thái thanh toán:</strong> {selectedBooking.transaction.desc}</p>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewBooking;
