import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DeviceCard from './DeviceCard';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { GET_DEVICES_API, RENAME_DEVICE_API, TOGGLE_DEVICE_STATUS_API } from '@/utils/constants';

const DeviceSetup = () => {
    const [status, setStatus] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [mac, setMac] = useState('');
    const { roomId, deviceId } = useParams();

    const navigate = useNavigate();
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get(`${GET_DEVICES_API}/${roomId}`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    const device = response.data.devices.find(device => device._id === deviceId);
                    if (device) {
                        setDeviceName(device.name);
                        setStatus(device.status);
                        setMac(device.macAddress);
                    }

                }

            } catch (err) {
                console.error('Error fetching devices:', err);
                toast.error(err.response.data.message);
            }
        };
        fetchDevices();
    }, [roomId, deviceId]);

    const handleRename = async (newName) => {
        try {
            const response = await axios.patch(
                `${RENAME_DEVICE_API}/${roomId}/${deviceId}`,
                { newName },
                { withCredentials: true }
            );
            if(response.data.success){
                setDeviceName(newName);
                toast.success(response.data.message);
            }
            


        } catch (err) {
            console.error('Error renaming device:', err);
            toast.error(err.response.data.message);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const response = await axios.patch(
                `${TOGGLE_DEVICE_STATUS_API}/${roomId}/${deviceId}`,
                {},
                { withCredentials: true }
            );
            if(response.data.success){
                setStatus(response.data.device.status);
                toast.success(response.data.message);
            }
            
        } catch (err) {
            console.error('Error toggling device status:', err);
            toast.error(err.response.data.message);
        }
    };

    const goBack = () => {
        navigate(`/admin/dashboard/${roomId}/device-setup`);

    }
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center space-x-3">
                            <ArrowLeft onClick={goBack} className="w-5 h-5 text-gray-400" />
                            <h1 className="text-2xl font-semibold text-gray-800">Device Setup</h1>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Configure and manage your device settings</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <DeviceCard
                        device={{ deviceName, status, mac }}
                        onRenameDevice={handleRename}
                        onTogglePower={handleToggleStatus}
                    />
                </div>
            </main>
        </div>
    );
};

export default DeviceSetup;