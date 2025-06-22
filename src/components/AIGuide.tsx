import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIGuide = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const isConfigured = useMemo(() => !!apiKey, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isConfigured 
        ? "Hi! I'm your AI assistant, powered by Gemini. How can I help you today?"
        : "The AI chatbot is not configured. Please add the VITE_GEMINI_API_KEY to your .env file.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !genAI) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      if (!genAI) throw new Error("AI not configured");

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          response_mime_type: "application/json",
        },
      });

      const prompt = `You are a helpful assistant for a fencing contractor app. Your goal is to help users.
      The available pages are: dashboard, quotes, customers, schedule, and settings.
      Based on the user's question, provide a response in JSON format. The object should have one of two keys: "navigation" (e.g., "/quotes") or "text" for a helpful response.
      User question: "${inputText}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsedResponse = JSON.parse(text);
      
      let aiResponse = "I'm not sure how to help with that. Please try again.";

      if (parsedResponse.navigation) {
        aiResponse = `Sure, taking you to the ${parsedResponse.navigation.replace('/', '')} page.`;
        setTimeout(() => navigate(parsedResponse.navigation), 1500);
      } else if (parsedResponse.text) {
        aiResponse = parsedResponse.text;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Guide error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing your request right now. Please try again or navigate manually using the sidebar.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center p-2"
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Chatbot</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[90vw] max-w-96 h-[70vh] max-h-96 bg-white/95 backdrop-blur-xl border border-white/20 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 lg:w-5 h-4 lg:h-5" />
          <span className="font-semibold text-sm lg:text-base">AI Chatbot</span>
        </div>
        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1"
          >
            {isMinimized ? <Maximize2 className="w-3 lg:w-4 h-3 lg:h-4" /> : <Minimize2 className="w-3 lg:w-4 h-3 lg:h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="w-3 lg:w-4 h-3 lg:h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className="w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-2 lg:p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-xs lg:text-sm whitespace-pre-line">{message.text}</p>
                </div>
                {message.isUser && (
                  <div className="w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 lg:w-4 h-3 lg:h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-2 lg:p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 lg:p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConfigured ? "Ask me anything..." : "Chatbot not configured"}
                className="flex-1 text-sm"
                disabled={isLoading || !isConfigured}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || !isConfigured}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                size="sm"
              >
                <Send className="w-3 lg:w-4 h-3 lg:h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIGuide;
