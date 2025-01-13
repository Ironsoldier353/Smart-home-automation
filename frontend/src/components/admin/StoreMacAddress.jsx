import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Laptop } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { ADD_MAC_ADDRESS_API } from "@/utils/constants";

const AddMacAddress = () => {
  
  const [macAddress, setMacAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const { roomId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${ADD_MAC_ADDRESS_API}/${roomId}`,
        { macAddress },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setMacAddress("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header section */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-xl backdrop-blur-sm bg-opacity-80">
            <Laptop className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Device Registry</h1>
            <p className="text-gray-500">Add new MAC addresses to your room</p>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white bg-opacity-90">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Add MAC Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              

              <div className="space-y-2">
                <Label htmlFor="macAddress">MAC Address</Label>
                <Input
                  type="text"
                  id="macAddress"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  className="bg-white/50 backdrop-blur-sm border-gray-200"
                  placeholder="Enter MAC address"
                  pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
                  title="Please enter a valid MAC address (e.g., 00:1A:2B:3C:4D:5E)"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </span>
                ) : (
                  "Add MAC Address"
                )}
              </Button>

              <Alert className="bg-indigo-50 border-indigo-200">
                <AlertDescription className="text-sm text-gray-600">
                  Please enter the MAC address in the format: XX:XX:XX:XX:XX:XX
                  <br />
                  Example: 00:1A:2B:3C:4D:5E
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddMacAddress;