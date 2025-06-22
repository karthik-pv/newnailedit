
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  FileText,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const settingSections = [
    {
      title: "Profile Settings",
      icon: User,
      fields: [
        { label: "Full Name", value: "John Doe", type: "text" },
        { label: "Email", value: "john@example.com", type: "email" },
        { label: "Phone", value: "(555) 123-4567", type: "tel" },
        { label: "Company Name", value: "Doe Fencing Co.", type: "text" }
      ]
    },
    {
      title: "Business Information",
      icon: FileText,
      fields: [
        { label: "Business Address", value: "123 Business St, City, State", type: "text" },
        { label: "Website", value: "https://doefencing.com", type: "url" },
        { label: "License Number", value: "LIC-123456", type: "text" },
        { label: "Tax ID", value: "XX-XXXXXXX", type: "text" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and business preferences</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile & Business Settings */}
          {settingSections.map((section, index) => (
            <Card key={section.title} className="glass p-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center space-x-3 mb-6">
                <section.icon className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <Label htmlFor={field.label.toLowerCase().replace(' ', '-')} className="text-sm font-medium text-gray-700">
                      {field.label}
                    </Label>
                    <Input
                      id={field.label.toLowerCase().replace(' ', '-')}
                      type={field.type}
                      defaultValue={field.value}
                      className="mt-1 glass-card border-0"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Notification Settings */}
          <Card className="glass p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive updates about quotes and jobs via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Get urgent updates via text message</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive browser notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="glass p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="glass-card border-0">
                Change Password
              </Button>
              <Button variant="outline" className="glass-card border-0">
                Enable Two-Factor Authentication
              </Button>
              <Button variant="outline" className="glass-card border-0 text-red-600 hover:text-red-700">
                Download Account Data
              </Button>
            </div>
          </Card>

          {/* Billing Settings */}
          <Card className="glass p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Billing & Subscription</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Current Plan: Pro</p>
                  <p className="text-sm text-gray-600">$29/month • Next billing: Jan 15, 2025</p>
                </div>
                <Button variant="outline" className="glass-card border-0">
                  Manage Plan
                </Button>
              </div>
              <Button variant="outline" className="glass-card border-0">
                Update Payment Method
              </Button>
              <Button variant="outline" className="glass-card border-0">
                View Billing History
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white glass-button">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
