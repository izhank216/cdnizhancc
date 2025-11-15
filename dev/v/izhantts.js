const IzhanTTS = (() => {
  let options = {
    lang: 'en-US',
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
    onend: null
  };

  function speakText(text, settings) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.lang;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      if (settings.voice) {
        const voices = window.speechSynthesis.getVoices();
        const selected = voices.find(v => v.name === settings.voice);
        if (selected) utterance.voice = selected;
      }
      if (typeof settings.onend === 'function') {
        utterance.onend = settings.onend;
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(`IzhanTTS failed to speak! Reason: ${err}`);
    }
  }

  function speak(text, opts = {}) {
    if (!window.speechSynthesis) {
      console.error("IzhanTTS failed to Initialize! Reason: SpeechSynthesis API not supported in this browser.");
      return;
    }
    const settings = { ...options, ...opts };
    speakText(text, settings);
  }

  function setOptions(opts = {}) {
    options = { ...options, ...opts };
  }

  function stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  function listVoices() {
    return window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  (function initCheck() {
    try {
      if (!window.speechSynthesis) throw new Error("SpeechSynthesis API not supported.");
      console.log("IzhanTTS initialized successfully!");
      speakText("IzhanTTS initialized successfully!", options);
    } catch (err) {
      console.error(`IzhanTTS failed to Initialize! Reason: ${err.message}`);
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
