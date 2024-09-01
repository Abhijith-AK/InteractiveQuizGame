// Get reference to our elements
let scoreData = document.getElementById("score");
let startBtn = document.getElementById("start-btn");
let startContainer = document.getElementById("start-container");
let questionContainer = document.getElementById("question-container");
let resultContainer = document.getElementById("results-container");
let question = document.getElementById("question-content");
let options = document.querySelectorAll("#options button");
let nextBtn = document.getElementById("next-button");
let playAgnBtn = document.getElementById("play-again");
let root = document.documentElement;

// declaration of variables required
let currentQuestionIndex = 0;
let score = 0;
let counter = 0;
let quizData = [];

// starting function activated on clicking start button
startBtn.addEventListener("click", async () => {
    currentQuestionIndex = 0;
    score = 0;
    quizData = await fetchQuestions();
    startContainer.classList.add("hide");
    questionContainer.classList.remove("hide");
    showQuestion();
});

// fetching questions via API
async function fetchQuestions() {
    let response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
    let data = await response.json();
    return data.results.map(question => formatQuestions(question));
}

// formating questions in JSON to usable object 
function formatQuestions(question) {
    const formattedQuestion = {
        question: question.question,
        answers: [
            ...question.incorrect_answers.map(answer => ({ text: answer, correct: false })),
            { text: question.correct_answer, correct: true }
        ].sort(() => Math.random() - 0.5) //shuffle answers
    };
    return formattedQuestion;
}

// showing progress as going through questions
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById("progress").style.width = `${progress}%`;
}

// showing questions and options
function showQuestion() {
    updateProgressBar();
    reset();
    const currentQuestion = quizData[currentQuestionIndex];
    question.innerHTML = currentQuestion.question;
    let i = 0;
    options.forEach(e => {
        let answer = currentQuestion.answers[i];
        e.innerHTML = answer.text;
        i++;
        e.onclick = () => { // Set the onclick only once
            options.forEach(f => {
                f.style.backgroundColor = "#000000e1";
            });
            e.style.backgroundColor = "orangered";
            nextBtn.classList.remove("hide");
            selectAnswer(answer);
        };
    });
}

// Remove previous background color for options and hide next button
function reset() {
    options.forEach(e => {
        e.style.backgroundColor = "#000000e1";
    });
    nextBtn.classList.add("hide");
}

// Keep track of the selected answer and move to the next question
let selectedAnswer = null;

function selectAnswer(answer) {
    selectedAnswer = answer;
}

// Move to the next question or show the result
nextBtn.addEventListener("click", () => {
    if (selectedAnswer && selectedAnswer.correct) {
        score++;
    }
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion();
        selectedAnswer = null; // Reset the selected answer for the next question
    } else {
        showResult();
    }
});

// showing result
function showResult() {
    questionContainer.classList.add("hide");
    resultContainer.classList.remove("hide");
    root.style.setProperty('--dash-offset', `${450 - (score / quizData.length * 450)}`);
    let message = "";

    if (score === quizData.length) {
        message = "Perfect Score!";
    } else if (score > quizData.length / 2) {
        message = "Great Job!";
    } else {
        message = "Better Luck Next Time!";
    }

    document.getElementById("result-message").textContent = message;

    setInterval(() => {
        if (counter === score) {
            clearInterval;
        } else {
            counter++;
            scoreData.innerHTML = `${score}/${quizData.length}`;
        }
    }, 300);
}

// play again
playAgnBtn.addEventListener("click", () => {
    resultContainer.classList.add("hide");
    startContainer.classList.remove("hide");
})