const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const resultContainer = document.getElementById('result');

function buildQuiz() {
  const output = questions.map((q, i) => {
    const answers = q.options.map(
      (opt, j) =>
        `<label>
          <input type="radio" name="question${i}" value="${j}">
          ${opt}
        </label>`
    ).join('');
    return `<div class="question" data-index="${i}">
              <p>${q.text}</p>
              <div class="answers">${answers}</div>
              <div class="explanation" style="display:none;"></div>
            </div>`;
  });
  quizContainer.innerHTML = output.join('');
}

function showResults() {
  const answerContainers = quizContainer.querySelectorAll('.answers');
  let correctCount = 0;

  questions.forEach((q, i) => {
    const container = answerContainers[i];
    const selected = container.querySelector('input:checked');
    const labels = container.querySelectorAll('label');
    const explanationBox = container.parentElement.querySelector('.explanation');

    // очистка прошлой подсветки
    labels.forEach(l => l.classList.remove('correct', 'wrong', 'selected'));
    explanationBox.style.display = 'none';
    explanationBox.innerHTML = "";

    if (!selected) return; // пропускаем если не выбрано

    const selectedValue = parseInt(selected.value);
    const correctIndex = q.correct;

    // подсветка правильного ответа
    labels[correctIndex].classList.add('correct');

    if (selectedValue !== correctIndex) {
      selected.parentElement.classList.add('wrong');
      explanationBox.innerHTML = `💡 ${q.explanation || "Проверьте материал — правильный ответ отличается."}`;
      explanationBox.style.display = 'block';
    } else {
      correctCount++;
    }
  });

  resultContainer.innerHTML = `✅ Правильных ответов: ${correctCount} из ${questions.length}`;
}

function handleSelection(e) {
  if (e.target.tagName !== 'INPUT') return;
  const group = e.target.name;
  const current = e.target;

  // Если уже был выбран и кликнули снова — снимаем выбор
  if (current.dataset.selected === "true") {
    current.checked = false;
    current.dataset.selected = "false";
  } else {
    // сброс для остальных
    const radios = document.querySelectorAll(`input[name="${group}"]`);
    radios.forEach(r => (r.dataset.selected = "false"));
    current.dataset.selected = "true";
  }

  // визуальная подсветка выбранного
  const labels = document.querySelectorAll(`input[name="${group}"] + *`);
  labels.forEach(l => l.parentElement.classList.remove('selected'));
  if (current.checked) current.parentElement.classList.add('selected');
}

quizContainer.addEventListener('click', handleSelection);
submi
