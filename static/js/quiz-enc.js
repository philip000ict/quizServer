
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
    set category(value) {
        if (...) {
            console.error("category cannot be below absolute zero.");
            return; // Exit without setting the value
        }
        this.#appState = value;
    }
}

async function init() {
  const res = await fetch("/api/subjects");
  data = await res.json();
  const appState = new quizObject(data);
  // createDivs();
//   transitionTo("subject");
//   resetAppState("subject");
//   loadSubjectButtons();
//   loadSubjectPanel();
}

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
//   transitionTo("question");
//   loadQuestionModal();
//   setCategoryImage();
//   setHeader();
//   currentMode = UI_MODE.QUIZ;
}

document.addEventListener("DOMContentLoaded", () => {
      init();
  });