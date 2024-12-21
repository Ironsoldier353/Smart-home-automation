import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Building, Loader2, Lock, Mail } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const LoginMember = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/auth/member/login',
        { email, password, roomId },
        { withCredentials: true }
      );

      setMessage('Login successful! Redirecting...');
      const user = res.data.user;

      if (user.room) {
        setTimeout(() => {
          navigate(`/member/dashboard`);
        }, 1500);
      } else {
        setMessage('No room associated with this account. Please contact the admin.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid credentials or room not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700">
      <Card className="w-96 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Member Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                  className="pl-9"
                  placeholder="Enter room ID"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          {message && (
            <div className={`mt-4 text-sm font-medium ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Not joined to a ROOM?</p>
            <Button
              variant="link"
              className="font-medium text-blue-700"
              onClick={() => window.location.href = '/add-member/join'}
            >
              Click Here!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginMember;