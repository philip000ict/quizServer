from flask import Flask, jsonify
import mysql.connector
import os
from dotenv import load_dotenv
from flask import send_from_directory

load_dotenv()
app = Flask(__name__)

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route('/api/quiz_data')
def quiz_data():
    conn = mysql.connector.connect(    
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT subject, category, topic
        FROM history_quiz
        ORDER BY subject;
    """)
    # cursor.execute("""
    #     SELECT subject, category, topic, question, correct_choice,
    #            distractor1, distractor2, distractor3, explanation
    #     FROM quiz_questions
    # """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    grouped = {}
    for r in rows:
        subj = r["subject"]
        cat = r["category"]
        topic = r["topic"]
        grouped.setdefault(subj, {}).setdefault(cat, {}).setdefault(topic, [])
        # grouped.setdefault(subj, {}).setdefault(cat, {}).setdefault(topic, []).append({
        #     "question": r["question"],
        #     "correct_choice": r["correct_choice"],
        #     "choices": [
        #         r["distractor1"],
        #         r["distractor2"],
        #         r["distractor3"],
        #         r["correct_choice"]
        #     ],
        #     "explanation": r["explanation"]
        # })
    return jsonify(grouped)
    # for r in rows:
    #     subj = r["subject"]
    #     cat = r["category"]
    #     topic = r["topic"]
    #     grouped.setdefault(subj, {}).setdefault(cat, {}).setdefault(topic, []).append({
    #         "question": r["question"],
    #         "correct_choice": r["correct_choice"],
    #         "choices": [
    #             r["distractor1"],
    #             r["distractor2"],
    #             r["distractor3"],
    #             r["correct_choice"]
    #         ],
    #         "explanation": r["explanation"]
    #     })
    # return jsonify(grouped)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
