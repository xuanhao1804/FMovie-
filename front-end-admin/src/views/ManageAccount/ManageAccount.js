import React, { useState, useEffect } from 'react'
import { Table, Modal, Button, Tag, Input, Select, message } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Option } = Select

const removeDiacritics = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const ManageAccount = ({ darkMode }) => {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:9999/account')
        if (response.data.success) {
          setAccounts(response.data.data)
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản:', error)
      }
    }
    fetchAccounts()
  }, [])

  const handleSearch = (e) => {
    const searchValue = removeDiacritics(e.target.value.toLowerCase())
    setSearchText(searchValue)
  }

  const handlePageSizeChange = (current, size) => {
    setPageSize(size)
  }

  const filteredAccounts = accounts.filter((account) => {
    const email = removeDiacritics(account.email.toLowerCase())
    const fullname = removeDiacritics(account.fullname.toLowerCase())
    return email.includes(searchText) || fullname.includes(searchText)
  })

  const showViewModal = (account) => {
    setSelectedAccount(account)
    setIsViewModalVisible(true)
  }

  const showEditModal = (account) => {
    if (account.role === 'admin') {
      message.warning('Không thể chỉnh sửa tài khoản admin.')
      return
    }
    setSelectedAccount(account)
    setFormData(account)
    setIsEditModalVisible(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value })
  }

  const handleRoleChange = (value) => {
    setFormData({ ...formData, roles: [value] })
  }

  const handleUpdateAccount = async () => {
    try {
      const updatedData = {
        ...formData,
        password: formData.password,
      }

      const response = await axios.put(
        `http://localhost:9999/account/${selectedAccount._id}`,
        updatedData,
      )
      setAccounts(
        accounts.map((acc) => (acc._id === selectedAccount._id ? response.data.data : acc)),
      )
      setIsEditModalVisible(false)
      message.success('Cập nhật tài khoản thành công!')
    } catch (error) {
      console.error('Lỗi khi cập nhật tài khoản:', error)
      message.error('Cập nhật tài khoản thất bại')
    }
  }

  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Họ và tên', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <span>
          {roles && roles.length > 0
            ? roles.map((role, index) => (
                <Tag color={role === 'admin' ? 'volcano' : 'blue'} key={index}>
                  {role.toUpperCase()}
                </Tag>
              ))
            : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status ? status.toUpperCase() : 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)} />
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            disabled={record.roles && record.roles.includes('admin')}
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Tìm kiếm theo email hoặc tên"
          onChange={handleSearch}
          allowClear
          style={{ flexGrow: 1, maxWidth: '300px' }}
        />
      </div>
      <Table
        dataSource={filteredAccounts}
        columns={columns}
        rowKey="_id"
        pagination={
          filteredAccounts.length > 10
            ? {
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onShowSizeChange: handlePageSizeChange,
                showTotal: (total) => (
                  <span style={{ color: darkMode ? '#FFF' : '#000' }}>
                    Tổng số {total} tài khoản
                  </span>
                ),
              }
            : false
        }
      />

      {/* View Modal */}
      <Modal
        title="Thông tin tài khoản"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={<Button onClick={() => setIsViewModalVisible(false)}>Đóng</Button>}
      >
        {selectedAccount && (
          <div>
            <p>
              <strong>Email:</strong> {selectedAccount.email}
            </p>
            <p>
              <strong>Họ và tên:</strong> {selectedAccount.fullname}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedAccount.phone}
            </p>
            <p>
              <strong>Vai trò:</strong>{' '}
              {selectedAccount.roles && selectedAccount.roles.length > 0
                ? selectedAccount.roles.map((role, index) => (
                    <Tag color={role === 'admin' ? 'volcano' : 'blue'} key={index}>
                      {role.toUpperCase()}
                    </Tag>
                  ))
                : 'N/A'}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedAccount.status}
            </p>
            <p>
              <strong>Ngày sinh:</strong>{' '}
              {selectedAccount.dob ? new Date(selectedAccount.dob).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Cập nhật tài khoản"
        open={isEditModalVisible}
        onOk={handleUpdateAccount}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {formData && (
          <div>
            <label>
              <strong>Họ và tên:</strong>
            </label>
            <Input
              name="fullname"
              value={formData.fullname}
              onChange={handleEditChange}
              placeholder="Họ và tên"
              style={{ marginBottom: 8 }}
            />
            <label>
              <strong>Số điện thoại:</strong>
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleEditChange}
              placeholder="Số điện thoại"
              style={{ marginBottom: 8 }}
            />
            <label>
              <strong>Vai trò:</strong>
            </label>
            <Select
              value={formData.roles && formData.roles.length > 0 ? formData.roles[0] : 'user'}
              onChange={handleRoleChange}
              style={{ width: '100%', marginBottom: 8 }}
            >
              <Option value="user">USER</Option>
              <Option value="seller">SELLER</Option>
            </Select>

            <label>
              <strong>Trạng thái:</strong>
            </label>
            <Select
              value={formData.status}
              onChange={handleStatusChange}
              style={{ width: '100%', marginBottom: 8 }}
            >
              <Option value="active">Kích hoạt</Option>
              <Option value="disable">Khóa</Option>
            </Select>
            <label>
              <strong>Mật khẩu:</strong>
            </label>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <Input.Password
                name="password"
                value={formData.password || ''}
                onChange={handleEditChange}
                placeholder="Mật khẩu"
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
  )
}

export default ManageAccount
