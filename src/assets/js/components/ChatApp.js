export function ChatApp() {
  return {
    showLoading: false,
    showIntro: true,
    showAssistantResponse: false,
    messages: [],

    init() {
      this.$watch('$store.chat.messageToSend', (newValue) => {
        if (newValue) {
          this.sendMessage();
        }
      });

      this.$watch('$store.chat.initiateVoiceCommand', (newValue) => {
        if (newValue) {
          this.handleVoiceCommand();
        }
      });
    },

    async sendMessage() {
      const message = this.$store.chat.messageToSend.trim();
      console.log('Sending message:', message);

      if (message === '') return;

      this.showLoading = true;
      this.showAssistantResponse = false;
      this.$store.chat.showQuickFinder = false;

      try {
        const response = await this.fetchChatResponse(message);

        await this.processAssistantResponse(response);
      } catch (error) {
        this.handleError(error);
      }

      this.showLoading = false;
      this.showAssistantResponse = true;
      this.$nextTick(() => {
        this.$store.chat.messageToSend = '';
        this.$store.chat.scrollToBottom = true;
      });
    },

    initiateVoiceCommand() {
      this.$store.chat.initiateVoiceCommand = true;
    },

    handleVoiceCommand() {
      this.$store.chat.annyang.start();
      window.setTimeout(() => {
        this.$store.chat.initiateVoiceCommand = false;
      }, 100);
    },

    updateChatHistory(role, content) {
      this.$store.chat.chatHistory.push({ role, content });
    },

    async fetchChatResponse(message) {
      try {
        console.log('Fetching chat response...');
        console.log('API URL:', window.API_URL);

        const response = await fetch(`${window.API_URL}/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            chat_history: this.chatHistory
          }),
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        this.addMessage('System', `Fetch error: ${error.message}`);
        this.$store.chat.scrollToBottom = true;
        throw error;
      }
    },

    async processAssistantResponse(response) {
      const reader = response.body.getReader();
      await this.streamResponse(reader);
    },

    async streamResponse(reader) {
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;
      let isMetadataProcessed = false;
      let currentMessage = '';  // Add this to accumulate content

      try {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            buffer += decoder.decode(value);
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line.trim());

                  if (!isMetadataProcessed && data.type === 'metadata') {
                    this.handleMetadata(data);
                    isMetadataProcessed = true;
                    // Add an empty assistant message to start accumulating content
                    this.addMessage('assistant', '');
                  } else if (data.type === 'content') {
                    currentMessage += data.content;
                    this.updateLastMessage(this.formatMessage(currentMessage));
                    this.$store.chat.scrollToBottom = true;
                  } else if (data.type === 'end') {
                    console.log('Stream ended');
                  }
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                  this.addMessage('system', 'Received malformed data from server.');
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        reader.cancel();
        this.addMessage('System', 'The connection was interrupted. Please try again.');
        throw error;
      } finally {
        reader.cancel();
      }

      // Handle any remaining buffer content
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer.trim());
          if (data.type === 'content') {
            if (this.messages.length === 0 || this.messages[this.messages.length - 1].role !== 'assistant') {
              this.addMessage('Assistant', '');
            }
            this.updateAssistantMessage(this.messages.length - 1, data.content);
          }
        } catch (e) {
          console.error('Error parsing remaining buffer:', e);
          this.addMessage('System', 'Received malformed data from server.');
        }
      }

      // Signal the end of the stream
      // Optionally, you can add a specific end message or status here
    },

    updateAssistantMessage(messageIndex, message) {
      const formattedMessage = this.formatMessage(message);
      this.messages[messageIndex].content += formattedMessage;
    },

    handleError(error) {
      console.error('Error:', error);
      this.addMessage('System', `An error occurred. Please try again. (${error.message})`);
      this.showLoading = false;
      this.showAssistantResponse = true;
      this.$store.chat.scrollToBottom = true;
    },

    toggleQuickFinder() {
      this.showQuickFinder = !this.showQuickFinder;
      if (this.showQuickFinder) {
        this.quickFinder.resetQuickFinder();
      }
    },

    addMessage(role, content) {
      this.messages.push({ role, content, type: 'message' });
    },

    updateLastMessage(content) {
      if (this.messages.length > 0) {
        this.messages[this.messages.length - 1].content = content;
      }
    },

    formatMessage(message) {
      const rawHTML = marked.parse(message);
      return DOMPurify.sanitize(rawHTML);
    },

    handleMetadata(data) {
      if (data.type !== 'metadata') return;

      const { sanitized_query, results } = data.metadata;

      this.updateChatHistory('user', sanitized_query);
      this.addMessage('user', sanitized_query);

      if (results && results.length > 0) {
        this.addStructuredResults(results);
      }

      this.showLoading = false;
    },

    addStructuredResults(results) {
      const formattedResults = results.map(result => ({
        ...result,
        formatted_address: this.formatAddress(result)
      }));

      this.messages.push({
        role: 'assistant',
        type: 'results',
        data: formattedResults,
      });
    },

    formatAddress(result) {
      const parts = [];

      if (result.address_street) parts.push(result.address_street);

      const cityState = [];
      if (result.address_city) cityState.push(result.address_city);
      if (result.address_state) cityState.push(result.address_state);
      if (cityState.length) parts.push(cityState.join(', '));

      if (result.address_zip) parts.push(result.address_zip);

      return parts.filter(Boolean).join(', ') || 'Address not available';
    },
  };
}
