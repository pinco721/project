const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const resultContainer = document.getElementById('result');

// ⬇⬇⬇ ДОБАВЬТЕ ЭТОТ КОД ДЛЯ ТАЙМЕРА ⬇⬇⬇
class CountdownTimer {
    constructor() {
        this.targetDate = new Date('2024-12-06T13:45:00').getTime();
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.startTimer();
    }

    startTimer() {
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = this.targetDate - now;

            // Если время вышло
            if (distance < 0) {
                this.handleTimerExpired();
                return;
            }

            // Расчет дней, часов, минут и секунд
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Обновление отображения
            this.updateDisplay(days, hours, minutes, seconds);
        };

        // Запускаем сразу и затем каждую секунду
        updateTimer();
        this.timerInterval = setInterval(updateTimer, 1000);
    }

    updateDisplay(days, hours, minutes, seconds) {
        document.getElementById('days').textContent = this.formatTime(days);
        document.getElementById('hours').textContent = this.formatTime(hours);
        document.getElementById('minutes').textContent = this.formatTime(minutes);
        document.getElementById('seconds').textContent = this.formatTime(seconds);
    }

    formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    handleTimerExpired() {
        document.getElementById('timer').innerHTML = `
            <div class="timer-expired">
                Тест начался! Удачи!
            </div>
        `;
        clearInterval(this.timerInterval);
    }
}

// Запуск таймера когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});
// ⬆⬆⬆ КОНЕЦ КОДА ТАЙМЕРА ⬆⬆⬆

// Ваш существующий код для теста продолжается здесь...
// Например:
// class Quiz { ... }
// или другие функции вашего теста

/* Построение теста на странице */
function buildQuiz() {
  const output = questions.map((q, i) => {
    const answers = q.options.map(
      (opt, j) =>
        `<label data-q="${i}" data-index="${j}">
          <span class="option-text">${opt}</span>
        </label>`
    ).join('');

    return `
      <div class="question" data-index="${i}">
        <p>${q.text}</p>
        <div class="answers">${answers}</div>
        <div class="explanation" style="display:none;"></div>
      </div>`;
  });

  quizContainer.innerHTML = output.join('');
}

/* Обработка выбора варианта */
quizContainer.addEventListener('click', e => {
  const label = e.target.closest('label');
  if (!label) return;

  const qIndex = label.dataset.q;
  const allOptions = quizContainer.querySelectorAll(`label[data-q="${qIndex}"]`);

  // если тот же вариант выбран повторно — снять выбор
  if (label.classList.contains('selected')) {
    label.classList.remove('selected');
    label.dataset.selected = "false";
    return;
  }

  // сбрасываем выбор для всех, выбираем текущий
  allOptions.forEach(opt => opt.classList.remove('selected'));
  label.classList.add('selected');
  label.dataset.selected = "true";
});

/* Проверка и отображение результатов */
submitButton.addEventListener('click', () => {
  const questionBlocks = quizContainer.querySelectorAll('.question');
  let correctCount = 0;

  questionBlocks.forEach((block, i) => {
    const selected = block.querySelector('label.selected');
    const labels = block.querySelectorAll('label');
    const explanationBox = block.querySelector('.explanation');

    // очищаем прошлую подсветку
    labels.forEach(l => l.classList.remove('correct', 'wrong'));
    explanationBox.style.display = 'none';
    explanationBox.innerHTML = '';

    if (!selected) return; // пропуск, если не выбран ответ

    const chosenIndex = parseInt(selected.dataset.index);
    const correctIndex = questions[i].correct;

    // подсвечиваем правильный ответ
    labels[correctIndex].classList.add('correct');

    if (chosenIndex !== correctIndex) {
      // выбран неверный — подсветить и показать объяснение
      selected.classList.add('wrong');
      explanationBox.innerHTML = `💡 ${questions[i].explanation || "Проверьте материал — правильный ответ отличается."}`;
      explanationBox.style.display = 'block';
    } else {
      correctCount++;
    }
  });

  resultContainer.innerHTML = `✅ Правильных ответов: ${correctCount} из ${questions.length}`;
});



/* Инициализация */
buildQuiz();
