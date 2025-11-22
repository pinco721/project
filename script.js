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
// ❗ Укажи дату и время начала теста здесь:
document.addEventListener('DOMContentLoaded', () => {
  new CountdownTimer('2025-12-06T14:00:00'); // формат: YYYY-MM-DDTHH:MM:SS
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

/* Выбор варианта */
quizContainer.addEventListener('click', (e) => {
  const label = e.target.closest('label');
  if (!label) return;

  const qIndex = label.dataset.q;
  const allOptions = quizContainer.querySelectorAll(`label[data-q="${qIndex}"]`);

  if (label.classList.contains('selected')) {
    label.classList.remove('selected');
    return;
  }

  allOptions.forEach((opt) => opt.classList.remove('selected'));
  label.classList.add('selected');
});

/* Проверка ответов */
submitButton.addEventListener('click', () => {
  const questionBlocks = quizContainer.querySelectorAll('.question');
  let correctCount = 0;

  questionBlocks.forEach((block, i) => {
    const selected = block.querySelector('label.selected');
    const labels = block.querySelectorAll('label');
    const explanationBox = block.querySelector('.explanation');

    labels.forEach((l) => l.classList.remove('correct', 'wrong'));
    explanationBox.style.display = 'none';
    explanationBox.innerHTML = '';

    if (!selected) return;

    const chosenIndex = parseInt(selected.dataset.index);
    const correctIndex = questions[i].correct;

    labels[correctIndex].classList.add('correct');

    if (chosenIndex !== correctIndex) {
      selected.classList.add('wrong');
      explanationBox.innerHTML = `💡 ${questions[i].explanation || "Проверьте материал — правильный ответ отличается."}`;
      explanationBox.style.display = 'block';
    } else {
      correctCount++;
    }
  });

  resultContainer.innerHTML = `✅ Правильных ответов: ${correctCount} из ${questions.length}`;
});

/* Инициализация теста */
buildQuiz();
