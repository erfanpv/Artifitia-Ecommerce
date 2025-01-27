import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import SignupPage from './pages/SignUp.jsx';
import SigninPage from './pages/SignIn.jsx';
import { Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Sidebar from './components/Sidebar.jsx';
import EditProduct from './components/EditProduct.jsx';
import LoginProtect from './components/ProtectRoutes/ProtectedRoute.jsx';

function Layout() {
  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<SigninPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/:id" element={<ProductDetails />} />
          <Route path="/edit-product/:id" element={< LoginProtect element={<EditProduct />} />} />

          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
      <Toaster />
    </Router>

  );
}

export default App;