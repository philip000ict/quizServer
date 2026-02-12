import {SubjectCatalog} from "./SubjectCatalog.js";
import {QuizData} from "./QuizData.js";
let subjectCatalog;
let quizData01;

async function init() {
  // const res = await fetch("/quizserver/api/subjects");
  const res = await fetch("/api/subjects");
  const data  = await res.json();
  subjectCatalog = new SubjectCatalog(data);
  console.log("subjectCatalog.getSubjectNames= ",subjectCatalog.getSubjectNames());

  transitionTo("subject");
  setAppState("subject");
  loadSubjectButtons();
  loadSubjectPanel();
  loadScorePanel();
  // addPrintBtn();
}
const appState = {
  subjects: {},        // full subject → categories map
  subject: null,
  category: null,
  topic: null,
  quiz: null,
  select_question: "",
  select_question_id: "",
  select_question_val: "",
  select_hint: "",
  select_answer: "",
  select_answer_id: ""
};
const panels = {
  subject: "subjectModal",
  category: "categoryModal",
  question: "questionModal",
  quiz: "quizModal",
  answer: "answerModal",
};
//Panel state switchers helper functions
function show(panel) {
  if (panel) document.getElementById(panel).style.display = "block";
}
function hideAll() {
  Object.entries(panels).forEach(([key,value]) => {
    document.getElementById(`${value}`).style.display = "none";
  } )
}
function transitionTo(mode) {
  switch (mode) {
    case "subject":
      hideAll();
      show(panels.subject);
      break;

    case "category":
      hideAll();
      show(panels.category);
      break;

    case "question":
      hideAll();
      show(panels.question);
      break;

    case "quiz":
      hideAll();
      show(panels.quiz);
      break;

    case "answer":
      hideAll();
      show(panels.answer);
      break;
  }
}
function setAppState(state){
  switch (state) {
    case "subject":
      appState.subject = null;
      appState.category = null;
      appState.topic = null;
      appState.quiz = null;
      appState.select_answer = "";
      appState.select_answer_val = "";
      appState.select_hint = "";
      appState.select_question = "";
      appState.select_question_id = "";
      break
    case "category":
      appState.category = null;
      appState.topic = null;
      appState.quiz = null;
      appState.select_answer = "";
      appState.select_answer_val = "";
      appState.select_hint = "";
      appState.select_question = "";
      appState.select_question_id = "";
      break

    case "question":
      appState.select_answer = "";
      appState.select_answer_val = "";
      appState.select_hint = "";
      appState.select_question = "";
      appState.select_question_id = "";
      break

     case "quiz":
      appState.select_answer = "";
      appState.select_answer_val = "";
      appState.select_hint = "";
      appState.select_question = "";
      appState.select_question_id = "";
      break   
  }
}
function loadSubjectPanel(){
  const subjectModal = document.getElementById("subjectModal");

  const subjectPanel = document.createElement("div");
  subjectPanel.className = "tilePanel";
  subjectPanel.id = "subjectPanel";

  const quizHeader = document.createElement("div");
  quizHeader.className = "tile title"
  quizHeader.innerHTML = "<header>Quiz Server App</header>";
  subjectPanel.appendChild(quizHeader);

  const subjectBlurb = document.createElement("div");  
  subjectBlurb.className = "tile text";
  subjectBlurb.innerHTML = "<p>An interactive quiz engine delivering deep dive academic level questions, instant feedback, and dynamic scoring.\
  Designed for students and teachers, it runs smoothly across devices as part of the Hydra microservice family. </p>"
  subjectPanel.appendChild(subjectBlurb);

  let instructionTile = document.createElement("div"); 
  instructionTile.className = "tile splash";
  instructionTile.innerHTML = `<a><b> Instructions 1; </b></a>\
  <img src="${STATIC_IMG_BASE}carousel.png" id ='carouselImg' alt='subject selection carousel buttons'>\
  <a> Select an Ancient Civilisation from the Subject Carousel above.</a>`;
  subjectPanel.appendChild(instructionTile);

  instructionTile = document.createElement("div"); 
  instructionTile.className = "tile splash";
  instructionTile.innerHTML = "<a><b> Instructions 2;</b></a>\
  <a> Select a Quiz Category from the Categories that appear here.</a>"
  subjectPanel.appendChild(instructionTile);

  instructionTile = document.createElement("div"); 
  instructionTile.className = "tile splash";
  instructionTile.innerHTML = "<a><b> Instructions 3;</b></a>\
  <a> Select a Question from the Quiz that appears here. Enjoy!</a>"
  subjectPanel.appendChild(instructionTile);
  subjectModal.appendChild(subjectPanel);
}
function loadScorePanel(){
  const scoreBlock = document.getElementById("scoreBlock");

  const countBox = document.createElement("div");
  countBox.className = "tile score";
  countBox.id = "countBox";
  countBox.innerText = "0";
  scoreBlock.appendChild(countBox);

  const tallyBox = document.createElement("div");
  tallyBox.className = "tile score";
  tallyBox.id = "tallyBox";
  tallyBox.innerText = "0";
  scoreBlock.appendChild(tallyBox);
}
function addPrintBtn(){
  const printBtn = document.createElement("div");
  printBtn.className = "panelBtn";
  printBtn.id= "printBtn";
  printBtn.innerText = "Print Quiz";
  printBtn.addEventListener('click', loadPrintPage);
  document.getElementById("buttonBox").appendChild(printBtn);
}
function loadPrintPage(){

}
async function loadSubjectButtons() {
    const subjectBanner = document.getElementById("carousel-wrapper");
    const buttonPanel = document.getElementById("carousel");
    const leftNav = document.getElementById("leftNav");
    const rightNav = document.getElementById("rightNav");
    if (appState.subjects) {
        subjectCatalog.getSubjectNames().forEach(subject => {
          const subjectButton = document.createElement("div");
          const subjectText = document.createElement("div");
          subjectText.innerHTML = "<div class = 'subjectText'>"+subject.replace(/^\S+\s*/, '')+"</div>";
          const subjectImg = "subjectBtn/"+subject.replaceAll(" ", "") + "_btn.webp";
          subjectButton.id = subject;
          subjectButton.innerText = subject;
          subjectButton.className = "subjectbtn";
          subjectButton.innerHTML = `<img id = "${subject}" class = "btnImg" src="${STATIC_IMG_BASE}${subjectImg}" alt="${subject}">`;
          subjectButton.appendChild(subjectText)
          subjectButton.addEventListener('click', onchangeSubjectSelect);
          buttonPanel.appendChild(subjectButton);
        });
      }
    subjectBanner.appendChild(leftNav);
    subjectBanner.appendChild(buttonPanel);
    subjectBanner.appendChild(rightNav);
    carousel();
};
function onchangeSubjectSelect(event){ 
    setAppState("subject");
    console.log(`The selected event =  ${event.target.id}`);
    subjectCatalog.currentSubject = event.target.id;
    console.log("subjectCatalog.getCurrentSubject() = ",subjectCatalog.currentSubject);
    transitionTo("category");
    loadCategoryPanel(event.target.id);
    setSubjectImage();
};
function loadCategoryPanel(subject){
    const categoryModal = document.getElementById("categoryModal");
    categoryModal.innerHTML = "";
    document.getElementById("quizHeader").innerHTML='<b>'+appState.subject+'</b>';
    const categoryPanel = document.createElement("div");
    categoryPanel.className = "tilePanel";
    const quizHeader = document.createElement("div");
    quizHeader.className = "tile title"
    quizHeader.innerText = subject;
    categoryPanel.appendChild(quizHeader);
    if (subject) {
        subjectCatalog
          .getCategoriesFor(subject)
          .forEach(category => {
              const ctile = document.createElement("div");
              ctile.id = category;
              ctile.innerHTML = category;
              ctile.className = "tile";
              ctile.addEventListener('click', selectCategory);
              categoryPanel.appendChild(ctile);
              });
        }
    categoryModal.appendChild(categoryPanel);
};
async function selectCategory(event) {
  showSpinner();              // 🔒 lock UI immediately
    try {
        const category = event.target.innerText;
        subjectCatalog.currentCategory = category;
        const subject = subjectCatalog.currentSubject;
        const res = await fetch(
          // `/quizserver/api/single_quiz_by_category/${encodeURIComponent(subject)},${encodeURIComponent(category)}`
          `/api/single_quiz_by_category/${encodeURIComponent(subject)},${encodeURIComponent(category)}`
        );
        quizData01 = new QuizData(await res.json());
        quizData01.currentSubject = subjectCatalog.currentSubject;
        transitionTo("question");
        loadQuestionModal();
        setCategoryImage();
        setHeader();
    } catch (err) {
        console.error("Quiz load failed", err);
        alert("Failed to load quiz. Please try again.");

  } finally {
      setTimeout(() => {
        console.log("This runs after 0.5 seconds");
        }, 1000); // 500 milliseconds = 0.5 seconds

       hideSpinner();             // 🔓 always unlock
  }
}
function loadQuestionModal(){
    setAppState("quiz");
    // default display here
    console.log(`quizData01.currentSubject; =  ${quizData01.currentSubject}`);
    console.log(`quizData01.currentCategory; =  ${quizData01.currentCategory}`);
    console.log(`quizData01.currentTopic; =  ${quizData01.currentTopic}`);
    const subject = quizData01.currentSubject;
    const category = quizData01.currentCategory;
    const topic = quizData01.currentTopic;
    const questionModal = document.getElementById("questionModal");
    const questionPanel = document.createElement("div");
    questionModal.innerHTML = "";
    questionPanel.className = "tilePanel";
    questionPanel.id = "questionPanel";
    // create title block
    const quizTitle = document.createElement("div");
    quizTitle.id = 'quizTitle';
    quizTitle.className = "tile title";
    quizTitle.innerHTML = quizData01.quizTitle;
    
    questionPanel.appendChild(quizTitle);
    quizHeader.innerHTML = `${subject} → ${category} → ${topic}`;
    quizHeader.style = "font: 2em sans-serif;";

    quizData01.questions.forEach((q, i) => {
        const box = document.createElement("div");
        box.className = "tile";
        box.value = i;
        box.id = 'q0'+(i + 1);
        box.innerHTML = `<a>Question ${i + 1}</a>`;
        box.addEventListener("click", selectQuestion);
        questionPanel.appendChild(box);
    });

    const okbtn = document.createElement("button");
      okbtn.id = "okQuestionBtn";
      okbtn.className = "panelBtn";
      okbtn.innerText = "OK";
      okbtn.onclick = () => {
        transitionTo("category");
      }
    questionPanel.appendChild(okbtn);
    questionModal.appendChild(questionPanel)

      
};
function selectQuestion(val){
  setAppState("question");
  const qval = val.target.value;
  const qid = val.target.id;
  console.log("qval = ",qval,", qid = ",qid)
  quizData01.currentQuestion = qval;
  quizData01.currentQuestionTileID = qid;
  console.log("quizData01.currentQuestion = ", quizData01.currentQuestion);
  
  loadQuizModal();
  transitionTo("quiz");
  //add points in play
  
}
function loadQuizModal(){
  console.log('document.getElementById("countBox").innerText = ',document.getElementById("countBox").textContent)
  const countBox = document.getElementById("countBox");
  let points = document.getElementById("countBox").textContent;
  points = "2";
  countBox.textContent = points;
  const qid = appState.question
  const quizModal = document.getElementById("quizModal");
  const quizPanel = document.createElement("div");
  quizModal.innerHTML = "";
  quizPanel.className = "tilePanel";
  quizPanel.id = "quizPanel";
  // get appState data
  const select_question = quizData01.currentQuestion;
  console.log("363 select_question = ", select_question);
  // create question title for quiz modal
  const qtitle = document.createElement("div");
  qtitle.className = "tile title";
  qtitle.id = "quizTitle";
  console.log("quizData01.quizTitle() = ",quizData01.quizTitle);
  const titleText = quizData01.quizTitle;
  qtitle.innerHTML = titleText;
  quizPanel.appendChild(qtitle);
// create question title for quiz modal
  const qtile = document.createElement("div");
  qtile.className = "tile q";
  qtile.id = "quizQuestion";
  qtile.innerHTML = `<a class = "question">${select_question}</a>`
  quizPanel.appendChild(qtile);
  //load answer tiles  
  let atileId = 0
  // select_data.choices.forEach(choice => {
  quizData01.currentChoices.forEach(choice => {
        const atile = document.createElement("div");
        atile.innerText = choice;
        atile.value = atileId;
        atile.id = "atile" + atileId;
        atile.className = "tile a-tile";
        atile.addEventListener("click", selectAnswer);
        quizPanel.appendChild(atile);
        atileId += 1;
      });

  //add hint tile
  // const etile = document.createElement("div");
  // etile.id = "hintTile";
  // etile.className = "tile hint";
  // etile.innerText = "No Hint";
  // // etile.addEventListener("click", showHint);
  // quizPanel.appendChild(etile);

  //add OK button
  const okbtn = document.createElement("button");
  okbtn.id = "okbtn";
  okbtn.className = "panelBtn";
  okbtn.innerText = "OK";
  okbtn.onclick = () => {
    transitionTo("question");
  }
  quizPanel.appendChild(okbtn);
  quizModal.appendChild(quizPanel);


};
function selectAnswer(val){
  const aval = val.target.textContent
  setAppState("answer");
  quizData01.currentAnswer = aval;
  transitionTo("answer");
  loadAnswerModal();
  checkAnswer();
}
async function checkAnswer(){
  // get answer tile
  const answer_tile = document.getElementById("answer_tile");
  console.log("quizData01.currentAnswer = ",quizData01.currentAnswer);
  const choice = quizData01.currentAnswer
  // convert answer text to sha256
  const userHash = await sha256(choice);
  console.log("user Hash = ",userHash);
  // get hash for correct answer
  const answer_hash = quizData01.answerHash;
  console.log("answer hash = ",answer_hash);
  //chech if hashes match and do the arbitration
  console.log("appState.question_id = ",quizData01.currentQuestionTileID);
  if (userHash === answer_hash){
      answer_tile.style = "background-color: springgreen;"
      document.getElementById(quizData01.currentQuestionTileID).style = "background-color: springgreen;"
      let score = document.getElementById("tallyBox").innerText
      let points = document.getElementById("countBox").innerText;
      score = Number(score);
      points = Number(points);
      score += points
      points = 0;
      document.getElementById("tallyBox").innerText = score;
      document.getElementById("countBox").innerText = points
  }else {       
      answer_tile.style = "background-color: salmon;"
      document.getElementById(quizData01.currentQuestionTileID).style = "background-color: salmon;"
      let score = document.getElementById("tallyBox").innerText
      let points = document.getElementById("countBox").innerText;
      score = Number(score);
      points = Number(points);
      points -= 2;
      score += points
      document.getElementById("countBox").innerText = points
      document.getElementById("tallyBox").innerText = score
  }
}
async function loadAnswerModal(){
      const answerModal = document.getElementById("answerModal");
      answerModal.innerHTML = "";
        //create panel for answer tiles
      const answerPanel = document.createElement("div");
      answerPanel.className = "tilePanel";
      answerPanel.id = 'answerPanel';
      // load question tile
      // create question title for answer modal
      const qtitle = document.createElement("div");
      qtitle.className = "tile title";
      qtitle.id = "quizTitle";
      qtitle.innerHTML = quizData01.quizTitle;
      
      answerPanel.appendChild(qtitle);

      // create question title for quiz modal
      const qtile = document.createElement("div");
      qtile.className = "tile q";
      qtile.id = "quizQuestion";
      qtile.innerHTML = `<a class = "question">${quizData01.currentQuestion}</a>`
      answerPanel.appendChild(qtile);

      // load answer tile
      const answer_tile = document.createElement("div")
      answer_tile.className = 'tile big';
      answer_tile.id = "answer_tile";
      answer_tile.innerText = quizData01.currentAnswer;
      answerPanel.appendChild(answer_tile);
      //add explanation
      const etile = document.createElement("div");
      etile.className = "tile big hint";
      etile.id = 'hintTile';
      const explanation = quizData01.currentExplanation;
      etile.innerHTML = explanation

      answerPanel.appendChild(etile);

        //add OK button
      const okbtn = document.createElement("button");
      okbtn.id = "okbtn";
      okbtn.className = "panelBtn";
      okbtn.innerText = "OK";
      okbtn.onclick = () => {
        transitionTo("question");
      }
      answerPanel.appendChild(okbtn);
      answerModal.appendChild(answerPanel);
}
function setSubjectImage(){
    const currentSubject = subjectCatalog.currentSubject;
    console.log("currentSubject",currentSubject);
    let subjectImage = currentSubject.replaceAll(" ", "") + ".webp";
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
async function sha256(str) {
    const utf8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}  
async function showHint() {
}
async function getHint() {
      // console.log("ln 289 appState.select_question_id = ", appState.select_question_id);
      // const res = await fetch("/quizserver/api/`/api/getHint/${encodeURIComponent(appState.select_question_id)}`);
      // const res = await fetch("/api/`/api/getHint/${encodeURIComponent(appState.select_question_id)}`);
      // const data = await res.json();
      // console.log("line 255 getHint() = ", data)
      // appState.select_hint = data.explanation;
      
      // return;
};
function showSpinner() {
  document.getElementById("quiz-loading").classList.remove("hidden");
}
function hideSpinner() {
        setTimeout(() => {
        console.log("This runs after 0.5 seconds");
        }, 1000); // 500 milliseconds = 0.5 seconds
  document.getElementById("quiz-loading").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
      init();
  });