/**
 * main.js - Основний файл для інтерфейсу додатку вивчення таблиці множення
 * Містить основні змінні та ініціалізацію програми
 */

// Елементи інтерфейсу
const restartButton = document.getElementById("restartButton");
const goHomeButton = document.getElementById("goHomeButton");
const questionScreen = document.getElementById("question-screen");
const introScreen = document.getElementById("intro-screen");
const summaryScreen = document.getElementById("summary-screen");
const statsScreen = document.getElementById("stats-screen");
const statsButton = document.getElementById("statsButton");
const statsIconList = document.getElementById("statsIconList");
const statsIconClose = document.getElementById("statsIconClose");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const resultText = document.getElementById("resultText");
const finalScoreText = document.getElementById("finalScore");
const answersList = document.getElementById("answersList");
const statsTable = document.getElementById("statsTable");
const numberButtonsContainer = document.getElementById(
  "numberButtonsContainer"
);
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// Елементи для нових функцій
const progressBar = document.getElementById("progressBar");
const starsContainer = document.getElementById("starsContainer");
const themeToggle = document.getElementById("themeToggle");
const difficultySelector = document.getElementById("difficultySelector");
const timerContainer = document.getElementById("timerContainer");
const timerBar = document.getElementById("timerBar");
const comboCounter = document.getElementById("comboCounter");
const comboValue = document.getElementById("comboValue");
const mascot = document.getElementById("mascot");
const mascotSpeech = document.getElementById("mascotSpeech");
const confettiContainer = document.getElementById("confettiContainer");
const celebrationScreen = document.getElementById("celebrationScreen");
const celebrationScore = document.getElementById("celebrationScore");
const celebrationCloseBtn = document.getElementById("celebrationCloseBtn");
const achievementsContainer = document.getElementById("achievementsContainer");

// Основні змінні
let currentQuestion = 0;
let totalQuestions = 10; // Кількість запитань за одне проходження
let correctAnswers = 0;
let answersLog = []; // Історія відповідей
let chosenNumber = "all"; // Обране число для тестування
let num1, num2; // Поточні множники
let correctAnswer; // Правильна відповідь
let statsOpen = false; // Стан вікна статистики

// Змінні для нових функцій
let currentTheme = "light"; // Поточна тема
let difficultyLevel = "easy"; // Рівень складності
let comboCount = 0; // Поточне комбо
let maxCombo = 0; // Максимальне комбо за одне проходження
let timerId = null; // ID таймера
let timeLeft = 100; // Залишок часу у відсотках

// Обробники подій
document.addEventListener("DOMContentLoaded", () => {
  // Ініціалізуємо обробники подій
  setupEventListeners();

  // Ініціалізуємо нові функції
  initNewFeatures();
});

// Функція для налаштування всіх обробників подій
function setupEventListeners() {
  // Вибір числа для тестування
  numberButtonsContainer.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      chosenNumber = btn.getAttribute("data-value");
      startTest();
    });
  });

  // Обробка кнопки статистики
  statsButton.addEventListener("click", () => {
    statsOpen = !statsOpen;
    if (statsOpen) {
      showStats();
    } else {
      hideStats();
    }
    toggleStatsButtonIcon(statsOpen);
  });

  // Кнопки перезапуску і повернення на головну
  restartButton.addEventListener("click", startTest);
  goHomeButton.addEventListener("click", goHome);

  // Кнопка закриття екрану святкування
  celebrationCloseBtn.addEventListener("click", showSummaryScreen);

  // Кнопка перемикання теми
  themeToggle.addEventListener("click", toggleTheme);

  // Кнопки вибору складності
  difficultySelector.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      setDifficulty(this.getAttribute("data-difficulty"));
    });
  });
}

// Функція для ініціалізації нових функцій
function initNewFeatures() {
  // Встановлюємо складність за замовчуванням
  setDifficulty("easy");

  // Ініціалізуємо маскота
  initMascot();

  // Налаштовуємо досягнення
  setupAchievements();

  // Налаштовуємо додаткове аудіо
  setupAudio();
}

// Налаштування додаткового аудіо
function setupAudio() {
  // Додаємо аудіо для комбо, досягнень та інших подій
  if (!document.getElementById("comboSound")) {
    const comboSound = document.createElement("audio");
    comboSound.id = "comboSound";
    comboSound.src = "https://www.fesliyanstudios.com/play-mp3/6";
    comboSound.preload = "auto";
    document.body.appendChild(comboSound);
  }

  if (!document.getElementById("achievementSound")) {
    const achievementSound = document.createElement("audio");
    achievementSound.id = "achievementSound";
    achievementSound.src = "https://www.fesliyanstudios.com/play-mp3/5";
    achievementSound.preload = "auto";
    document.body.appendChild(achievementSound);
  }
}

// Функція для перемикання іконки кнопки статистики
function toggleStatsButtonIcon(isOpen) {
  if (isOpen) {
    statsIconList.style.display = "none";
    statsIconClose.style.display = "block";
  } else {
    statsIconList.style.display = "block";
    statsIconClose.style.display = "none";
  }
}

// Функція для переходу на головну
function goHome() {
  summaryScreen.style.display = "none";
  statsScreen.style.display = "none";
  questionScreen.style.display = "none";
  introScreen.style.display = "block";
}

// Функція для приховування статистики
function hideStats() {
  statsScreen.style.display = "none";
  introScreen.style.display = "block";
}
