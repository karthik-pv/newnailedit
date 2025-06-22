
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Clock, 
  CheckCircle,
  PlayCircle,
  Crown,
  Sparkles,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Quotes",
      description: "Generate professional quotes instantly with our advanced AI",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your business data",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Streamline your customer relationships effortlessly",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Reduce quote generation time by 90%",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  const stats = [
    { number: "1000+", label: "Contractors Trust Us", icon: Users },
    { number: "4.9/5", label: "Customer Rating", icon: Star },
    { number: "90%", label: "Time Saved", icon: TrendingUp },
    { number: "24/7", label: "Support Available", icon: Shield }
  ];

  // Splash Screen Component
  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-2xl animate-scale-in">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">N</span>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            NailedIt
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            Transform Your Service Business
          </p>
          
          <div className="flex items-center justify-center space-x-2 animate-fade-in" style={{ animationDelay: '1s' }}>
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-slate-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl floating" style={{ animationDelay: '4s' }}></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold text-white">NailedIt</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-white hover:text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 font-semibold hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center min-h-screen">
        
        {/* Left Side - Hero Content */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-6">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 px-6 py-3 text-lg backdrop-blur-sm">
              <Crown className="w-5 h-5 mr-2" />
              Trusted by 1000+ contractors
            </Badge>
            
            <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Service Business
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
              Generate professional quotes instantly with AI, manage customers effortlessly, 
              and grow your fencing business like never before.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 group"
            >
              Get Started Free
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-white px-10 py-4 text-lg backdrop-blur-sm group bg-transparent"
            >
              <PlayCircle className="mr-3 w-6 h-6" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 ${
                  hoveredStat === index ? 'scale-105 bg-white/20' : ''
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-sm text-slate-300">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Features Grid */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-3 text-cyan-300" />
              Why Choose NailedIt?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 hover:bg-white/20 transition-all duration-500 cursor-pointer group border-white/10 animate-slide-up"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto transition-all duration-500 ${
                    hoveredFeature === index ? 'scale-110' : ''
                  }`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <Card className="bg-white/10 backdrop-blur-sm p-6 text-center border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-slate-300">Trusted worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-300">Enterprise security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-300">24/7 support</span>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="bg-white/10 backdrop-blur-sm p-8 text-center border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to transform your business?
            </h3>
            <p className="text-slate-300 mb-6">
              Join thousands of contractors who've revolutionized their process
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 group"
            >
              Start Your Free Trial
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
