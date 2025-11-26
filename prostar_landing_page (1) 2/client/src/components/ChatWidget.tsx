import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hallo! 👋 Willkommen bei ProStar Marketing. Wie kann ich dir heute helfen?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock bot responses based on user input
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('kurs') || lowerMessage.includes('course')) {
      return 'Der Social-Media-Masterplan ist ein umfassender 5-Modul-Kurs, der dir zeigt, wie du deine Social-Media-Präsenz strategisch aufbaust und dein Business wächst. Möchtest du mehr über die Module erfahren?';
    }
    if (lowerMessage.includes('preis') || lowerMessage.includes('kosten') || lowerMessage.includes('price')) {
      return 'Wir bieten flexible Preisoptionen: Starter (€297), Professional (€597) und Premium (€997). Jede Option enthält unterschiedliche Bonusmaterialien und Support-Level. Welche Option interessiert dich?';
    }
    if (lowerMessage.includes('modul') || lowerMessage.includes('module')) {
      return 'Der Kurs besteht aus 5 Modulen:\n1. Strategie & Positionierung\n2. Content-Erstellung\n3. Community-Management\n4. Analytics & Optimierung\n5. Automation & Skalierung\n\nWelches Modul interessiert dich am meisten?';
    }
    if (lowerMessage.includes('garantie') || lowerMessage.includes('geld zurück') || lowerMessage.includes('refund')) {
      return '✅ Wir bieten eine 30-Tage Geld-zurück-Garantie! Wenn der Kurs nicht deinen Erwartungen entspricht, erstattest du dein Geld vollständig zurück – keine Fragen gestellt.';
    }
    if (lowerMessage.includes('anfänger') || lowerMessage.includes('beginner') || lowerMessage.includes('anfang')) {
      return 'Absolut! Der Kurs ist perfekt für Anfänger geeignet. Wir starten bei den Grundlagen und bauen schrittweise auf. Auch erfahrene Marketer finden fortgeschrittene Strategien. Für wen ist der Kurs gedacht?';
    }
    if (lowerMessage.includes('dauer') || lowerMessage.includes('zeit') || lowerMessage.includes('duration')) {
      return 'Der Kurs dauert durchschnittlich 4-6 Wochen bei 5-10 Stunden pro Woche. Du kannst aber in deinem eigenen Tempo lernen – es gibt keine Zeitlimits!';
    }
    if (lowerMessage.includes('zertifikat') || lowerMessage.includes('certificate')) {
      return 'Ja! Nach Abschluss aller Module erhältst du ein offizielles ProStar Marketing Zertifikat, das du auf LinkedIn und deiner Website nutzen kannst.';
    }
    if (lowerMessage.includes('danke') || lowerMessage.includes('thanks') || lowerMessage.includes('merci')) {
      return 'Sehr gerne! 😊 Hast du noch weitere Fragen zum Kurs? Ich helfe dir gerne weiter!';
    }

    return 'Das ist eine großartige Frage! 🤔 Für detailliertere Informationen empfehle ich dir, die FAQ-Sektion zu besuchen oder dich mit unserem Team in Kontakt zu setzen. Kann ich dir noch bei etwas anderem helfen?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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
          boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)',
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
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-cyan-500 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
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
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
                onChange={(e) => setInputValue(e.target.value)}
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
            <p className="text-xs text-gray-400 mt-2">💡 Frag mich nach: Preis, Modulen, Garantie, oder Anfänger-Tipps!</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
