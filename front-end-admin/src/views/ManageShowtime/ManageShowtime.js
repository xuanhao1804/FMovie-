import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import axios from 'axios';
import ModalCreateCinema from '../../components/Modal/ModalCreateCinema/ModalCreateCinema.js';
import { useParams } from 'react-router-dom';

const ManageShowtime = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();
    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'City',
            dataIndex: 'city',
            render: (text, record) => record?.city?.name,
        },
        {
            title: 'Number of Rooms',
            dataIndex: 'rooms',
            render: (rooms) => rooms.length,
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link">Edit</Button>
                    <Button type="link">Delete</Button>
                </Space>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/cinema/get-all');
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showCreateModal = () => {
        setIsModalVisible(true);
    };

    const handleModalSuccess = () => {
        setIsModalVisible(false);
        fetchData(); // Refresh data after creating a cinema
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="row flex-lg-nowrap">
            <div className="col mb-3">
                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create
                </Button>
                <Table columns={columns} dataSource={data} pagination={false} />

                {/* Modal for creating cinema */}
                <ModalCreateCinema
                    isVisible={isModalVisible}
                    onCancel={handleCancel}
                    onSuccess={handleModalSuccess}
                />
            </div>
        </div>
    );
};

export default ManageShowtime;
