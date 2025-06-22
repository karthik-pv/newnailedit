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
  Volume2,
  VolumeX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { allData } from "@/data/placeholderData";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isConfigured = useMemo(() => !!apiKey, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: isConfigured
        ? "Hi! I'm your AI assistant for your fencing business. I have access to all your quotes, customers, schedule, and projects data. How can I help you today? You can type or use the microphone to speak!"
        : "The AI chatbot is not configured. Please add the VITE_GEMINI_API_KEY to your .env file.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize speech recognition and text-to-speech
  useEffect(() => {
    // Speech Recognition
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

    // Text-to-Speech
    if ("speechSynthesis" in window) {
      setTtsSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
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

  const speakText = (text: string) => {
    if (window.speechSynthesis && ttsSupported) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
          responseMimeType: "application/json",
        },
      });

      const prompt = `You are a helpful AI assistant for a fencing contractor business. You have access to all the business data including quotes, customers, schedule, and projects.

Current Business Data:
${JSON.stringify(allData, null, 2)}

Based on the user's question and the business data above, provide a response in JSON format with the following structure:
{
  "navigation": "/route" (optional - only if user wants to navigate to a specific page),
  "text": "your detailed response based on the actual business data",
  "summary": "brief summary for voice reading",
  "toHighlight": "ID of the specific item to highlight" (optional - include only if referring to a specific quote, customer, schedule item, or project by ID)
}

Available pages and their exact routes:
- Dashboard: "/dashboard"
- Quotes: "/quotes" 
- Customers: "/customers"
- Schedule: "/schedule"
- Settings: "/settings"

User question: "${textToSend}"

Important: 
- Use the actual data from the business to provide specific, helpful responses
- If asked about quotes, customers, schedule, or projects, reference the actual data
- Provide specific numbers, names, and details from the data
- Make the response conversational and helpful
- The "summary" should be a shorter version suitable for text-to-speech
- If you mention a specific item (like "your most recent quote", "John Smith's project", etc.), include its ID in "toHighlight"
- For navigation, use the EXACT route format with leading slash (e.g., "/quotes", "/customers")
- Examples of when to use navigation:
  * "Show me my quotes" -> "navigation": "/quotes"
  * "Take me to customers" -> "navigation": "/customers"
  * "Go to schedule" -> "navigation": "/schedule"
- Examples of when to use toHighlight:
  * "Which is my most recent quote?" -> include the quote ID
  * "Show me John Smith's information" -> include customer ID
  * "What's my next appointment?" -> include schedule ID`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        parsedResponse = {
          text: text,
          summary: text,
        };
      }

      let aiResponse = "I'm not sure how to help with that. Please try again.";
      let speechText = aiResponse;

      if (parsedResponse.navigation) {
        // Ensure navigation route starts with "/"
        let navigationRoute = parsedResponse.navigation;
        if (!navigationRoute.startsWith("/")) {
          navigationRoute = `/${navigationRoute}`;
        }

        aiResponse =
          parsedResponse.text ||
          `Taking you to the ${navigationRoute.replace("/", "")} page.`;
        speechText = parsedResponse.summary || aiResponse;

        // Handle highlighting if specified
        if (parsedResponse.toHighlight) {
          // Store the highlight ID in sessionStorage for the target page
          sessionStorage.setItem("highlightId", parsedResponse.toHighlight);
        }

        setTimeout(() => navigate(navigationRoute), 2000);
      } else if (parsedResponse.text) {
        aiResponse = parsedResponse.text;
        speechText = parsedResponse.summary || parsedResponse.text;

        // Handle highlighting on current page
        if (parsedResponse.toHighlight) {
          // Trigger highlighting event
          const highlightEvent = new CustomEvent("highlightItem", {
            detail: { id: parsedResponse.toHighlight },
          });
          window.dispatchEvent(highlightEvent);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Automatically speak the response
      setTimeout(() => {
        speakText(speechText);
      }, 500);
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
          <span className="text-xs font-medium">AI Chat</span>
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
          <span className="font-semibold text-sm lg:text-base">
            Business AI
          </span>
          <div className="flex items-center space-x-1">
            {isListening && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Listening</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Speaking</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* TTS Control */}
          {ttsSupported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={isSpeaking ? stopSpeaking : undefined}
              className="text-white hover:bg-white/20 p-1"
              disabled={!isSpeaking}
            >
              {isSpeaking ? (
                <VolumeX className="w-3 lg:w-4 h-3 lg:h-4" />
              ) : (
                <Volume2 className="w-3 lg:w-4 h-3 lg:h-4" />
              )}
            </Button>
          )}
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
                  className={`max-w-[80%] p-2 lg:p-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-xs lg:text-sm whitespace-pre-line">
                    {message.text}
                  </p>
                  {!message.isUser && ttsSupported && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(message.text)}
                      className="mt-2 p-1 h-6 text-gray-600 hover:text-gray-800"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  )}
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
                      : "Ask about quotes, customers, schedule..."
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

            {/* Status indicators */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              {!speechSupported && (
                <p>Voice input not supported in this browser</p>
              )}
              {!ttsSupported && (
                <p>Text-to-speech not supported in this browser</p>
              )}
              {isListening && (
                <p className="text-blue-600 animate-pulse">
                  🎤 Listening... Speak now
                </p>
              )}
              {isSpeaking && (
                <p className="text-green-600 animate-pulse">🔊 Speaking...</p>
              )}
            </div>
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
