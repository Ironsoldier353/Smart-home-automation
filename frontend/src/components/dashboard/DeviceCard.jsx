import PropTypes from "prop-types";
import { useState } from "react";
import { Pencil, Power } from 'lucide-react';

const DeviceCard = ({ device, onRenameDevice, onTogglePower }) => {
  const { deviceName, status } = device;
  const [isEditing, setIsEditing] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState(deviceName);

  const handleRename = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setNewDeviceName(e.target.value);
  };

  const handleSave = () => {
    if (newDeviceName.trim() !== "") {
      onRenameDevice(newDeviceName);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-6">
      {/* Device Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newDeviceName}
                onChange={handleInputChange}
                onBlur={handleSave}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800">{deviceName}</h2>
              <button
                onClick={handleRename}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status === "on" ? "bg-green-500" : "bg-gray-400"}`} />
          <span className="text-sm text-gray-600">
            {status === "on" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Device Status and Controls */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Device Status</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {status === "on" ? "Currently Active" : "Currently Inactive"}
            </p>
          </div>
          
          <button
            onClick={onTogglePower}
            className={`
              inline-flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors
              ${status === "on" 
                ? "bg-red-50 text-red-600 hover:bg-red-100" 
                : "bg-green-50 text-green-600 hover:bg-green-100"
              }
            `}
          >
            <Power className="w-5 h-5" />
            <span>{status === "on" ? "Deactivate" : "Activate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

DeviceCard.propTypes = {
  device: PropTypes.shape({
    deviceName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onRenameDevice: PropTypes.func.isRequired,
  onTogglePower: PropTypes.func.isRequired,
};

export default DeviceCard;