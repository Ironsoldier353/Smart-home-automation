import { User, Mail, Home, Shield, LogOut, CornerUpLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { persistStore } from 'redux-persist';
import store from '@/redux/store';
import { toast } from 'sonner';
import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/button";

const AdminUserDetails = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth?.user);
    const roomId = user?.room;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let persistor = persistStore(store);

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

    const userDetails = [
        { icon: User, label: "Username", value: user.username },
        { icon: Mail, label: "Email", value: user.email },
        { icon: Home, label: "Room ID", value: user.room || 'No Room Assigned' },
        { icon: Shield, label: "Role", value: user.role }
    ];

    const goToDashboard = () => {
        navigate(`/admin/dashboard/${roomId}`);
    }

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* Back Button */}
            <button
                onClick={goToDashboard}
                className="group relative p-2 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center space-y-1">
                    <div className="p-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200">
                        <CornerUpLeft className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 text-xs">
                        Go to Dashboard
                    </span>
                </div>
            </button>


            {/* Logout Button */}
            <Button
                variant="outline"
                className="absolute top-4 right-4 space-x-2 bg-white bg-opacity-50 backdrop-blur-sm"
                onClick={logoutHandler}
                disabled={loading}
            >
                <LogOut className="w-4 h-4 text-red-600" />
                <span className="text-red-600">{loading ? 'Logging out...' : 'Logout'}</span>
            </Button>

            <div className="flex items-center justify-center min-h-full">
                <Card className="max-w-lg w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            User Details
                        </CardTitle>
                        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {userDetails.map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Icon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        {label}
                                    </h3>
                                    <p className={`text-lg font-semibold text-gray-900 ${label === "Email" ? "" : "capitalize"}`}>
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminUserDetails;
