from flask import Flask, render_template, jsonify, request
import mysql.connector
import os, random, hashlib
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, template_folder='templates')
db_table = 'ancient_quiz'
def get_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=int(os.getenv("MYSQL_PORT", 3306))
    )

def hash_answer(answer):
    return hashlib.sha256(answer.encode('utf-8')).hexdigest()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/subjects")
def get_subjects():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"SELECT DISTINCT subject, category FROM {db_table} ORDER BY subject, category")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Group categories under each subject
    grouped = {}
    for row in rows:
        subj = row["subject"]
        cat = row["category"]
        if subj not in grouped:
            grouped[subj] = []
        if cat not in grouped[subj]:
            grouped[subj].append(cat)
    return jsonify(grouped)


@app.route("/api/random_quiz")
def random_quiz():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Step 0: Get random subject
    cursor.execute(f"SELECT DISTINCT subject FROM {db_table} ORDER BY RAND() LIMIT 1")
    subject = cursor.fetchone()["subject"]

    # Step 1: Get random category
    cursor.execute(f"SELECT DISTINCT category FROM {db_table} WHERE subject = %s  ORDER BY RAND() LIMIT 1", (subject,))
    category = cursor.fetchone()["category"]
    # print("category = ". category  )
    # Step 2: Get random topic from that category
    cursor.execute(f"SELECT DISTINCT topic FROM {db_table} WHERE category = %s ORDER BY RAND() LIMIT 1", (category,))
    topic = cursor.fetchone()["topic"]

    # Step 3: Get 6 random questions
    cursor.execute(f"""
        SELECT question, correct_choice, distractor1, distractor2, distractor3, explanation
        FROM {db_table} 
        WHERE subject = %s AND category = %s AND topic = %s
        ORDER BY RAND() 
        LIMIT 6
    """, (subject, category, topic))

    questions = []
    for row in cursor.fetchall():
        choices = [row["correct_choice"], row["distractor1"], row["distractor2"], row["distractor3"]]
        random.shuffle(choices)
        correct_hash = hashlib.sha256(row["correct_choice"].encode()).hexdigest()
        # explanation_hash = hash_answer(row["explanation"])
        questions.append({
            "question": row["question"],
            "choices": choices,
            "answer_hash": correct_hash,
            # "explanation_hash": explanation_hash
        })

    cursor.close()
    conn.close()
    
    return jsonify({
        "subject": subject,
        "category": category,
        "topic": topic,
        "questions": questions
    })

@app.route("/api/single_quiz_by_subject/<subject>")
def single_quiz_by_subject(subject):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Step 1: Get random subject
    # cursor.execute("SELECT DISTINCT subject FROM ancient_quiz ORDER BY RAND() LIMIT 1")
    # subject = cursor.fetchone()["subject"]
    # print("subject = ". subject  )
    # Step 2: Get random topic from that subject
    cursor.execute(f"SELECT DISTINCT category FROM {db_table} WHERE subject = %s ORDER BY RAND() LIMIT 1", (subject,))
    category = cursor.fetchone()["category"]
    return category

    # # Step 3: Get 6 random questions
    # cursor.execute("""
    #     SELECT question, correct_choice, distractor1, distractor2, distractor3, explanation
    #     FROM ancient_quiz 
    #     WHERE subject = %s AND category = %s
    #     ORDER BY RAND() 
    #     LIMIT 6
    # """, (subject, category))

    # questions = []
    # for row in cursor.fetchall():
    #     choices = [row["correct_choice"], row["distractor1"], row["distractor2"], row["distractor3"]]
    #     random.shuffle(choices)
    #     correct_hash = hashlib.sha256(row["correct_choice"].encode()).hexdigest()
    #     questions.append({
    #         "question": row["question"],
    #         "choices": choices,
    #         "answer_hash": correct_hash,
    #         "explanation": row["explanation"]
    #     })

    # cursor.close()
    # conn.close()
    
    # return jsonify({
    #     "subject": subject,
    #     "category": category,
    #     "topic": topic,
    #     "questions": questions
    # })

@app.route("/api/single_quiz_by_category/<subject>,<category>")
def single_quiz_by_category(subject, category):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Step 1: Get subject, category

    # Step 2: Get random topic from that category
    cursor.execute(f"SELECT DISTINCT topic FROM {db_table} WHERE subject = %s AND category = %s ORDER BY RAND() LIMIT 1", (subject, category))
    topic = cursor.fetchone()["topic"]

    # Step 3: Get 6 random questions
    cursor.execute(f"""
        SELECT id, question, correct_choice, distractor1, distractor2, distractor3, explanation
        FROM {db_table} 
        WHERE subject = %s AND category = %s AND topic = %s
        ORDER BY RAND() 
        LIMIT 6
    """, (subject, category, topic))

    questions = []
    for row in cursor.fetchall():
        question_id = row["id"]
        choices = [row["correct_choice"], row["distractor1"], row["distractor2"], row["distractor3"]]
        random.shuffle(choices)
        correct_hash = hashlib.sha256(row["correct_choice"].encode()).hexdigest()
        explanation = row["explanation"]
        questions.append({
            "question_id": question_id,
            "question": row["question"],
            "choices": choices,
            "answer_hash": correct_hash,
            "explanation": explanation
        })

    cursor.close()
    conn.close()
    
    return jsonify({
        "category": category,
        "topic": topic,
        "questions": questions
    })

@app.route("/api/quiz_by_category/<subject>, <category>")
def get_quiz_by_category(subject, category):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Get 4 random topics from category
    cursor.execute(f"""
        SELECT DISTINCT topic 
        FROM {db_table}
        WHERE subject = %s AND category = %s 
        ORDER BY RAND() 
        LIMIT 4
    """, (category,))
    topics = [row["topic"] for row in cursor.fetchall()]

    # For each topic, get 6 random questions
    results = {}
    for topic in topics:
        cursor.execute(f"""
            SELECT question, correct_choice, distractor1, distractor2, distractor3, explanation
            FROM {db_table}
            WHERE category = %s AND topic = %s 
            ORDER BY RAND() 
            LIMIT 6
        """, (category, topic))
        questions = []
        for row in cursor.fetchall():
            all_choices = [row["correct_choice"], row["distractor1"], row["distractor2"], row["distractor3"]]
            random.shuffle(all_choices)
            correct_hash = hash_answer(row["correct_choice"])
            # explanation_hash = hash_answer(row["explanation"])
            questions.append({
                "question": row["question"],
                "choices": all_choices,
                "answer_hash": correct_hash
                # "explanation_hash": "explanation_hash"
            })
        results[topic] = questions

    cursor.close()
    conn.close()
    return jsonify(results)

@app.route("/api/getHint/<question_id>")
def getHint(question_id):
    conn = get_db()
    cursor = conn.cursor()

    # Step 1: Get subject, category

    # Step 2: Get explanation from that subject, category, topic, question
    # cursor.execute("SELECT DISTINCT topic FROM ancient_quiz WHERE subject = %s AND category = %s ORDER BY RAND() LIMIT 1", (subject, category, topic, question))
    # explanation = cursor.fetchone()["explanation"]

    # # Step 3: Get 6 random questions
    cursor.execute(f"""
        SELECT explanation
        FROM {db_table} 
        WHERE id = %s
        """, (question_id,))
        
    result = cursor.fetchone()
    if result:
        explanation = result[0]
        print(explanation)
    else:
        explanation = "Nada, no habla Espagnol"
        print(explanation)
    # data = {"hint":"Dunno Mate!"}
    cursor.close()
    conn.close()

    return jsonify({"explanation": explanation})

# @app.route("/api/getHint/<subject>, <category>, <topic>, <question>")
# def getHint(subject, category, topic, question):
#     conn = get_db()
#     cursor = conn.cursor(dictionary=True)

#     # Step 1: Get subject, category

#     # Step 2: Get explanation from that subject, category, topic, question
#     # cursor.execute("SELECT DISTINCT topic FROM ancient_quiz WHERE subject = %s AND category = %s ORDER BY RAND() LIMIT 1", (subject, category, topic, question))
#     # explanation = cursor.fetchone()["explanation"]

#     # # Step 3: Get 6 random questions
#     cursor.execute("""
#         SELECT explanation
#         FROM ancient_quiz 
#         WHERE subject = %s AND category = %s AND topic = %s AND question = %s
#         """, (subject, category, topic, question))

#     explanation = cursor.fetchone()["explanation"]
#     # data = {"hint":"Dunno Mate!"}
#     cursor.close()
#     conn.close()

#     return jsonify({"explanation": explanation})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
