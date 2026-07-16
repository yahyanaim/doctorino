import Home from '../pages/Home';
import Services from '../pages/Services';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Contact from '../pages/Contact';
import Doctors from '../pages/Doctors/Doctors';
import DoctorDetails from '../pages/Doctors/DoctorDetails';
import MyBookings from '../pages/MyBookings';
import DoctorApprovals from '../pages/admin/DoctorApprovals';
import CreateDoctor from '../pages/admin/CreateDoctor';
import {Routes, Route} from 'react-router-dom';

function Routers() {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctor/:id' element={<DoctorDetails/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/services' element={<Services />} />
        <Route path='/dashboard' element={<MyBookings />} />
        <Route path='/admin/doctors' element={<DoctorApprovals />} />
        <Route path='/admin/doctors/create' element={<CreateDoctor />} />
    </Routes>
  )
}

export default Routers
