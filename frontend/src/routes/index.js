import route from '@config/route'
import Home from '@pages/home'
import DetailPost from '@pages/detail-post'
import Notification from '@pages/notification'
import Message from '@pages/message'
import RoomConversation from '@components/conversation/room-conversation'
import CreatePost from '@pages/create-post'
import Profile from '@pages/profile'
import ChatPc from '@pages/chat-pc'
import Login from '@pages/auth/login'
import Register from '@pages/auth/register'
import Verification from '@pages/vefity'
import ResetPassWordFrom from '@pages/auth/reset-password'
import FollowingPage from '../pages/following'
import NewsPage from '../pages/news'

export const routesPrivate = [
  {
    path: route.home,
    component: <Home />
  },
  {
    path: route.detailPost,
    component: <DetailPost />
  },
  {
    path: route.notifi,
    component: <Notification />
  },
  {
    path: route.message,
    component: <Message />
  },
  {
    path: route.roomChat,
    component: <RoomConversation />
  },
  {
    path: route.makePost,
    component: <CreatePost />
  },
  {
    path: route.profile,
    component: <Profile />
  },
  {
    path: route.chat,
    component: <ChatPc />
  },
  {
    path: route.chatRoom,
    component: <ChatPc />
  },
  {
    path: route.following,
    component: <FollowingPage />
  },
  {
    path: route.news,
    component: <NewsPage />
  }
]

export const routesPublic = [
  {
    path: route.login,
    component: <Login />
  },
  {
    path: route.verify,
    component: <Verification />
  },
  {
    path: route.register,
    component: <Register />
  },

  {
    path: route.reset,
    component: <ResetPassWordFrom />
  }
]
