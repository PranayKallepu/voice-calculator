# 🎙️ Voice Command Calculator Web App

A hands-free calculator that listens to your **voice commands**, performs **arithmetic calculations**, and **speaks the results aloud**. It also stores your calculation history in **local storage** so you never lose your previous results.

---

## 🚀 Features

- 🎤 **Voice Input**: Perform calculations by speaking commands like:

  - "Add 5 and 3"
  - "What is 10 divided by 2"
  - "Multiply 7 by 8"

- 🧠 **Natural Language Parsing**: Recognizes common phrases for addition, subtraction, multiplication, and division.
- 🔊 **Web Speech API**:

  - 🗣️ Recognizes input voice from microphone using the **Web Speech API (SpeechRecognition)**.
  - 🔊 Speaks the result aloud using the **Web Speech API (SpeechSynthesis)**.

- 🗃️ **Local Storage History**:

  - Saves previous calculations in the browser's **local storage**.
  - Displays history on page load.
  - Option to **clear history** with a single click.

- 🖥️ **Simple & User-Friendly Interface**:
  - **Microphone button** to start voice input.
  - **Calculation display** for the recognized command and result.
  - **History list** to show past calculations.

---

## 🛠️ Tech Stack

| Technology     | Usage                               |
| -------------- | ----------------------------------- |
| HTML5          | Structure of the web app            |
| CSS3           | Styling and layout                  |
| JavaScript     | Functionality and logic             |
| Web Speech API | Voice recognition and speech output |

---

## 📦 How to Run the Project

1. **Clone the Repository** (if hosted on GitHub):
   ```bash
   git clone https://github.com/your-username/voice-command-calculator.git
   cd voice-command-calculator
   ```
