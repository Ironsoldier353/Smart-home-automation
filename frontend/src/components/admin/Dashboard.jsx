import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);

  const handleGenerateInviteCode = async () => {
    if (!roomId.trim()) {
      setMessage('Room ID is required to generate an invite code.');
      return;
    }

    setLoading(true);
    setMessage('');
    setInviteCode('');

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/rooms/admin/${roomId}/invite-code`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your auth token logic
          },
        }
      );

      setInviteCode(response.data.inviteCode);
      setMessage('Invite code generated successfully!');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to generate invite code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetRoomDetails = async () => {
    if (!roomId.trim()) {
      setMessage('Room ID is required to fetch room details.');
      return;
    }

    setLoading(true);
    setMessage('');
    setRoomDetails(null);

    try {
      const response = await axios.get(`http://localhost:8000/api/v1/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your auth token logic
        },
      });

      setRoomDetails(response.data.room);
      setMessage('Room details fetched successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch room details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="roomId" className="block text-gray-700 font-medium mb-2">
          Room ID
        </label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleGenerateInviteCode}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          {loading ? 'Generating...' : 'Generate Invite Code'}
        </button>

        <button
          onClick={handleGetRoomDetails}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
        >
          {loading ? 'Fetching...' : 'Get Room Details'}
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 text-lg font-medium ${
            inviteCode || roomDetails ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}

      {inviteCode && (
        <p className="mt-4 text-lg font-medium text-green-600">
          Your Invite Code: <span className="font-bold">{inviteCode}</span>
        </p>
      )}

      {roomDetails && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Room Details</h2>
          <p><strong>ID:</strong> {roomDetails._id}</p>
          <p><strong>Name:</strong> {roomDetails.name}</p>
          <p><strong>Admin:</strong> {roomDetails.admin}</p>
          <p><strong>Members:</strong></p>
          <ul className="list-disc ml-6">
            {roomDetails.members.map((member) => (
              <li key={member._id}>{member.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
