import { useState } from "react";
import AddDevice from "./AddDevice";
import DeviceList from "./DeviceList";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);

  // Handle adding a new device
  const handleAddDevice = (newDevice) => {
    setDevices((prevDevices) => [
      ...prevDevices,
      { ...newDevice, status: "off" },
    ]);
  };

  // rename device
  const handleRenameDevice = (index, newName) => {
    const updatedDevices = [...devices];
    updatedDevices[index].deviceName = newName;
    setDevices(updatedDevices);
  };

  // Handle toggling the power status of a device
  const handleTogglePower = (index) => {
    const updatedDevices = [...devices];
    updatedDevices[index].status = updatedDevices[index].status === "on" ? "off" : "on";
    setDevices(updatedDevices);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Add Device Form */}
      <AddDevice onAddDevice={handleAddDevice} />
      
      <h2 className="text-xl mt-6">Connected Devices</h2>
      <DeviceList
        devices={devices}
        onRenameDevice={handleRenameDevice}
        onTogglePower={handleTogglePower}
      />
    </div>
  );
};

export default Dashboard;
