function getId(id) {
  return document.getElementById(id);
}

let answered = false;
let correctAnswerCounter = 0;

getId("startQuizBtn").addEventListener("click", () => {
  getId("startQuiz").classList.add("hidden");
  getId("quizRules").classList.remove("hidden");
});

getId("previous").addEventListener("click", () => {
  getId("quizRules").classList.add("hidden");
  getId("startQuiz").classList.remove("hidden");
});

getId("toQuiz").addEventListener("click", () => {
  getId("quizRules").classList.add("hidden");
  getId("quiz").classList.remove("hidden");

  startAnswerChecker(0);
});

function showQuestion(index) {
  const answerBtn = document.querySelectorAll("#answerWrapper > button");
  getId("question").textContent = questionList[index].question;

  for (let i = 0; i < answerBtn.length; i++) {
    let option = answerBtn[i].dataset.option;
    answerBtn[i].innerHTML = `
        <span class="flex gap-1">${option}. <span class="text-left" id="answer${option}">${questionList[index].options[i]}</span></span>
    `;
  }

  answerBtn.forEach((ele) => {
    ele.removeAttribute("class");
    ele.setAttribute(
      "class",
      "border-[1.5px] border-[#81B1B3] bg-[#e6eff0] text-[#81B1B3] hover:bg-[#749fa1] hover:border-[#749fa1] hover:text-[#c0d8d9] active:bg-[#678e8f] active:border-[#678e8f] active:text-[#cde0e1] cursor-pointer duration-300 rounded-md px-2 py-1 flex justify-between items-center"
    );
  });
}

function setCorrectAnswer(index) {
  const correctAnswer = document.querySelector(
    `#answerWrapper button[data-option="${questionList[index].answer}"]`
  );
  const correctAnswerValue = correctAnswer.innerHTML;

  correctAnswer.removeAttribute("class");
  correctAnswer.setAttribute(
    "class",
    "border-[1.5px] border-[#a4b465] bg-[#edf0e0] text-[#a4b465] hover:bg-[#94a25b] hover:border-[#94a25b] hover:text-[#d2dab2] active:bg-[#839051] active:border-[#839051] active:text-[#dbe1c1] cursor-pointer duration-300 rounded-md px-2 py-1 flex justify-between items-center"
  );
  correctAnswer.innerHTML =
    correctAnswerValue + "<i class='ph ph-check-circle text-xl'></i>";

  getId("nextQuestionBtn").classList.remove("hidden");

  answered = true;
}

function setWrongAnswer(id, index) {
  const wrongAnswer = document.querySelector(
    `#answerWrapper button[data-option="${getId(id).dataset.option}"]`
  );
  const wrongAnswerValue = wrongAnswer.innerHTML;

  wrongAnswer.removeAttribute("class");
  wrongAnswer.setAttribute(
    "class",
    "border-[1.5px] border-[#bf3131] bg-[#f2d6d6] text-[#bf3131] hover:bg-[#ac2c2c] hover:border-[#ac2c2c] hover:text-[#df9898] active:bg-[#992727] active:border-[#992727] active:text-[#e5adad] cursor-pointer duration-300 rounded-md px-2 py-1 flex justify-between items-center"
  );
  wrongAnswer.innerHTML =
    wrongAnswerValue + "<i class='ph ph-x-circle text-xl'></i>";

  setCorrectAnswer(index);
}

function answerValidation(index) {
  const answerBtn = document.querySelectorAll("#answerWrapper > button");

  // Hapus event listener lama dengan cloning
  answerBtn.forEach((button) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });

  // Tambah event listener baru
  document.querySelectorAll("#answerWrapper > button").forEach((ele) => {
    ele.addEventListener("click", () => {
      if (!answered) {
        if (ele.dataset.option === questionList[index].answer) {
          setCorrectAnswer(index);
          correctAnswerCounter++;
        } else {
          setWrongAnswer(ele.id, index);
        }
      }
    });
  });
}

function startTimer(index) {
  const timerBar = getId("timerBar");
  let timerCounter = 0;
  let timerBarCounter = 0;

  getId("quizCountdown").textContent = 15 - timerCounter;
  timerBar.style.width = `${timerBarCounter / 15}%`;

  const setTimer = setInterval(() => {
    timerCounter++;
    getId("quizCountdown").textContent = 15 - timerCounter;
    // timerBar.style.width = `${(timerBarCounter /15}%`;

    if (timerCounter >= 15) {
      clearInterval(setTimer);
      clearInterval(setTimerBar);
      setCorrectAnswer(index);
    }
  }, 1000);

  const setTimerBar = setInterval(() => {
    timerBarCounter++;
    timerBar.style.width = `${timerBarCounter / 15}%`;

    if (timerBarCounter >= 15000) {
      clearInterval(setTimerBar);
    }
  }, 10);

  const answerBtn = document.querySelectorAll("#answerWrapper > button");
  answerBtn.forEach((ele) => {
    ele.addEventListener("click", () => {
      clearInterval(setTimer);
      clearInterval(setTimerBar);
    });
  });
}

function startAnswerChecker(index) {
  answered = false;
  showQuestion(index);
  answerValidation(index);
  startTimer(index);
}

let answerIndex = 0;
getId("questionNumber").textContent = answerIndex + 1;
getId("progress").textContent = answerIndex + 1;

getId("nextQuestionBtn").addEventListener("click", () => {
  if (answerIndex === questionList.length - 1) {
    answerIndex = 0;

    getId("correctAnswer").textContent = correctAnswerCounter;
    correctAnswerCounter = 0;

    getId("questionNumber").textContent = answerIndex + 1;
    getId("progress").textContent = answerIndex + 1;

    getId("quizResult").classList.remove("hidden");
    getId("quiz").classList.add("hidden");

    getId("replayQuiz").addEventListener(
      "click",
      () => {
        getId("quizResult").classList.add("hidden");
        getId("quiz").classList.remove("hidden");

        startAnswerChecker(0);
      },
      { once: true }
    );

    getId("exitQuiz").addEventListener(
      "click",
      () => {
        getId("quizResult").classList.add("hidden");
        getId("startQuiz").classList.remove("hidden");
      },
      { once: true }
    );
  } else {
    answerIndex++;
    getId("questionNumber").textContent = answerIndex + 1;
    getId("progress").textContent = answerIndex + 1;
    getId("nextQuestionBtn").classList.add("hidden");

    startAnswerChecker(answerIndex);
  }
});
