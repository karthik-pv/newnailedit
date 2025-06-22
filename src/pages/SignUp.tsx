import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  Crown,
  Zap,
  Star,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Building,
  Phone,
  Globe,
  Camera,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>(
    {}
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Business Info
    companyName: "",
    ownerName: "",
    businessEmail: "",
    phone: "",
    website: "",
    description: "",
    logo: null as File | null,
    pricingDocument: null as File | null,
    // Payment Info
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));

    // Upload file immediately and store URL
    try {
      const uploadResponse = await apiService.uploadMedia({ [type]: file });
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: uploadResponse.uploaded_files[type],
      }));
    } catch (err: any) {
      setError(`Failed to upload ${type}: ${err.message}`);
    }
  };

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small contractors getting started",
      features: [
        "Up to 50 quotes per month",
        "Basic AI quote generation",
        "Email support",
        "Customer management",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing fencing businesses",
      features: [
        "Unlimited quotes",
        "Advanced AI training",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
        "Custom branding",
        "API access",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large-scale operations",
      features: [
        "Everything in Professional",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security",
        "SLA guarantee",
        "On-site training",
      ],
      popular: false,
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleNext = async () => {
    setError("");
    setLoading(true);

    try {
      if (currentStep === 1) {
        // Register user
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        await apiService.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
        });

        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Skip to plan selection for now
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Skip to company creation (we'll handle payment later)
        setCurrentStep(4);
      } else if (currentStep === 4) {
        // Create company with all data
        const companyData = {
          company_name: formData.companyName,
          owner_name: formData.ownerName,
          email: formData.businessEmail,
          phone: formData.phone,
          website: formData.website || null,
          description: formData.description || null,
          logo_url: uploadedFiles.logo || null,
          pricing_document_url: uploadedFiles.pricingDocument || null,
        };

        const companyResponse = await apiService.createCompany(companyData);

        // Update user with company_id
        const userToken = localStorage.getItem("access_token");
        if (userToken) {
          // Decode token to get user ID (simplified - in production use proper JWT decode)
          const payload = JSON.parse(atob(userToken.split(".")[1]));
          await apiService.updateUser(payload.sub, {
            company_id: companyResponse.company.id,
          });
        }

        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth with Supabase
    navigate("/dashboard");
  };

  const steps = [
    { number: 1, title: "Account", description: "Create your account" },
    {
      number: 2,
      title: "Business Info",
      description: "Tell us about your company",
    },
    {
      number: 3,
      title: "Choose Plan",
      description: "Select your pricing plan",
    },
    {
      number: 4,
      title: "Company Creation",
      description: "Upload your pricing document",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="p-2 hover:bg-white/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold gradient-text">
                  NailedIt
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Already have an account?
              </span>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 hover:bg-white/50"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex items-center flex-shrink-0"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <span className="font-bold text-sm">{step.number}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-xs md:text-sm font-medium ${
                          currentStep >= step.number
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 hidden md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 md:w-24 h-0.5 mx-2 md:mx-4 transition-all duration-300 ${
                        currentStep > step.number
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="glass p-6 md:p-8 animate-fade-in">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Account Creation */}
            {currentStep === 1 && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600">
                    Get started with NailedIt today
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="glass-card border-0 pl-10 pr-4 py-3"
                      />
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@company.com"
                        className="glass-card border-0 pl-10 pr-4 py-3"
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        className="glass-card border-0 pl-10 pr-12 py-3"
                      />
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="glass-card border-0 pl-10 pr-4 py-3"
                      />
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="mt-6 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Sign Up */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  className="w-full glass-card border-0 py-3 text-gray-700 hover:text-gray-900"
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  Continue with Google
                </Button>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Business Information
                  </h2>
                  <p className="text-gray-600">
                    Let's set up your company profile
                  </p>
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
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="businessEmail"
                        name="businessEmail"
                        type="email"
                        value={formData.businessEmail}
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
                          onChange={(e) => handleFileUpload(e, "logo")}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">
                              {formData.logo
                                ? formData.logo.name
                                : "Click to upload your company logo"}
                            </div>
                            {uploadedFiles.logo && (
                              <div className="text-xs text-green-600 mt-1">
                                ✓ Uploaded successfully
                              </div>
                            )}
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

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <Crown className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Your Plan
                  </h2>
                  <p className="text-gray-600">
                    Select the perfect plan for your fencing business
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan, index) => (
                    <Card
                      key={plan.id}
                      className={`glass-card p-6 cursor-pointer transition-all duration-300 relative ${
                        selectedPlan === plan.id
                          ? "ring-2 ring-blue-500 glass"
                          : "hover:glass"
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      )}

                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                          {plan.id === "enterprise" ? (
                            <Crown className="w-8 h-8 text-purple-600" />
                          ) : (
                            <Zap className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            {plan.price}
                          </span>
                          <span className="text-gray-600 ml-1">
                            {plan.period}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {plan.description}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          selectedPlan === plan.id
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                            : "glass-button text-gray-700 hover:text-blue-700"
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Company Creation (replacing payment for now) */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Complete Setup
                  </h2>
                  <p className="text-gray-600">
                    Upload your pricing document to train the AI
                  </p>
                </div>

                <div className="max-w-lg mx-auto">
                  <div className="glass-card p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e, "pricingDocument")}
                      className="hidden"
                      id="pricing-document-upload"
                    />
                    <label
                      htmlFor="pricing-document-upload"
                      className="cursor-pointer"
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <div className="text-lg font-medium text-gray-900 mb-2">
                          {formData.pricingDocument
                            ? formData.pricingDocument.name
                            : "Upload pricing document"}
                        </div>
                        {uploadedFiles.pricingDocument && (
                          <div className="text-sm text-green-600 mb-2">
                            ✓ Uploaded successfully
                          </div>
                        )}
                        <div className="text-sm text-gray-600 mb-4">
                          Click to browse files
                        </div>
                        <div className="text-xs text-gray-500">
                          Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
                className="glass-card border-0"
              >
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {loading
                  ? "Processing..."
                  : currentStep === 4
                  ? "Complete Setup"
                  : "Continue"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
