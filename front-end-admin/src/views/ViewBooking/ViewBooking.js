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
            title: 'Order Code',
            dataIndex: 'orderCode',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'paid' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
        },
        {
            title: 'Total Price (VND)',
            dataIndex: 'total_price',
        },
        {
            title: 'Username',
            dataIndex: 'createdBy',
            render: (createdBy) => createdBy ? createdBy.fullname : 'N/A',
        },
        {
            title: 'Seats',
            dataIndex: 'seats',
            render: (seats) => seats.map(seat => `${seat.area}${seat.position}`).join(', '),
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showDetailsModal(record)}>View Details</Button>
                </Space>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/booking/get-all');
            setData(response.data);
            console.log(response.data);
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
        const orderCode = booking.orderCode ? String(booking.orderCode) : ''; // Convert to string if it exists
        const createdByName = booking.createdBy ? booking.createdBy.fullname : ''; // Safely access fullname

        return (
            orderCode.includes(query) || // Check orderCode
            createdByName.toLowerCase().includes(query) || // Check username
            (booking.status && booking.status.toLowerCase().includes(query)) // Check status
        );
    });

    return (
        <div className="booking-view">
            <h2>Booking Management</h2>
            <Search
                placeholder="Search by order code, username, or status"
                onSearch={(value) => setSearchQuery(value)}
                style={{ marginBottom: 20, width: 400 }}
            />
            <Table columns={columns} dataSource={filteredData} rowKey="_id" pagination={{ pageSize: 10 }} />

            {/* Modal for booking details */}
            <Modal
                title="Booking Details"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>
                ]}
            >
                {selectedBooking && (
                    <div>
                        <p><strong>Order Code:</strong> {selectedBooking.orderCode}</p>
                        <p><strong>Status:</strong> {selectedBooking.status}</p>
                        <p><strong>Date:</strong> {selectedBooking.createdAt}</p>
                        <p><strong>Total Price:</strong> {selectedBooking.total_price} VND</p>
                        <p><strong>Seats:</strong> {selectedBooking.seats.map(seat => `${seat.area}${seat.position}`).join(', ')}</p>

                        <p><strong>Popcorns:</strong></p>
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
                            <p>None</p>
                        )}

                        {selectedBooking.transaction && (
                            <>
                                <h3>Transaction Details</h3>
                                <p><strong>Account Number:</strong> {selectedBooking.transaction.accountNumber}</p>
                                <p><strong>Amount:</strong> {selectedBooking.transaction.amount} VND</p>
                                <p><strong>Reference:</strong> {selectedBooking.transaction.reference}</p>
                                <p><strong>Transaction Date:</strong> {selectedBooking.transaction.transactionDateTime}</p>
                                <p><strong>Payment Status:</strong> {selectedBooking.transaction.desc}</p>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewBooking;
