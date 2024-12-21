
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SetupRoom from './components/auth/Setup-Room';

import Login from './components/auth/Login';
import DashboardAdmin from './pages/admin/Dashboard-admin';
import FindRoom from './components/auth/Find-Room';
import AddMember from './components/auth/AddMember';
import JoinMember from './components/auth/JoinMember';
import LoginMember from './components/auth/LoginMember';
import DashboardMember from './pages/member/Dashboard-member';
import Signup from './components/auth/Signup';
import JoinAdmin from './components/auth/JoinAdmin';
import RegisterAdmin from './components/auth/RegisterAdmin';
import ProtectedRoute1 from './components/ProtectedRoute1';



const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/setup-room",
    element: <SetupRoom />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: `/admin/dashboard/:roomId`,
    element: <ProtectedRoute1>
      <DashboardAdmin />
    </ProtectedRoute1>
  },
  {
    path: "/find-room",
    element: <FindRoom />
  },
  {
    path: "/add-member",
    element: <AddMember />
  },
  {
    path: "/add-member/join",
    element: <JoinMember />
  },
  {
    path: "/add-member/login",
    element: <LoginMember />
  },
  {
    path: `/member/dashboard`,
    element: <DashboardMember />
  },
  {
    path: "/add-admin",
    element: <JoinAdmin />
  },
  {
    path: "/add-admin/register",
    element: <RegisterAdmin />
  }
])
const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
