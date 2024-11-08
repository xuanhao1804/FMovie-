import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Form, Input, message, Pagination } from 'antd'

import {
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EditOutlined,
} from '@ant-design/icons'

import axios from 'axios'
import ModalCreateMovie from '../../components/Modal/ModalCreateMovie/ModalCreateMovie.js'
import EditModal from '../../components/Modal/ModalEditMovie/EditModal'

const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

const ManageMovie = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [existingGenres, setExistingGenres] = useState([])
  const [form] = Form.useForm()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const showEditModal = (record) => {
    setSelectedMovie(record)
    setIsEditModalOpen(true)
  }

  const handleEditOk = () => {
    setIsEditModalOpen(false)
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
  }

  const showCreateModal = () => {
    form.resetFields()
    setIsCreateModalOpen(true)
  }

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false)
  }

  const handleDeleteMovie = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:9999/movie/delete/${id}`)
      message.success(response.data.message)
      fetchData()
    } catch (error) {
      console.error('Error deleting movie:', error)
      message.error('Failed to delete movie. Please try again.')
    }
  }

  const handleSearch = (e) => {
    const value = removeVietnameseTones(e.target.value.toLowerCase())
    setSearchText(value)
    const filtered = data.filter((item) =>
      removeVietnameseTones(item.name.toLowerCase()).includes(value),
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page on new search
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (image) => <img src={image} alt="movie poster" style={{ width: 75, height: 100 }} />,
    },
    {
      title: 'Phim',
      dataIndex: 'name',
    },
    {
      title: 'Đạo diễn',
      dataIndex: 'director',
      sorter: (a, b) => a.director.localeCompare(b.director),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: 'Thể loại',
      dataIndex: 'genres',
      render: (genres) => genres.join(', '),
      sorter: (a, b) => a.genres.join(', ').localeCompare(b.genres.join(', ')),
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <span
          style={{
            color: status === 'playing' ? 'green' : status === 'upcoming' ? 'orange' : 'red',
          }}
        >
          {status === 'playing'
            ? 'Đang chiếu'
            : status === 'upcoming'
              ? 'Sắp chiếu'
              : 'Không hiển thị'}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="default"
            ghost
            icon={<EditOutlined style={{ color: '#595959' }} />}
            onClick={() => showEditModal(record)}
            style={{
              borderColor: '#d9d9d9',
              color: '#595959',
            }}
          >
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];
  

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9999/movie/get-all')
      setData(response.data.data)
      setFilteredData(response.data.data)
      const allGenres = response.data.data.flatMap((movie) => movie.genres)
      const uniqueGenres = Array.from(new Set(allGenres))
      setExistingGenres(uniqueGenres)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredData.length)

  return (
    <div className="row flex-lg-nowrap">
      <div className="col mb-3">
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tiêu đề"
            value={searchText}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={showCreateModal}>
            Tạo mới
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={filteredData.slice(startIndex, endIndex)}
          pagination={false}
          scroll={{ y: 500 }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <span>{`Hiển thị ${startIndex + 1}-${endIndex} trên tổng số ${filteredData.length} phim`}</span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['10', '20', '50']}
            showQuickJumper={false}
            itemRender={(page, type, originalElement) => {
              if (type === 'prev') return <LeftOutlined />
              if (type === 'next') return <RightOutlined />
              if (type === 'jump-prev') return <DoubleLeftOutlined />
              if (type === 'jump-next') return <DoubleRightOutlined />
              return originalElement
            }}
            scrollToFirstRowOnChange={false}
          />
        </div>
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
  )
}

export default ManageMovie
