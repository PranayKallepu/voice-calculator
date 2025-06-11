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
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
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

    voiceButton.addEventListener("click", () => {
      toggleMicText(true);
      recognition.start();
    });

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      console.log("Speech recognized:", speechResult);

      let mathExpression = speechResult
        .replace(/plus/g, "+")
        .replace(/minus/g, "-")
        .replace(/\b(x|times|multiply|multiplied by|into)\b/g, "*") // include "x"
        .replace(/divided by|divide/g, "/")
        .replace(/power|to the power of/g, "^")
        .replace(
          /\b(square root of|square root|root of|root)\s*(\d+(\.\d+)?|\([^()]*\))/g,
          (_, __, val) => `√${val}`
        ) // attach val to √
        .replace(/modulo|mod/g, "%")
        .replace(/factorial of (\d+)/g, (_, num) => `${num}!`)
        .replace(/(\d+)\s*factorial/g, (_, num) => `${num}!`);

      mathExpression = mathExpression.replace(/[^0-9+\-*/^√%!().\s]/g, "");
      expression.textContent = mathExpression;
      display.value = mathExpression;

      try {
        let sanitized = mathExpression
          .replace(/\^/g, "**") // power
          .replace(
            /√(\d+(\.\d+)?|\([^()]*\))/g,
            (_, val) => `Math.sqrt(${val})`
          ) // improved √ handling
          .replace(/(\d+|\([^()]*\))!/g, (_, val) => `factorial(${val})`); // factorial

        const result = Function(
          "factorial",
          `"use strict"; return (${sanitized})`
        )(factorial);

        display.value = result;
        expression.textContent = `${mathExpression} = ${result}`;
        speakResult(`The answer is ${result}`);
      } catch (error) {
        console.error("Error evaluating expression:", error);
        alert("Invalid mathematical expression. Please try again.");
      }

      toggleMicText(false);
    };

    recognition.onend = () => {
      toggleMicText(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error in speech recognition. Please try again.");
      toggleMicText(false);
    };
  } else {
    voiceButton.disabled = true;
    voiceButton.textContent = "Voice not supported";
    alert(
      "Your browser does not support speech recognition. Please use a modern browser."
    );
  }

  // Speak result
  function speakResult(text) {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  }
});
