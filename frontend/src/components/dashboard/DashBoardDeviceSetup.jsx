/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Plus, Power, Settings, Activity, LogOut } from "lucide-react";
import AddDevice from "./AddDevice";
import DeviceList from "./DeviceList";
import { useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import store from "@/redux/store";
import axios from "axios";
import { logout } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [activeTab, setActiveTab] = useState("addDevices");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let persistor = persistStore(store);
  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();

  const handleAddDevice = (newDevice) => {
    setDevices((prevDevices) => [
      ...prevDevices,
      { ...newDevice, status: "off" },
    ]);
  };

  const handleRenameDevice = (index, newName) => {
    const updatedDevices = [...devices];
    updatedDevices[index].deviceName = newName;
    setDevices(updatedDevices);
  };

  const handleTogglePower = (index) => {
    const updatedDevices = [...devices];
    updatedDevices[index].status =
      updatedDevices[index].status === "on" ? "off" : "on";
    setDevices(updatedDevices);
  };

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
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-xl backdrop-blur-sm bg-opacity-80 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">Device Management</p>
        </div>
        
        <nav className="px-4 py-4 space-y-2 flex-grow">
          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
              activeTab === "addDevices"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("addDevices")}
          >
            <Plus size={20} className={activeTab === "addDevices" ? "animate-pulse" : ""} />
            <span className="font-medium">Add Devices</span>
          </button>
          
          {devices.map((device, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                activeTab === `device${index + 1}`
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(`device${index + 1}`)}
            >
              <Settings size={20} />
              <span className="font-medium truncate">
                {device.deviceName || `Device ${index + 1}`}
              </span>
            </button>
          ))}
        </nav>

        {/* Enhanced Sign Out Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-200 
              bg-gradient-to-r from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-100
              border border-gray-200 hover:border-red-200
              text-gray-600 hover:text-red-600
              shadow-sm hover:shadow-md group"
          >
            <LogOut size={20} className="transform transition-transform group-hover:rotate-12" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {activeTab === "addDevices" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Device Setup
                </h1>
                <p className="mt-2 text-gray-600">Add and manage your connected devices</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
                <AddDevice onAddDevice={handleAddDevice} />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Devices</h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
                  <DeviceList
                    devices={devices}
                    onRenameDevice={handleRenameDevice}
                    onTogglePower={handleTogglePower}
                  />
                </div>
              </div>
            </div>
          )}

          {devices.map(
            (device, index) =>
              activeTab === `device${index + 1}` && (
                <div key={index} className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {device.deviceName || `Device ${index + 1}`}
                    </h1>
                    <p className="mt-2 text-gray-600">Manage device settings and status</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Current Status</p>
                        <div className="flex items-center space-x-2">
                          <Activity size={20} className={`${
                            device.status === "on" 
                              ? "text-green-500 animate-pulse" 
                              : "text-red-500"
                          }`} />
                          <p className={`text-lg font-medium ${
                            device.status === "on" 
                              ? "text-green-500" 
                              : "text-red-500"
                          }`}>
                            {device.status === "on" ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                          device.status === "on"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
                            : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30"
                        }`}
                        onClick={() => handleTogglePower(index)}
                      >
                        <Power size={20} />
                        <span>Toggle Power</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;