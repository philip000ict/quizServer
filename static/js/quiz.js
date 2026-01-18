let quizData = {};
let quizList = [];
let currentIndex = 0;
const quizDataBlock = {}; // category object → topic arrays → question objects
let topicIndex = 0;

async function loadQuizData() {
  const res = await fetch("/api/quiz_data");
  quizData = await res.json();
  populateDropdowns();
}

function populateDropdowns() {
  const subjectSelect = document.getElementById("subjectSelect");
  for (let subject in quizData) {
    const opt = document.createElement("option");
    opt.value = subject;
    opt.text = subject;
    subjectSelect.appendChild(opt);
  }
}

function populateCategories() {
  const subject = document.getElementById("subjectSelect").value;
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = "";
  for (let cat in quizData[subject]) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.text = cat;
    categorySelect.appendChild(opt);
  }
}

function populateTopics() {
  const subject = document.getElementById("subjectSelect").value;
  const category = document.getElementById("categorySelect").value;
  const topicSelect = document.getElementById("topicSelect");
  topicSelect.innerHTML = "";
  for (let topic in quizData[subject][category]) {
    const opt = document.createElement("option");
    opt.value = topic;
    opt.text = topic;
    topicSelect.appendChild(opt);
  }
}

function startQuiz() {
  const s = document.getElementById("subjectSelect").value;
  const c = document.getElementById("categorySelect").value;
  const t = document.getElementById("topicSelect").value;
  quizList = quizData[s][c][t];
  currentIndex = 0;
  showQuestion();
}

function showQuestion() {
  const q = quizList[currentIndex];
  document.getElementById("questionText").innerText = q.question;
  const options = shuffle([q.correct_choice, ...q.choices.filter(c => c !== q.correct_choice)]);
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, q.correct_choice, q.explanation);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct, explanation) {
  const result = document.getElementById("result");
  result.innerHTML = selected === correct
    ? `<p>✅ Correct!</p><p>${explanation}</p>`
    : `<p>❌ Incorrect. Correct answer: ${correct}</p><p>${explanation}</p>`;
  document.getElementById("nextBtn").style.display = "block";
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizList.length) {
    document.getElementById("result").innerHTML = "";
    document.getElementById("nextBtn").style.display = "none";
    showQuestion();
  } else {
    document.getElementById("quizArea").innerHTML = "<h2>🎉 Quiz complete!</h2>";
  }
}
async function sha256(str) {
  const utf8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", loadQuizData);

function showQuiz(category) {
  fetch(`/api/quiz_by_category/${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("panelBlock");
      container.innerHTML = "";

      console.log("Object.entries(data) = ", Object.entries(data))

      Object.entries(data).forEach(([topicName, questions]) => {
        const topicId = `topic#${++topicIndex}`;
        quizData[topicId] = {
          name: topicName,
          questions: questions.map((q, i) => ({
            id: `question#${i + 1}`,
            text: q.question,
            choices: q.choices,
            answer_hash: q.answer_hash,
            explanation: q.explanation
          }))
        };
      });
      
      for (const [topic, questions] of Object.entries(data)) {

        let i = 1;
        const panel = document.createElement("div");
        panel.className = "quizBlock";
        const title = document.createElement("div");
        title.id = 'quiz#'.i;
        title.className = "tile title";
        title.style = "height:75px;"
        title.innerHTML = `<b>${topic}</b>`;
        panel.appendChild(title);

        
        questions.forEach(q => {
          const qBox = document.createElement("div");
          qBox.className = "tile";
          qBox.innerHTML = `<h2><b>Q${i}</b></h2>`;
          // q.choices.forEach(choice => {
          //   const btn = document.createElement("button");
          //   // btn.className = "tile";
          //   btn.innerText = choice;
          //   btn.onclick = () => { checkAnswer
              // const hash = sha256(choice); // assumes sha256() is available
              // if (hash === q.answer_hash) {
              //   alert("✅ Correct!");
              // } else {
              //   alert("❌ Incorrect!");
              // }
            // };
            // qBox.appendChild(btn);
          // });
          panel.appendChild(qBox);
          i++;
        });
      container.appendChild(panel);
        
      }
    });
}
