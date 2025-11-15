// izhantts.js - IzhanTTS single-file TTS library
const IzhanTTS = (() => {
  let options = {
    lang: 'en-US',
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
    onend: null
  };

  // Internal function to speak text safely
  function speakText(text, settings) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = settings.lang;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      // Set voice if specified
      if (settings.voice) {
        const voices = window.speechSynthesis.getVoices();
        const selected = voices.find(v => v.name === settings.voice);
        if (selected) utterance.voice = selected;
      }

      // On end callback
      if (typeof settings.onend === 'function') {
        utterance.onend = settings.onend;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(`IzhanTTS failed to speak! Reason: ${err}`);
    }
  }

  // Speak function
  function speak(text, opts = {}) {
    if (!window.speechSynthesis) {
      console.error("IzhanTTS failed to Initialize! Reason: SpeechSynthesis API not supported in this browser.");
      return;
    }
    const settings = { ...options, ...opts };
    speakText(text, settings);
  }

  // Set global default options
  function setOptions(opts = {}) {
    options = { ...options, ...opts };
  }

  // Stop current speech
  function stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // List available voices
  function listVoices() {
    return window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  // Initialization check
  (function initCheck() {
    try {
      if (!window.speechSynthesis) throw new Error("SpeechSynthesis API not supported.");
      console.log("IzhanTTS initialized successfully!");
      // Optional: speak a small confirmation
      speakText("IzhanTTS initialized successfully!", options);
    } catch (err) {
      console.error(`IzhanTTS failed to Initialize! Reason: ${err.message}`);
      // Optional: attempt to speak the failure message
      if (window.speechSynthesis) {
        speakText(`IzhanTTS failed to Initialize! Reason: ${err.message}`, options);
      }
    }
  })();

  return {
    speak,
    setOptions,
    stop,
    listVoices
  };
})();
