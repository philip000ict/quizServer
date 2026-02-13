export class QuizData {
  #meta = {
    subject: null,
    subject_string: null,
    category: null,
    category_string: null,
    topic: null,
    topic_string: null
  };

  #quiz;                 // frozen quiz payload
  #currentQuestionIndex; // number

  #selection = {
    question: "",
    question_id: "",
    question_val: null,
    questionTileID: "",
    explanation: "",
    answer: "",
    answer_hash: "",
  };

  static async create(categoryId, subjectId) {

    const res = await fetch(
      `/api/single_quiz_by_category/${categoryId}`
    );

    const payload = await res.json();
    
    return new QuizData(payload, categoryId, subjectId);
  }

  constructor(payload, categoryId, subjectId) {
    // console.log("36 Inside Constructor");
    this.#meta.subject = subjectId;
    // this.#meta.subject_string =
    //   subjectCatalog.getSubjectNameById(subjectId);
    // 
    this.#meta.category = categoryId;
    // this.#meta.category_string =
    //   subjectCatalog
    //     .getCategoriesFor(subjectId)
    //     .find(c => String(c.id) === String(categoryId))
    //     ?.name ?? "";

    this.#meta.topic = payload.topic_id;
    this.#meta.topic_string = payload.topic;

    this.#quiz = Object.freeze({
      questions: Object.freeze(
        payload.questions.map(q =>
          Object.freeze({
            ...q,
            choices: Object.freeze([...q.choices])
          })
        )
      )
    });
  }
  // constructor(quizPayload) {
  //   if (!quizPayload || !Array.isArray(quizPayload.questions)) {
  //     throw new Error("Invalid quiz payload");
  //   }
  //   console.log("QuizData payload:", quizPayload);

  //   this.#meta.subject  = quizPayload.subject ?? null;
  //   this.#meta.category = quizPayload.category ?? null;
  //   this.#meta.topic    = quizPayload.topic ?? null;

  //   // Freeze quiz data to prevent mutation
  //   this.#quiz = Object.freeze({
  //     ...quizPayload,
  //     questions: quizPayload.questions.map(q =>
  //       Object.freeze({
  //         ...q,
  //         choices: Object.freeze([...q.choices])
  //       })
  //     )
  //   });

  //   this.#currentQuestionIndex = null;
  // }

  /* ─────────────────────────
     META (drop-in replacements)
     ───────────────────────── */
  set currentSubject(val) {
    this.#meta.subject = val;
  }
  get currentSubject() {
    return this.#meta.subject;
  }
  set currentSubject_string(val) {
  this.#meta.subject_string = val;
  }
  get currentSubject_string() {
    return this.#meta.subject_string;
  }
  set currentCategory(val) {
    this.#meta.category = val;
  }
  get currentCategory() {
    return this.#meta.category;
  }
  set currentCategory_string(val) {
    this.#meta.category_string = val;
  }
  get currentCategory_string() {
    return this.#meta.category_string;
  }
  set currentTopic(val) {
    this.#meta.topic = val;
  }
  get currentTopic() {
    return this.#meta.topic;
  }
  set currentTopic_string(val) {
    this.#meta.topic_string = val;
  }
  get currentTopic_string() {
    return this.#meta.topic_string;
  }
    get currentQuestion(){
    return this.#selection.question; 
  }
  set currentQuestionTileID(val) {
    this.#selection.questionTileID = val;
  }
  get currentQuestionTileID() {
    return this.#selection.questionTileID;
  }
  set currentAnswer(val) {
    this.#selection.answer = val;
  }
  get currentAnswer() {
    return this.#selection.answer;
  }
  get currentExplanation() {
    return this.#selection.explanation;
  }
  get answerHash() {
    return this.#selection.answer_hash;
  }
  get selectQuestionId() {
    return this.#selection.question_id;
  }

  get quizTitle() {

  // const subjectName =
  //     subjectCatalog.getSubjectNameById(this.#meta.subject) ?? "";
  // console.log("currentSubject = ",subjectName)
  // const categoryName =
  //     subjectCatalog
  //       .getCategoriesFor(this.#meta.subject)
  //       .find(c => String(c.id) === String(this.#meta.category))
  //       ?.name ?? "";
  // console.log("currentCategory = ",categoryName)
  const topicName = this.#meta.topic_string ?? "";

  return `
    ${this.#meta.subject_string}
    <br>
    <a>
      ${this.#meta.category_string}
      <br>
      ${topicName}
    </a>
  `;
}
  // get quizTitle() {
  //   const quizTitle = `${this.#meta.subject}<br><a>${this.#meta.category}<br>${this.#meta.topic}</a>`;
  //   return quizTitle;
  // }

  /* ─────────────────────────
     QUIZ ITERATION
     replaces: appState.quiz.questions.forEach
     ───────────────────────── */

  get questions() {
    return this.#quiz.questions.map((q, i) => ({
      id: q.id,
      index: i,
      text: q.question
    }));
  }

  /* ─────────────────────────
     QUESTION SELECTION
     ───────────────────────── */

  set currentQuestion(index) {
    const i = Number(index);
    
    // console.log("class set currentQuestion(index) now activated");
    const q = this.#quiz.questions[i];
    // console.log("this.#quiz.questions[index]", this.#quiz.questions[i]);
    if (!q) return;

    this.#currentQuestionIndex = i;

    this.#selection.question = q.question;
    this.#selection.question_id = q.id;
    this.#selection.question_val = i;
    this.#selection.explanation = q.explanation;
    this.#selection.answer_hash = q.answer_hash ?? "";
  }

  get currentQuestion() {
    return this.#selection.question;
  }

  get currentQuestionData() {
    // console.log("this.#currentQuestionIndex", this.#currentQuestionIndex);
    if (this.#currentQuestionIndex === null) return null;

    const q = this.#quiz.questions[this.#currentQuestionIndex];

    return {
      question: q.question,
      choices: q.choices,
      hint: q.hint ?? ""
    };
  }

  /* ─────────────────────────
     CHOICES ITERATION
     replaces: select_question.choices.forEach
     ───────────────────────── */

  get currentChoices() {
    return this.#currentQuestionIndex === null
      ? []
      : this.#quiz.questions[this.#currentQuestionIndex].choices;
  }

  /* ─────────────────────────
     ANSWER
     ───────────────────────── */

  set currentAnswerHash(hash) {
    this.#selection.answer_hash = hash;
  }

  get currentAnswerHash() {
    return this.#selection.answer_hash;
  }
}
