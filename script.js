const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const resultContainer = document.getElementById('result');

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
