let selectedVoice = null;

// Function to initialize and get the Zira voice
const initializeVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  selectedVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes("female")
  );
};

// Initialize voice when voices are loaded
if ("speechSynthesis" in window) {
  if (window.speechSynthesis.getVoices().length > 0) {
    initializeVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = initializeVoice;
  }
}

// Shared speak function
const speakResult = (textToSpeak) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 0.5;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
};

// Export the speak function
window.speakResult = speakResult;
