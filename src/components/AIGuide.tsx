import { useState, useMemo, useRef, useEffect } from "react";
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
  Maximize2,
  Mic,
  MicOff,
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
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isConfigured = useMemo(() => !!apiKey, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: isConfigured
        ? "Hi! I'm your AI assistant, powered by Gemini. How can I help you today? You can type or use the microphone to speak!"
        : "The AI chatbot is not configured. Please add the VITE_GEMINI_API_KEY to your .env file.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          // Automatically send the message after getting the transcript
          setTimeout(() => {
            handleSendMessage(transcript);
          }, 100);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);

          // Show error message to user
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: `Speech recognition error: ${event.error}. Please try again or type your message.`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: "Could not start speech recognition. Please check your microphone permissions.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || !genAI) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
      User question: "${textToSend}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const parsedResponse = JSON.parse(text);

      let aiResponse = "I'm not sure how to help with that. Please try again.";

      if (parsedResponse.navigation) {
        aiResponse = `Sure, taking you to the ${parsedResponse.navigation.replace(
          "/",
          ""
        )} page.`;
        setTimeout(() => navigate(parsedResponse.navigation), 1500);
      } else if (parsedResponse.text) {
        aiResponse = parsedResponse.text;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Guide error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing your request right now. Please try again or navigate manually using the sidebar.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
          {isListening && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Listening...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1"
          >
            {isMinimized ? (
              <Maximize2 className="w-3 lg:w-4 h-3 lg:h-4" />
            ) : (
              <Minimize2 className="w-3 lg:w-4 h-3 lg:h-4" />
            )}
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
                  message.isUser ? "justify-end" : "justify-start"
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-xs lg:text-sm whitespace-pre-line">
                    {message.text}
                  </p>
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
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
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
                placeholder={
                  isConfigured
                    ? isListening
                      ? "Listening..."
                      : "Ask me anything..."
                    : "Chatbot not configured"
                }
                className="flex-1 text-sm"
                disabled={isLoading || !isConfigured || isListening}
              />

              {/* Microphone Button */}
              {speechSupported && (
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading || !isConfigured}
                  className={`${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white transition-colors duration-200`}
                  size="sm"
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="w-3 lg:w-4 h-3 lg:h-4" />
                  ) : (
                    <Mic className="w-3 lg:w-4 h-3 lg:h-4" />
                  )}
                </Button>
              )}

              {/* Send Button */}
              <Button
                onClick={() => handleSendMessage()}
                disabled={
                  !inputText.trim() || isLoading || !isConfigured || isListening
                }
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                size="sm"
              >
                <Send className="w-3 lg:w-4 h-3 lg:h-4" />
              </Button>
            </div>

            {/* Speech recognition status */}
            {!speechSupported && (
              <p className="text-xs text-gray-500 mt-2">
                Voice input not supported in this browser
              </p>
            )}
            {isListening && (
              <p className="text-xs text-blue-600 mt-2 animate-pulse">
                🎤 Listening... Speak now
              </p>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

// Add type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

export default AIGuide;
