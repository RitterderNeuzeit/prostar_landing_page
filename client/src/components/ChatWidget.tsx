import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hallo! 👋 Willkommen bei ProStar Marketing. Wie kann ich dir heute helfen?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Configuration
  const API_URL =
    import.meta.env.VITE_PROSTAR_AI_URL ||
    "https://ai-sales-agent-for-prostar-marketing-1013733494627.us-west1.run.app";
  const API_KEY = import.meta.env.VITE_PROSTAR_AI_KEY || "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call ProStar AI API
  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: "prostar-landing-page",
          context: "ProStar Marketing Landing Page Chat",
        }),
      });

      if (!response.ok) {
        console.error("API Error:", response.status);
        return "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später erneut.";
      }

      const data = await response.json();
      return (
        data.response || data.message || "Ich konnte keine Antwort generieren."
      );
    } catch (error) {
      console.error("Chat API Error:", error);
      return "Es tut mir leid, es gab einen Fehler. Bitte versuche es später erneut oder kontaktiere unser Support-Team.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const userInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Get response from ProStar AI API
    const botResponse = await getBotResponse(userInput);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 animate-glow-pulse"
        aria-label="Open chat"
        style={{
          boxShadow: "0 0 30px rgba(0, 217, 255, 0.5)",
        }}
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-full sm:max-w-md z-50">
      {/* Chat Header */}
      <div
        className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-t-2xl p-4 flex items-center justify-between"
        style={{
          boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">ProStar Support</h3>
            <p className="text-xs text-white/80">Wir antworten sofort</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Toggle minimize"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="bg-gray-900 h-96 overflow-y-auto p-4 space-y-4 border-x border-gray-800">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-cyan-500 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg rounded-bl-none border border-gray-700">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="bg-gray-800 rounded-b-2xl p-4 border-x border-b border-gray-700">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={event => setInputValue(event.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Schreib deine Frage..."
                className="flex-1 bg-gray-900 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 text-white rounded-lg p-2 transition-colors"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              💡 Frag mich nach: Preis, Modulen, Garantie, oder Anfänger-Tipps!
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
