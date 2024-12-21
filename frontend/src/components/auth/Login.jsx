import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Loader2, Home } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/auth/admin/login',
        { username, password },
        { withCredentials: true }
      );
      setMessage('Login successful! Redirecting...');
      const user = res.data.user;


      if(res.data.success) {
        dispatch(login(user));
      }

      if (!user.room) {
        setMessage('Room not found for the admin. Please contact support.');
        return;
      }
      

      setTimeout(() => {
        navigate(`/admin/dashboard/${user.room}`);
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-white"
          onClick={() => window.location.href = '/'}
        >
          <Home className="w-5 h-5" />
          <span>Go to Home</span>
        </Button>
      </div>
      <div className="flex items-center justify-center flex-grow">
        <Card className="w-96 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome ADMIN
            </CardTitle>
            <CardDescription className="text-center">
              Enter your username and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-9"
                    placeholder="Enter your username"
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
              <p className="text-l text-muted-foreground">Don&apos;t have an Account?</p>
              <Button
                variant="link"
                className="font-medium text-blue-500"
                onClick={() => window.location.href = '/signup'}
              >
                Register Here!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
