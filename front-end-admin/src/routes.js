import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
// const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/base/cards/Cards'))
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
// const Navs = React.lazy(() => import('./views/base/navs/Navs'))
// const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
// const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
// const Progress = React.lazy(() => import('./views/base/progress/Progress'))
// const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
// const Tables = React.lazy(() => import('./views/base/tables/Tables'))
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// // Buttons
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
// const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

// //Forms
// const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

// // Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// // Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const ManageMovie = React.lazy(() => import('./views/ManageMovie/ManageMovie'))
const ManageCinema = React.lazy(() => import('./views/ManageCinema/ManageCinema'))

const ManageShowtime = React.lazy(() => import('./views/ManageShowtime/ManageShowtime'))
const ManagePopCorn = React.lazy(() => import('./views/ManagePopCorn/ManagePopCorn'))
const ManageRoom = React.lazy(() => import('./views/ManageRoom/ManageRoom'))
const ViewBooking = React.lazy(() => import('./views/ViewBooking/ViewBooking'))
const ManageAccount = React.lazy(() => import('./views/ManageAccount/ManageAccount'))
const ManageCarousel = React.lazy(() => import('./views/ManageCarousel/ManageCarousel'))
import ChangePassword from './views/ChangePassword/ChangePassword';


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/cinema', name: 'Cinema', element: ManageCinema, exact: true },
  { path: '/film', name: 'Film', element: ManageMovie, exact: true },
  { path: '/showtime/:id', name: 'Cinema > Showtime', element: ManageShowtime, exact: true },
  { path: '/popcorn', name: 'PopCorn', element: ManagePopCorn, exact: true },
  { path: '/ticket', name: 'Ticket', element: ViewBooking, exact: true },
  { path: "/room/:cinemaId", name: "Cinema > Room", element: ManageRoom, exact: true },
  {
    path: '/manage-account',
    exact: true,
    name: 'Manage Account',
    element: ManageAccount,
},
{
  path: '/manage-carousel',
  exact: true,
  name: 'Manage Carousel',
  element: ManageCarousel,
},{
  path: '/change-password',
  exact: true,
  name: 'Change Password',
  element:ChangePassword ,
}
]

export default routes
