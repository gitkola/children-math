/**
 * ui.js - Файл для елементів інтерфейсу
 * Містить функції для анімацій, зміни теми, візуальних ефектів
 */

// Текст для маскота
const mascotMessages = {
  welcome: [
    "Привіт! Давай вивчати таблицю множення!",
    "Готовий до математичних пригод?",
    "Я допоможу тобі стати кращим у множенні!",
  ],
  correct: ["Чудово!", "Так тримати!", "Відмінно!", "Ти молодець!", "Супер!"],
  wrong: [
    "Спробуй ще раз!",
    "Не здавайся!",
    "Наступного разу вийде!",
    "Помилки допомагають вчитися!",
  ],
  encourage: [
    "Ти можеш це зробити!",
    "Я вірю в тебе!",
    "Кожна практика робить тебе кращим!",
  ],
  highScore: ["Новий рекорд!", "Ти перевершив себе!", "Неймовірний результат!"],
};

// Ініціалізація маскота
function initMascot() {
  // Показуємо випадкове привітання
  showMascotMessage(getRandomMessage(mascotMessages.welcome));

  // Анімація маскота
  setInterval(() => {
    if (Math.random() > 0.7) {
      mascot.style.animation = "jump 0.5s ease";
      setTimeout(() => {
        mascot.style.animation = "";
      }, 500);
    }
  }, 5000);
}

// Показ повідомлення від маскота
function showMascotMessage(message) {
  mascotSpeech.textContent = message;
  mascotSpeech.classList.add("visible");

  setTimeout(() => {
    mascotSpeech.classList.remove("visible");
  }, 3000);
}

// Отримання випадкового повідомлення з масиву
function getRandomMessage(messageArray) {
  return messageArray[Math.floor(Math.random() * messageArray.length)];
}

// Ініціалізація прогрес-бару
function updateProgressBar() {
  const progress = (currentQuestion / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
}

// Ініціалізація зірочок
function updateStars() {
  const stars = starsContainer.querySelectorAll(".star");
  const starsEarned = Math.floor((correctAnswers / totalQuestions) * 3);

  stars.forEach((star, index) => {
    if (index < starsEarned) {
      star.classList.add("earned");
    } else {
      star.classList.remove("earned");
    }
  });
}

// Переключення теми
function toggleTheme() {
  const themes = ["light", "dark", "space", "pirate"];
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  currentTheme = themes[nextIndex];

  document.body.classList.remove("dark-theme", "space-theme", "pirate-theme");

  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
  } else if (currentTheme === "space") {
    document.body.classList.add("space-theme");
  } else if (currentTheme === "pirate") {
    document.body.classList.add("pirate-theme");
  }

  showMascotMessage(`Тема змінена на: ${getCurrentThemeName()}`);
}

// Отримати назву поточної теми
function getCurrentThemeName() {
  const themeNames = {
    light: "Звичайна",
    dark: "Темна",
    space: "Космічна",
    pirate: "Піратська",
  };
  return themeNames[currentTheme];
}

// Функція для встановлення рівня складності
function setDifficulty(level) {
  difficultyLevel = level;

  // Оновлюємо активну кнопку
  const buttons = difficultySelector.querySelectorAll(".difficulty-btn");
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-difficulty") === level) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Налаштовуємо параметри в залежності від складності
  if (level === "easy") {
    totalQuestions = 10;
    timeLeft = 15; // Секунд на відповідь
  } else if (level === "medium") {
    totalQuestions = 15;
    timeLeft = 10;
  } else if (level === "hard") {
    totalQuestions = 20;
    timeLeft = 7;
  }

  showMascotMessage(`Рівень складності: ${getDifficultyName(level)}`);
}

// Отримати назву складності
function getDifficultyName(level) {
  const names = {
    easy: "Легкий",
    medium: "Середній",
    hard: "Складний",
  };
  return names[level];
}

// Запуск таймера для відповіді
function startTimer() {
  // Скидаємо таймер
  if (timerId) {
    clearInterval(timerId);
  }

  timeLeft = 100; // Відсотки для відображення
  timerBar.style.width = "100%";

  // Отримуємо час у секундах залежно від складності
  let seconds;
  if (difficultyLevel === "easy") {
    seconds = 15;
  } else if (difficultyLevel === "medium") {
    seconds = 10;
  } else {
    seconds = 7;
  }

  const interval = 10; // Мілісекунд на кожен крок
  const steps = (seconds * 1000) / interval; // Кількість кроків
  const decrement = 100 / steps; // Зменшення у відсотках на кожен крок

  timerId = setInterval(() => {
    timeLeft -= decrement;
    timerBar.style.width = `${timeLeft}%`;

    // Змінюємо колір таймера при зменшенні часу
    if (timeLeft < 30) {
      timerBar.style.backgroundColor = "#ff3860";
    } else if (timeLeft < 60) {
      timerBar.style.backgroundColor = "#ffdd57";
    } else {
      timerBar.style.backgroundColor = "#007bff";
    }

    // Час вийшов
    if (timeLeft <= 0) {
      clearInterval(timerId);
      checkAnswer(null); // Передаємо null для позначення що час вийшов
    }
  }, interval);
}

// Оновлення лічильника комбо
function updateComboCounter(isCorrect) {
  if (isCorrect) {
    comboCount++;
    if (comboCount > maxCombo) {
      maxCombo = comboCount;
    }
  } else {
    comboCount = 0;
  }

  comboValue.textContent = comboCount;

  // Анімуємо лічильник комбо
  if (comboCount >= 3) {
    comboCounter.classList.add("active");

    // Показуємо повідомлення при великих комбо
    if (comboCount === 3) {
      showMascotMessage("Комбо x3! Чудово!");
      if (document.getElementById("comboSound")) {
        document.getElementById("comboSound").play();
      }
    } else if (comboCount === 5) {
      showMascotMessage("Комбо x5! Неймовірно!");
      if (document.getElementById("comboSound")) {
        document.getElementById("comboSound").play();
      }
    } else if (comboCount >= 7) {
      showMascotMessage("Комбо x" + comboCount + "! ТИ НАЙКРАЩИЙ!");
      createConfetti(20); // Додаємо конфетті для святкування
      if (document.getElementById("comboSound")) {
        document.getElementById("comboSound").play();
      }
    }
  } else {
    comboCounter.classList.remove("active");
  }
}

// Створення конфетті
function createConfetti(count) {
  confettiContainer.innerHTML = "";

  const colors = [
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#577590",
  ];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Встановлюємо випадкові параметри для кожного конфетті
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const animDuration = Math.random() * 3 + 2;
    const animDelay = Math.random() * 2;

    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = color;
    confetti.style.left = `${left}%`;
    confetti.style.opacity = "1";
    confetti.style.animation = `confetti-fall ${animDuration}s ease-in ${animDelay}s forwards`;

    confettiContainer.appendChild(confetti);
  }
}

// Відображення екрану святкування
function showCelebration() {
  celebrationScore.textContent = `${correctAnswers} / ${totalQuestions}`;

  // Очищаємо контейнер досягнень
  achievementsContainer.innerHTML = "";

  // Перевіряємо досягнення
  checkAchievements();

  // Додаємо значки досягнень
  Object.values(badges).forEach((badge) => {
    const badgeElement = document.createElement("div");
    badgeElement.classList.add("badge");
    if (badge.earned) {
      badgeElement.classList.add("earned");
    }

    badgeElement.innerHTML = `
            <div style="font-size: 2rem;">${badge.icon}</div>
            <div class="badge-tooltip">${badge.title}</div>
        `;

    achievementsContainer.appendChild(badgeElement);
  });

  // Показуємо екран святкування
  celebrationScreen.classList.add("show");

  // Створюємо конфетті для святкування
  if (correctAnswers >= totalQuestions * 0.7) {
    createConfetti(50);
  }
}
