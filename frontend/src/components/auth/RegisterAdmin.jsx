import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Home } from 'lucide-react';

const RegisterAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/rooms/add-member/register', { email, password, roomId });
      
      // Log the full response for debugging purposes
      console.log(response);

      // Make sure the response structure matches what's expected
      setUsername(response.data.user.username);
      setMessage(response.data.message);

      setEmail('');
      setPassword('');
      setRoomId('');
    } catch (error) {
      console.error(error); // Log the error for debugging
      setMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700">
      <Card className="w-96 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Register as Admin
          </CardTitle>
          <CardDescription className="text-center">
            Fill in the details to register as an admin for the room
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
                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                  className="pl-9"
                  placeholder="Enter the Room ID"
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
                  Registering...
                </>
              ) : (
                'Register as Admin'
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
            <p className="text-l text-muted-foreground">Do you want to access Dashboard?</p>
            <Button variant="link" className="font-medium" onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAdmin;
