document.addEventListener('DOMContentLoaded', (event) => {
    const examList = document.getElementById('examList');
    const takeExamModal = document.getElementById('takeExamModal');
    const resultModal = document.getElementById('resultModal');
    const examTitleElement = document.getElementById('examTitle');
    const examForm = document.getElementById('examForm');
    const submitExamButton = document.getElementById('submitExamButton');
    const resultText = document.getElementById('resultText');
    const closeModalButtons = document.querySelectorAll('.close');
    let currentExam = null;

    // Load exams from localStorage
    const loadExams = () => {
        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        examList.innerHTML = '';
        exams.forEach((exam, index) => {
            const li = document.createElement('li');
            li.textContent = exam.title;
            const takeExamButton = document.createElement('button');
            takeExamButton.textContent = 'Take Exam';
            takeExamButton.classList.add('modern-button');
            takeExamButton.addEventListener('click', () => takeExam(index));
            li.appendChild(takeExamButton);
            examList.appendChild(li);
        });
    };

    // Take exam
    const takeExam = (index) => {
        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        currentExam = exams[index];
        examTitleElement.textContent = currentExam.title;
        examForm.innerHTML = '';
        currentExam.questions.forEach((question, qIndex) => {
            const questionContainer = document.createElement('div');
            questionContainer.classList.add('question');

            const questionTitle = document.createElement('h2');
            questionTitle.textContent = `Question ${qIndex + 1}: ${question.question}`;
            questionContainer.appendChild(questionTitle);

            const answersContainer = document.createElement('div');
            answersContainer.classList.add('answers');

            Object.keys(question.answers).forEach(key => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${qIndex + 1}`;
                input.value = key;
                input.id = `q${qIndex + 1}${key}`;

                const label = document.createElement('label');
                label.htmlFor = input.id;
                label.textContent = `${key.toUpperCase()}) ${question.answers[key]}`;

                answersContainer.appendChild(input);
                answersContainer.appendChild(label);
            });

            questionContainer.appendChild(answersContainer);
            examForm.appendChild(questionContainer);
        });
        takeExamModal.style.display = 'flex';
    };

    // Submit exam
    submitExamButton.addEventListener('click', () => {
        const formData = new FormData(examForm);
        let score = 0;
        const totalQuestions = currentExam.questions.length;

        currentExam.questions.forEach((question, qIndex) => {
            const answer = formData.get(`q${qIndex + 1}`);
            if (answer === question.correctAnswer) {
                score++;
            }
        });

        let percentage = (score / totalQuestions) * 100;
        resultText.textContent = `Exam: ${currentExam.title}\nYour score is: ${percentage}%`;
        takeExamModal.style.display = 'none';
        resultModal.style.display = 'flex';
    });

    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            takeExamModal.style.display = 'none';
            resultModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == takeExamModal) {
            takeExamModal.style.display = 'none';
        }
        if (event.target == resultModal) {
            resultModal.style.display = 'none';
        }
    });

    loadExams();
});
