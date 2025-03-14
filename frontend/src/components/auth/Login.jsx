import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Loader2, Home, Mail, Users, Shield, BadgeCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice';
import { toast } from 'sonner';
import { LOGIN_ADMIN_API, FORGOT_USERNAME_API } from '@/utils/constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotUsernameLoading, setForgotUsernameLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [forgotUsernameMessage, setForgotUsernameMessage] = useState('');
  const [showForgotUsername, setShowForgotUsername] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `${LOGIN_ADMIN_API}`,
        { username, password },
        { withCredentials: true }
      );

      const user = res.data.user;

      if (res.data.success) {
        setMessage('Login successful! Redirecting...');
        dispatch(login(user));
        toast.success(res.data.message);
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
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotUsername = async (e) => {
    e.preventDefault();
    setForgotUsernameLoading(true);
    setForgotUsernameMessage('');

    try {
      const res = await axios.post(`${FORGOT_USERNAME_API}`, {
        email,
        role,
        securityQuestion,
        securityAnswer,
      });

      if (res.data.success) {
        setForgotUsernameMessage(`Your username is: ${res.data.username}`);
        toast.success(res.data.message);
      } else {
        setForgotUsernameMessage(res.data.message || 'Failed to retrieve username.');
      }
    } catch (error) {
      setForgotUsernameMessage(error.response?.data?.message || 'Error retrieving username.');
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setForgotUsernameLoading(false);
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
              Check Your registered Email for credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotUsername ? (
              <form onSubmit={handleLogin} className="space-y-4">
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

                {message && (
                  <div className={`mt-4 text-sm font-medium ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                  </div>
                )}

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="mt-4 text-center space-y-2">
                  <Button
                    variant="link"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setShowForgotUsername(true)}
                  >
                    Forgot Username?
                  </Button>
                  <p className="text-l text-muted-foreground">
                    Not registered yet?{' '}
                    <Button
                      variant="link"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => window.location.href = '/signup'}
                    >
                      Register Here!
                    </Button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotUsername} className="space-y-4">
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
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityQuestion">Security Question</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select
                      id="securityQuestion"
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                      required
                      className="pl-9 w-full border rounded-lg py-2"
                    >
                      <option value="" disabled>Select a security question</option>
                      <option value="What is your favorite color?">What is your favorite color?</option>
                      <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                      <option value="What is your mother’s maiden name?">What is your mother’s maiden name?</option>
                      <option value="What was the name of the street you grew up on?">What was the name of the street you grew up on?</option>
                      <option value="What is your favorite book or movie?">What is your favorite book or movie?</option>
                      <option value="What was the make and model of your first car?">What was the make and model of your first car?</option>
                      <option value="What is your childhood nickname?">What is your childhood nickname?</option>
                      <option value="In what city were you born?">In what city were you born?</option>
                      <option value="What is your mother’s middle name?">What is your mother’s middle name?</option>
                      <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                      <option value="What is the name of your best friend from childhood?">What is the name of your best friend from childhood?</option>
                      <option value="What was the name of your first teacher?">What was the name of your first teacher?</option>
                    </select>
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">Security Answer</Label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="securityAnswer"
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      required
                      className="pl-9"
                      placeholder="Enter your security answer"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotUsernameLoading}
                >
                  {forgotUsernameLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrieving username...
                    </>
                  ) : (
                    'Retrieve Username'
                  )}
                </Button>

                {forgotUsernameMessage && (
                  <div className={`mt-4 text-sm font-medium ${forgotUsernameMessage.includes('Your username') ? 'text-green-500' : 'text-red-500'}`}>
                    {forgotUsernameMessage}
                  </div>
                )}

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setShowForgotUsername(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
