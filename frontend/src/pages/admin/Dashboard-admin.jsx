import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, LogOut, Users, Key, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InviteCodeButton from '../../components/admin/InviteCodeButton';
import RoomDetails from '../../components/admin/RoomDetails';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { persistStore } from 'redux-persist'
import store from '@/redux/store';
import { toast } from 'sonner';

const DashboardAdmin = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let persistor = persistStore(store);
  const user = useSelector((state) => state.auth?.user);

  const logoutHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/auth/user/logoutUser',
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(logout());
        persistor.purge();
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Logout failed');
      toast.error(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header section remains the same */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-xl backdrop-blur-sm bg-opacity-80">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your room settings and access</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="space-x-2 bg-white bg-opacity-50 backdrop-blur-sm"
                  onClick={logoutHandler}
                  disabled={loading}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{loading ? 'Logging out...' : 'Logout'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign out of your account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {roomId ? (
          <div className="grid gap-6">
            <Card className="backdrop-blur-sm bg-white bg-opacity-90">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Room Information</CardTitle>
                  <Badge variant="outline" className="font-mono">
                    {roomId}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Active Users</h3>
                      <p className="text-sm text-gray-500">Currently online</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Key className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Link to={`/admin/dashboard/${user.room}/device-setup`}>
                        <Button 
                          className="group relative overflow-hidden bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
                        >
                          <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12" />
                          <span className="relative flex items-center space-x-2">
                            <Key className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                            <span>Access Control</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </Link>
                      <p className="text-sm text-gray-500">Manage Devices</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Session Time</h3>
                      <p className="text-sm text-gray-500">Room activity</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white bg-opacity-90">
                <CardHeader>
                  <CardTitle>Room Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <InviteCodeButton roomId={roomId} />
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white bg-opacity-90">
                <CardHeader>
                  <CardTitle>Room Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <RoomDetails roomId={roomId} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="text-center p-12 backdrop-blur-sm bg-white bg-opacity-90">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-600">No Room ID Provided</h2>
              <p className="text-gray-500">Please make sure to include a valid room ID in the URL</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;