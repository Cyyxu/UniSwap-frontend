import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import AdminRoute from './components/AdminRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import CommodityList from './pages/CommodityList'
import CommodityDetail from './pages/CommodityDetail'
import CommodityManage from './pages/CommodityManage'
import OrderList from './pages/OrderList'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostCreate from './pages/PostCreate'
import UserCenter from './pages/UserCenter'
import AIChat from './pages/AIChat'
import Favorites from './pages/Favorites'
import NoticeList from './pages/NoticeList'
import ChatRoom from './pages/ChatRoom'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminUserManage from './pages/Admin/UserManage'
import AdminCommodityManage from './pages/Admin/CommodityManage'
import AdminOrderManage from './pages/Admin/OrderManage'
import AdminPostManage from './pages/Admin/PostManage'
import AdminStatistics from './pages/Admin/Statistics'
import AdminSettings from './pages/Admin/Settings'
import AdminNoticeManage from './pages/Admin/NoticeManage'
import AdminCommentManage from './pages/Admin/CommentManage'
import AdminScoreManage from './pages/Admin/ScoreManage'
import MyFavourites from './pages/MyFavourites'
import MyComments from './pages/MyComments'
import MyCommodities from './pages/MyCommodities'
import UserFavourites from './pages/UserFavourites'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="commodity" element={<CommodityList />} />
          <Route path="commodity/:id" element={<CommodityDetail />} />
          <Route path="commodity-manage" element={<PrivateRoute><CommodityManage /></PrivateRoute>} />
          <Route path="order" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="post" element={<PostList />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="post/create" element={<PrivateRoute><PostCreate /></PrivateRoute>} />
          <Route path="user" element={<PrivateRoute><UserCenter /></PrivateRoute>} />
          <Route path="ai-chat" element={<PrivateRoute><AIChat /></PrivateRoute>} />
          <Route path="favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="my-favourites" element={<PrivateRoute><MyFavourites /></PrivateRoute>} />
          <Route path="user-favourites" element={<UserFavourites />} />
          <Route path="my-comments" element={<PrivateRoute><MyComments /></PrivateRoute>} />
          <Route path="my-commodities" element={<PrivateRoute><MyCommodities /></PrivateRoute>} />
          <Route path="notice" element={<NoticeList />} />
          <Route path="message" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
        </Route>
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManage />} />
          <Route path="commodities" element={<AdminCommodityManage />} />
          <Route path="orders" element={<AdminOrderManage />} />
          <Route path="posts" element={<AdminPostManage />} />
          <Route path="notices" element={<AdminNoticeManage />} />
          <Route path="comments" element={<AdminCommentManage />} />
          <Route path="scores" element={<AdminScoreManage />} />
          <Route path="statistics" element={<AdminStatistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

