import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
} from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilm, faTheaterMasks, faTicket, faCalendar} from '@fortawesome/free-solid-svg-icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
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
    icon: <FontAwesomeIcon icon={faFilm} style={{marginRight: "5px"}} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cinema',
    to: '/cinema',
    icon: <FontAwesomeIcon icon={faTheaterMasks} style={{marginRight: "5px"}} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: ' Ticket',
    to: '/ticket',
    icon: <FontAwesomeIcon icon={faTicket} style={{marginRight: "5px"}} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Showtime',
    to: '/showtime',
    icon: <FontAwesomeIcon icon={faCalendar} style={{marginRight: "5px"}} customClassName="nav-icon" />,
  },
]

export default _nav
