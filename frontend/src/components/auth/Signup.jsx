import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [showLoginOption, setShowLoginOption] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUsername('');
    setShowLoginOption(false);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/admin/register', { email, password });

      // Extracting username and success message from response
      setUsername(response.data.user.username);
      setMessage(response.data.message);

      // Showing the login option after successful registration
      setShowLoginOption(true);

      // Clearing inputs
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm font-medium ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        {username && (
          <p className="mt-2 text-sm font-medium text-blue-600">
            Your generated username: <strong>{username}</strong>
          </p>
        )}
        {showLoginOption && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">Already have an account?</p>
            <a
              href="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
