import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Form, Input, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalCreateMovie from '../../components/Modal/ModalCreateMovie/ModalCreateMovie'
import EditModal from '../../components/Modal/ModalEditMovie/EditModal';
const { Option } = Select;

const ManageMovie = () => {
    const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image file
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [newGenre, setNewGenre] = useState('');
    const [actors, setActors] = useState(['']);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [existingGenres, setExistingGenres] = useState([]);
    const [form] = Form.useForm();

    const showEditModal = (record) => {
        setSelectedMovie(record);
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        setIsEditModalOpen(false);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
    };

    const showCreateModal = () => {
        form.resetFields();
        setActors(['']);
        setNewGenre('');
        setImageFile(null); // Reset image file when opening the modal
        setIsCreateModalOpen(true);
    };

    const handleCreateCancel = () => {
        setIsCreateModalOpen(false);
    };
    const handleDeleteMovie = async (id) => {
        console.log("Deleting movie with ID:", id);
        try {
            const response = await axios.delete(`http://localhost:9999/movie/delete/${id}`);
            console.log("Delete response:", response.data);
            message.success(response.data.message);
            fetchData();
        } catch (error) {
            console.error("Error deleting movie:", error);
            message.error('Failed to delete movie. Please try again.');
        }
    };



    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Photo',
            dataIndex: 'image',
            render: (image) => <img src={image} alt="movie poster" style={{ width: 75, height: 100 }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Director',
            dataIndex: 'director',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
        },
        {
            title: 'Genres',
            dataIndex: 'genres',
            render: (genres) => genres.join(', '),
        },
        {
            title: 'Country',
            dataIndex: 'country',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <span style={{ color: status === 'playing' ? 'green' : status === 'upcoming' ? 'orange' : 'red' }}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showEditModal(record)}>Edit</Button>
                    <Button type="link" onClick={() => handleDeleteMovie(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/movie/get-all');
            setData(response.data.data);
            const allGenres = response.data.data.flatMap(movie => movie.genres);
            const uniqueGenres = Array.from(new Set(allGenres));
            setExistingGenres(uniqueGenres);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="row flex-lg-nowrap">
            <div className="col mb-3">
                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create
                </Button>

                <Table columns={columns} dataSource={data} pagination={false} />

                <EditModal
                    visible={isEditModalOpen}
                    onCancel={handleEditCancel}
                    onOk={handleEditOk}
                    movie={selectedMovie}
                    fetchData={fetchData}
                    existingGenres={existingGenres}
                />

                <ModalCreateMovie
                    isCreateModalOpen={isCreateModalOpen}
                    handleCreateCancel={handleCreateCancel}
                    fetchData={fetchData}
                    existingGenre={existingGenres}
                />

            </div>
        </div>
    );
};

export default ManageMovie;
