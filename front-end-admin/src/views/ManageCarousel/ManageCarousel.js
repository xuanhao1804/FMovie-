import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarousels, addCarousel, updateCarousel, deleteCarousel } from '../../reducers/CarouselReducer';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

const CLOUDINARY_CLOUD_NAME = 'dcepcimwy';
const CLOUDINARY_UPLOAD_PRESET = 'haolx18';

const ManageCarousel = () => {
  const dispatch = useDispatch();
  const carousels = useSelector((state) => state.carousels.carousels);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [linkType, setLinkType] = useState('none');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchCarousels());
    fetchMovies();
  }, [dispatch]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:9999/movie/get-all');
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      message.error('Failed to fetch movies.');
    }
  };

  const handleAddCarousel = () => {
    setSelectedCarousel(null);
    form.resetFields();
    setImageUrl('');
    setIsModalVisible(true);
    setLinkType('none');
  };

  const handleEditCarousel = (carousel) => {
    setSelectedCarousel(carousel);
    form.setFieldsValue({
      ...carousel,
      startDate: carousel.startDate ? dayjs(carousel.startDate) : null,
      endDate: carousel.endDate ? dayjs(carousel.endDate) : null,
    });
    setImageUrl(carousel.imageUrl);
    setLinkType(carousel.linkType);
    setIsModalVisible(true);
  };

  const handleUpload = async (options) => {
    const { file } = options;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;
      setImageUrl(imageUrl);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image. Please try again.');
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const carouselData = {
        ...values,
        imageUrl,
      };

      if (linkType === 'movie') {
        const selectedMovie = movies.find(movie => movie._id === values.movieId);
        carouselData.linkUrl = `http://localhost:3000/film/detail/${selectedMovie._id}`;
      }

      if (selectedCarousel) {
        dispatch(updateCarousel({ id: selectedCarousel._id, carousel: carouselData }))
          .then(() => {
            message.success('Carousel updated successfully');
            setIsModalVisible(false);
            form.resetFields();
            setImageUrl('');
          })
          .catch(() => {
            message.error('Failed to update carousel');
          });
      } else {
        dispatch(addCarousel(carouselData))
          .then(() => {
            message.success('Carousel added successfully');
            setIsModalVisible(false);
            form.resetFields();
            setImageUrl('');
          })
          .catch(() => {
            message.error('Failed to add carousel');
          });
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCarousel(null);
    form.resetFields();
    setImageUrl('');
  };

  const handleLinkTypeChange = (value) => {
    setLinkType(value);
    if (value !== 'external') {
      form.setFieldsValue({ linkUrl: '' });
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredCarousels = carousels.filter((carousel) =>
    carousel.title.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Image URL',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => <img src={text} alt="carousel" style={{ width: '100px' }} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      sorter: (a, b) => a.displayOrder - b.displayOrder,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditCarousel(record)}>Edit</Button>
          <Button type="danger" onClick={() => dispatch(deleteCarousel(record._id)).then(() => {
            message.success('Carousel deleted successfully');
          }).catch(() => {
            message.error('Failed to delete carousel');
          })}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddCarousel} style={{ marginRight: 10 }}>Add Carousel</Button>
        <Input.Search placeholder="Search by title" onChange={handleSearch} style={{ width: 200 }} />
      </div>
      <Table columns={columns} dataSource={filteredCarousels} rowKey="_id" />

      <Modal
        title={selectedCarousel ? 'Edit Carousel' : 'Create Carousel'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload customRequest={handleUpload} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '100%', marginTop: 10 }} />}
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the status' }]}>
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item name="displayOrder" label="Display Order" rules={[{ required: true, message: 'Please enter the display order' }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Date Range">
            <Input.Group compact>
              <Form.Item
                name="startDate"
                noStyle
                rules={[{ required: true, message: 'Please select the start date' }]}
              >
                <DatePicker placeholder="Start Date" style={{ width: '50%' }} />
              </Form.Item>
              <Form.Item
                name="endDate"
                noStyle
                rules={[{ required: true, message: 'Please select the end date' }]}
              >
                <DatePicker placeholder="End Date" style={{ width: '50%' }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item name="linkType" label="Link Type" rules={[{ required: true, message: 'Please select the link type' }]}>
            <Select onChange={handleLinkTypeChange}>
              <Option value="movie">Movie</Option>
              <Option value="external">External</Option>
              <Option value="none">None</Option>
            </Select>
          </Form.Item>

          {linkType === 'movie' && (
            <Form.Item name="movieId" label="Select Movie" rules={[{ required: true, message: 'Please select a movie' }]}>
              <Select showSearch placeholder="Search for a movie">
                {movies.map(movie => (
                  <Option key={movie._id} value={movie._id}>{movie.name}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {linkType === 'external' && (
            <Form.Item name="linkUrl" label="Link URL" rules={[{ required: true, message: 'Please enter the external URL' }]}>
              <Input />
            </Form.Item>
          )}

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCarousel;
