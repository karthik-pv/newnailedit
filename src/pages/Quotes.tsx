import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Plus,
  MoreVertical,
  FileText,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { DataContext } from "@/context/DataContext";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Label } from "@/components/ui/label";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const Quotes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");
  const { quotes, customers, addQuote } = context;

  const handleGenerateWithAI = async () => {
    if (!projectDescription || !genAI) return;
    setIsGenerating(true);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Based on the project description "${projectDescription}", create a quote. The response should be a JSON object with "project" (a short title), "amount" (e.g., "$2,450.00"), and "status" ("draft").`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const quoteData = JSON.parse(text);

        addQuote({
            ...quoteData,
            customer: selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name : 'N/A',
        });
        
        setIsCreating(false);
        setProjectDescription("");
        setSelectedCustomer("");

    } catch (error) {
        console.error("AI Quote Generation Error:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCreating) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex justify-center items-center">
        <Card className="w-full max-w-2xl p-8 glass">
          <Button variant="ghost" onClick={() => setIsCreating(false)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Quote Generation</h2>
          <p className="text-gray-600 mb-6">Describe your project to generate a professional quote with AI, or create one manually.</p>
          
          <div className="space-y-4">
            <div>
                <Label>Customer (Optional)</Label>
                <Select onValueChange={setSelectedCustomer}>
                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
              <Label>Project Description</Label>
              <Textarea 
                placeholder="e.g., Install a 6-foot wooden privacy fence around the backyard, approximately 150 linear feet. Include one gate."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button onClick={handleGenerateWithAI} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate with AI
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotes</h1>
                <p className="text-gray-600">Manage and track all your quotes</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white glass-button"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input 
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-card border-0 pl-10"
              />
            </div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="grid gap-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className="glass p-6 hover:glass-card transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{quote.id}</h3>
                      <Badge className={`${getStatusColor(quote.status)} text-xs`}>
                        {quote.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{quote.customer} • {quote.project}</p>
                    <p className="text-sm text-gray-500">{quote.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{quote.amount}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="glass-button"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="glass-button"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="glass-button"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quotes;
