/**
 * achievements.js - Файл для системи досягнень
 * Містить функції для обробки та відображення досягнень
 */

// Значки досягнень
let badges = {
  perfectScore: {
    id: "perfect",
    title: "Ідеальний результат",
    earned: false,
    icon: "🏆",
  },
  fastSolver: {
    id: "fast",
    title: "Швидкий розв'язувач",
    earned: false,
    icon: "⚡",
  },
  comboMaster: {
    id: "combo",
    title: "Майстер комбо",
    earned: false,
    icon: "🔥",
  },
  mathExpert: {
    id: "expert",
    title: "Експерт таблиці множення",
    earned: false,
    icon: "🧠",
  },
  persistent: {
    id: "persistent",
    title: "Наполегливий учень",
    earned: false,
    icon: "🔄",
  },
};

// Перевірка досягнень
function checkAchievements() {
  // Ідеальний результат
  if (correctAnswers === totalQuestions) {
    if (!badges.perfectScore.earned) {
      showAchievementNotification(badges.perfectScore);
    }
    badges.perfectScore.earned = true;
  }

  // Комбо майстер
  if (maxCombo >= 5) {
    if (!badges.comboMaster.earned) {
      showAchievementNotification(badges.comboMaster);
    }
    badges.comboMaster.earned = true;
  }

  // Експерт таблиці множення
  const previousResults =
    JSON.parse(localStorage.getItem("multiplicationResults")) || [];
  if (previousResults.length >= 5 && correctAnswers >= totalQuestions * 0.8) {
    if (!badges.mathExpert.earned) {
      showAchievementNotification(badges.mathExpert);
    }
    badges.mathExpert.earned = true;
  }

  // Наполегливий учень
  if (previousResults.length >= 10) {
    if (!badges.persistent.earned) {
      showAchievementNotification(badges.persistent);
    }
    badges.persistent.earned = true;
  }

  // Швидкий розв'язувач - якщо середній час відповіді менше половини максимального
  if (timeLeft > 50) {
    if (!badges.fastSolver.earned) {
      showAchievementNotification(badges.fastSolver);
    }
    badges.fastSolver.earned = true;
  }

  // Зберігаємо досягнення
  localStorage.setItem("mathAchievements", JSON.stringify(badges));
}

// Показати повідомлення про нове досягнення
function showAchievementNotification(badge) {
  // Відтворення звуку досягнення
  if (document.getElementById("achievementSound")) {
    document.getElementById("achievementSound").play();
  }

  // Створюємо елемент повідомлення
  const notification = document.createElement("div");
  notification.classList.add("achievement-unlocked");
  notification.innerHTML = `
        <div class="achievement-icon">${badge.icon}</div>
        <div class="achievement-title">Нове досягнення!</div>
        <div class="achievement-name">${badge.title}</div>
    `;

  // Додаємо повідомлення на сторінку
  document.body.appendChild(notification);

  // Видаляємо повідомлення через 3 секунди
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Завантаження досягнень
function loadAchievements() {
  const savedAchievements = JSON.parse(
    localStorage.getItem("mathAchievements")
  );
  if (savedAchievements) {
    badges = savedAchievements;
  }
}

// Налаштування досягнень
function setupAchievements() {
  loadAchievements();
}
