//  const UI_MODE = {
//   SUBJECT: "subject",
//   CATEGORY: "category",
//   QUIZ: "quiz"
// };

let UI_MODE = "subject";
 
// const appState = {
//   subjects: {},        // full subject → categories map
//   subject: null,
//   category: null,
//   topic: null,
//   quiz: null,
//   select_question: "",
//   select_question_id: "",
//   select_question_val: "",
//   select_hint: "",
//   select_answer: "",
//   select_answer_id: ""
// }

class quizObject {
    #initialQuiz; // Private field, inaccessible from outside the class
    #subjectMap = new Map( {
    subject: null,
    category: null,
    });
    #appState = new Map( {
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
    });
    constructor(initialData = {}) {
    // Populate the map with initial data
    Object.entries(initialData).forEach(([subject, categories]) => {
      this.#subjectMap.set(subject, categories);
    });
    console.write("#subjectMap = ",subjectMap );
  }

    // Getter method for controlled reading of the value
    get subjects() {
        return this.#appState.subjects;
    }

    // Setter method for controlled writing of the value with validation
    set temperature(value) {
        if (value < -273.15) {
            console.error("Temperature cannot be below absolute zero.");
            return; // Exit without setting the value
        }
        this.#appState = value;
    }
}

// const thermo = new Thermostat(20);

// console.log(thermo.temperature); // Outputs: 20 (uses the getter)

// thermo.temperature = 25; // Uses the setter
// console.log(thermo.temperature); // Outputs: 25

// thermo.temperature = -300; // Uses the setter, but validation prevents the change
// // Outputs (to console.error): Temperature cannot be below absolute zero.
// console.log(thermo.temperature);

// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
//   }
async function init() {
  const res = await fetch("/api/subjects");
  data = await res.json();
  const appState = new quizObject(data);
  // createDivs();
  transitionTo("subject");
  resetAppState("subject");
  loadSubjectButtons();
  loadSubjectPanel();
}
function resetAppState(state) {
  console.log("resetAppState(state) = ",state);
  appState.subject = null;
  appState.category = null;
  appState.topic = null;
  appState.quiz = null;
  appState.select_question = "";
  appState.select_question_id = "";
  appState.select_hint = "";
  appState.select_answer = "";
  appState.selectAnswer_id = "";

  // currentMode = UI_MODE.subject;
}
function selectSubject(subject) {
  appState.subject = subject;
  appState.category = null;
  appState.topic = null;
  appState.quiz = null;
  appState.select_question = "";
  appState.select_question_id = "";
  appState.select_hint = "";
  appState.select_answer = "";
  appState.selectAnswer_id = "";
  renderCategoryPanel();
  // currentMode = UI_MODE.CATEGORY;
}
const panels = {
  subject: "subjectModal",
  category: "categoryModal",
  question: "questionModal",
  quiz: "quizModal",
  answer: "answerModal",
};
//Panel state switchers helper functions
function show(panel) {
  // console.log("panel = ", panel);
  if (panel) document.getElementById(panel).style.display = "block";
}
function hideAll() {
  Object.entries(panels).forEach(([key,value]) => {
    // console.log(`${key}: ${value}`);
    document.getElementById(`${value}`).style.display = "none";
  } )
}
function transitionTo(mode) {
  // if (UI_MODE === nextMode) return;
  // UI_MODE === nextMode
  // // Exit logic (cleanup per mode if needed)
  // console.log("transitionTo(mode) = ", mode);
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

    // case "check":
    //   hideAll();
    //   show(panels.check);
    //   break;

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
  const subjectPanel = document.getElementById("subjectModal");
  const subjectBlurb = document.createElement("div");
  subjectBlurb.className = "tilePanel textBlock";
  subjectBlurb.innerHTML = "<h1>Quiz Server App</h1>\
  <p>An interactive quiz engine delivering curriculum-aligned questions, instant feedback, and dynamic scoring.\
  Designed for students and teachers, it runs smoothly across devices as part of the Hydra microservice family. </p>\
  <p><b> Instructions 1; </b></p>\
  <p> Select an Ancient Civilisation from the Subject Carousel above.</p>\
  <p><b> Instructions 2;</b></p>\
  <p> Select a Quiz Category from the Categories that appear here.</p>\
  <p><b> Instructions 3;</b></p>\
  <p> Select a Question from the Quiz that appears here. Enjoy!</p>"

  subjectPanel.appendChild(subjectBlurb);
}
async function loadSubjectButtons() {
    // console.log("loadSubjectPanel() >>> data = ", appState.subjects);
    const subjectBanner = document.getElementById("carousel-wrapper");
    const buttonPanel = document.getElementById("carousel");
    const leftNav = document.getElementById("leftNav");
    const rightNav = document.getElementById("rightNav");
    // leftNav.innerText = "L";
    // rightNav.innerText = "R";
    if (appState.subjects) {
        for (let subject in appState.subjects) {
          const subjectButton = document.createElement("div");
          const subjectText = document.createElement("div");
          subjectText.innerHTML = "<div class = 'subjectText'>"+subject.replace(/^\S+\s*/, '')+"</div>";
          // subjectText.innerHTML = "<div class = 'subjectText'>"+subject.split(' ').slice(1).join(' ')+"</div>";
          const subjectImg = "subjectBtn/"+subject.replaceAll(" ", "") + "_btn.webp";
          subjectButton.id = subject;
          subjectButton.innerText = subject;
          subjectButton.className = "subjectbtn";
          subjectButton.innerHTML = `<img id = "${subject}" class = "btnImg" src="${STATIC_IMG_BASE}${subjectImg}" alt="${subject}">`;
          subjectButton.appendChild(subjectText)
          subjectButton.addEventListener('click', onchangeSubjectSelect);
          buttonPanel.appendChild(subjectButton);
        };
      }
    // buttonPanel.innerHTML += buttonPanel.innerHTML;
    subjectBanner.appendChild(leftNav);
    subjectBanner.appendChild(buttonPanel);
    subjectBanner.appendChild(rightNav);
    carousel();
};
function onchangeSubjectSelect(event){ 
    setAppState("subject");
    console.log(`The selected event =  ${event.target.id}`);
    appState.subject = event.target.id;
    transitionTo("category");
    loadCategoryPanel();
    setSubjectImage();
};
function loadCategoryPanel(){
    const categoryModal = document.getElementById("categoryModal");
    categoryModal.innerHTML = "";
    document.getElementById("quizHeader").innerHTML='<b>'+appState.subject+'</b>';
    const categoryPanel = document.createElement("div");
    categoryPanel.className = "tilePanel";
    // categoryPanel.innerHTML = "";
    const quizHeader = document.createElement("div");
    quizHeader.className = "tile title"
    quizHeader.innerText = appState.subject;
    categoryPanel.appendChild(quizHeader);
    if (appState.subjects[appState.subject]) {

        appState.subjects[appState.subject].forEach(category => {
            // console.log("The category = ", category);
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
  setAppState("category");
  appState.category = event.target.innerText;
  console.log("The selectCategory(category) = ", event.target.innerText);
  const res = await fetch(
    `/api/single_quiz_by_category/${encodeURIComponent(appState.subject)},${encodeURIComponent(appState.category)}`
  );
  appState.quiz = await res.json();
  console.log(`appState.quiz.topic; =  ${appState.quiz.topic}`);
  // console.log(`appState.quiz.questions; =  ${appState.quiz.questions}`);
  appState.topic = appState.quiz.topic;
  transitionTo("question");
  loadQuestionModal();
  setCategoryImage();
  setHeader();
  currentMode = UI_MODE.QUIZ;
}
function loadQuestionModal(){
    setAppState("quiz");
    // default display here
    console.log("275 loadquestionModal() appState.select_answer_val = ", appState.select_answer_val);
    const questionModal = document.getElementById("questionModal");
    // const categoryModal = document.getElementById("categoryModal");
    const questionPanel = document.createElement("div");
    questionModal.innerHTML = "";
    questionPanel.className = "tilePanel";
    // create title block
    const quizTitle = document.createElement("div");
    quizTitle.id = 'quizTitle';
    quizTitle.className = "tile title";
    // const selectedCategory = appState.category;
    // const selectedTopic = appState.quiz.topic;
    quizTitle.innerHTML = `<a>${appState.subject}</a>${appState.category}<a>${appState.quiz.topic}</a>`;
    
    questionPanel.appendChild(quizTitle);
    quizHeader.innerHTML = `${appState.subject} → ${appState.category} → ${appState.quiz.topic}`;
    quizHeader.style = "font: 2em sans-serif;";

    appState.quiz.questions.forEach((q, i) => {
        const box = document.createElement("div");
        box.className = "tile";
        box.value = i;
        box.id = 'q0'+(i + 1);
        box.innerHTML = `<a>Question ${i + 1}</a>`;
        box.addEventListener("click", selectQuestion);
        questionPanel.appendChild(box);
    });

    const okbtn = document.createElement("button");
      okbtn.id = "okQuestionbtn";
      okbtn.className = "panelbtn";
      okbtn.innerText = "OK";
      okbtn.onclick = () => {
        transitionTo("category");
      }
    questionPanel.appendChild(okbtn);
    questionModal.appendChild(questionPanel)
    // quizModal.appendChild(quizPanel);
};
function selectQuestion(val){
  setAppState("question");
  const qval = val.target.value;
  const qid = val.target.id;
  console.log("qval = ",qval)
  console.log("317 appState.quiz.questions[qval].answer_hash= ",appState.quiz.questions[qval].answer_hash);
  console.log("317 appState.quiz.questions[qval].question = ",appState.quiz.questions[qval].question);
  appState.select_question_val = qval;
  appState.select_question_id = qid;
  appState.select_question = appState.quiz.questions[qval].question;
  console.log("324 selectQuestion(val) appState = ", appState);
  // appState.select_answer_val = "";
  // appState.select_answer_val = appState.quiz.questions[qval].answer_hash;
  // console.log("257 appState.quiz.questions[qid] = ",appState.quiz.questions[qid])
  // appState.answer_hash = appState.quiz.questions[qid].answer_hash;
  
  loadQuizModal();
  transitionTo("quiz");
}
function loadQuizModal(){
  const qid = appState.question
  const quizModal = document.getElementById("quizModal");
  const quizPanel = document.createElement("div");
  quizModal.innerHTML = "";
  quizPanel.className = "tilePanel";
  quizPanel.id = "quizPanel";
  // get appState data
  const select_data = appState.select_question;
  const select_question = appState.select_question.question;
  console.log("281 select_question = ", select_question);
  // create question title for quiz modal
  const qtitle = document.createElement("div");
  qtitle.className = "tile title";
  qtitle.id = "quizTitle";
  qtitle.innerHTML = `<a>${appState.subject}</a>${appState.category}<a>${appState.quiz.topic}</a>`;
  quizPanel.appendChild(qtitle);
// create question title for quiz modal
  const qtile = document.createElement("div");
  qtile.className = "tile q";
  qtile.id = "quizQuestion";
  qtile.innerHTML = `<a class = "question">${select_question}</a>`
  quizPanel.appendChild(qtile);
  //load answer tiles  
  let atileId = 0
  select_data.choices.forEach(choice => {
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
  const etile = document.createElement("div");
  etile.id = "hintTile";
  etile.className = "tile hint";
  etile.innerText = "Hint";
  etile.addEventListener("click", showHint);
  quizPanel.appendChild(etile);

  //add OK button
  const okbtn = document.createElement("button");
  okbtn.id = "okbtn";
  okbtn.className = "panelbtn";
  okbtn.innerText = "OK";
  okbtn.onclick = () => {
    transitionTo("question");
  }
  quizPanel.appendChild(okbtn);
  quizModal.appendChild(quizPanel);

};
function selectAnswer(val){
  const aval = val.target.value
  setAppState("answer");
  console.log("390 selectAnswer(val) = ", val);
  console.log("391 appState.select_question = ", appState.select_question);
  appState.select_answer = appState.quiz.questions[aval];
  console.log("395 appState.select_question.choices[aval] = ",appState.select_question.choices[aval]);
  appState.select_answer_val = appState.quiz.questions[val.target.value].answer_hash;
  transitionTo("answer");
  loadAnswerModal();
  checkAnswer();
}
async function checkAnswer(){
  // get answer tile
  const answer_tile = document.getElementById("answer_tile");
  console.log("appState.question = ",appState.select_answer);
  // console.log("appState.quiz.questions = ",appState.quiz.questions.[]);
  const choice = appState.select_answer
  // convert answer text to sha256
  const userHash = await sha256(choice);
  console.log("user Hash = ",userHash);
  // get hash for correct answer
  const answer_hash = appState.select_answer_hash;
  console.log("answer hash = ",answer_hash);
  //chech if hashes match and do the arbitration
  console.log("appState.question_id = ",appState.select_question_id);
  if (userHash === answer_hash){
      answer_tile.style = "background-color: springgreen;"
      document.getElementById(appState.select_question_id).style = "background-color: springgreen;"
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
      document.getElementById(appState.select_question_id).style = "background-color: salmon;"
      let score = document.getElementById("scoreBox").innerText
      let points = pointsBox.innerText;
      score = Number(score);
      points = Number(points);
      points -= 2;
      score += points
      document.getElementById("pointsBox").innerText = points
  }


      // alert(userHash === answer_hash ? "✅ Correct" : "❌ Incorrect");
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
      qtitle.innerHTML = `<a>${appState.subject}</a>${appState.category}<a>${appState.quiz.topic}</a>`;
      
      answerPanel.appendChild(qtitle);

      // create question title for quiz modal
      const qtile = document.createElement("div");
      qtile.className = "tile q";
      qtile.id = "quizQuestion";
      qtile.innerHTML = `<a class = "question">${appState.select_question}</a>`
      answerPanel.appendChild(qtile);

      `<a class = "question">${appState.select_question.question}</a>`
      // load answer tile
      const answer_tile = document.createElement("div")
      answer_tile.className = 'tile big';
      answer_tile.id = "answer_tile";
      answer_tile.innerText = appState.select_answer;
      answerPanel.appendChild(answer_tile);
      //add explanation
      const etile = document.createElement("div");
      etile.className = "tile big hint";
      etile.id = 'hintTile';
      // const res = await getHint();
      const explanation = "<p>Waiting for an Explanation!</p>"
      // const explanation = appState.select_hint;
      etile.innerHTML = explanation

      answerPanel.appendChild(etile);

        //add OK button
      const okbtn = document.createElement("button");
      okbtn.id = "okbtn";
      okbtn.className = "panelbtn";
      okbtn.innerText = "OK";
      okbtn.onclick = () => {
        transitionTo("question");
      }
      answerPanel.appendChild(okbtn);
      answerModal.appendChild(answerPanel);
}
function setSubjectImage(){
    let subjectImage = appState.subject.replaceAll(" ", "") + ".webp";   
    // console.log(STATIC_IMG_BASE + subjectImage);
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