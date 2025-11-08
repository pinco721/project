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
    return `<div class="question">
              <p>${q.text}</p>
              <div class="answers">${answers}</div>
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
    labels.forEach(label => {
      label.classList.remove('correct', 'wrong', 'selected');
    });

    if (!selected) return;

    const selectedValue = parseInt(selected.value);
    const correctIndex = q.correct;

    // Подсветить правильный ответ
    labels[correctIndex].classList.add('correct');

    // Если ответ неверный — подсветить выбранный красным
    if (selectedValue !== correctIndex) {
      selected.parentElement.classList.add('wrong');
    } else {
      correctCount++;
    }
  });

  resultContainer.innerHTML = `✅ Правильных ответов: ${correctCount} из ${questions.length}`;
}

function handleSelection(e) {
  if (e.target.tagName !== 'INPUT') return;
  const group = e.target.name;
  const labels = document.querySelectorAll(`input[name=${group}] + *`);
  labels.forEach(l => l.parentElement.classList.remove('selected'));
  e.target.parentElement.classList.add('selected');
}

quizContainer.addEventListener('change', handleSelection);
buildQuiz();
submitButton.addEventListener('click', showResults);
