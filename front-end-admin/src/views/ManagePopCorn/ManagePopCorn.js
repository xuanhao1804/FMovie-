import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import axios from 'axios';
import ModalCreatePopcorn from '../../components/Modal/ModalCreatePopCorn/ModalCreatePopCorn';
import ModalEditPopcorn from '../../components/Modal/ModalEditPopCorn/ModalEditPopCorn';
const ManagePopcorn = () => {
    const [data, setData] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedPopcorn, setSelectedPopcorn] = useState(null);

    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            render: (text) => (
                <img
                    src={text}
                    alt="popcorn"
                    style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                />
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <span style={{ color: status === 'active' ? 'green' : 'red' }}>
                    {status === 'active' ? 'Hoạt động' :
                        'Không hoạt động'}
                </span>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showEditModal(record)}>Chỉnh sửa</Button>
                </Space>
            ),
        },
    ];
    const handleDeletePopCorn = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:9999/popcorn/delete/${id}`);
            message.success(response.data.message);
            fetchData();
        } catch (error) {
            console.error("Error deleting movie:", error);
            message.error('Failed to delete movie. Please try again.');
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/popcorn/get-all');
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
    const showEditModal = (popcorn) => {
        setSelectedPopcorn(popcorn);
        setIsEditModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        fetchData();
    };

    return (
        <div className="row flex-lg-nowrap">
            <div className="col mb-3">
                <Button
                    type="primary"
                    onClick={showCreateModal}
                    style={{ marginBottom: 16 }}
                >
                    Tạo mới
                </Button>
                <Table columns={columns} dataSource={data} pagination={false} />

                <ModalCreatePopcorn
                    isVisible={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    onSuccess={handleCreateSuccess}
                />
                <ModalEditPopcorn
                    isVisible={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    onSuccess={handleEditSuccess}
                    popcorn={selectedPopcorn}
                />
            </div>
        </div>
    );
};

export default ManagePopcorn;
