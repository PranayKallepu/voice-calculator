// Calculator functionality
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("result");
  const expression = document.getElementById("expression");
  const buttons = document.querySelectorAll("button");

  let currentInput = "0";
  let previousInput = "";
  let operation = null;
  let resetInput = false;
  let displayTimeout;
  let isShowingExpression = true;
  let lastResult = "0";

  // Function to clear calculator
  window.clearCalculator = () => {
    currentInput = "0";
    previousInput = "";
    operation = null;
    resetInput = false;
    isShowingExpression = true;
    display.value = "0";
    expression.textContent = `Ans = ${lastResult}`;
  };

  // Function to update display
  const updateDisplay = () => {
    if (isShowingExpression) {
      // Show the expression in the result display
      if (operation && previousInput) {
        display.value = `${previousInput} ${operation} ${currentInput}`;
      } else {
        display.value = currentInput;
      }
    } else {
      // Show the result
      display.value = currentInput;
    }

    // Auto clear after 15 seconds
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
      clearCalculator();
    }, 15000);
  };

  // Function to update expression
  const updateExpression = () => {
    if (!isShowingExpression) {
      expression.textContent = `${previousInput} ${operation} ${currentInput} =`;
    } else {
      expression.textContent = "0";
    }
  };

  // Function to handle number input
  const handleNumber = (number) => {
    if (currentInput === "0" || resetInput) {
      currentInput = number;
      resetInput = false;
    } else {
      currentInput += number;
    }
    isShowingExpression = true;
    updateDisplay();
    updateExpression();
  };

  // Function to handle operation
  const handleOperation = (op) => {
    if (operation !== null) {
      calculate();
    }
    previousInput = currentInput;
    operation = op;
    resetInput = true;
    isShowingExpression = true;
    updateDisplay();
    updateExpression();
  };

  // Function to speak the result
  const speakResult = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1; // Slightly slower than normal
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
  };

  // Function to calculate result
  const calculate = () => {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "x":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
      default:
        return;
    }

    currentInput = String(result);
    lastResult = String(result);
    isShowingExpression = false;
    updateDisplay();
    updateExpression();

    // Save calculation to history
    const historyExpression = `${previousInput} ${operation} ${currentInput}`;
    saveToHistory(historyExpression, result);

    // Speak the result
    speakResult(`The Answer is ${result}`);
  };

  // Add event listeners to buttons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Get button text content
      const buttonText = button.textContent.trim();

      // Handle different button types
      if (buttonText.match(/[0-9]/)) {
        handleNumber(buttonText);
      } else if (buttonText === "00") {
        if (currentInput !== "0") {
          currentInput += "00";
          isShowingExpression = true;
          updateDisplay();
          updateExpression();
        }
      } else if (["+", "-", "x", "/"].includes(buttonText)) {
        handleOperation(buttonText);
      } else if (buttonText === "=") {
        calculate();
      } else if (buttonText === "AC") {
        clearCalculator();
      }

      // Add button press animation
      button.classList.add("pressed");
      setTimeout(() => {
        button.classList.remove("pressed");
      }, 100);
    });
  });

  // Initialize display
  updateDisplay();
  updateExpression();
});
