document.addEventListener('alpine:init', () => {
  Alpine.plugin(focus);

  Alpine.store('chat', {
    userMessage: '',
    messageToSend: '',
    chatHistory: [],
    annyang: window.annyang,
    initiateVoiceCommand: false,
    scrollToBottom: false,
    focusQueryInput: false,
    showQueryInput: true,
    showQuickFinder: true,
    selectedService: '',
    selectedLocation: '',
  });

  if (window.annyang) {
    window.annyang.addCommands({
      '*command': (command) => {
        Alpine.store('chat').messageToSend = command;
        window.setTimeout(() => {
          window.annyang.abort();
        }, 100);
      }
    });
  }
});
