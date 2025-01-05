import { useState, useEffect } from 'react';
import axios from 'axios';
import AddDevice from './AddDevice';
import Sidebar from './LeftSideBar';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/devices/get/${roomId}`, {
          withCredentials: true
        });
        if (response.data.success) {
          setDevices(response.data.devices);
          
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        toast.error(err.response.data.message);
      }
    };

    fetchDevices();
  }, [roomId]);

  const handleDeviceRegistered = (newDevice) => {
    setDevices((prevDevices) => [...prevDevices, newDevice]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen border-r border-gray-200 bg-white shadow-sm">
          <Sidebar devices={devices} roomId={roomId} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">Device Setup</h1>
              <p className="text-sm text-gray-500 mt-1">Room ID: {roomId}</p>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Device</h2>
                <AddDevice roomId={roomId} onDeviceRegistered={handleDeviceRegistered} />
              </div>

              {/* Device Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600">Total Devices</h3>
                  <p className="text-2xl font-semibold text-blue-800 mt-2">{devices.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600">Active Devices</h3>
                  <p className="text-2xl font-semibold text-green-800 mt-2">
                    {devices.filter(device => device.status === 'on').length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-600">Room Status</h3>
                  <p className="text-2xl font-semibold text-purple-800 mt-2">Active</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;