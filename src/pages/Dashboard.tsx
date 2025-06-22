import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  FileText,
  Calendar,
  Settings,
  Crown,
  CheckCircle,
  MoreVertical,
  User,
  Menu,
  X,
  Hammer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIGuide from "@/components/AIGuide";
import { DataContext } from "@/context/DataContext";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { ScheduleJobDialog } from "@/components/ScheduleJobDialog";
import {
  allData,
  quotes,
  customers,
  schedule,
  projects,
} from "@/data/placeholderData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isScheduleJobOpen, setIsScheduleJobOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");
  const {
    customers: contextCustomers,
    quotes: contextQuotes,
    scheduledJobs,
  } = context;

  // Handle highlighting functionality
  useEffect(() => {
    // Check for highlight ID from sessionStorage (when navigating from AI)
    const storedHighlightId = sessionStorage.getItem("highlightId");
    if (storedHighlightId) {
      setHighlightedId(storedHighlightId);
      sessionStorage.removeItem("highlightId");
      // Auto-remove highlight after 5 seconds
      setTimeout(() => setHighlightedId(null), 5000);
    }

    // Listen for highlight events from AI
    const handleHighlight = (event: CustomEvent) => {
      setHighlightedId(event.detail.id);
      // Auto-remove highlight after 5 seconds
      setTimeout(() => setHighlightedId(null), 5000);
    };

    window.addEventListener("highlightItem", handleHighlight as EventListener);

    // Remove highlight when clicking anywhere
    const handleClick = () => {
      if (highlightedId) {
        setHighlightedId(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener(
        "highlightItem",
        handleHighlight as EventListener
      );
      document.removeEventListener("click", handleClick);
    };
  }, [highlightedId]);

  const stats = [
    {
      title: "Total Quotes",
      value: allData.summary.totalQuotes.toString(),
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
    },
    {
      title: "Active Projects",
      value: allData.summary.activeProjects.toString(),
      change: "+8%",
      trend: "up" as const,
      icon: Hammer,
    },
    {
      title: "Total Revenue",
      value: `$${allData.summary.totalRevenue.toLocaleString()}`,
      change: "+23%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Active Customers",
      value: allData.summary.activeCustomers.toString(),
      change: "+5%",
      trend: "up" as const,
      icon: Users,
    },
  ];

  const recentQuotes = quotes.slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 glass border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg lg:text-xl font-bold gradient-text">
                NailedIt
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="space-y-1 lg:space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start glass-button text-blue-600 bg-blue-50 text-sm lg:text-base"
              onClick={() => navigate("/dashboard")}
            >
              <FileText className="w-4 h-4 mr-2 lg:mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-white/50 text-sm lg:text-base"
              onClick={() => navigate("/quotes")}
            >
              <FileText className="w-4 h-4 mr-2 lg:mr-3" />
              Quotes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-white/50 text-sm lg:text-base"
              onClick={() => navigate("/customers")}
            >
              <Users className="w-4 h-4 mr-2 lg:mr-3" />
              Customers
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-white/50 text-sm lg:text-base"
              onClick={() => navigate("/schedule")}
            >
              <Calendar className="w-4 h-4 mr-2 lg:mr-3" />
              Schedule
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-white/50 text-sm lg:text-base"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4 mr-2 lg:mr-3" />
              Settings
            </Button>
          </nav>

          <div className="mt-6 lg:mt-8">
            <Card className="glass-card p-3 lg:p-4">
              <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                <Crown className="w-4 lg:w-5 h-4 lg:h-5 text-yellow-500" />
                <span className="font-semibold text-gray-900 text-sm lg:text-base">
                  Upgrade to Pro
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                Unlock unlimited quotes and advanced features
              </p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs lg:text-sm"
                onClick={() => navigate("/upgrade")}
              >
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="glass border-b border-white/20 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-sm lg:text-base hidden sm:block">
                  Welcome back! Here's what's happening with your business.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button variant="ghost" size="sm" className="glass-button">
                <Bell className="w-4 lg:w-5 h-4 lg:h-5" />
              </Button>
              <div className="flex items-center space-x-1 lg:space-x-2 glass-card px-2 lg:px-3 py-1 lg:py-2 rounded-lg">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <User className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-700 hidden sm:block">
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass-card p-3 lg:p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-1 lg:mt-2">
                      <TrendingUp
                        className={`w-3 lg:w-4 h-3 lg:h-4 mr-1 ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span
                        className={`text-xs lg:text-sm ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 lg:w-12 h-8 lg:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-4 lg:w-6 h-4 lg:h-6 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Quotes */}
            <div className="lg:col-span-2">
              <Card className="glass p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                    Recent Quotes
                  </h3>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white glass-button px-4 lg:px-6 py-2 lg:py-3 shadow-sm hover:shadow-md text-sm lg:text-base w-full sm:w-auto"
                    onClick={() => navigate("/quotes")}
                  >
                    <Plus className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3" />
                    Create New Quote
                  </Button>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  {quotes.slice(0, 3).map((quote, index) => (
                    <div
                      key={quote.id}
                      className={`glass-card p-3 lg:p-4 hover:glass transition-all duration-200 ${
                        highlightedId === quote.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                            <span className="font-medium text-gray-900 text-sm lg:text-base">
                              {quote.id}
                            </span>
                            <Badge
                              className={`${getStatusColor(
                                quote.status
                              )} text-xs`}
                            >
                              {quote.status}
                            </Badge>
                          </div>
                          <div className="text-xs lg:text-sm text-gray-600 truncate">
                            {quote.customerName} • {quote.projectType}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {quote.date}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-base lg:text-lg font-semibold text-gray-900">
                            {quote.amount}
                          </div>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreVertical className="w-3 lg:w-4 h-3 lg:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions & AI Status */}
            <div className="space-y-4 lg:space-y-6">
              {/* Quick Actions */}
              <Card className="glass p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <Button
                    className="w-full justify-start glass-button text-sm lg:text-lg py-3 lg:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    onClick={() => navigate("/quotes")}
                  >
                    <Plus className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3" />
                    Create New Quote
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start glass-card border-0 py-3 lg:py-4 text-sm lg:text-base"
                    onClick={() => setIsAddCustomerOpen(true)}
                  >
                    <Users className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3" />
                    Add Customer
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start glass-card border-0 py-3 lg:py-4 text-sm lg:text-base"
                    onClick={() => setIsScheduleJobOpen(true)}
                  >
                    <Calendar className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3" />
                    Schedule Job
                  </Button>
                </div>
              </Card>

              {/* AI Training Status */}
              <Card className="glass p-4 lg:p-6">
                <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base lg:text-lg">
                      AI Training Status
                    </h3>
                    <p className="text-xs lg:text-sm text-green-600 font-medium">
                      Training Complete
                    </p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                  AI is ready to generate quotes
                </p>
                <p className="text-xs text-gray-500">
                  Your AI has been trained on your pricing document and is ready
                  to help generate professional quotes based on your business
                  model.
                </p>
              </Card>

              {/* Upcoming Schedule */}
              <Card className="glass p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Upcoming Schedule
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  {schedule
                    .filter((item) => item.status === "scheduled")
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`glass-card p-3 lg:p-4 hover:glass transition-all duration-200 ${
                          highlightedId === item.id
                            ? "ring-2 ring-blue-500 bg-blue-50 animate-pulse"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.date} at {item.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">
                              {item.type}
                            </p>
                            <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  {schedule.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No upcoming jobs scheduled.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* AI Guide */}
      <AIGuide />
      <AddCustomerDialog
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      />
      <ScheduleJobDialog
        isOpen={isScheduleJobOpen}
        onClose={() => setIsScheduleJobOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
