import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Tag, Input, Select, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:9999/account'); // Gọi API để lấy danh sách tài khoản
        if (response.data.success) {
          setAccounts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const showViewModal = (account) => {
    setSelectedAccount(account);
    setIsViewModalVisible(true);
  };

  const showEditModal = (account) => {
    setSelectedAccount(account);
    setFormData(account);
    setIsEditModalVisible(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value });
  };

  const handleUpdateAccount = async () => {
    try {
      const updatedData = {
        ...formData,
        password: formData.password // Gửi mật khẩu mới (nếu cần)
      };

      const response = await axios.put(`http://localhost:9999/account/${selectedAccount._id}`, updatedData);
      setAccounts(accounts.map(acc => acc._id === selectedAccount._id ? response.data.data : acc));
      setIsEditModalVisible(false);
      message.success('Account updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      message.error('Failed to update account');
    }
  };

  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Họ và tên', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)} />
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={accounts} columns={columns} rowKey="_id" />

      {/* View Modal */}
      <Modal
        title="Tài khoản"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={<Button onClick={() => setIsViewModalVisible(false)}>Close</Button>}
      >
        {selectedAccount && (
          <div>
            <p><strong>Email:</strong> {selectedAccount.email}</p>
            <p><strong>Họ và tên:</strong> {selectedAccount.fullname}</p>
            <p><strong>Số điện thoại:</strong> {selectedAccount.phone}</p>
            <p><strong>Trạng thái:</strong> {selectedAccount.status}</p>
            <p><strong>Ngày sinh:</strong> {new Date(selectedAccount.dob).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Cập nhật"
        visible={isEditModalVisible}
        onOk={handleUpdateAccount}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {formData && (
          <div>
            <label><strong>Họ và tên:</strong></label>
            <Input
              name="fullname"
              value={formData.fullname}
              onChange={handleEditChange}
              placeholder="Full Name"
              style={{ marginBottom: 8 }}
            />
            <label><strong>Số điện thoại:</strong></label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleEditChange}
              placeholder="Phone"
              style={{ marginBottom: 8 }}
            />
            <label><strong>Status:</strong></label>
            <Select
              value={formData.status}
              onChange={handleStatusChange}
              style={{ width: '100%', marginBottom: 8 }}
            >
              <Option value="active">Kích hoạt</Option>
              <Option value="disable">Khóa</Option>
            </Select>
            <label><strong>Mật khẩu:</strong></label>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <Input.Password
                name="password"
                value={formData.password || ''}
                onChange={handleEditChange}
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
              />
              <Button
                type="text"
                icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10, top: 5 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageAccount;
