import Question from "./Question.js";
import Quiz from "./Quiz.js"

const App = (() => {
    // cache the DOM
    const quizEl = document.querySelector(".jabquiz");
    const quizQuestionEl = document.querySelector(".jabquiz__question");
    const trackerEl = document.querySelector(".jabquiz__tracker");
    const taglineEl = document.querySelector(".jabquiz__tagline");
    const choicesEl = document.querySelector(".jabquiz__choices");
    const progressInnerEl = document.querySelector(".progress__inner");
    const nextButtonEl = document.querySelector(".next");
    const restartButtonEl = document.querySelector(".restart");

    const q1 = new Question(
        "What's the name of Blackbeard's ship?", ["Queen Anne's Revenge", "The Black Banana Boat", "Pleasure Island", "Down in Kokomo"],
        0
    );
    const q2 = new Question(
        "Why is your mother so disappointed?", ["You own too many fedoras", "You haven't left your room in months", "You smell like Cheetos and sadness", "You exist"],
        0, 1, 2, 3
    );
    const q3 = new Question(
        "What is black, blue, and red all over?", ["A United passenger", "That really bad bruise from your last field hockey game", "The cookie monster is dead", "1960s Batman and Robin"],
        3
    );
    const q4 = new Question(
        "What cries and is always broke?", ["College student", "You, because the ice cream machine is broken", "A leaky waterline", "Your good-for-nothing roommate who's always hitting you up for weed and food"],
        1
    );
    const q5 = new Question(
        "What was the last thing your dad said to you?", ["Going out for a pack of cigarettes", "Going to the store", "Going on a beer run", "Nothing, because he snuck out."],
        0, 1, 2, 3
    );

    const quiz = new Quiz([q1, q2, q3, q4, q5]);

    const listeners =_=>{
        nextButtonEl.addEventListener("click", function(){
            const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
            if(selectedRadioElem) {
                const key = Number(selectedRadioElem.getAttribute("data-order"))
                quiz.guess(key);
                renderAll();
            }
        })

        restartButtonEl.addEventListener("click", function(){
            //1. reset the quiz
            quiz.reset();
            setValue(taglineEl, `Trying again? Pff.`)
            // 2. renderAll
            renderAll();
            // 3. restore the next button
            nextButtonEl.style.opacity = 1;
        })
    }

    const setValue = (elem, value) => {
        elem.innerHTML = value;
    }

    const renderQuestion = _ => {
        const question = quiz.getCurrentQuestion().question;
        setValue(quizQuestionEl, question);
    }

    const renderChoicesElements = _ => {
        let markup = "";
        const currentChoices = quiz.getCurrentQuestion().choices;
        currentChoices.forEach((elem, index) => {
            markup += `
        <li class="jabquiz__choice">
          <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
          <label for="choice${index}" class="jabquiz__label">
            <i></i>
            <span>${elem}</span>
          </label>
        </li>
      `
        });

        setValue(choicesEl, markup);
    }

    const renderTracker = _ => {
        const index = quiz.currentIndex;
        setValue(trackerEl, `${index+1} of ${quiz.questions.length}`)
    }

    const getPercentage = (num1, num2) => {
        return Math.round((num1 / num2) * 100);
    }

    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function () {
            if (width > maxPercent) {
                clearInterval(loadingBar);
            } else {
                width++;
                progressInnerEl.style.width = width + "%";
            }
        }, 3)
    }

    const renderProgress = _ => {
        // 1. width
        const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
        // 2. launch(0, width)
        launch(0, currentWidth);
    }

    const renderEndScreen =_=>{
        setValue(quizQuestionEl, `High-five.`);
        setValue(taglineEl, `The end. Did you want a cookie?`);
        setValue(trackerEl, `Oh, look here's your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
        nextButtonEl.style.opacity = 0;
        renderProgress();
    }

    const renderAll = _ => {
        if (quiz.hasEnded()) {
            // renderEndScreen
            renderEndScreen();
        } else {
            // 1. render the question
            renderQuestion();
            // 2. Render the choices elements
            renderChoicesElements()
            // 3. Render Tracker
            renderTracker();
            // 4. Render Progress
            renderProgress();
        }
    }

    return {
        renderAll: renderAll,
        listeners: listeners
    }
})();

App.renderAll();
App.listeners();
