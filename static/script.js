document.addEventListener('DOMContentLoaded', function() {
    const courseTitleInput = document.getElementById('course-title');
    const submitButton = document.getElementById('submit-btn');
    const outputContainer = document.getElementById('output');

    submitButton.addEventListener('click', submitCourse);
    courseTitleInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitCourse();
        }
    });

    function submitCourse() {
        const courseTitle = courseTitleInput.value.trim();
        if (courseTitle === '') return;

        appendMessage('user', courseTitle);
        courseTitleInput.value = '';

        appendMessage('assistant', 'Generating educational content...');

        fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseTitle: courseTitle }),
        })
        .then(response => response.json())
        .then(data => {
            outputContainer.removeChild(outputContainer.lastChild);
            appendMessage('assistant', data.content);
        })
        .catch((error) => {
            console.error('Error:', error);
            outputContainer.removeChild(outputContainer.lastChild);
            appendMessage('assistant', 'Sorry, an error occurred. Please try again.');
        });
    }

    function appendMessage(sender, content) {
        const formattedContent = formatContent(content);

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const senderSpan = document.createElement('span');
        senderSpan.className = 'sender';
        senderSpan.textContent = sender === 'user' ? 'You: ' : 'AI Educational Assistant: ';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerHTML = formattedContent;

        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(contentDiv);
        outputContainer.appendChild(messageDiv);
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }
    function formatContent(content) {
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        content = content.replace(/(\d+\.)/g, '<br><strong>$1</strong>');

        return content;
    }
});
