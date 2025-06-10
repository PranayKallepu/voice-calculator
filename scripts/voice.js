// Voice command functionality
document.addEventListener("DOMContentLoaded", () => {
  const voiceButton = document.querySelector(".voice-btn");
  const micIcon = document.querySelector(".mic-icon");
  const voiceText = document.querySelector(".voice-text");
  const display = document.getElementById("result");
  const expression = document.getElementById("expression");
  const voiceCircle = document.querySelector(".voice-circle");
  const voiceOverlay = document.querySelector(".voice-overlay");

  // Add test button for speech synthesis
  const testButton = document.createElement("button");
  testButton.textContent = "Test Speech";
  testButton.style.margin = "10px";
  document.body.appendChild(testButton);

  testButton.addEventListener("click", () => {
    speakResult(
      "Testing speech synthesis. If you can hear this, the speech function is working!"
    );
  });

  // --- Define the factorial function ---
  const factorial = (n) => {
    if (n < 0) {
      return "Error: Factorial of negative number";
    }
    if (n === 0 || n === 1) {
      return 1;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

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

      // Convert spoken words to mathematical expression
      let mathExpression = speechResult
        .replace(/plus/g, "+")
        .replace(/minus/g, "-")
        .replace(/times|multiply|multiplied by|into/g, "*")
        .replace(/divided by|divide/g, "/")
        .replace(/power|to the power of/g, "^")
        .replace(/square root|root of|root/g, "√")
        .replace(/mod|modulo/g, "%")
        .replace(/factorial|fact of|factor/g, "!");

      // includes only numbers, operators
      mathExpression = mathExpression.replace(/[^0-9+\-*\/\^√%!()\s.]/g, "");
      console.log(mathExpression);

      // Show the expression in the display
      expression.textContent = mathExpression;
      display.value = mathExpression;

      try {
        // Evaluate the expression
        const result = Function(
          '"use strict"; return (' + mathExpression + ")"
        )();

        // Update display with result
        display.value = result;
        // Remove any trailing dots and format the expression
        expression.textContent = `${mathExpression} = ${result}`;

        // Speak the result
        speakResult(`The answer is ${result}`);
      } catch (error) {
        console.error("Error evaluating expression:", error);
        alert("Invalid mathematical expression. Please try again.");
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
