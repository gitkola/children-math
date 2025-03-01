/**
 * game.js - Файл для логіки гри
 * Містить функції для генерації завдань, перевірки відповідей, тощо
 */

// Генерація нового запитання
function generateQuestion() {
  // Оновлюємо прогрес-бар
  updateProgressBar();

  // Запускаємо таймер
  startTimer();

  if (chosenNumber === "all") {
    // Обидва числа випадкові
    num1 = Math.floor(Math.random() * 10) + 1;
  } else {
    // Зафіксоване число + випадкове друге
    num1 = parseInt(chosenNumber, 10);
  }

  // Складніші приклади для середнього і складного рівнів
  if (difficultyLevel === "easy") {
    num2 = Math.floor(Math.random() * 10) + 1;
  } else if (difficultyLevel === "medium") {
    num2 = Math.floor(Math.random() * 12) + 1;
  } else {
    // Для складного рівня - числа до 15
    num1 = Math.floor(Math.random() * 15) + 1;
    num2 = Math.floor(Math.random() * 15) + 1;
  }

  correctAnswer = num1 * num2;

  questionText.textContent = `Скільки буде ${num1} × ${num2}?`;
  resultText.textContent = "";
  questionText.classList.remove("correct-animation", "wrong-animation");

  // Генеруємо відповіді в залежності від рівня складності
  const possibleAnswers = new Set();
  possibleAnswers.add(correctAnswer);

  // Для складних рівнів додаємо більш "каверзні" варіанти відповідей
  if (difficultyLevel === "medium" || difficultyLevel === "hard") {
    // Додаємо типові помилки: переплутані числа, +-1 від правильної відповіді
    possibleAnswers.add(num2 * num1); // Це те ж саме, але для каверзності
    possibleAnswers.add(correctAnswer + 1);
    possibleAnswers.add(correctAnswer - 1);
    possibleAnswers.add(num1 * (num2 + 1)); // Помилка в обчисленнях
  }

  while (possibleAnswers.size < 4) {
    // Генеруємо відповіді ближче до правильної для складніших рівнів
    let range = difficultyLevel === "easy" ? 50 : 20;
    let randomOffset =
      Math.floor(Math.random() * range) - Math.floor(range / 2);

    // Переконуємося, що відповідь не дорівнює правильній і більше 0
    let randomAnswer = correctAnswer + randomOffset;
    if (randomAnswer > 0 && randomAnswer !== correctAnswer) {
      possibleAnswers.add(randomAnswer);
    }
  }

  const answersArray = Array.from(possibleAnswers);
  answersArray.sort(() => Math.random() - 0.5);

  answersContainer.innerHTML = "";
  answersArray.forEach((answer) => {
    const ansBtn = document.createElement("button");
    ansBtn.textContent = answer;
    ansBtn.addEventListener("click", () => checkAnswer(answer));
    answersContainer.appendChild(ansBtn);
  });
}

// Перевірка відповіді
function checkAnswer(chosenAnswer) {
  // Зупиняємо таймер
  if (timerId) {
    clearInterval(timerId);
  }

  const allAnswerButtons = answersContainer.querySelectorAll("button");
  allAnswerButtons.forEach((btn) => {
    btn.disabled = true;
  });

  questionText.classList.remove("correct-animation", "wrong-animation");
  let isCorrect = false;

  // Якщо час вийшов
  if (chosenAnswer === null) {
    resultText.textContent = `Час вийшов! Правильна відповідь: ${correctAnswer}`;
    resultText.style.color = "red";
    wrongSound.play();
    questionText.classList.add("wrong-animation");
    showMascotMessage(getRandomMessage(mascotMessages.encourage));
  }
  // Якщо відповідь правильна
  else if (chosenAnswer === correctAnswer) {
    correctAnswers++;
    isCorrect = true;
    resultText.textContent = "Правильно!";
    resultText.style.color = "green";
    correctSound.play();
    questionText.classList.add("correct-animation");
    showMascotMessage(getRandomMessage(mascotMessages.correct));

    // Створюємо маленький ефект конфетті для кожної правильної відповіді
    if (comboCount >= 2) {
      createConfetti(5);
    }
  }
  // Якщо відповідь неправильна
  else {
    resultText.textContent = `Неправильно. Правильна відповідь: ${correctAnswer}`;
    resultText.style.color = "red";
    wrongSound.play();
    questionText.classList.add("wrong-animation");
    showMascotMessage(getRandomMessage(mascotMessages.wrong));
  }

  // Оновлюємо комбо лічильник
  updateComboCounter(isCorrect);

  // Оновлюємо зірочки
  updateStars();

  answersLog.push({
    num1: num1,
    num2: num2,
    userAnswer: chosenAnswer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect,
    timeLeft: timeLeft, // Додаємо час, що залишився
  });

  currentQuestion++;
  if (currentQuestion < totalQuestions) {
    setTimeout(generateQuestion, 1500);
  } else {
    endTest();
  }
}

// Запуск тесту
function startTest() {
  introScreen.style.display = "none";
  summaryScreen.style.display = "none";
  statsScreen.style.display = "none";
  questionScreen.style.display = "block";

  currentQuestion = 0;
  correctAnswers = 0;
  answersLog = [];
  comboCount = 0;
  maxCombo = 0;

  // Завантажуємо попередньо збережені досягнення
  loadAchievements();

  // Ініціалізуємо прогрес-бар
  progressBar.style.width = "0%";

  // Ініціалізуємо зірочки
  starsContainer.querySelectorAll(".star").forEach((star) => {
    star.classList.remove("earned");
  });

  // Скидаємо комбо лічильник
  comboValue.textContent = "0";
  comboCounter.classList.remove("active");

  generateQuestion();
}

// Завершення тесту
function endTest() {
  questionScreen.style.display = "none";

  // Показуємо екран святкування перед підсумковим екраном
  showCelebration();

  // Відображаємо маскот повідомлення
  if (correctAnswers === totalQuestions) {
    showMascotMessage(getRandomMessage(mascotMessages.highScore));
  } else if (correctAnswers >= totalQuestions * 0.7) {
    showMascotMessage("Гарний результат! Так тримати!");
  } else {
    showMascotMessage("Практика веде до досконалості! Спробуй ще!");
  }

  let previousResults =
    JSON.parse(localStorage.getItem("multiplicationResults")) || [];
  previousResults.push({
    date: new Date().toLocaleString(),
    score: correctAnswers,
    total: totalQuestions,
    maxCombo: maxCombo,
    difficulty: difficultyLevel,
    details: answersLog,
  });
  localStorage.setItem(
    "multiplicationResults",
    JSON.stringify(previousResults)
  );
}

// Показ підсумкового екрану
function showSummaryScreen() {
  celebrationScreen.classList.remove("show");
  summaryScreen.style.display = "block";

  finalScoreText.textContent = `Ваш результат: ${correctAnswers} / ${totalQuestions}`;
  finalScoreText.innerHTML += `<br>Максимальне комбо: ${maxCombo}`;
  finalScoreText.innerHTML += `<br>Рівень складності: ${getDifficultyName(
    difficultyLevel
  )}`;

  renderAnswersList(answersLog, answersList);
}

// Візуалізація списку відповідей
function renderAnswersList(log, container) {
  container.innerHTML = "";
  log.forEach((item) => {
    const wrapDiv = document.createElement("div");
    let line = "";
    if (item.isCorrect) {
      line = `<strong>${item.num1} × ${item.num2}</strong> = <strong style="color:black;">${item.userAnswer}</strong>`;
    } else {
      line = `<strong>${item.num1} × ${item.num2}</strong> = <del style="color:red;">${item.userAnswer}</del> <strong style="color:green;">${item.correctAnswer}</strong>`;
    }
    wrapDiv.innerHTML = line;
    container.appendChild(wrapDiv);
  });
}

// Показ статистики
function showStats() {
  introScreen.style.display = "none";
  summaryScreen.style.display = "none";
  questionScreen.style.display = "none";
  statsScreen.style.display = "block";

  const previousResults =
    JSON.parse(localStorage.getItem("multiplicationResults")) || [];
  if (previousResults.length === 0) {
    statsTable.innerHTML = "<tr><td>Статистика відсутня</td></tr>";
    return;
  }

  let tableHtml = `
        <tr>
            <th>#</th>
            <th>Дата</th>
            <th>Результат</th>
            <th>Складність</th>
            <th>Макс. комбо</th>
        </tr>
    `;

  previousResults.forEach((item, index) => {
    const difficulty = item.difficulty
      ? getDifficultyName(item.difficulty)
      : "Легкий";
    const maxCombo = item.maxCombo || 0;

    tableHtml += `
            <tr class="stats-main-row" data-idx="${index}">
                <td>${index + 1}</td>
                <td>${item.date}</td>
                <td>${item.score} / ${item.total}</td>
                <td>${difficulty}</td>
                <td>${maxCombo}</td>
            </tr>
            <tr class="stats-details-row" data-idx="${index}">
                <td colspan="5">
                    <div class="answers-list" id="answers-list-${index}"></div>
                </td>
            </tr>
        `;
  });

  statsTable.innerHTML = tableHtml;

  const mainRows = document.querySelectorAll(".stats-main-row");
  mainRows.forEach((row) => {
    row.addEventListener("click", () => {
      const idx = row.getAttribute("data-idx");
      const detailsRow = document.querySelector(
        `.stats-details-row[data-idx="${idx}"]`
      );
      if (detailsRow.style.display === "") {
        detailsRow.style.display = "none";
      } else if (detailsRow.style.display === "none") {
        detailsRow.style.display = "table-row";
        const detailContainer = document.getElementById(`answers-list-${idx}`);
        detailContainer.innerHTML = "";
        const detailsLog = previousResults[idx].details || [];
        renderAnswersList(detailsLog, detailContainer);
      } else {
        detailsRow.style.display = "none";
      }
    });
  });
}
