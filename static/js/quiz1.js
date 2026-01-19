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
 
//  let qdata = []; //data for current quiz
//     let rdata = []; //data for random quiz
//     let selectedSubject = "";
//     let selectedCategory = "";
//     let selectedTopic = "";


async function init() {
  const res = await fetch("/api/subjects");
  appState.subjects = await res.json();

  loadSubjectDropdown();
  loadSubjectPanel();
//   activateButtons();
}

function selectSubject(subject) {
  appState.subject = subject;
  appState.category = null;
  appState.topic = null;
  appState.quiz = null;

  loadCategoryDropdown();
  renderCategoryPanel();
//   loadSubjectImage();
//   setHeader();

  currentMode = UI_MODE.CATEGORY;
}

async function selectCategory(category) {
  appState.category = category;

  const res = await fetch(
    `/api/single_quiz_by_category/${encodeURIComponent(category)}`
  );
  appState.quiz = await res.json();

  renderQuizPanel();
  setHeader();

  currentMode = UI_MODE.QUIZ;
}
function loadSubjectDropdown() {
    //   console.log("loadDropdowns() >>> data = ", appState.subjects)
      const data = appState.subjects;
      const subjectSelect = document.getElementById("subject");
      const option = document.createElement("option");
      option.value = "default";
      option.text = "Select Subject";
      subjectSelect.appendChild(option);
      for (let subject in data) {
        const option = document.createElement("option");
        option.value = subject;
        option.text = subject;
        subjectSelect.appendChild(option);
        }
        subjectSelect.addEventListener("change", loadCategoryDropdown)
        
      };
async function loadSubjectPanel() {
    const data = appState.subjects;
    console.log("loadSubjectPanel() >>> data = ", data);
    const subjectPanel = document.getElementById("quizModal");
    const option = document.createElement("option");
    option.value = "default";
    option.text = "Select Subject";
    subjectPanel.appendChild(option);
    subjectPanel.innerHTML= "";

    if (data) {
        const subjectTitle = document.createElement("div");
        subjectTitle.innerHTML = '<b>Quiz Subjects</b>';
        subjectTitle.className = "tile title"
        subjectPanel.appendChild(subjectTitle);
        for (let subject in data) {
        const ctile = document.createElement("div");
        ctile.id = subject;
        ctile.innerText = subject;
        ctile.className = "tile";
        ctile.addEventListener('click', onchangeSubjectSelect);
        // ctile.onclick = () => {onchangeSubjectSelect(this) };
        subjectPanel.appendChild(ctile);
        };
    }
    subjectPanel.style = "display: block;";
    };
function onchangeSubjectSelect(event){ 
    console.log(`The selected event =  ${event.target.id}`);
    appState.subject = event.target.id;
    
    
    loadCategoryDropdown();
    // console.log("The selected Subject Tile is = ", appState.subject);
    loadCategoryPanel();
    // loadImage();
    };
async function selectCategory(category) {
  appState.category = category;

  const res = await fetch(
    `/api/single_quiz_by_category/${encodeURIComponent(category)}`
  );
  appState.quiz = await res.json();

  loadQuizModal();
  setHeader();

  currentMode = UI_MODE.QUIZ;
}
function loadCategoryDropdown() {
        console.log(`The selected subject =  ${appState.subject}`);
        console.log(`The selected subject =  ${appState.subjects}`);
        const data = appState.subjects;
        const subjectSelect = document.getElementById("subject");
        const categorySelect = document.getElementById("category");
        const quizModal = document.getElementById("quizModal");
        // appState.subject = subjectSelect.value;
        const selectedSubject = appState.subject;
        const quizHeader = document.getElementById("quizHeader");
        quizHeader.innerHTML = `${selectedSubject} → select a Category → select a Topic`;
        console.log("loadCategoryDropdown() selectedSubject = ", appState.subject);
        console.log("data[selectedSubject] = ", data[selectedSubject]);
        // const 
        // load category select default value
        categorySelect.innerHTML = "";
        const option = document.createElement("option");
        option.value = "default";
        // option.text = "<<< Select Subject First <<<";
        option.text = "Select Category";
        categorySelect.appendChild(option);


        // load category select values
        if (data[selectedSubject]) {
          data[selectedSubject].forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.text = cat;
            categorySelect.appendChild(option);
          });
        }

        // load category panel values
        // if (data[selectedSubject]) {
        //   data[selectedSubject].forEach(cat => {
            
        //     const catTile = document.createElement("div");
        //     catTile.value = cat;
        //     catTile.id = cat;
        //     catTile.innerText = cat;
        //     console.log("data[selectedSubject].cat = ", catTile);
        //     categorySelect.appendChild(catTile);
        //   });
        // }
        categorySelect.onchange = () => {
          selectedCategory = categorySelect.value;
          if (selectedCategory) {
            console.log("selected category = ",selectedCategory)
            loadSelectQuiz(selectedCategory); // ✅ call your quiz rendering function
          }
      };
    };

    function loadCategoryPanel(){
        const data = appState.subjects;
        document.getElementById("quizModal").style = "display: none;";
        const subjectPanel = document.getElementById("subject");
        const categoryModal = document.getElementById("categoryModal");
        console.log("The selected Subject Tile is appState.subject = ", appState.subject);
        // console.log("The appState.subjects = ", appState.category);
        const selectedSubject = appState.subject;
        
        categoryModal.innerHTML= "snafu";

        if (data[selectedSubject]) {
            const categoryTitle = document.createElement("div");
            categoryTitle.innerHTML = '<b>'+appState.subject+'</b>';
            categoryTitle.className = "tile title"
            categoryModal.appendChild(categoryTitle);
            data[selectedSubject].forEach(category => {
                console.log("The category = ", category);
                const ctile = document.createElement("div");
                ctile.id = category;
                ctile.innerHTML = '<b>'+category+'</b>';
                ctile.className = "tile";
                ctile.addEventListener('click', selectCategory(category));
                // ctile.onclick = () => {onchangeSubjectSelect(this) };
                categoryModal.appendChild(ctile);
        });
            }
        categoryModal.style = "display: block;";



        // if (data[selectedSubject]) {
        //   console.log("data[selectedSubject] = ", data[selectedSubject]);
        //   const subjectTitle = document.createElement("div");
        //   subjectTitle.innerHTML = '<b>'+selectedSubject+'</b>';
        //   subjectTitle.className = "tile title"
        //   categoryModal.appendChild(subjectTitle);
        //   data[selectedSubject].forEach(cat => {

        //     const ctile = document.createElement("div");
        //     ctile.id = cat;
        //     ctile.innerText = cat;
        //     ctile.className = "tile";
        //     // ctile.addEventListener("click", getQuestionChoice)
        //     ctile.onclick = () => { loadSelectQuiz(cat)};
        //     categoryModal.appendChild(ctile);
        //   });
        // }
        // categoryModal.style = "display: block;";
      };

      function loadImage(){
        let selectedImage = selectedSubject.replaceAll(" ", "") + ".webp";   
        console.log(STATIC_IMG_BASE + selectedImage);
        document.getElementById("subjectImage").innerHTML = `<img src="${STATIC_IMG_BASE}${selectedImage}" alt="${selectedSubject}">`;
      };

      function loadQuizHeader(){
        const quizHeader = document.getElementById("quizHeader");
        quizHeader.innerHTML = `${selectedSubject} → ${selectedCategory} → ${selectedTopic}`;
        quizHeader.style = "font: 2em sans-serif;";
        // subjectSelect.dispatchEvent(new Event("change"));
      }

    function loadQuizCategories(data){
  // default display here
      console.log("loadQuizCategories(data) = ", data);
      // qdata = data;
      
      const quizModal = document.getElementById("quizModal");
      document.getElementById("questionModal").innerHTML = "";
      quizModal.innerHTML = "";
      quizModal.className = "quizBlock";
      const title = document.createElement("div");
      title.id = 'quiz#0';
      title.className = "tile title default-title";
      // title.style = "height:75px;"
      title.innerHTML = `<b>${data.category}</b><a>${data.topic}</a>`;
      quizModal.appendChild(title);

      const quizHeader = document.getElementById("quizHeader");
      quizHeader.innerHTML = `${selectedSubject} → ${selectedCategory} → ${selectedTopic}`;
      quizHeader.style = "font: 2em sans-serif;";

      data.questions.forEach((q, i) => {
        const box = document.createElement("div");
        box.className = "tile ";
        box.value = i
        box.id = 'q0'+(i + 1)
        box.innerHTML = `<a>Q${i + 1}</a>`
        box.addEventListener("click", getQuestionChoice)
        quizModal.appendChild(box);
      });

    };

    function loadQuizModal(){
  // default display here
        console.log("loadQuizModal() data = ", appState.quiz);
        // qdata = data;
        // const quizHeader = document.getElementById("quizHeader");
        const quizModal = document.getElementById("quizModal");
        document.getElementById("questionModal").innerHTML = "";
        quizModal.innerHTML = "";
        quizModal.className = "quizBlock";
        const title = document.createElement("div");
        title.id = 'quiz#0';
        title.className = "tile title default-title";
        // title.style = "height:75px;"
        // load global vars
        const selectedCategory = appState.category;
        const selectedTopic = appState.quiz.topic;
        title.innerHTML = `<b>${appState.category}</b><a>${appState.quiz.topic}</a>`;
        
        quizModal.appendChild(title);
        document.getElementById("categoryModal").style = "display: none;";
        quizModal.style = "display: block;"
        quizHeader.innerHTML = `${appState.subject} → ${appState.category} → ${appState.quiz.topic}`;
        quizHeader.style = "font: 2em sans-serif;";

        appState.quiz.forEach((q, i) => {
            const box = document.createElement("div");
            box.className = "tile ";
            box.value = i
            box.id = 'q0'+(i + 1)
            box.innerHTML = `<a>Q${i + 1}</a>`
            box.addEventListener("click", getQuestionChoice)
            quizModal.appendChild(box);
        });
    };

    function activateRandomButton(){
      const randombtn = document.getElementById("randombtn");
      randombtn.onclick = () => { loadRandomQuiz()
      }
    };

    async function loadRandomQuiz() {
      const res = await fetch("/api/random_quiz");
      const data = await res.json();
      console.log("loadRandomQuiz() data = ",data);
      qdata = data;
      rdata = data;
      loadQuizModal(data);
    }

  async function loadSelectQuizBySubject(subject) {
      const res = await fetch(`/api/single_quiz_by_subject/${encodeURIComponent(subject)}`);
      const data = await res.json();
      loadQuizModal(data);
  }

  async function loadSelectQuiz(category) {
      const res = await fetch(`/api/single_quiz_by_category/${encodeURIComponent(category)}`);
      const data = await res.json();
      loadQuizModal(data);
  }

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
    // quizModal.style = "display: none;";
    questionModal.style = "display: block;";
    console.log("val = ", val);
    console.log("val (target) id = ", val.target.id);
    qchoice = val.target.id
    console.log("qdata.questions = ", qdata);
    console.log("qdata.questions[val.target.value].question = ", qdata.questions[val.target.value]);
    const qtitle = document.createElement("div");
    qtitle.className = "tile title default-title";
    qtitle.id = 'q0';
    qtitle.innerHTML = `<a>${qdata.questions[val.target.value].question}</a>`
    questionModal.innerHTML="";
    questionModal.appendChild(qtitle);

    qdata.questions[val.target.value].choices.forEach(choice => {
          console.log("qdata.questions[val.target.value].answer_hash = ", qdata.questions[val.target.value].answer_hash);
          const atile = document.createElement("div");
          atile.innerText = choice;
          atile.className = "tile a-tile";
          atile.onclick = async () => {
              const userHash = await sha256(choice);
              if (userHash === qdata.questions[val.target.value].answer_hash ){
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
                  // document.getElementById("scoreBox").innerText = score
                  document.getElementById("pointsBox").innerText = points
              }

              alert(userHash === qdata.questions[val.target.value].answer_hash ? "✅ Correct" : "❌ Incorrect");
          };
          questionModal.appendChild(atile);
        });
          const etile = document.createElement("div");
          etile.id = "explainTile";
          etile.className = "tile etile";
          //console.log("qdata.questions[val.target.value].explanation = ",qdata.questions[val.target.value].explanation);
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