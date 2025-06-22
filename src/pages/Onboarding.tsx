
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle,
  ArrowRight,
  Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Info
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    logo: null,
    
    // Document Upload
    pricingDocument: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to dashboard
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Business Information", description: "Tell us about your company" },
    { number: 2, title: "Upload Pricing Document", description: "Train our AI with your pricing" },
    { number: 3, title: "Setup Complete", description: "You're ready to start!" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">NailedIt</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep >= step.number 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{step.number}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="glass p-8 animate-fade-in">
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
                  <p className="text-gray-600">Let's set up your company profile</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Fencing Company LLC"
                        className="glass-card border-0 pl-10"
                        required
                      />
                      <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                        className="glass-card border-0 pl-10"
                        required
                      />
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Business Email *</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@yourcompany.com"
                        className="glass-card border-0 pl-10"
                        required
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="glass-card border-0 pl-10"
                        required
                      />
                      <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://www.yourcompany.com"
                        className="glass-card border-0 pl-10"
                      />
                      <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell us about your fencing business, services offered, and specializations..."
                      className="glass-card border-0 mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Company Logo (Optional)</Label>
                    <div className="mt-1">
                      <div className="glass-card p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">
                              {formData.logo ? formData.logo.name : "Click to upload your company logo"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              PNG, JPG up to 2MB
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Pricing Document</h2>
                  <p className="text-gray-600">
                    Upload your pricing guide so our AI can learn your business model and generate accurate quotes
                  </p>
                </div>

                <div className="max-w-lg mx-auto">
                  <div className="glass-card p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e, 'pricingDocument')}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <div className="text-lg font-medium text-gray-900 mb-2">
                          {formData.pricingDocument ? formData.pricingDocument.name : "Drop your pricing document here"}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          or click to browse files
                        </div>
                        <div className="text-xs text-gray-500">
                          Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                        </div>
                      </div>
                    </label>
                  </div>

                  {formData.pricingDocument && (
                    <Card className="glass-card p-4 mt-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {formData.pricingDocument.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(formData.pricingDocument.size / 1024)} KB
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </Card>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for best results:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Include your standard pricing for different fence types</li>
                      <li>• Add material costs and labor rates</li>
                      <li>• Include any special pricing or discounts</li>
                      <li>• Mention common add-ons and their costs</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Complete!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your AI is now being trained on your pricing document. 
                  You can start generating professional quotes immediately!
                </p>

                <Card className="glass-card p-6 max-w-md mx-auto mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Business profile created</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Pricing document uploaded</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">AI training in progress</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="glass-card border-0"
              >
                Back
              </Button>

              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 && (!formData.companyName || !formData.ownerName || !formData.email || !formData.phone)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white glass-button"
              >
                {currentStep === 3 ? 'Go to Dashboard' : 'Continue'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
