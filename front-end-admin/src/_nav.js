import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFilm, faTheaterMasks, faTicket, faCalendar, faClipboardList, faCookieBite, faUser } from '@fortawesome/free-solid-svg-icons';

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import useCinemas from './components/useCinemas';

const NavComponent = () => {
  const cinemas = useCinemas();

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: 'info',
        text: 'NEW',
      },
    },
    {
      component: CNavTitle,
      name: 'Quản lý',
    },
    {
      component: CNavItem,
      name: 'Phim',
      to: '/film',
      icon: <FontAwesomeIcon icon={faFilm} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Rạp chiếu phim',
      to: '/cinema',
      icon: <FontAwesomeIcon icon={faTheaterMasks} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Vé',
      to: '/ticket',
      icon: <FontAwesomeIcon icon={faTicket} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Bỏng ngô & nước uống',
      to: '/popcorn',
      icon: <FontAwesomeIcon icon={faCookieBite} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Phòng',
      icon: <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
      items: Array.isArray(cinemas) ? cinemas.map(cinema => ({
        component: CNavItem,
        name: cinema.name,
        to: `/room/${cinema._id}`,
      })) : [],
    },
    {
      component: CNavGroup,
      name: 'Showtime',
      icon: <FontAwesomeIcon icon={faCalendar} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
      items: Array.isArray(cinemas) ? cinemas.map(cinema => ({
        component: CNavItem,
        name: cinema.name,
        to: `/showtime/${cinema._id}`,
      })) : [],
    },
    {
      component: CNavItem,
      name: 'Quản lý tài khoản',
      to: '/manage-account',
      icon: <FontAwesomeIcon icon={faUser} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
  ];
};

export default NavComponent;
