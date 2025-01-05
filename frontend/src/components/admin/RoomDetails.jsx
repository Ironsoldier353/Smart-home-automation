/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const RoomDetails = ({ roomId }) => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchRoomDetails = async () => {
    setLoadingDetails(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/rooms/admin/room-details/${roomId}`,
        { withCredentials: true }
      );
      if(response.data.success) {
      setRoomDetails(response.data.room); // Save room details to state
      toast.success(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching room details');
      toast.error(err.response?.data?.message || err.message || 'Error fetching room details');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <button
        className="w-full bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
        onClick={fetchRoomDetails}
        disabled={loadingDetails}
      >
        {loadingDetails ? 'Fetching...' : 'Get Room Details'}
      </button>

      {roomDetails && (
        <div className="mt-6 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Room Details</h3>
          <div>
            <h4 className="font-semibold">Admin:</h4>
            <p className="text-gray-700">
              {roomDetails.admin.map((admin) => (
                <li key={admin._id}>{admin.email}</li>
              ))}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Members:</h4>
            <ul className="text-gray-700">
              {roomDetails.members.map((member) => (
                <li key={member._id}>{member.email}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {error && <p className="text-lg font-semibold text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default RoomDetails;
