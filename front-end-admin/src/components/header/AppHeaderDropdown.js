// src/components/header/AppHeaderDropdown.js
import React from 'react';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import avatar8 from './../../assets/images/avatars/8.jpg';
import { useDispatch } from 'react-redux';
import { logout } from '../../reducers/UserReducer';
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem onClick={handleChangePassword}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Change Password
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;