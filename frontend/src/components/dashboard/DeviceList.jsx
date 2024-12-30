import PropTypes from "prop-types";
import DeviceCard from "./DeviceCard";

const DeviceList = ({ devices, onRenameDevice, onTogglePower }) => {
  if (devices.length === 0) {
    return <p className="text-gray-600">No devices connected yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {devices.map((device, index) => (
        <DeviceCard
          key={index}
          index={index}
          device={device}
          onRenameDevice={onRenameDevice}
          onTogglePower={onTogglePower}
        />
      ))}
    </div>
  );
};

// PropTypes for DeviceList
DeviceList.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      deviceName: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRenameDevice: PropTypes.func.isRequired,
  onTogglePower: PropTypes.func.isRequired,
};

export default DeviceList;
