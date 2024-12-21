import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Home } from 'lucide-react';
import { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUsername('');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/admin/register', { email, password });
      setUsername(response.data.user.username);
      setMessage(response.data.message);

      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
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
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to register
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

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            {message && (
              <div className={`mt-4 text-sm font-medium ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </div>
            )}

            {username && (
              <div className="mt-2 text-sm font-medium text-primary">
                Your generated username: <strong>{username}</strong>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-l text-muted-foreground">Already have an account?</p>
              <Button
                variant="link"
                className="font-medium"
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
