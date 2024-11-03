import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarousels, addCarousel, updateCarousel, deleteCarousel } from '../../reducers/CarouselReducer';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

// Đặt các biến cấu hình Cloudinary lên đầu để dễ chỉnh sửa
const CLOUDINARY_CLOUD_NAME = 'dcepcimwy'; // Thay bằng cloud_name của bạn
const CLOUDINARY_UPLOAD_PRESET = 'haolx18'; // Thay bằng upload preset của bạn

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
    setImageUrl(''); // Reset image URL
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
    setImageUrl(carousel.imageUrl); // Set current image URL
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
        imageUrl, // Sử dụng URL của ảnh đã upload
      };
  
      if (linkType === 'movie') {
        const selectedMovie = movies.find(movie => movie._id === values.movieId);
        carouselData.linkUrl = `http://localhost:3000/film/detail/${selectedMovie._id}`; // Tự động điền URL chi tiết phim
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
    setImageUrl(''); // Reset image URL
  };

  const handleLinkTypeChange = (value) => {
    setLinkType(value);
    if (value !== 'external') {
      form.setFieldsValue({ linkUrl: '' });
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
    },
    {
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
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
      <Button type="primary" onClick={handleAddCarousel}>Add Carousel</Button>
      <Table columns={columns} dataSource={carousels} rowKey="_id" />

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
