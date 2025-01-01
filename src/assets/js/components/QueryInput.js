export function QueryInput() {
  return {
    init() {
      this.$watch('$store.chat.focusQueryInput', (newValue) => {
        if (newValue) {
          this.focusTextarea();
        }
      });

      this.$watch('$store.chat.pushButton', (newValue) => {
        if (newValue) {
          this.pushButton();
        }
      });
    },

    focusTextarea() {
      this.$focus.focus(this.$refs.userMessage);
    },

    autoResize(event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + 'px';
    },

    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },

    pushButton() {
      window.setTimeout(() => {
        this.$refs.sendButton.click();
      }, 100);
    },

    clearInput() {
      this.$store.chat.userMessage = '';
      this.$refs.userMessage.style.height = 'auto';
    },

    sendMessage() {
      if (this.$store.chat.userMessage.trim() === '') return;
      // this.$dispatch('message-sent', this.$store.chat.userMessage.trim());
      this.$store.chat.messageToSend = this.$store.chat.userMessage.trim();
      this.clearInput();
    },
  }
}
