export class SubjectCatalog {
  #subjects;
  #currentSubject;
  #currentCategory;

  constructor(subjectArray) {
    if (!Array.isArray(subjectArray)) {
      throw new Error("Invalid subjects payload");
    }

    // Convert array → indexed map by ID
    this.#subjects = Object.freeze(
      Object.fromEntries(
        subjectArray.map(s => [
          String(s.id),
          Object.freeze({
            id: s.id,
            name: s.name,
            categories: Object.freeze(s.categories ?? [])
          })
        ])
      )
    );
  }

  set currentSubject(val) {
    this.#currentSubject = String(val);
  }

  get currentSubject() {
    return this.#currentSubject;
  }

  set currentCategory(val) {
    this.#currentCategory = String(val);
  }

  get currentCategory() {
    return this.#currentCategory;
  }

  getSubjectNames() {
    return Object.values(this.#subjects);
  }

  getCategoriesFor(subjectId) {
    return this.#subjects[String(subjectId)]?.categories ?? [];
  }

  hasSubject(subjectId) {
    return String(subjectId) in this.#subjects;
  }

  getSubjectNameById(subjectId) {
    return this.#subjects[String(subjectId)]?.name ?? null;
  }
  getCategoryNameById(categoryId) {

    const cid = String(categoryId);

    for (const subject of Object.values(this.#subjects)) {

      const match = subject.categories
        ?.find(c => String(c.id) === cid);

      if (match) {
        return match.name;
      }
    }

    return null;
  }
  get raw() {
    return this.#subjects;
  }
}
