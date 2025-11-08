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
    const selector = `input[name=question${i}]:checked`;
    const userAnswer = (answerContainers[i].querySelector(selector) || {}).value;

    if (parseInt(userAnswer) === q.correct) {
      correctCount++;
      answerContainers[i].style.color = 'green';
    } else {
      answerContainers[i].style.color = 'red';
    }
  });

  resultContainer.innerHTML = `Вы ответили правильно на ${correctCount} из ${questions.length}`;
}

buildQuiz();
submitButton.addEventListener('click', showResults);
