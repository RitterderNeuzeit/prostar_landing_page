/**
 * ProStar AI Chat Bubble - Optimized for Squarespace
 * Lightweight, non-intrusive chat agent for prostarmarketing.de
 * 
 * Usage in Squarespace:
 * 1. Settings → Advanced → Code Injection → Footer
 * 2. Paste this code:
 * 
 * <script src="https://prostarai.manus.space/prostar-chat-bubble.js"></script>
 * <script>
 *   ProstarChatBubble.init({
 *     apiUrl: 'https://prostarai.manus.space/api',
 *     position: 'bottom-right',
 *     theme: 'dark'
 *   });
 * </script>
 */

(function() {
  'use strict';

  const ProstarChatBubble = {
    config: {
      apiUrl: 'https://prostarai.manus.space/api',
      position: 'bottom-right',
      theme: 'dark',
      bubbleSize: 60, // pixels
      bubbleColor: '#00D9FF',
      bubbleGlow: '0 0 20px rgba(0, 217, 255, 0.6)'
    },

    state: {
      isOpen: false,
      messages: [],
      isLoading: false
    },

    init(options = {}) {
      // Merge options
      this.config = { ...this.config, ...options };

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.create());
      } else {
        this.create();
      }
    },

    create() {
      // Create bubble container
      const bubble = document.createElement('div');
      bubble.id = 'prostar-chat-bubble';
      bubble.innerHTML = this.getHTML();
      bubble.style.cssText = this.getBubbleStyles();

      // Add to body
      document.body.appendChild(bubble);

      // Attach event listeners
      this.attachListeners();

      // Load chat history
      this.loadHistory();
    },

    getHTML() {
      return `
        <div class="prostar-chat-bubble-container">
          <!-- Chat Bubble Button -->
          <button class="prostar-chat-bubble-btn" id="prostar-bubble-btn" aria-label="ProStar AI Chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="prostar-bubble-badge" id="prostar-badge">1</span>
          </button>

          <!-- Chat Window -->
          <div class="prostar-chat-window" id="prostar-chat-window">
            <!-- Header -->
            <div class="prostar-chat-header">
              <div class="prostar-chat-title">
                <h3>ProStar AI Agent</h3>
                <p>Immer für Sie da</p>
              </div>
              <button class="prostar-close-btn" id="prostar-close-btn" aria-label="Chat schließen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Messages -->
            <div class="prostar-chat-messages" id="prostar-messages">
              <div class="prostar-message prostar-message-bot">
                <div class="prostar-message-content">
                  Hallo! 👋 Ich bin der ProStar AI Agent. Wie kann ich dir heute helfen?
                </div>
              </div>
            </div>

            <!-- Input -->
            <div class="prostar-chat-input-area">
              <input 
                type="text" 
                id="prostar-input" 
                class="prostar-chat-input" 
                placeholder="Schreib eine Nachricht..."
                aria-label="Chat-Nachricht eingeben"
              />
              <button class="prostar-send-btn" id="prostar-send-btn" aria-label="Senden">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    getBubbleStyles() {
      return `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --prostar-primary: #00D9FF;
        --prostar-dark: #0A0E27;
        --prostar-text: #FFFFFF;
      `;
    },

    getInlineStyles() {
      return `
        <style>
          #prostar-chat-bubble {
            --prostar-primary: #00D9FF;
            --prostar-dark: #0A0E27;
            --prostar-text: #FFFFFF;
            --prostar-border: #1a1f3a;
          }

          .prostar-chat-bubble-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
          }

          /* Bubble Button */
          .prostar-chat-bubble-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--prostar-primary);
            border: none;
            color: var(--prostar-dark);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
            transition: all 0.3s ease;
            position: relative;
          }

          .prostar-chat-bubble-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(0, 217, 255, 0.8);
          }

          .prostar-chat-bubble-btn:active {
            transform: scale(0.95);
          }

          /* Badge */
          .prostar-bubble-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #FF6B6B;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid var(--prostar-dark);
          }

          .prostar-bubble-badge.hidden {
            display: none;
          }

          /* Chat Window */
          .prostar-chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 500px;
            background: var(--prostar-dark);
            border: 1px solid var(--prostar-border);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 5px 40px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
            display: none;
          }

          .prostar-chat-window.open {
            display: flex;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Header */
          .prostar-chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid var(--prostar-border);
            background: linear-gradient(135deg, #0A0E27 0%, #1a1f3a 100%);
          }

          .prostar-chat-title h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--prostar-text);
          }

          .prostar-chat-title p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #8B92B0;
          }

          .prostar-close-btn {
            background: none;
            border: none;
            color: var(--prostar-text);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
          }

          .prostar-close-btn:hover {
            color: var(--prostar-primary);
          }

          /* Messages */
          .prostar-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .prostar-message {
            display: flex;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .prostar-message-bot {
            justify-content: flex-start;
          }

          .prostar-message-user {
            justify-content: flex-end;
          }

          .prostar-message-content {
            max-width: 70%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
          }

          .prostar-message-bot .prostar-message-content {
            background: var(--prostar-border);
            color: var(--prostar-text);
            border-bottom-left-radius: 4px;
          }

          .prostar-message-user .prostar-message-content {
            background: var(--prostar-primary);
            color: var(--prostar-dark);
            border-bottom-right-radius: 4px;
          }

          /* Typing Indicator */
          .prostar-typing {
            display: flex;
            gap: 4px;
            padding: 10px 14px;
            background: var(--prostar-border);
            border-radius: 12px;
            border-bottom-left-radius: 4px;
          }

          .prostar-typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--prostar-primary);
            animation: typing 1.4s infinite;
          }

          .prostar-typing-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .prostar-typing-dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes typing {
            0%, 60%, 100% {
              opacity: 0.5;
              transform: translateY(0);
            }
            30% {
              opacity: 1;
              transform: translateY(-10px);
            }
          }

          /* Input Area */
          .prostar-chat-input-area {
            display: flex;
            gap: 8px;
            padding: 12px;
            border-top: 1px solid var(--prostar-border);
            background: var(--prostar-dark);
          }

          .prostar-chat-input {
            flex: 1;
            background: var(--prostar-border);
            border: 1px solid var(--prostar-border);
            border-radius: 20px;
            padding: 10px 14px;
            color: var(--prostar-text);
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
          }

          .prostar-chat-input:focus {
            border-color: var(--prostar-primary);
          }

          .prostar-chat-input::placeholder {
            color: #8B92B0;
          }

          .prostar-send-btn {
            background: var(--prostar-primary);
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--prostar-dark);
            cursor: pointer;
            transition: all 0.2s;
          }

          .prostar-send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
          }

          .prostar-send-btn:active {
            transform: scale(0.95);
          }

          .prostar-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .prostar-chat-window {
              width: calc(100vw - 40px);
              height: 60vh;
              max-height: 500px;
            }

            .prostar-message-content {
              max-width: 85%;
            }
          }

          /* Scrollbar */
          .prostar-chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          .prostar-chat-messages::-webkit-scrollbar-track {
            background: transparent;
          }

          .prostar-chat-messages::-webkit-scrollbar-thumb {
            background: var(--prostar-border);
            border-radius: 3px;
          }

          .prostar-chat-messages::-webkit-scrollbar-thumb:hover {
            background: var(--prostar-primary);
          }
        </style>
      `;
    },

    attachListeners() {
      const bubbleBtn = document.getElementById('prostar-bubble-btn');
      const closeBtn = document.getElementById('prostar-close-btn');
      const sendBtn = document.getElementById('prostar-send-btn');
      const input = document.getElementById('prostar-input');
      const chatWindow = document.getElementById('prostar-chat-window');

      // Toggle chat window
      bubbleBtn?.addEventListener('click', () => this.toggleChat());
      closeBtn?.addEventListener('click', () => this.closeChat());

      // Send message
      sendBtn?.addEventListener('click', () => this.sendMessage());
      input?.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.sendMessage();
        }
      });

      // Close on outside click
      document.addEventListener('click', (event) => {
        const bubble = document.getElementById('prostar-chat-bubble');
        if (bubble && !bubble.contains(event.target) && this.state.isOpen) {
          this.closeChat();
        }
      });
    },

    toggleChat() {
      if (this.state.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    },

    openChat() {
      const chatWindow = document.getElementById('prostar-chat-window');
      const badge = document.getElementById('prostar-badge');
      if (chatWindow) {
        chatWindow.classList.add('open');
        badge?.classList.add('hidden');
        this.state.isOpen = true;
        document.getElementById('prostar-input')?.focus();
      }
    },

    closeChat() {
      const chatWindow = document.getElementById('prostar-chat-window');
      if (chatWindow) {
        chatWindow.classList.remove('open');
        this.state.isOpen = false;
      }
    },

    sendMessage() {
      const input = document.getElementById('prostar-input');
      const message = input?.value?.trim();

      if (!message) return;

      // Add user message
      this.addMessage(message, 'user');
      input.value = '';

      // Show typing indicator
      this.showTyping();

      // Simulate API call
      setTimeout(() => {
        this.removeTyping();
        const response = this.getResponse(message);
        this.addMessage(response, 'bot');
      }, 1000 + Math.random() * 1000);
    },

    addMessage(text, sender) {
      const messagesContainer = document.getElementById('prostar-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `prostar-message prostar-message-${sender}`;
      messageDiv.innerHTML = `<div class="prostar-message-content">${this.escapeHtml(text)}</div>`;
      messagesContainer?.appendChild(messageDiv);
      messagesContainer?.scrollTop = messagesContainer?.scrollHeight;

      // Save to history
      this.state.messages.push({ text, sender, timestamp: Date.now() });
      this.saveHistory();
    },

    showTyping() {
      const messagesContainer = document.getElementById('prostar-messages');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'prostar-message prostar-message-bot';
      typingDiv.id = 'prostar-typing';
      typingDiv.innerHTML = `
        <div class="prostar-typing">
          <div class="prostar-typing-dot"></div>
          <div class="prostar-typing-dot"></div>
          <div class="prostar-typing-dot"></div>
        </div>
      `;
      messagesContainer?.appendChild(typingDiv);
      messagesContainer?.scrollTop = messagesContainer?.scrollHeight;
    },

    removeTyping() {
      const typing = document.getElementById('prostar-typing');
      typing?.remove();
    },

    getResponse(message) {
      const lowerMessage = message.toLowerCase();

      // FAQ Responses mit ProStar Brand Voice
      const responses = {
        'kurs': 'Der Social-Media-Masterplan Kurs ist perfekt für KMUs, die ihre Social-Media-Präsenz aufbauen möchten. Mit 5 umfassenden Modulen, praktischen Templates und persönlicher Unterstützung lernen Sie bewährte Strategien, die sofort funktionieren.',
        'preis': 'Wir bieten 3 Tiers: Starter (€97), Professional (€197) und Enterprise (€497). Jedes Paket ist auf unterschiedliche Bedürfnisse zugeschnitten. Alle Tiers beinhalten Zugang zu allen Modulen und lebenslangen Support.',
        'modul': 'Der Kurs besteht aus 5 Modulen: 1) Grundlagen, 2) Content-Strategie, 3) Engagement-Taktiken, 4) Conversion-Optimization, 5) Community-Building. Jedes Modul hat Videos, Workbooks und praktische Übungen.',
        'garantie': 'Wir bieten eine 30-Tage Geld-zurück-Garantie. Wenn der Kurs nicht Ihren Erwartungen entspricht, erhalten Sie volle Rückerstattung - keine Fragen gestellt.',
        'zugang': 'Nach dem Kauf erhalten Sie sofortigen Zugang zu allen Kursinhalten. Sie können die Materialien herunterladen und in Ihrem eigenen Tempo lernen.',
        'zertifikat': 'Nach Abschluss aller Module erhalten Sie ein ProStar-Zertifikat, das Sie auf LinkedIn und Ihrer Website verwenden können.',
        'support': 'Sie erhalten E-Mail-Support von unserem Team. Bei Enterprise-Kunden bieten wir auch 1:1 Coaching-Sessions an.',
        'default': 'Das ist eine großartige Frage! Für spezifische Informationen empfehle ich, unseren Kurs anzuschauen. Klick hier: https://prostarai.manus.space'
      };

      for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          return response;
        }
      }

      return responses.default;
    },

    loadHistory() {
      try {
        const saved = localStorage.getItem('prostar_chat_history');
        if (saved) {
          this.state.messages = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    },

    saveHistory() {
      try {
        localStorage.setItem('prostar_chat_history', JSON.stringify(this.state.messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // Expose to global scope
  window.ProstarChatBubble = ProstarChatBubble;

  // Auto-init if script has data attributes
  document.addEventListener('DOMContentLoaded', () => {
    const script = document.currentScript;
    if (script?.dataset.init === 'true') {
      ProstarChatBubble.init();
    }

    // Inject styles
    const styleEl = document.createElement('div');
    styleEl.innerHTML = ProstarChatBubble.getInlineStyles();
    document.head.appendChild(styleEl.firstElementChild);
  });
})();
