// History management functions
const HISTORY_KEY = "calculator_history";
const MAX_HISTORY_ITEMS = 50;

// Save calculation to history
function saveToHistory(expression, result) {
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

  // Add new calculation at the beginning
  history.unshift({
    expression,
    result,
    timestamp: new Date().toISOString(),
  });

  // Keep only the last MAX_HISTORY_ITEMS calculations
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  updateHistoryDisplay();
}

// Get history from localStorage
function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

// Clear history
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
  const historyList = document.getElementById("history-list");
  const history = getHistory();

  if (historyList) {
    historyList.innerHTML = "";

    if (history.length === 0) {
      historyList.innerHTML =
        '<li class="empty-history">No calculation history</li>';
      return;
    }

    history.forEach((item) => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let formattedDate;
      if (date.toDateString() === today.toDateString()) {
        formattedDate = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        formattedDate = "Yesterday";
      } else {
        formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="history-item">
          <div>
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
          </div>
          <div class="history-timestamp">
          <p>${formattedDate}</p>
            <p>${formattedTime}</p>
          </div>
        </div>
      `;
      historyList.appendChild(li);
    });
  }
}

// Toggle history panel
function toggleHistory() {
  const historyPanel = document.getElementById("history-panel");
  const overlay = document.querySelector(".history-overlay");

  if (historyPanel) {
    const isShowing = historyPanel.classList.contains("show");

    if (isShowing) {
      // Closing the panel
      historyPanel.classList.remove("show");
      overlay.classList.remove("show");
      document.body.style.overflow = "auto";
    } else {
      // Opening the panel
      historyPanel.classList.add("show");
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
      // Update the display when opening
      updateHistoryDisplay();
    }
  }
}

// Initialize history when page loads
document.addEventListener("DOMContentLoaded", () => {
  updateHistoryDisplay();
});
