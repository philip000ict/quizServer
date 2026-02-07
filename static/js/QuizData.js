export class QuizData {
  #meta = {
    subject: null,
    category: null,
    topic: null
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

  constructor(quizPayload) {
    if (!quizPayload || !Array.isArray(quizPayload.questions)) {
      throw new Error("Invalid quiz payload");
    }
    console.log("QuizData payload:", quizPayload);

    this.#meta.subject  = quizPayload.subject ?? null;
    this.#meta.category = quizPayload.category ?? null;
    this.#meta.topic    = quizPayload.topic ?? null;

    // Freeze quiz data to prevent mutation
    this.#quiz = Object.freeze({
      ...quizPayload,
      questions: quizPayload.questions.map(q =>
        Object.freeze({
          ...q,
          choices: Object.freeze([...q.choices])
        })
      )
    });

    this.#currentQuestionIndex = null;
  }

  /* ─────────────────────────
     META (drop-in replacements)
     ───────────────────────── */
  set currentSubject(val) {
    this.#meta.subject = val;
  }
  get currentSubject() {
    return this.#meta.subject;
  }
  set currentCategory(val) {
    this.#meta.category = val;
  }
  get currentCategory() {
    return this.#meta.category;
  }
  set currentTopic(val) {
    this.#meta.topic = val;
  }
  get currentTopic() {
    return this.#meta.topic;
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
    const quizTitle = `${this.#meta.subject}<br><a>${this.#meta.category}<br>${this.#meta.topic}</a>`;
    return quizTitle;
  }

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
    
    console.log("class set currentQuestion(index) now activated");
    const q = this.#quiz.questions[i];
    console.log("this.#quiz.questions[index]", this.#quiz.questions[i]);
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
    console.log("this.#currentQuestionIndex", this.#currentQuestionIndex);
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
