import { Routes, Route } from 'react-router-dom';
import CategoryCarousel from './components/CategoryCarousel';
import HeroCarousel from './components/HeroCarousel';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import ProfilePage from './pages/ProfilePage';

function App() {

  return (
    <>
    <NavBar/>

    <Routes>
      <Route path="/" element={<Home/>} ></Route>
      <Route path='/shop' element={<Shop/>}></Route>
      <Route path='/detail/:productid' element={<ProductDetail/>}></Route>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<ProfilePage/>}></Route>

    </Routes>


    <Footer/>
    </>
  )
}

export default App
