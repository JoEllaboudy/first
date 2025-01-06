document.addEventListener('DOMContentLoaded', (event) => {
    const examList = document.getElementById('examList');
    const addExamButton = document.getElementById('addExamButton');
    const examModal = document.getElementById('examModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const saveExamButton = document.getElementById('saveExamButton');
    const examTitleInput = document.getElementById('examTitle');
    const modalTitle = document.getElementById('modalTitle');
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionButton = document.getElementById('addQuestionButton');
    let editIndex = null;
    let currentQuestions = [];

    // Load exams from localStorage
    const loadExams = () => {
        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        examList.innerHTML = '';
        exams.forEach((exam, index) => {
            const li = document.createElement('li');
            li.textContent = exam.title;
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('modern-button');
            editButton.addEventListener('click', () => editExam(index));
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('modern-button');
            deleteButton.addEventListener('click', () => deleteExam(index));
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            examList.appendChild(li);
        });
    };

    // Add new exam
    addExamButton.addEventListener('click', () => {
        editIndex = null;
        examTitleInput.value = '';
        currentQuestions = [];
        questionsContainer.innerHTML = '';
        modalTitle.textContent = 'Add New Exam';
        examModal.style.display = 'flex';
    });

    // Save exam
    saveExamButton.addEventListener('click', () => {
        const examTitle = examTitleInput.value.trim();
        if (examTitle && currentQuestions.length > 0) {
            const exams = JSON.parse(localStorage.getItem('exams')) || [];
            const exam = { title: examTitle, questions: currentQuestions };
            if (editIndex !== null) {
                exams[editIndex] = exam;
            } else {
                exams.push(exam);
            }
            localStorage.setItem('exams', JSON.stringify(exams));
            loadExams();
            examModal.style.display = 'none';
        } else {
            alert('Please enter an exam title and add at least one question.');
        }
    });

    // Edit exam
    const editExam = (index) => {
        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        const exam = exams[index];
        examTitleInput.value = exam.title;
        currentQuestions = exam.questions;
        questionsContainer.innerHTML = '';
        currentQuestions.forEach((question, qIndex) => {
            addQuestionToContainer(question, qIndex);
        });
        editIndex = index;
        modalTitle.textContent = 'Edit Exam';
        examModal.style.display = 'flex';
    };

    // Delete exam
    const deleteExam = (index) => {
        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        exams.splice(index, 1);
        localStorage.setItem('exams', JSON.stringify(exams));
        loadExams();
    };

    // Add question
    addQuestionButton.addEventListener('click', () => {
        const questionText = prompt('Enter the question:');
        if (questionText) {
            const answers = {};
            ['A', 'B', 'C', 'D'].forEach(letter => {
                const answer = prompt(`Enter answer ${letter}:`);
                if (answer) {
                    answers[letter.toLowerCase()] = answer;
                }
            });
            const correctAnswer = prompt('Enter the correct answer (A, B, C, or D):').toLowerCase();
            if (answers[correctAnswer]) {
                const question = { question: questionText, answers, correctAnswer };
                currentQuestions.push(question);
                addQuestionToContainer(question, currentQuestions.length - 1);
            } else {
                alert('Invalid correct answer.');
            }
        }
    });

    // Add question to container
    const addQuestionToContainer = (question, qIndex) => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question');
        questionContainer.innerHTML = `
            <h3>Question ${qIndex + 1}: ${question.question}</h3>
            <ul>
                ${Object.keys(question.answers).map(key => `<li>${key.toUpperCase()}: ${question.answers[key]}</li>`).join('')}
            </ul>
            <p>Correct Answer: ${question.correctAnswer.toUpperCase()}</p>
        `;
        questionsContainer.appendChild(questionContainer);
    };

    // Close modal
    closeModal.addEventListener('click', () => {
        examModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == examModal) {
            examModal.style.display = 'none';
        }
    });

    loadExams();
});