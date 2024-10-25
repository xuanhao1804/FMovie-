// Trong ManageCinema.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import axios from 'axios';
import ModalCreateCinema from '../../components/Modal/ModalCreateCinema/ModalCreateCinema';
import ModalEditCinema from '../../components/Modal/ModalEditCinema/ModalEditCinema'

const ManageCinema = () => {
    const [data, setData] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedCinema, setSelectedCinema] = useState(null);

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
                    <Button type="link" onClick={() => showEditModal(record)}>Edit</Button>
                    <Button type="link" onClick={() => confirmDelete(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];
    const confirmDelete = (cinemaId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this cinema?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => deleteCinema(cinemaId),
        });
    };

    const deleteCinema = async (cinemaId) => {
        try {
            await axios.delete(`http://localhost:9999/cinema/delete/${cinemaId}`);
            message.success('Cinema deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting cinema:', error);
            message.error('Failed to delete cinema. Please try again.');
        }
    };

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
        setIsCreateModalVisible(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        fetchData();
    };

    const showEditModal = (cinema) => {
        setSelectedCinema(cinema);
        setIsEditModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        fetchData();
    };

    return (
        <div className="row flex-lg-nowrap">
            <div className="col mb-3">
                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create
                </Button>
                <Table columns={columns} dataSource={data} pagination={false} />

                <ModalCreateCinema
                    isVisible={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    onSuccess={handleCreateSuccess}
                />

                <ModalEditCinema
                    isVisible={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    onSuccess={handleEditSuccess}
                    cinema={selectedCinema}
                />
            </div>
        </div>
    );
};

export default ManageCinema;
