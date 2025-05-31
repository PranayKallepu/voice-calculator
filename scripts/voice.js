// Voice command functionality
document.addEventListener("DOMContentLoaded", () => {
  const voiceButton = document.querySelector(".voice-btn");
  const micIcon = document.querySelector(".mic-icon");
  const voiceText = document.querySelector(".voice-text");
  const display = document.getElementById("result");
  const expression = document.getElementById("expression");
  const voiceCircle = document.querySelector(".voice-circle");
  const voiceOverlay = document.querySelector(".voice-overlay");

  // Check if browser supports speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Function to toggle mic text and voice circle
    const toggleMicText = (isListening) => {
      if (isListening) {
        micIcon.textContent = "🎤";
        voiceText.textContent = "Speak Now...";
        voiceButton.classList.add("voice-active");
        voiceCircle.classList.add("active");
        voiceOverlay.classList.add("active");
      } else {
        micIcon.textContent = "🎤";
        voiceText.textContent = "Voice Input";
        voiceButton.classList.remove("voice-active");
        voiceCircle.classList.remove("active");
        voiceOverlay.classList.remove("active");
      }
    };

    // Voice button click event
    voiceButton.addEventListener("click", () => {
      voiceButton.classList.add("voice-active");
      toggleMicText(true);
      recognition.start();
    });

    // Handle speech recognition results
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      console.log("Speech recognized:", speechResult);

      // Parse the speech result
      const numbers = speechResult.match(/\d+/g);

      if (!numbers || numbers.length < 2) {
        alert(
          "Please speak two numbers for calculation. For example: '5 plus 3'"
        );
        toggleMicText(false);
        voiceButton.classList.remove("voice-active");
        return;
      }

      const firstNumber = numbers[0];
      const secondNumber = numbers[1];
      let operation = null;

      // Determine operation
      if (
        speechResult.includes("+") ||
        speechResult.includes("add") ||
        speechResult.includes("plus")
      ) {
        operation = "+";
      } else if (
        speechResult.includes("-") ||
        speechResult.includes("subtract") ||
        speechResult.includes("minus")
      ) {
        operation = "-";
      } else if (
        speechResult.includes("x") ||
        speechResult.includes("multiply") ||
        speechResult.includes("times")
      ) {
        operation = "x";
      } else if (
        speechResult.includes("/") ||
        speechResult.includes("divide") ||
        speechResult.includes("divided by")
      ) {
        operation = "/";
      }

      if (!operation) {
        alert(
          "Please specify an operation. Use words like 'plus', 'minus', 'times', or 'divided by'"
        );
        toggleMicText(false);
        voiceButton.classList.remove("voice-active");
        return;
      }

      // Perform calculation
      let result;
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);

      if (operation === "/" && num2 === 0) {
        alert("Cannot divide by zero!");
        toggleMicText(false);
        voiceButton.classList.remove("voice-active");
        return;
      }

      switch (operation) {
        case "+":
          result = num1 + num2;
          break;
        case "-":
          result = num1 - num2;
          break;
        case "x":
          result = num1 * num2;
          break;
        case "/":
          result = num1 / num2;
          break;
      }

      // Update both display and expression
      display.value = result;
      expression.textContent = `${firstNumber} ${operation} ${secondNumber} =`;
      console.log("result : ", result);

      // Speak the result
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          `The Answer is ${result}`
        );
        utterance.rate = 0.9;
        utterance.pitch = 1.2; // Higher pitch for female voice
        utterance.volume = 1;

        // Get available voices and set a female voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.includes("female") || voice.name.includes("Female")
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        window.speechSynthesis.speak(utterance);
      }

      toggleMicText(false);
      voiceButton.classList.remove("voice-active");
    };

    recognition.onend = () => {
      toggleMicText(false);
      voiceButton.classList.remove("voice-active");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error in speech recognition. Please try again.");
      toggleMicText(false);
      voiceButton.classList.remove("voice-active");
    };
  } else {
    voiceButton.disabled = true;
    voiceButton.textContent = "Voice not supported";
    alert(
      "Your browser does not support speech recognition. Please use a modern browser."
    );
  }
});
