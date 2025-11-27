/**
 * ProStar Chat Widget - Embeddable Chat Assistant
 *
 * Usage:
 * <script src="https://yourdomain.com/prostar-chat-widget.js"></script>
 * <script>
 *   ProStarChat.init({
 *     apiUrl: 'https://yourdomain.com/api',
 *     position: 'bottom-right',
 *     theme: 'dark'
 *   });
 * </script>
 */

(function () {
  "use strict";

  const ProStarChat = {
    config: {
      apiUrl: "https://prostarai.manus.space/api",
      position: "bottom-right",
      theme: "dark",
      title: "ProStar Chat Assistant",
      placeholder: "Stellen Sie eine Frage...",
      initialMessage: "Hallo! 👋 Wie kann ich Ihnen heute helfen?",
    },

    state: {
      isOpen: false,
      messages: [],
      isLoading: false,
    },

    init: function (options = {}) {
      // Merge user config with defaults
      this.config = { ...this.config, ...options };

      // Create widget container
      this.createWidget();

      // Load chat history from localStorage
      this.loadChatHistory();

      // Add event listeners
      this.attachEventListeners();

      console.log("ProStar Chat Widget initialized");
    },

    createWidget: function () {
      // Create main container
      const container = document.createElement("div");
      container.id = "prostar-chat-widget";
      container.className = `prostar-chat-${this.config.position} prostar-chat-${this.config.theme}`;

      // Create chat bubble button
      const bubble = document.createElement("button");
      bubble.id = "prostar-chat-bubble";
      bubble.className = "prostar-chat-bubble";
      bubble.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
      bubble.setAttribute("aria-label", "Chat öffnen");

      // Create chat window
      const window = document.createElement("div");
      window.id = "prostar-chat-window";
      window.className = "prostar-chat-window";
      window.innerHTML = `
        <div class="prostar-chat-header">
          <h3>${this.config.title}</h3>
          <button id="prostar-chat-close" aria-label="Chat schließen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="prostar-chat-messages" id="prostar-chat-messages"></div>
        <div class="prostar-chat-input-area">
          <input 
            type="text" 
            id="prostar-chat-input" 
            placeholder="${this.config.placeholder}"
            aria-label="Chat-Nachricht eingeben"
          />
          <button id="prostar-chat-send" aria-label="Nachricht senden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      `;

      // Add styles
      this.injectStyles();

      // Append to body
      container.appendChild(bubble);
      container.appendChild(window);
      document.body.appendChild(container);
    },

    injectStyles: function () {
      const style = document.createElement("style");
      style.textContent = `
        #prostar-chat-widget {
          position: fixed;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          z-index: 9999;
          bottom: 20px;
          right: 20px;
        }

        #prostar-chat-widget.prostar-chat-bottom-left {
          left: 20px;
          right: auto;
        }

        .prostar-chat-bubble {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00D9FF 0%, #00B8CC 100%);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 217, 255, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .prostar-chat-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 217, 255, 0.6);
        }

        .prostar-chat-bubble.active {
          display: none;
        }

        #prostar-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: #0A0E27;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: scale(0.95) translateY(10px);
          pointer-events: none;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 217, 255, 0.2);
        }

        #prostar-chat-widget.prostar-chat-bottom-left #prostar-chat-window {
          right: auto;
          left: 0;
        }

        #prostar-chat-window.active {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }

        .prostar-chat-header {
          padding: 16px;
          border-bottom: 1px solid rgba(0, 217, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(0, 184, 204, 0.05) 100%);
        }

        .prostar-chat-header h3 {
          margin: 0;
          color: #00D9FF;
          font-size: 16px;
          font-weight: 600;
        }

        #prostar-chat-close {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        #prostar-chat-close:hover {
          color: #00D9FF;
        }

        #prostar-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: #E0E0E0;
        }

        .prostar-chat-message {
          display: flex;
          gap: 8px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .prostar-chat-message.user {
          justify-content: flex-end;
        }

        .prostar-chat-message-content {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 8px;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.4;
        }

        .prostar-chat-message.assistant .prostar-chat-message-content {
          background: rgba(0, 217, 255, 0.1);
          border-left: 2px solid #00D9FF;
          color: #E0E0E0;
        }

        .prostar-chat-message.user .prostar-chat-message-content {
          background: #00D9FF;
          color: #0A0E27;
          border-radius: 8px 0 8px 8px;
        }

        .prostar-chat-typing {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
        }

        .prostar-chat-typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00D9FF;
          animation: typing 1.4s infinite;
        }

        .prostar-chat-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .prostar-chat-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }

        .prostar-chat-input-area {
          padding: 12px;
          border-top: 1px solid rgba(0, 217, 255, 0.1);
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.2);
        }

        #prostar-chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 217, 255, 0.2);
          border-radius: 6px;
          padding: 8px 12px;
          color: #E0E0E0;
          font-size: 14px;
          transition: all 0.2s;
        }

        #prostar-chat-input:focus {
          outline: none;
          border-color: #00D9FF;
          background: rgba(0, 217, 255, 0.05);
        }

        #prostar-chat-input::placeholder {
          color: #666;
        }

        #prostar-chat-send {
          background: #00D9FF;
          border: none;
          border-radius: 6px;
          color: #0A0E27;
          cursor: pointer;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-weight: 600;
        }

        #prostar-chat-send:hover {
          background: #00E5FF;
          box-shadow: 0 2px 8px rgba(0, 217, 255, 0.3);
        }

        #prostar-chat-send:active {
          transform: scale(0.95);
        }

        @media (max-width: 480px) {
          #prostar-chat-window {
            width: calc(100vw - 40px);
            height: 60vh;
            bottom: 80px;
          }
        }
      `;
      document.head.appendChild(style);
    },

    attachEventListeners: function () {
      const bubble = document.getElementById("prostar-chat-bubble");
      const closeBtn = document.getElementById("prostar-chat-close");
      const input = document.getElementById("prostar-chat-input");
      const sendBtn = document.getElementById("prostar-chat-send");
      const window = document.getElementById("prostar-chat-window");

      bubble.addEventListener("click", () => this.toggleChat());
      closeBtn.addEventListener("click", () => this.closeChat());
      sendBtn.addEventListener("click", () => this.sendMessage());
      input.addEventListener("keypress", e => {
        if (e.key === "Enter") this.sendMessage();
      });
    },

    toggleChat: function () {
      const window = document.getElementById("prostar-chat-window");
      const bubble = document.getElementById("prostar-chat-bubble");

      if (this.state.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    },

    openChat: function () {
      const window = document.getElementById("prostar-chat-window");
      const bubble = document.getElementById("prostar-chat-bubble");

      window.classList.add("active");
      bubble.classList.add("active");
      this.state.isOpen = true;

      // Add initial message if no messages exist
      if (this.state.messages.length === 0) {
        this.addMessage(this.config.initialMessage, "assistant");
      }

      // Focus input
      document.getElementById("prostar-chat-input").focus();
    },

    closeChat: function () {
      const window = document.getElementById("prostar-chat-window");
      const bubble = document.getElementById("prostar-chat-bubble");

      window.classList.remove("active");
      bubble.classList.remove("active");
      this.state.isOpen = false;
    },

    sendMessage: function () {
      const input = document.getElementById("prostar-chat-input");
      const message = input.value.trim();

      if (!message) return;

      // Add user message
      this.addMessage(message, "user");
      input.value = "";

      // Show typing indicator
      this.showTypingIndicator();

      // Send to API
      this.fetchResponse(message);
    },

    addMessage: function (text, sender) {
      const messagesContainer = document.getElementById(
        "prostar-chat-messages"
      );

      const messageDiv = document.createElement("div");
      messageDiv.className = `prostar-chat-message ${sender}`;

      const contentDiv = document.createElement("div");
      contentDiv.className = "prostar-chat-message-content";
      contentDiv.textContent = text;

      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);

      // Store message
      this.state.messages.push({ text, sender, timestamp: new Date() });

      // Save to localStorage
      this.saveChatHistory();

      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    showTypingIndicator: function () {
      const messagesContainer = document.getElementById(
        "prostar-chat-messages"
      );

      const typingDiv = document.createElement("div");
      typingDiv.id = "prostar-chat-typing";
      typingDiv.className = "prostar-chat-typing";
      typingDiv.innerHTML = "<span></span><span></span><span></span>";

      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    removeTypingIndicator: function () {
      const typing = document.getElementById("prostar-chat-typing");
      if (typing) typing.remove();
    },

    fetchResponse: function (message) {
      // Simulate API call - replace with actual API endpoint
      setTimeout(
        () => {
          this.removeTypingIndicator();

          // Mock responses based on keywords
          let response = this.getMockResponse(message);
          this.addMessage(response, "assistant");
        },
        1000 + Math.random() * 1000
      );
    },

    getMockResponse: function (message) {
      const lowerMessage = message.toLowerCase();

      const responses = {
        preis:
          "Unsere Kurse kosten €97 (Starter), €197 (Professional) oder €497 (Enterprise). Alle Pläne bieten lebenslangen Zugriff!",
        modul:
          "Der Kurs besteht aus 5 umfassenden Modulen: Strategie, Content-Planung, Community, Analytics und Conversion.",
        anfang:
          "Ja, dieser Kurs ist perfekt für Anfänger! Wir beginnen mit den Grundlagen und bauen darauf auf.",
        garantie:
          "Wir bieten eine 30-Tage Geld-zurück-Garantie. Wenn Sie nicht zufrieden sind, erhalten Sie Ihr Geld zurück.",
        default:
          "Großartig! Wie kann ich Ihnen noch helfen? Sie können nach Preis, Modulen, oder anderen Fragen fragen.",
      };

      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return responses.default;
    },

    saveChatHistory: function () {
      localStorage.setItem(
        "prostarChatHistory",
        JSON.stringify(this.state.messages)
      );
    },

    loadChatHistory: function () {
      const history = localStorage.getItem("prostarChatHistory");
      if (history) {
        this.state.messages = JSON.parse(history);
      }
    },
  };

  // Expose globally
  window.ProStarChat = ProStarChat;

  // Auto-initialize if data attributes are present
  if (
    document.currentScript &&
    document.currentScript.dataset.init === "true"
  ) {
    document.addEventListener("DOMContentLoaded", () => {
      ProStarChat.init();
    });
  }
})();
