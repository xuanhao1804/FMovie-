import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Input, Tooltip } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalCreatePopcorn from '../../components/Modal/ModalCreatePopCorn/ModalCreatePopCorn';
import ModalEditPopcorn from '../../components/Modal/ModalEditPopCorn/ModalEditPopCorn';

const ManagePopcorn = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedPopcorn, setSelectedPopcorn] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
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
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <span style={{ color: status === 'active' ? 'green' : 'red' }}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Chỉnh sửa
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDeletePopCorn = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:9999/popcorn/delete/${id}`);
            message.success(response.data.message || 'Xóa bỏ thành công!');
            fetchData();
        } catch (error) {
            console.error("Error deleting popcorn:", error);
            message.error('Không thể xóa bỏ. Vui lòng thử lại.');
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/popcorn/get-all');
            setData(response.data.data);
            setFilteredData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể lấy dữ liệu. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = data.filter((item) =>
            item.name.toLowerCase().includes(value) ||
            item.description.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

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

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return (
        <div className="row flex-lg-nowrap">
            <div className="col mb-3">
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc mô tả"
                        value={searchText}
                        onChange={handleSearch}
                        prefix={<SearchOutlined />}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
                        Tạo mới
                    </Button>
                </Space>
                
                <Table
                    columns={columns}
                    dataSource={filteredData.slice(startIndex, endIndex)}
                    pagination={false}
                    rowKey="_id"
                />

                {totalItems > 10 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                        <span>{`Hiển thị ${startIndex + 1}-${endIndex} trên tổng số ${totalItems} combo`}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Trang đầu">
                                <Button
                                    icon={<DoubleLeftOutlined />}
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(1, pageSize)}
                                    style={{ margin: '0 4px' }}
                                />
                            </Tooltip>
                            <Tooltip title="Trang trước">
                                <Button
                                    icon={<LeftOutlined />}
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1, pageSize)}
                                    style={{ margin: '0 4px' }}
                                />
                            </Tooltip>
                            <span style={{ margin: '0 8px', fontWeight: 'bold' }}>{`${currentPage}/${totalPages}`}</span>
                            <Tooltip title="Trang tiếp theo">
                                <Button
                                    icon={<RightOutlined />}
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1, pageSize)}
                                    style={{ margin: '0 4px' }}
                                />
                            </Tooltip>
                            <Tooltip title="Trang cuối">
                                <Button
                                    icon={<DoubleRightOutlined />}
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(totalPages, pageSize)}
                                    style={{ margin: '0 4px' }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                )}

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
