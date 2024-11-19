import os
from flask import Flask, render_template, request, jsonify
from boltiotai import openai
openai.api_key = os.getenv('OPENAI_API_KEY', 'OPENAI_API_KEY')

app = Flask(__name__, static_folder='static', template_folder='templates')
GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    course_title = data.get('courseTitle')
    messages = [{
        "role": "system",
        "content": "You Provide Complete syllabus,roadmap for any educational content"
    }]
    if any(greeting in course_title for greeting in GREETINGS):
        messages.append({
            "role": "user",
            "content": course_title
        })
        messages.append({
            "role": "assistant",
            "content": "Hello! How may I assist you today?"
        })
    else:
        messages.append({
            "role": "user",
            "content": f"""Generate educational content for a course titled '{course_title}'. Include objectives, syllabus, measurable outcomes, assessment methods, and recommended readings."""
        })
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    content = response['choices'][0]['message']['content']
    return jsonify({'content': content})

if __name__ == '__main__':
    app.run()
