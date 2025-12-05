/* script.js */
const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const resultContainer = document.getElementById('result');

/* === ОБРАТНЫЙ ТАЙМЕР === */
class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate).getTime();
    this.timerInterval = null;
    this.timerEl = document.getElementById('timer');
    this.start();
  }

  start() {
    const update = () => {
      const now = new Date().getTime();
      const distance = this.targetDate - now;

      if (distance <= 0) {
        this.showStarted();
        clearInterval(this.timerInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.updateDisplay(days, hours, minutes, seconds);
    };

    update();
    this.timerInterval = setInterval(update, 1000);
  }

  updateDisplay(days, hours, minutes, seconds) {
    document.getElementById('days').textContent = this.format(days);
    document.getElementById('hours').textContent = this.format(hours);
    document.getElementById('minutes').textContent = this.format(minutes);
    document.getElementById('seconds').textContent = this.format(seconds);
  }

  format(num) {
    return num < 10 ? '0' + num : num;
  }

  showStarted() {
    this.timerEl.innerHTML = `<div class="timer-expired">Тест начался! Удачи!</div>`;
  }
}

/* === Запуск таймера === */
document.addEventListener('DOMContentLoaded', () => {
  new CountdownTimer('2025-12-06T14:00:00'); 
});

/* === ТЕСТ === */
function buildQuiz() {
  const output = questions.map((q, i) => {
    const answers = q.options
      .map(
        (opt, j) =>
          `<label data-q="${i}" data-index="${j}">
            <span class="option-text">${opt}</span>
          </label>`
      )
      .join('');

    return `
      <div class="question" data-index="${i}">
        <p>${q.text}</p>
        <div class="answers">${answers}</div>
        <div class="explanation" style="display:none;"></div>
      </div>`;
  });

  quizContainer.innerHTML = output.join('');
}

/* Выбор варианта (МНОЖЕСТВЕННЫЙ ВЫБОР) */
quizContainer.addEventListener('click', (e) => {
  const label = e.target.closest('label');
  if (!label) return;

  // Просто переключаем класс 'selected' для множественного выбора.
  // Мы больше не удаляем класс у соседей.
  label.classList.toggle('selected');
});

/* Проверка ответов */
submitButton.addEventListener('click', () => {
  const questionBlocks = quizContainer.querySelectorAll('.question');
  let correctCount = 0;

  questionBlocks.forEach((block, i) => {
    // Находим все выбранные пользователем плашки
    const selectedLabels = block.querySelectorAll('label.selected');
    const allLabels = block.querySelectorAll('label');
    const explanationBox = block.querySelector('.explanation');

    // Сбрасываем старую подсветку
    allLabels.forEach((l) => l.classList.remove('correct', 'wrong'));
    explanationBox.style.display = 'none';
    explanationBox.innerHTML = '';

    // Получаем индексы, которые выбрал пользователь
    const userSelectedIndices = Array.from(selectedLabels).map(l => parseInt(l.dataset.index));
    // Получаем правильные индексы из questions.js
    const correctIndices = questions[i].correct; // Теперь это массив, например [0, 2]

    // 1. Подсвечиваем ВСЕ правильные ответы зеленым (даже если пользователь их не выбрал, чтобы он знал правду)
    correctIndices.forEach(index => {
        allLabels[index].classList.add('correct');
    });

    // 2. Логика проверки
    // Правильно, если: 
    // а) количество выбранных совпадает с количеством правильных
    // б) все выбранные индексы присутствуют в массиве правильных
    const isCorrect = 
        userSelectedIndices.length === correctIndices.length &&
        userSelectedIndices.every(val => correctIndices.includes(val));

    if (isCorrect) {
      correctCount++;
    } else {
      // Если ответ неверный:
      // Подсвечиваем красным те, что пользователь выбрал, но которых НЕТ в правильных
      userSelectedIndices.forEach(index => {
          if (!correctIndices.includes(index)) {
              allLabels[index].classList.add('wrong');
          }
      });
      
      // Показываем объяснение
      explanationBox.innerHTML = `💡 ${questions[i].explanation || "Ответ неверен или неполон."}`;
      explanationBox.style.display = 'block';
    }
  });

  resultContainer.innerHTML = `✅ Правильных ответов: ${correctCount} из ${questions.length}`;
  // Прокручиваем к результату
  resultContainer.scrollIntoView({ behavior: 'smooth' });
});

/* Инициализация теста */
buildQuiz();