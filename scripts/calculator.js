document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("result");
  const expression = document.getElementById("expression");
  const buttons = document.querySelectorAll("button");

  let expressionInput = "";
  let lastResult = "0";
  let displayTimeout;

  window.clearCalculator = () => {
    expressionInput = "";
    display.value = "0";
    expression.textContent = `Ans = ${lastResult}`;
  };

  const updateExpression = () => {
    expression.textContent = expressionInput || "0";
  };

  const handleNumber = (number) => {
    expressionInput += number;
    display.value = expressionInput;
    updateExpression();
    resetTimeout();
  };

  const handleOperation = (op) => {
    let mappedOp = op;
    if (op === "x") mappedOp = "*";
    else if (op === "^") mappedOp = "**";
    else if (op === "mod" || op === "%") mappedOp = "%";
    else if (op === "!") mappedOp = "!";
    else if (op === "√") mappedOp = "√";

    expressionInput += mappedOp;
    display.value = expressionInput;
    updateExpression();
    resetTimeout();
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const calculate = () => {
    try {
      let sanitized = expressionInput
        .replace(/x/g, "*")
        .replace(/\^/g, "**")
        .replace(/mod/g, "%")
        .replace(/√(\d+|\([^()]*\))/g, (match, p1) => `Math.sqrt(${p1})`)
        .replace(/(\d+|\([^()]*\))!/g, (match, p1) => `factorial(${p1})`);

      const result = Function(
        "factorial",
        `"use strict"; return (${sanitized})`
      )(factorial);

      lastResult = String(result);
      display.value = result;
      expression.textContent = `${expressionInput} =`;
      expressionInput = String(result);
      speakResult(`The answer is ${result}`);
      saveToHistory(`${expression.textContent}`, result);
    } catch (error) {
      display.value = "Error";
    }
    resetTimeout();
  };

  const resetTimeout = () => {
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
      clearCalculator();
    }, 15000);
  };

  const saveToHistory = (expr, result) => {
    console.log(`History: ${expr} = ${result}`);
  };

  const speakResult = (text) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent.trim();

      if (/^\d+$/.test(buttonText)) {
        handleNumber(buttonText);
      } else if (buttonText === "00") {
        handleNumber("00");
      } else if (
        ["+", "-", "x", "/", "^", "mod", "%", "!", "√"].includes(buttonText)
      ) {
        handleOperation(buttonText);
      } else if (buttonText === "=") {
        calculate();
      } else if (buttonText === "AC") {
        clearCalculator();
      }

      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 100);
    });
  });

  display.value = "0";
  expression.textContent = `Ans = ${lastResult}`;
});
