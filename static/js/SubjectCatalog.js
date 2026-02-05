export class SubjectCatalog {
  #subjects; // private, immutable
  #currentSubject;
  #currentCategory;
  constructor(subjectPayload) {
    if (!subjectPayload || typeof subjectPayload !== "object") {
      throw new Error("Invalid subjects payload");
    }
    console.log("constructor(subjectPayload) = ",subjectPayload);
    // deep clone + freeze to prevent mutation
    this.#subjects = Object.freeze(
      Object.fromEntries(
        Object.entries(subjectPayload).map(([k, v]) => [
          k,
          Object.freeze([...v])
        ])
      )
    );
  }
  set currentSubject(val) {
    this.#currentSubject = val;
  }
  get currentSubject() {
    return this.#currentSubject;
  }
  set currentCategory(val) {
    this.#currentCategory = val;
  }
  get currentCategory() {
    return this.#currentCategory;
  }

  getSubjects(val){
    return this.#subjects[val];
  }



  // ===== REPLACEMENT FOR: for (let subject in appState.subjects)
  getSubjectNames() {
    return Object.keys(this.#subjects);
  }

  // ===== REPLACEMENT FOR: appState.subjects[appState.subject]
  getCategoriesFor(subject) {
    return this.#subjects[subject] ?? [];
  }

  // Optional safety helpers
  hasSubject(subject) {
    return subject in this.#subjects;
  }

  get raw() {
    // read-only escape hatch (still frozen)
    return this.#subjects;
  }
}
