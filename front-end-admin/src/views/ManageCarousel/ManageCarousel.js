import React, { useState, useEffect, useRef } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Upload,
  Dropdown,
  Menu,
} from 'antd'
import {
  UploadOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCarousels,
  addCarousel,
  updateCarousel,
  deleteCarousel,
} from '../../reducers/CarouselReducer'
import dayjs from 'dayjs'
import axios from 'axios'

const { Option } = Select
const { confirm } = Modal

const CLOUDINARY_CLOUD_NAME = 'dcepcimwy'
const CLOUDINARY_UPLOAD_PRESET = 'haolx18'

const removeDiacritics = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const ManageCarousel = () => {
  const dispatch = useDispatch()
  const carousels = useSelector((state) => state.carousels.carousels)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedCarousel, setSelectedCarousel] = useState(null)
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState('')
  const [linkType, setLinkType] = useState('none')
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs().add(1, 'day'))
  const [movies, setMovies] = useState([])
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const endDatePickerRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCarousels())
    fetchMovies()
  }, [dispatch])

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:9999/movie/get-all')
      setMovies(response.data.data)
    } catch (error) {
      console.error('Lỗi khi tải phim:', error)
      message.error('Không thể tải danh sách phim.')
    }
  }

  const handleAddCarousel = () => {
    setSelectedCarousel(null)
    form.resetFields()
    setImageUrl('')
    setIsModalVisible(true)
    setLinkType('none')
  }

  const handleEditCarousel = (carousel) => {
    setSelectedCarousel(carousel)
    form.setFieldsValue({
      ...carousel,
      startDate: carousel.startDate ? dayjs(carousel.startDate) : null,
      endDate: carousel.endDate ? dayjs(carousel.endDate) : null,
      movieId: carousel.linkType === 'movie' ? carousel.linkUrl.split('/').pop() : undefined,
    })
    setImageUrl(carousel.imageUrl)
    setLinkType(carousel.linkType)
    setIsModalVisible(true)
  }

  const handleUpload = async (options) => {
    const { file } = options
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      )
      const imageUrl = response.data.secure_url
      setImageUrl(imageUrl)
      message.success('Tải ảnh lên thành công!')
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error)
      message.error('Không thể tải ảnh lên. Vui lòng thử lại.')
    }
  }

  const handleStatusChange = async (carousel, status) => {
    try {
      const updatedCarousel = { ...carousel, status }
      await dispatch(updateCarousel({ id: carousel._id, carousel: updatedCarousel }))
      message.success(`Carousel đã được ${status === 'active' ? 'hiển thị' : 'ẩn'}`)
    } catch (error) {
      message.error('Không thể cập nhật trạng thái của carousel')
    }
  }

  const handleDeleteCarousel = (carousel) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa carousel "${carousel.title}" không?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const updatedCarousel = { ...carousel, status: 'deleted' }
        return dispatch(updateCarousel({ id: carousel._id, carousel: updatedCarousel }))
          .then(() => {
            message.success('Carousel đã được đánh dấu là "đã xóa"')
          })
          .catch(() => {
            message.error('Không thể cập nhật trạng thái của carousel')
          })
      },
    })
  }

  const handleDateChange = (date, dateString, isStartDate) => {
    if (isStartDate) {
      setStartDate(date)
      if (date.isAfter(endDate)) {
        const newEndDate = date.add(1, 'day')
        setEndDate(newEndDate)
        form.setFieldsValue({ endDate: newEndDate })
        message.warning('Vui lòng chọn lại ngày kết thúc.')
        endDatePickerRef.current.focus()
      }
    } else {
      setEndDate(date)
    }
  }

  const disabledEndDate = (current) => {
    return current && (current < startDate || current > startDate.add(6, 'months'))
  }

  const disabledStartDate = (current) => {
    return current && current > dayjs().add(6, 'months')
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      const carouselData = {
        ...values,
        imageUrl,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }

      if (linkType === 'movie') {
        const selectedMovie = movies.find((movie) => movie._id === values.movieId)
        carouselData.linkUrl = `http://localhost:3000/film/detail/${selectedMovie._id}`
      }

      if (selectedCarousel) {
        dispatch(updateCarousel({ id: selectedCarousel._id, carousel: carouselData }))
          .then(() => {
            message.success('Cập nhật carousel thành công')
            setIsModalVisible(false)
            form.resetFields()
            setImageUrl('')
          })
          .catch(() => {
            message.error('Cập nhật carousel thất bại')
          })
      } else {
        dispatch(addCarousel(carouselData))
          .then(() => {
            message.success('Thêm mới carousel thành công')
            setIsModalVisible(false)
            form.resetFields()
            setImageUrl('')
          })
          .catch(() => {
            message.error('Thêm mới carousel thất bại')
          })
      }
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedCarousel(null)
    form.resetFields()
    setImageUrl('')
  }

  const handleLinkTypeChange = (value) => {
    setLinkType(value)
    if (value !== 'external') {
      form.setFieldsValue({ linkUrl: '' })
    }
  }

  const handleSearch = (e) => {
    const searchValue = removeDiacritics(e.target.value)
    setSearchText(searchValue)
  }

  const handlePageSizeChange = (current, size) => {
    setPageSize(size)
  }

  const filteredCarousels = carousels
    .filter((carousel) => carousel.status !== 'deleted')
    .filter((carousel) => {
      const title = removeDiacritics(carousel.title)
      return title.includes(searchText)
    })

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => (
          <span style={{ 
              color: '#000', 
              wordWrap: 'break-word', 
              wordBreak: 'break-word', 
              whiteSpace: 'normal', 
              maxWidth: '200px', 
              display: 'inline-block' 
          }}>
              {text}
          </span>
      ),
  },
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => <img src={text} alt="carousel" style={{ width: '100px' }} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? 'Hiển thị' : 'Ẩn'}
        </span>
      ),
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      sorter: (a, b) => a.displayOrder - b.displayOrder,
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item onClick={() => handleStatusChange(record, 'active')}>Hiển thị</Menu.Item>
            <Menu.Item onClick={() => handleStatusChange(record, 'inactive')}>Ẩn</Menu.Item>
          </Menu>
        )
        return (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditCarousel(record)}
            >
              Chỉnh sửa
            </Button>
            <Dropdown overlay={menu}>
              <Button>
                Trạng thái <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCarousel(record)}
            >
              Xóa
            </Button>
          </Space>
        )
      },
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" onClick={handleAddCarousel}>
          Tạo mới
        </Button>
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề"
          onChange={handleSearch}
          allowClear
          style={{ flexGrow: 1, maxWidth: '300px' }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredCarousels}
        rowKey="_id"
        pagination={
          filteredCarousels.length > 10
            ? {
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onShowSizeChange: handlePageSizeChange,
                showTotal: (total) => (
                  <span style={{ color: '#000' }}>Tổng số {total} bản ghi</span>
                ),
              }
            : false
        }
      />
      <Modal
        title={selectedCarousel ? 'Chỉnh sửa' : 'Tạo mới'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề' },
              { max: 50, message: 'Tiêu đề không được vượt quá 50 ký tự' },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item label="Tải lên ảnh">
            <Upload customRequest={handleUpload} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </Upload>
          </Form.Item>
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded" style={{ width: '100%', marginTop: 10 }} />
          )}
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="active">Kích hoạt</Option>
              <Option value="inactive">Hủy kích hoạt</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="displayOrder"
            label="Thứ tự hiển thị"
            rules={[
              { required: true, message: 'Vui lòng nhập thứ tự hiển thị' },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject('Vui lòng nhập số')
                  }
                  if (isNaN(value)) {
                    return Promise.reject('Chỉ được nhập số')
                  }
                  if (value < 1) {
                    return Promise.reject('Giá trị phải lớn hơn 0')
                  }
                  if (value > 9999) {
                    return Promise.reject('Thứ tự hiển thị tối đa là 9999')
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input type="number" min={1} max={9999} />
          </Form.Item>

          <Form.Item label="Khoảng thời gian">
            <Input.Group compact>
              <Form.Item
                name="startDate"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker
                  placeholder="Ngày bắt đầu"
                  style={{ width: '50%' }}
                  value={startDate}
                  onChange={(date, dateString) => handleDateChange(date, dateString, true)}
                  disabledDate={disabledStartDate}
                />
              </Form.Item>
              <Form.Item
                name="endDate"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
              >
                <DatePicker
                  ref={endDatePickerRef}
                  placeholder="Ngày kết thúc"
                  style={{ width: '50%' }}
                  value={endDate}
                  onChange={(date, dateString) => handleDateChange(date, dateString, false)}
                  disabledDate={disabledEndDate}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name="linkType"
            label="Loại liên kết"
            rules={[{ required: true, message: 'Vui lòng chọn loại liên kết' }]}
          >
            <Select onChange={handleLinkTypeChange}>
              <Option value="movie">Phim</Option>
              <Option value="external">Liên kết ngoài</Option>
              <Option value="none">Không</Option>
            </Select>
          </Form.Item>
          {linkType === 'movie' && (
            <Form.Item
              name="movieId"
              label="Chọn phim"
              rules={[{ required: true, message: 'Vui lòng chọn một phim' }]}
            >
              <Select showSearch placeholder="Tìm kiếm phim">
                {movies.map((movie) => (
                  <Option key={movie._id} value={movie._id}>
                    {movie.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {linkType === 'external' && (
            <Form.Item
              name="linkUrl"
              label="URL liên kết"
              rules={[{ required: true, message: 'Vui lòng nhập URL liên kết ngoài' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ max: 200, message: 'Mô tả không được vượt quá 200 ký tự' }]}
          >
            <Input.TextArea maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageCarousel
