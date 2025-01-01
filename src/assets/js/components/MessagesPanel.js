export function MessagesPanel() {
  return {
    init() {
      this.$watch('$store.chat.scrollToBottom', (newValue) => {
        if (newValue) {
          this.scrollToBottom();

          this.$nextTick(() => {
            this.$store.chat.scrollToBottom = false;
          });
        }
      });
    },

    scrollToBottom() {
      document.getElementById('chat-messages-end').scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
  }
}
