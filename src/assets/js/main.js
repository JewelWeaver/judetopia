import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import annyang from 'annyang';
import { marked } from 'marked';

import './layout.js';
import './chat.js';
import { ChatApp } from './components/ChatApp.js';
import { MessagesPanel } from './components/MessagesPanel.js';
import { QueryInput } from './components/QueryInput.js';
import { QuickFinder } from './components/QuickFinder.js';

// Register Alpine components
Alpine.data('ChatApp', ChatApp);
Alpine.data('MessagesPanel', MessagesPanel);
Alpine.data('QueryInput', QueryInput);
Alpine.data('QuickFinder', QuickFinder);

// Set up global objects
window.Alpine = Alpine;
window.annyang = annyang;
window.marked = marked;

// Initialize Alpine
Alpine.plugin(focus);
Alpine.start();
