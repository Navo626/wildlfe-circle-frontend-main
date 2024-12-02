import "./App.css";
import SignIn from "./pages/SignIn.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import BlogList from "./pages/BlogList.jsx";
import Blog from "./pages/Blog.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Gallery from "./pages/Gallery.jsx";
import Error404 from "./pages/404.jsx";
import Forest3D from "./pages/Forest3D.jsx";
import useCheckSession from "./hooks/useCheckSession.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminGallery from "./pages/admin/AdminGallery.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AdminAbout from "./pages/admin/content/AdminAbout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import Product from "./pages/Product.jsx";
import ProductList from "./pages/ProductList.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import {useEffect, useState} from "react";
import AdminNews from "./pages/admin/AdminNews.jsx";
import NewsList from "./pages/NewsList.jsx";
import ProjectList from "./pages/ProjectList.jsx";
import Project from "./pages/Project.jsx";
import News from "./pages/News.jsx";
import AdminBlogs from "./pages/admin/AdminBlogs.jsx";
import Session from "./pages/Session.jsx";
import AdminSession from "./pages/admin/AdminSession.jsx";

function App() {
  useCheckSession();
  const { pathname } = useLocation();
  const [audio] = useState(new Audio("./audio/Forest.mp3"));

  useEffect(() => {
    if (pathname === "/forest") {
      audio.loop = true;
      audio.play().then((r) => r);
    } else {
      audio.pause();
    }
  }, [audio, pathname]);

  return (
    <>
      <div className="bg-white dark:bg-gray-950 transition duration-500">
        <Routes>
          {/* Public routes */}
          <Route path={"/"} element={<Home />} />
          <Route path={"/blog"} element={<BlogList />} />
          <Route path={"/blog/:id"} element={<Blog />} />
          <Route path={"/news"} element={<NewsList />} />
          <Route path={"/news/:id"} element={<News />} />
          <Route path={"/project"} element={<ProjectList />} />
          <Route path={"/project/:id"} element={<Project />} />
          <Route path={"/session"} element={<Session />} />
          <Route path={"/gallery"} element={<Gallery />} />
          <Route path={"/forest"} element={<Forest3D />} />
          <Route path={"/product"} element={<ProductList />} />
          <Route path={"/product/:id"} element={<Product />} />
          <Route path={"/about"} element={<About />} />
          <Route path={"/contact"} element={<Contact />} />

          {/* Auth routes */}
          <Route path={"/login"} element={<SignIn />} />
          <Route path={"/register"} element={<SignUp />} />
          <Route path={"/forgot-password"} element={<ForgotPassword />} />
          <Route path={"/reset-password/:token"} element={<ResetPassword />} />

          {/* 404 route */}
          <Route path={"*"} element={<Error404 />} />

          {/* Admin routes */}
          <Route path="/admin/" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path={"/admin/sessions"} element={<AdminSession />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/content/about" element={<AdminAbout />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
