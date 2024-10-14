const totalQuestions = 20;
const questionsPerPage = 10;
const totalPages = Math.ceil(totalQuestions / questionsPerPage);
let currentPage = 1;

// User's Answers
let userAnswers = {};

// Correct Answers
const answers = {
  q1: 'c',
  q2: 'b',
  q3: 'a',
  q4: 'd',
  q5: 'b',
  q6: 'b',
  q7: 'c',
  q8: 'b',
  q9: 'c',
  q10: 'b',
  q11: 'b',
  q12: 'b',
  q13: 'c',
  q14: 'c',
  q15: 'a',
  q16: 'c',
  q17: 'b',
  q18: 'c',
  q19: 'b',
  q20: 'c',
};

// Initialize the questionnaire
function initQuestionnaire() {
  // Show the first page
  showPage(currentPage);

  // Update progress bar
  updateProgressBar();

  // Add event listeners to radio buttons
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', function() {
      const questionName = this.name;
      userAnswers[questionName] = this.value;

      // Highlight the next question and scroll to it
      highlightNextQuestion(this);

      // Update progress bar
      updateProgressBar();
    });
  });

  // Add event listeners to navigation buttons
  document.getElementById('next-button-1').addEventListener('click', function() {
    currentPage = 2;
    showPage(currentPage);
  });

  document.getElementById('prev-button-2').addEventListener('click', function() {
    currentPage = 1;
    showPage(currentPage);
  });

  // Add submit event listener to the last page form
  document.getElementById('questionnaire-page-2').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateScore();
  });

  // Highlight the first question
  highlightFirstQuestion();
}

// Show the specified page
function showPage(pageNumber) {
  // Hide all pages
  const pages = document.querySelectorAll('.questionnaire-page');
  pages.forEach((page) => {
    page.classList.remove('active');
  });

  // Show the current page
  document.getElementById(`questionnaire-page-${pageNumber}`).classList.add('active');

  // Update progress bar for the current page
  updateProgressBar();

  // Highlight the first unanswered question on the new page
  highlightFirstQuestion();
}

// Update the progress bar
function updateProgressBar() {
  let answeredCount = 0;

  for (let i = 1; i <= totalQuestions; i++) {
    const questionName = `q${i}`;
    if (userAnswers[questionName]) {
      answeredCount++;
    }
  }

  const progressBar = document.getElementById('progress-bar');
  let progressPercent = 0;

  if (answeredCount >= 10 && answeredCount < 20) {
    progressPercent = 50;
  } else if (answeredCount === 20) {
    progressPercent = 100;
  }

  progressBar.style.width = `${progressPercent}%`;
  progressBar.setAttribute('data-percentage', progressPercent);
}

// Highlight the next question and scroll to it
function highlightNextQuestion(currentInput) {
  const currentQuestionDiv = currentInput.closest('.question');
  const allQuestions = document.querySelectorAll('.question');
  allQuestions.forEach((question) => {
    question.classList.remove('active');
  });

  // Dim the current question
  currentQuestionDiv.classList.remove('active');
  currentQuestionDiv.style.opacity = '0.5';

  // Find the next question
  let nextQuestionDiv = getNextQuestionDiv(currentQuestionDiv);

  if (nextQuestionDiv) {
    // Highlight the next question
    nextQuestionDiv.classList.add('active');
    nextQuestionDiv.style.opacity = '1';

    // Scroll to the next question
    nextQuestionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    // If no more questions on this page, check if there's a next page
    if (currentPage < totalPages) {
      // Move to the next page
      currentPage++;
      showPage(currentPage);

      // Scroll to the first question on the next page
      setTimeout(() => {
        const firstQuestionOnNextPage = document.querySelector(`#questionnaire-page-${currentPage} .question`);
        if (firstQuestionOnNextPage) {
          firstQuestionOnNextPage.classList.add('active');
          firstQuestionOnNextPage.style.opacity = '1';
          firstQuestionOnNextPage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }
}

// Get the next question div
function getNextQuestionDiv(currentQuestionDiv) {
  const allQuestions = Array.from(document.querySelectorAll('.question'));
  const currentIndex = allQuestions.indexOf(currentQuestionDiv);
  return allQuestions[currentIndex + 1];
}

// Highlight the first unanswered question on the current page
function highlightFirstQuestion() {
  const currentForm = document.getElementById(`questionnaire-page-${currentPage}`);
  const questions = currentForm.querySelectorAll('.question');

  // Remove existing highlights
  questions.forEach((question) => {
    question.classList.remove('active');
    question.style.opacity = '0.5';
  });

  // Find the first unanswered question
  for (let question of questions) {
    const input = question.querySelector('input[type="radio"]:checked');
    if (!input) {
      question.classList.add('active');
      question.style.opacity = '1';
      break;
    }
  }
}

// Calculate the score and display the result
function calculateScore() {
  let score = 0;

  for (let question in answers) {
    if (userAnswers[question] === answers[question]) {
      score++;
    }
  }

  document.getElementById('result').innerText = `You scored ${score} out of ${totalQuestions}.`;

  // Hide the questionnaire and only show the result
  document.getElementById('questionnaire-container').style.display = 'none';
}

// Initialize the questionnaire on page load
window.onload = initQuestionnaire;
