//  const UI_MODE = {
//   SUBJECT: "subject",
//   CATEGORY: "category",
//   QUIZ: "quiz"
// };

let UI_MODE = "subject";
 
const appState = {
  subjects: {},        // full subject → categories map
  subject: null,
  category: null,
  topic: null,
  quiz: null,
  select_question: null,
  select_question_id: null,
  select_hint: null,
  points: 0,
  score: 0
};

// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
//   }

async function init() {
  const res = await fetch("/api/subjects");
  appState.subjects = await res.json();
  // createDivs();
  transitionTo("subject");
  loadSubjectButtons();
  loadSubjectPanel();
}

function selectSubject(subject) {
  appState.subject = subject;
  appState.category = null;
  appState.topic = null;
  appState.quiz = null;

  renderCategoryPanel();

  currentMode = UI_MODE.CATEGORY;
}
const panels = {
  subject: "subjectModal",
  category: "categoryModal",
  quiz: "quizModal",
  question: "questionModal",
  answer: "answerPanel",
  hint: "hintPanel",
  check: "checkPanel"
};
//Panel state switchers helper functions
function show(panel) {
  console.log("panel = ", panel);
  if (panel) document.getElementById(panel).style.display = "block";
}

function hide(panel) {
  console.log("panel = ", panel);
  if (panel) document.getElementById(panel).style.display = "none";
}

function transitionTo(nextMode) {
  if (UI_MODE === nextMode) return;
  UI_MODE === nextMode
  // Exit logic (cleanup per mode if needed)
  console.log("panels.subject = ", nextMode);
  switch (nextMode) {
    case "subject":
      show(panels.subject);
      hide(panels.category);
      hide(panels.question);
      hide(panels.quiz);
      hide(panels.answer);
      hide(panels.hint);
      hide(panels.check);
      break;

    case "category":
      hide(panels.subject);
      show(panels.category);
      hide(panels.question);
      hide(panels.quiz);
      hide(panels.answer);
      hide(panels.hint);
      hide(panels.check);
      break;
  }

  // Update state
  // uiState.mode = nextMode;

  // Entry logic
  // switch (nextMode) {
  //   case UI_MODE.SUBJECT:
  //     enterSubjectMode();
  //     break;

  //   case UI_MODE.CATEGORY:
  //     enterCategoryMode();
  //     break;

  //   case UI_MODE.QUIZ:
  //     enterQuizMode();
  //     break;
  // }
}
function loadSubjectPanel(){
  const subjectPanel = document.getElementById("subjectModal");
  const subjectBlurb = "<h1>QuizBrowser App</h1>\
  <p>An interactive quiz engine delivering curriculum-aligned questions, instant feedback, and dynamic scoring.\
  Designed for students and teachers, it runs smoothly across devices as part of the Hydra microservice family. </p>\
  <p> Instructions 1; Select an Ancient Civilisation from the Subject Buttons above.</p>\
  <p> Instructions 2; Select a Subject Category from the Categories that appear here.</p>"

  subjectPanel.innerHTML = subjectBlurb;
}

async function loadSubjectButtons() {
    // console.log("loadSubjectPanel() >>> data = ", appState.subjects);
    const subjectBanner = document.getElementById("subjectBanner");
    const buttonPanel = document.getElementById("buttonPanel");
    const leftNav = document.getElementById("leftNav");
    const rightNav = document.getElementById("rightNav");
    // leftNav.innerText = "L";
    // rightNav.innerText = "R";
    if (appState.subjects) {
        for (let subject in appState.subjects) {
          const subjectButton = document.createElement("div");
          const subjectImg = "subjectBtn/"+subject.replaceAll(" ", "") + "_btn.webp";
          subjectButton.id = subject;
          subjectButton.innerText = subject;
          subjectButton.className = "subjectbtn";
          subjectButton.innerHTML = `<img id = "${subject}" class = "btnImg" src="${STATIC_IMG_BASE}${subjectImg}" alt="${subject}">`;
          subjectButton.addEventListener('click', onchangeSubjectSelect);
          buttonPanel.appendChild(subjectButton);
        };
      }
      subjectBanner.appendChild(leftNav);
      subjectBanner.appendChild(buttonPanel);
      subjectBanner.appendChild(rightNav);

    };

function onchangeSubjectSelect(event){ 
    console.log(`The selected event =  ${event.target.id}`);
    appState.subject = event.target.id;
    transitionTo("category");
    loadCategoryPanel();
    setSubjectImage();
    // document.getElementById("questionModal").style.display = "none";
    // document.getElementById("quizModal").style.display = "none";
    // document.getElementById("panelBlock").style.display = "none";
    };

async function selectCategory(event) {
  appState.category = event.target.innerText;
  console.log("The selectCategory(category) = ", event.target.innerText);
  const res = await fetch(
    `/api/single_quiz_by_category/${encodeURIComponent(appState.subject)},${encodeURIComponent(appState.category)}`
  );
  appState.quiz = await res.json();
  console.log(`appState.quiz.topic; =  ${appState.quiz.topic}`);
  console.log(`appState.quiz.questions; =  ${appState.quiz.questions}`);
  appState.topic = appState.quiz.topic;
  setCategoryImage()
  loadQuestionModal();
  setHeader();
  currentMode = UI_MODE.QUIZ;
}

function loadCategoryPanel(){
    const categoryModal = document.getElementById("categoryModal");
    document.getElementById("quizHeader").innerHTML='<b>'+appState.subject+'</b>';
    categoryModal.innerHTML = "";
    if (appState.subjects[appState.subject]) {

        appState.subjects[appState.subject].forEach(category => {
            console.log("The category = ", category);
            const ctile = document.createElement("div");
            ctile.id = category;
            ctile.innerHTML = category;
            ctile.className = "tile";
            ctile.addEventListener('click', selectCategory);
            categoryModal.appendChild(ctile);
            });
        }
    // categoryModal.style = "display: block;";
    };
function setSubjectImage(){
    let subjectImage = appState.subject.replaceAll(" ", "") + ".webp";   
    console.log(STATIC_IMG_BASE + subjectImage);
    document.getElementById("subjectImage").innerHTML = `<img src="${STATIC_IMG_BASE}${subjectImage}" alt="${appState.subject}">`;
  };
function setCategoryImage(){
    setSubjectImage()
    // let subjectImage = appState.subject.replaceAll(" ", "") + "/"; 
    // let categoryImage = appState.category.replaceAll(" ", "") + ".webp";   
    // console.log(STATIC_IMG_BASE + categoryImage);
    // document.getElementById("subjectImage").innerHTML = `<img src="${STATIC_IMG_BASE}${subjectImage}${categoryImage}" alt="${appState.category}">`;
    // document.getElementById("subjectImage").innerHTML = `<img src="${STATIC_IMG_BASE}${subjectImage}" alt="${appState.category}">`;
  };

      function setHeader(){
        const quizHeader = document.getElementById("quizHeader");
        quizHeader.innerHTML = `${appState.subject} → ${appState.category} → ${appState.topic}`;
        quizHeader.style = "font: 1em sans-serif;";
      }

    function loadQuestionModal(){
  // default display here
        console.log("loadquestionModal() data = ", appState.quiz);
        const questionModal = document.getElementById("questionModal");
        const categoryModal = document.getElementById("categoryModal");
        
        document.getElementById("questionModal").innerHTML = "";
        questionModal.innerHTML = "";
        questionModal.className = "quizBlock";
        const title = document.createElement("div");
        title.id = 'quiz#0';
        title.className = "tile title";
        const selectedCategory = appState.category;
        const selectedTopic = appState.quiz.topic;
        title.innerHTML = `<b>${appState.category}</b><a>${appState.quiz.topic}</a>`;
        
        questionModal.appendChild(title);
        document.getElementById("categoryModal").style = "display: none;";
        questionModal.style = "display: block;"
        quizHeader.innerHTML = `${appState.subject} → ${appState.category} → ${appState.quiz.topic}`;
        quizHeader.style = "font: 2em sans-serif;";

        appState.quiz.questions.forEach((q, i) => {
            const box = document.createElement("div");
            box.className = "tile ";
            box.value = i;
            box.id = 'q0'+(i + 1);
            box.innerHTML = `<a>Q${i + 1}</a>`;
            box.addEventListener("click", getQuestionChoice);
            questionModal.appendChild(box);
        });
        const okbtn = document.createElement("button");
          okbtn.id = "okQuestionbtn";
          okbtn.className = "panelbtn";
          okbtn.innerText = "OK";
          okbtn.onclick = () => {
            questionModal.style.display = "none";
            document.getElementById("categoryModal").style.display = "block";
          }
        questionModal.appendChild(okbtn);
        categoryModal.style.display = "none";

    };

async function sha256(str) {
  const utf8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

  function getQuestionChoice(val){
    //get array index from click-event as value
    const qchoice = val.target.value
    //load selection values to global
    appState.quiz.question_id = val.target.id;
    appState.quiz.answer_hash = appState.quiz.questions[val.target.value].answer_hash;
    // get modal DOM
    const quizModal = document.getElementById("quizModal");
    document.getElementById("questionModal").style.display = "none";
    // const pointsBox = document.getElementById("pointsBox");
    // pointsBox.innerText = 5;
    quizModal.style.display ="block";
    // create question title for quiz modal
    const qtitle = document.createElement("div");
    appState.select_question = appState.quiz.questions[qchoice].question
    appState.select_question_id = appState.quiz.questions[qchoice].question_id
    console.log("appState.select_question_id = ", appState.select_question_id);
    qtitle.className = "tile title";
    qtitle.value = appState.select_question_id;
    qtitle.id = 'q'+val.target.value;
    qtitle.innerHTML = `<a><b>${appState.quiz.topic}</b></a><a>${appState.select_question}</a>`
    quizModal.innerHTML="";
    quizModal.appendChild(qtitle);

    //create panel for answer tiles
    const answerPanel = document.createElement("div");
    answerPanel.className = "panel";
    answerPanel.id = 'answerPanel';
    answerPanel.innerHTML = ""
    quizModal.appendChild(answerPanel);

    //create panel for answer tiles
    const checkPanel = document.createElement("div");
    checkPanel.className = "panel";
    checkPanel.id = 'checkPanel';
    checkPanel.innerHTML = "";
    checkPanel.style = "display: none";
    quizModal.appendChild(checkPanel);
    //load answer tiles  
    let atileId = 0
    appState.quiz.questions[qchoice].choices.forEach(choice => {
          const atile = document.createElement("div");
          atile.innerText = choice;
          atile.value = atileId;
          atile.id = "atile" + atileId;
          atile.className = "tile a-tile";
          atile.addEventListener("click", checkAnswer);
          answerPanel.appendChild(atile);
          atileId += 1;
        });

    //add hint tile
    const etile = document.createElement("div");
    etile.id = "explainTile";
    etile.className = "tile title";
    etile.innerText = "Hint";
    etile.addEventListener("click", showHint);
    // etile.onclick = () => {
    //   showHint()
    // }
    answerPanel.appendChild(etile);

    //create panel for hint tile
    const hintPanel = document.createElement("div");
    hintPanel.className = "panel";
    hintPanel.id = 'hintPanel';
    hintPanel.innerHTML = ""
    hintPanel.style = "display: none;"
    quizModal.appendChild(hintPanel);

    //add OK button
    const okbtn = document.createElement("button");
    okbtn.id = "okbtn";
    okbtn.className = "panelbtn";
    okbtn.innerText = "OK";
    okbtn.onclick = () => {
      quizModal.style.display = "none";
      document.getElementById("questionModal").style.display = "block";
    }
    quizModal.appendChild(okbtn);

  };

async function checkAnswer(val){
      // get answer tile choice id
      const answer_tile = document.getElementById(val.target.id)
      const choice = answer_tile.innerText
      // convert answer text to sha256
      const userHash = await sha256(choice);
      // get hash for correct answer
      const answer_hash = appState.quiz.answer_hash;
      //chech if hashes match and do the arbitration
      if (userHash === answer_hash){
          answer_tile.style = "background-color: green;"
          document.getElementById(appState.quiz.question_id).style = "background-color: green;"
          let score = document.getElementById("scoreBox").innerText
          let points = pointsBox.innerText;
          score = Number(score);
          points = Number(points);
          score += points
          points = 0;
          document.getElementById("scoreBox").innerText = score
          document.getElementById("pointsBox").innerText = points
      }else {       
          answer_tile.style = "background-color: salmon;"
          document.getElementById(appState.quiz.question_id).style = "background-color: salmon;"
          let score = document.getElementById("scoreBox").innerText
          let points = pointsBox.innerText;
          score = Number(score);
          points = Number(points);
          points -= 2;
          score += points
          document.getElementById("pointsBox").innerText = points
      }
      const checkPanel = document.getElementById("checkPanel");
      const answerPanel = document.getElementById("answerPanel");
      // checkPanel.innerHTML = "";
      checkPanel.appendChild(answer_tile);
      //add explanation
      const etile = document.createElement("div");
      etile.className = "tile etile";
      etile.id = 'e'+val.target.value;
      const res = await getHint();
      const explanation = appState.select_hint;
      etile.innerHTML = explanation

      checkPanel.appendChild(etile);
      checkPanel.style.display = "block";
      answerPanel.style.display = "none";
      // alert(userHash === answer_hash ? "✅ Correct" : "❌ Incorrect");
    }
    
async function showHint() {
  const res = await getHint();
  const hintPanel = document.getElementById("hintPanel");
  const answerPanel = document.getElementById("answerPanel");
  const etile = document.createElement("div");
  etile.className = "tile etile";
  etile.id = 'hintTile';
  const explanation = appState.select_hint;
  etile.innerHTML = explanation
  hintPanel.appendChild(etile);

  hintPanel.style = "display:block;"
  answerPanel.style = "display:none;"
  hintPanel.onclick = () => {
      hintPanel.style = "display:none;"
      answerPanel.style = "display:block;"
      }

    }

async function getHint() {
      console.log("ln 289 appState.select_question_id = ", appState.select_question_id);
      // const res = await fetch(`/api/getHint/${encodeURIComponent(appState.subject)}, ${encodeURIComponent(appState.category)}, ${encodeURIComponent(appState.topic)}, ${encodeURIComponent(appState.select_question)}`);
      const res = await fetch(`/api/getHint/${encodeURIComponent(appState.select_question_id)}`);
      const data = await res.json();
      console.log("line 255 getHint() = ", data)
      appState.select_hint = data.explanation;
      return;
    };

document.addEventListener("DOMContentLoaded", () => {
      init();
  });