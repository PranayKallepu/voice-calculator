// Calculator functionality
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("result");
  const expression = document.getElementById("expression");
  const buttons = document.querySelectorAll("button");

  let expressionInput = "";
  let lastResult = "0";
  let displayTimeout;

  // Function to clear calculator
  window.clearCalculator = () => {
    expressionInput = "";
    display.value = "0";
    expression.textContent = `Ans = ${lastResult}`;
  };

  // Function to update expression display
  const updateExpression = () => {
    if (expressionInput === "") {
      expression.textContent = "0";
    } else {
      expression.textContent = expressionInput;
    }
  };

  // Function to handle number input
  const handleNumber = (number) => {
    expressionInput += number;
    display.value = expressionInput;
    updateExpression();
    resetTimeout();
  };

  // Function to handle operation input
  const handleOperation = (op) => {
    const mappedOp = op === "x" ? "*" : op;
    expressionInput += mappedOp;
    display.value = expressionInput;
    updateExpression();
    resetTimeout();
  };

  // Function to calculate the result of full expression
  const calculate = () => {
    try {
      // Evaluate expression safely
      const result = Function(
        '"use strict"; return (' + expressionInput + ")"
      )();
      lastResult = String(result);
      display.value = result;
      expression.textContent = `${expressionInput} =`;
      expressionInput = String(result); // Allow chaining
      speakResult(`The answer is ${result}`);
      saveToHistory(`${expression.textContent}`, result);
    } catch (error) {
      display.value = "Error";
    }
    resetTimeout();
  };

  // Auto-clear after 15 seconds
  const resetTimeout = () => {
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
      clearCalculator();
    }, 15000);
  };

  // Dummy saveToHistory function (can be customized)
  const saveToHistory = (expr, result) => {
    console.log(`History: ${expr} = ${result}`);
  };

  // Dummy speakResult function (can be customized)
  const speakResult = (text) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  // Handle button clicks
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent.trim();

      if (/[0-9]/.test(buttonText)) {
        handleNumber(buttonText);
      } else if (buttonText === "00") {
        handleNumber("00");
      } else if (["+", "-", "x", "/", "^", "%"].includes(buttonText)) {
        handleOperation(buttonText);
      } else if (buttonText === "=") {
        calculate();
      } else if (buttonText === "AC") {
        clearCalculator();
      }

      // Add press animation
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 100);
    });
  });

  // Initial display
  display.value = "0";
  expression.textContent = `Ans = ${lastResult}`;
});
