 const UI_MODE = {
  SUBJECT: "subject",
  CATEGORY: "category",
  QUIZ: "quiz"
};

let currentMode = UI_MODE.SUBJECT;
 
const appState = {
  subjects: {},        // full subject → categories map
  subject: null,
  category: null,
  topic: null,
  quiz: null,
  points: 0,
  score: 0
};

async function init() {
  const res = await fetch("/api/subjects");
  appState.subjects = await res.json();
  loadSubjectButtons();
}

function selectSubject(subject) {
  appState.subject = subject;
  appState.category = null;
  appState.topic = null;
  appState.quiz = null;

  renderCategoryPanel();

  currentMode = UI_MODE.CATEGORY;
}

// async function selectCategory(category) {
//   appState.category = category;

//   const res = await fetch(
//     `/api/single_quiz_by_category/${encodeURIComponent(category)}`
//   );
//   appState.quiz = await res.json();

//   renderQuizPanel();
//   setHeader();

//   currentMode = UI_MODE.QUIZ;
// }

async function loadSubjectButtons() {
    console.log("loadSubjectPanel() >>> data = ", appState.subjects);
    const buttonPanel = document.getElementById("buttonPanel");

    if (appState.subjects) {
        for (let subject in appState.subjects) {
        const subjectButton = document.createElement("div");
        subjectButton.id = subject;
        subjectButton.innerText = subject;
        subjectButton.className = "panelbtn";
        subjectButton.addEventListener('click', onchangeSubjectSelect);
        buttonPanel.appendChild(subjectButton);
        };
      }
    };

function onchangeSubjectSelect(event){ 
    console.log(`The selected event =  ${event.target.id}`);
    appState.subject = event.target.id;
    loadCategoryPanel();
    };

async function selectCategory(event) {
  appState.category = event.target.innerText;
    console.log("The selectCategory(category) = ", event.target.innerText);
  const res = await fetch(
    `/api/single_quiz_by_category/${encodeURIComponent(appState.category)}`
  );
  appState.quiz = await res.json();
  appState.topic = appState.quiz.topic;
  loadQuizModal();
  setHeader();

  currentMode = UI_MODE.QUIZ;
}

function loadCategoryPanel(){
    const categoryModal = document.getElementById("categoryModal");
    document.getElementById("quizHeader").innerHTML='<b>'+appState.subject+'</b>';

    if (appState.subjects[appState.subject]) {

        appState.subjects[appState.subject].forEach(category => {
            console.log("The category = ", category);
            const ctile = document.createElement("div");
            ctile.id = category;
            ctile.innerHTML = '<b>'+category+'</b>';
            ctile.className = "tile";
            ctile.addEventListener('click', selectCategory);
            categoryModal.appendChild(ctile);
            });
        }
    categoryModal.style = "display: block;";
    };

      function loadImage(){
        let selectedImage = appState.subject.replaceAll(" ", "") + ".webp";   
        console.log(STATIC_IMG_BASE + selectedImage);
        document.getElementById("subjectImage").innerHTML = `<img src="${STATIC_IMG_BASE}${selectedImage}" alt="${selectedSubject}">`;
      };

      function setHeader(){
        const quizHeader = document.getElementById("quizHeader");
        quizHeader.innerHTML = `${appState.subject} → ${appState.category} → ${appState.topic}`;
        quizHeader.style = "font: 1em sans-serif;";
      }

    function loadQuizModal(){
  // default display here
        console.log("loadQuizModal() data = ", appState.quiz);
        const quizModal = document.getElementById("quizModal");
        document.getElementById("questionModal").innerHTML = "";
        quizModal.innerHTML = "";
        quizModal.className = "quizBlock";
        const title = document.createElement("div");
        title.id = 'quiz#0';
        title.className = "tile title default-title";
        const selectedCategory = appState.category;
        const selectedTopic = appState.quiz.topic;
        title.innerHTML = `<b>${appState.category}</b><a>${appState.quiz.topic}</a>`;
        
        quizModal.appendChild(title);
        document.getElementById("categoryModal").style = "display: none;";
        quizModal.style = "display: block;"
        quizHeader.innerHTML = `${appState.subject} → ${appState.category} → ${appState.quiz.topic}`;
        quizHeader.style = "font: 2em sans-serif;";

        appState.quiz.questions.forEach((q, i) => {
            const box = document.createElement("div");
            box.className = "tile ";
            box.value = i
            box.id = 'q0'+(i + 1)
            box.innerHTML = `<a>Q${i + 1}</a>`
            box.addEventListener("click", getQuestionChoice)
            quizModal.appendChild(box);
        });
    };

async function sha256(str) {
  const utf8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

  function getQuestionChoice(val){
    const quizModal = document.getElementById("quizModal");
    const questionModal = document.getElementById("questionModal");
    const pointsBox = document.getElementById("pointsBox");
    pointsBox.innerText = 5;
    questionModal.style = "display: block;";
    console.log("val = ", val);
    console.log("val (target) id = ", val.target.id);
    qchoice = val.target.id
    console.log("appState.quiz.topic = ", appState.quiz.topic);
    console.log("appState.quiz.topic.questions = ", appState.quiz.questions);
    console.log("appState.quiz.topic.questions[val.target.value].question = ", appState.quiz.questions[val.target.value].question);
    const qtitle = document.createElement("div");
    qtitle.className = "tile title default-title";
    qtitle.id = 'q0';
    qtitle.innerHTML = `<a>${appState.quiz.questions[val.target.value].question}</a>`
    questionModal.innerHTML="";
    questionModal.appendChild(qtitle);

    appState.quiz.questions[val.target.value].choices.forEach(choice => {
          console.log("appState.quiz.questions[val.target.value].answer_hash = ", appState.quiz.questions[val.target.value].answer_hash);
          const atile = document.createElement("div");
          atile.innerText = choice;
          atile.className = "tile a-tile";
          atile.onclick = async () => {
              const userHash = await sha256(choice);
              if (userHash === appState.quiz.questions[val.target.value].answer_hash ){
                  atile.style = "background-color: green;"
                  document.getElementById(val.target.id).style = "background-color: green;"
                  let score = document.getElementById("scoreBox").innerText
                  let points = pointsBox.innerText;
                  score = Number(score);
                  points = Number(points);
                  score += points
                  points = 0;
                  document.getElementById("scoreBox").innerText = score
                  document.getElementById("pointsBox").innerText = points
              }else {       
                  atile.style = "background-color: salmon;"
                  document.getElementById(val.target.id).style = "background-color: salmon;"
                  let score = document.getElementById("scoreBox").innerText
                  let points = pointsBox.innerText;
                  score = Number(score);
                  points = Number(points);
                  points -= 2;
                  score += points
                  document.getElementById("pointsBox").innerText = points
              }

              alert(userHash === appState.quiz.questions[val.target.value].answer_hash ? "✅ Correct" : "❌ Incorrect");
          };
          questionModal.appendChild(atile);
        });
          const etile = document.createElement("div");
          etile.id = "explainTile";
          etile.className = "tile etile";
          etile.innerText = "Hint";
          etile.onclick = () => {
            getHint()
          }
          questionModal.appendChild(etile);
      //  });
  };

async function getHint() {
      const res = await fetch("/api/getHint");
      const data = await res.json();
      console.log("Hint = ", data.hint)
    };

document.addEventListener("DOMContentLoaded", () => {
      init();
  });