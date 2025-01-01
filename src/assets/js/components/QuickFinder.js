export function QuickFinder() {
  return {
    showServices: true,
    showServices1: false,
    showServices2: false,
    showServices3: false,
    showServices4: false,
    showServices5: false,
    showLocation: false,
    selectedService: '',
    selectedLocation: '',

    init() {
      window.setTimeout(() => {
        this.showServices1 = true;
      }, 300);
      window.setTimeout(() => {
        this.showServices2 = true;
      }, 400);
      window.setTimeout(() => {
        this.showServices3 = true;
      }, 500);
      window.setTimeout(() => {
        this.showServices4 = true;
      }, 600);
      window.setTimeout(() => {
        this.showServices5 = true;
      }, 700);
    },

    selectService(service) {
      this.selectedService = service;
      this.hideServices();
      window.setTimeout(() => {
        console.log('selectService');
        this.doShowLocation();
        this.$focus.focus(this.$refs.locationInput);
      }, 600);
    },

    doShowLocation() {
      this.showLocation = true;
      this.$store.chat.showQueryInput = false;
    },

    doHideLocation() {
      this.showLocation = false;
      this.$store.chat.showQueryInput = true;
    },

    selectMore() {
      this.hideServices();
      this.$store.chat.focusQueryInput = true;
    },

    hideServices() {
      window.setTimeout(() => {
        this.showServices5 = false;
      }, 100);
      window.setTimeout(() => {
        this.showServices4 = false;
      }, 200);
      window.setTimeout(() => {
        this.showServices3 = false;
      }, 300);
      window.setTimeout(() => {
        this.showServices2 = false;
      }, 400);
      window.setTimeout(() => {
        this.showServices1 = false;
      }, 500);
    },

    async handleLocationSubmitted() {
      if (this.selectedLocation.trim() === '') {
        return;
      }

      window.setTimeout(() => {
        this.doHideLocation();
      }, 100);

      window.setTimeout(() => {
        const searchQuery = `${this.selectedService} near ${this.selectedLocation}`;
        this.$store.chat.userMessage = searchQuery;
        this.$store.chat.focusQueryInput = true;
        this.$store.chat.pushButton = true;
      }, 300);
    },

    resetQuickFinder() {
      this.showServices = true;
      this.doHideLocation();
      this.selectedService = '';
      this.selectedLocation = '';
    },
  }
}
