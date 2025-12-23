import { Suspense, lazy, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import AdminRoute from './components/AdminRoute'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const CommodityList = lazy(() => import('./pages/CommodityList'))
const CommodityDetail = lazy(() => import('./pages/CommodityDetail'))
const CommodityManage = lazy(() => import('./pages/CommodityManage'))
const Cart = lazy(() => import('./pages/Cart'))
const OrderList = lazy(() => import('./pages/OrderList'))
const PostList = lazy(() => import('./pages/PostList'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const PostCreate = lazy(() => import('./pages/PostCreate'))
const UserCenter = lazy(() => import('./pages/UserCenter'))
const AIChat = lazy(() => import('./pages/AIChat'))
const Favorites = lazy(() => import('./pages/Favorites'))
const NoticeList = lazy(() => import('./pages/NoticeList'))
const ChatRoom = lazy(() => import('./pages/ChatRoom'))
const AdminLayout = lazy(() => import('./components/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminUserManage = lazy(() => import('./pages/Admin/UserManage'))
const AdminCommodityManage = lazy(() => import('./pages/Admin/CommodityManage'))
const AdminOrderManage = lazy(() => import('./pages/Admin/OrderManage'))
const AdminPostManage = lazy(() => import('./pages/Admin/PostManage'))
const AdminStatistics = lazy(() => import('./pages/Admin/Statistics'))
const AdminSettings = lazy(() => import('./pages/Admin/Settings'))
const AdminNoticeManage = lazy(() => import('./pages/Admin/NoticeManage'))
const AdminCommentManage = lazy(() => import('./pages/Admin/CommentManage'))
const AdminScoreManage = lazy(() => import('./pages/Admin/ScoreManage'))
const MyFavourites = lazy(() => import('./pages/MyFavourites'))
const MyComments = lazy(() => import('./pages/MyComments'))
const MyCommodities = lazy(() => import('./pages/MyCommodities'))
const UserFavourites = lazy(() => import('./pages/UserFavourites'))

const PageLoader = () => (
  <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spin size="large" />
  </div>
)

function PrivateRoute({ children }: { children: ReactNode }) {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="commodity" element={<CommodityList />} />
            <Route path="commodity/:id" element={<CommodityDetail />} />
            <Route path="commodity-manage" element={<PrivateRoute><CommodityManage /></PrivateRoute>} />
            <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
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
      </Suspense>
    </BrowserRouter>
  )
}

export default App
