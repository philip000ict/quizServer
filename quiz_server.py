from flask import Flask, render_template, jsonify, request
from werkzeug.middleware.proxy_fix import ProxyFix
import mysql.connector
import os, random, hashlib
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, template_folder='templates')

app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_proto=1,
    x_host=1,
    x_prefix=1,
)

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
def get_subject_tree():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            s.id AS subject_id,
            s.name AS subject_name,
            c.id AS category_id,
            c.name AS category_name
        FROM subjects s
        LEFT JOIN categories c ON c.subject_id = s.id
        ORDER BY s.id, c.id
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    tree = {}

    for row in rows:
        sid = row["subject_id"]
        cid = row["category_id"]

        if sid not in tree:
            tree[sid] = {
                "id": sid,
                "name": row["subject_name"],
                "categories": []
            }

        if cid:
            tree[sid]["categories"].append({
                "id": cid,
                "name": row["category_name"]
            })

    return jsonify(list(tree.values()))

@app.route("/api/subjects_topics")
def get_subject_tree_topics():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            s.id AS subject_id,
            s.name AS subject_name,
            c.id AS category_id,
            c.name AS category_name,
            t.id AS topic_id,
            t.name AS topic_name
        FROM subjects s
        LEFT JOIN categories c ON c.subject_id = s.id
        LEFT JOIN topics t ON t.category_id = c.id
        ORDER BY s.id, c.id, t.id
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    tree = {}
    
    for row in rows:
        sid = row["subject_id"]
        cid = row["category_id"]
        tid = row["topic_id"]

        # SUBJECT
        if sid not in tree:
            tree[sid] = {
                "id": sid,
                "name": row["subject_name"],
                "categories": {}
            }

        # CATEGORY
        if cid and cid not in tree[sid]["categories"]:
            tree[sid]["categories"][cid] = {
                "id": cid,
                "name": row["category_name"],
                "topics": []
            }

        # TOPIC
        if tid:
            tree[sid]["categories"][cid]["topics"].append({
                "id": tid,
                "name": row["topic_name"]
            })

    # Convert nested dicts to arrays
    result = []
    for subject in tree.values():
        subject["categories"] = list(subject["categories"].values())
        result.append(subject)

    return jsonify(result)

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
    # Step 2: Get random topic from that subject
    cursor.execute(f"SELECT DISTINCT category FROM {db_table} WHERE subject = %s ORDER BY RAND() LIMIT 1", (subject,))
    category = cursor.fetchone()["category"]
    return category

@app.route("/api/single_quiz_by_category/<int:category_id>")
def single_quiz_by_category(category_id):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Step 1 — Get random topic in category
    cursor.execute("""
        SELECT id, name
        FROM topics
        WHERE category_id = %s
        ORDER BY RAND()
        LIMIT 1
    """, (category_id,))

    topic_row = cursor.fetchone()

    if not topic_row:
        return jsonify({"error": "No topics found"}), 404

    topic_id = topic_row["id"]
    topic_name = topic_row["name"]

    # Step 2 — Get 6 random questions
    cursor.execute("""
        SELECT id, question, correct_choice,
               distractor1, distractor2, distractor3, explanation
        FROM questions
        WHERE topic_id = %s
        ORDER BY RAND()
        LIMIT 6
    """, (topic_id,))

    questions = []

    for row in cursor.fetchall():
        choices = [
            row["correct_choice"],
            row["distractor1"],
            row["distractor2"],
            row["distractor3"]
        ]

        random.shuffle(choices)

        correct_hash = hashlib.sha256(
            row["correct_choice"].encode()
        ).hexdigest()

        questions.append({
            "question_id": row["id"],
            "question": row["question"],
            "choices": choices,
            "answer_hash": correct_hash,
            "explanation": row["explanation"]
        })

    cursor.close()
    conn.close()

    return jsonify({
        "category_id": category_id,
        "topic_id": topic_id,
        "topic": topic_name,
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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
