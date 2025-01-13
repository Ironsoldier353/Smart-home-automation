import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Home, Shield, BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SIGNUP_ADMIN_API } from '@/utils/constants';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUsername('');

    try {
      const response = await axios.post(`${SIGNUP_ADMIN_API}`, {
        email,
        password,
        securityQuestion,
        securityAnswer
      });

      if (response.data.success) {
        setUsername(response.data.user.username);
        setMessage(response.data.message);

        setEmail('');
        setPassword('');
        setSecurityQuestion('');
        setSecurityAnswer('');
        toast.success(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
      toast.error(error.response?.data?.message || 'Something went wrong.');
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
              Enter your email, password, and security details to register
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
                    placeholder="Enter your answer in one word. e.g. Blue"
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
