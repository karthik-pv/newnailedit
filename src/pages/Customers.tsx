import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Plus,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { DataContext } from "@/context/DataContext";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

const Customers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");
  const { customers, quotes } = context;

  const getCustomerQuoteInfo = (customerId: string) => {
    const customerQuotes = quotes.filter(q => q.customer === customerId);
    const totalValue = customerQuotes.reduce((sum, q) => {
      return sum + parseFloat(q.amount.replace(/[^0-9.-]+/g,""));
    }, 0);
    return {
      count: customerQuotes.length,
      value: totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="glass-button"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
                  <p className="text-gray-600">Manage your customer relationships</p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white glass-button"
                onClick={() => setIsAddCustomerOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input 
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-card border-0 pl-10"
              />
            </div>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, index) => {
              const quoteInfo = getCustomerQuoteInfo(customer.id);
              return (
                <Card key={customer.id} className="glass p-6 hover:glass-card transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <Badge className={`${getStatusColor(customer.status)} text-xs mt-1`}>
                          {customer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {customer.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last contact: {customer.lastContact}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quotes: <span className="font-semibold">{quoteInfo.count}</span></span>
                      <span className="text-gray-600">Value: <span className="font-semibold">{quoteInfo.value}</span></span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      <AddCustomerDialog isOpen={isAddCustomerOpen} onClose={() => setIsAddCustomerOpen(false)} />
    </>
  );
};

export default Customers;
