import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTheaterMasks, faTicket, faCalendar, faClipboardList, faCookieBite } from '@fortawesome/free-solid-svg-icons';
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
      name: 'Management',
    },
    {
      component: CNavItem,
      name: 'Film',
      to: '/film',
      icon: <FontAwesomeIcon icon={faFilm} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Cinema',
      to: '/cinema',
      icon: <FontAwesomeIcon icon={faTheaterMasks} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Ticket',
      to: '/ticket',
      icon: <FontAwesomeIcon icon={faTicket} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'PopCorn',
      to: '/popcorn',
      icon: <FontAwesomeIcon icon={faCookieBite} style={{ marginRight: "5px" }} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Room',
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
      })) : [], // Đảm bảo rằng nếu không phải là mảng thì trả về mảng rỗng
    },
  ];
};

export default NavComponent; // Xuất như một component
