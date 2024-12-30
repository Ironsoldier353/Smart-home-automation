import PropTypes from "prop-types";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from "react";

const DeviceCard = ({ device, index, onRenameDevice, onTogglePower }) => {
  const { deviceName, status } = device;
  
  // State to track the new device name while editing
  const [isEditing, setIsEditing] = useState(false); 
  const [newDeviceName, setNewDeviceName] = useState(deviceName);

  // editing when pencil icon is clicked
  const handleRename = () => {
    setIsEditing(true);
  };

  // Handle input change for the new device name
  const handleInputChange = (e) => {
    setNewDeviceName(e.target.value);
  };

  const handleSave = () => {
    if (newDeviceName.trim() !== "") {
      onRenameDevice(index, newDeviceName);
      setIsEditing(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Device Name */}
          {isEditing ? (
            <input
              type="text"
              value={newDeviceName}
              onChange={handleInputChange}
              onBlur={handleSave}
              className="border p-1 rounded"
              autoFocus
            />
          ) : (
            <h3 className="font-bold">{deviceName}</h3>
          )}

          {!isEditing && (
            <FaPencilAlt
              className="text-gray-500 cursor-pointer ml-2"
              onClick={handleRename}
            />
          )}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="ml-2 bg-blue-500 text-white py-1 px-4 rounded"
          >
            Save
          </button>
        )}
      </div>

      <p>Status: {status === "on" ? "On" : "Off"}</p>

      <button
        onClick={() => onTogglePower(index)}
        className="bg-blue-500 text-white py-1 px-4 rounded mt-2"
      >
        {status === "on" ? "Disable" : "Activate"}
      </button>
    </div>
  );
};

// PropTypes for DeviceCard
DeviceCard.propTypes = {
  device: PropTypes.shape({
    deviceName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onRenameDevice: PropTypes.func.isRequired,  // Rename function passed from parent
  onTogglePower: PropTypes.func.isRequired,  // Power toggle function passed from parent
};

export default DeviceCard;
