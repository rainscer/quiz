document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal  = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionsTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextBtn = document.querySelector('#next');
    const prevBtn = document.querySelector('#prev');
    const sendBtn = document.querySelector('#send');

    const getData = () => {
        formAnswers.textContent = 'Loading...';
        
        setTimeout(()=> {
            fetch(`./questions.json`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    playTest(data.questions);
                })
                .catch(err => {
                    formAnswers.textContent = "Ошибка загрузки данных"
                    console.error(err)
                })
        },1000)        
    }

    const finalAnswers = [];
    
    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block')
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block')
    })

    const playTest = (questions) => {
                
        let numberQuestion = 0;

        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');

                answerItem.classList.add('answers-item', 'd-flex', 'flex-column');
                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                    </label>
                `
    
                formAnswers.appendChild(answerItem)
            })
        }

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
            
            if (numberQuestion>=0 && numberQuestion <= questions.length -1 ) {
                questionsTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                nextBtn.classList.remove('d-none');
                prevBtn.classList.remove('d-none');
                sendBtn.classList.add('d-none');
            } 
            
            if (numberQuestion == 0) {
                prevBtn.classList.add('d-none');
            }

            if (numberQuestion == questions.length) {
                nextBtn.classList.add('d-none');
                prevBtn.classList.add('d-none');
                sendBtn.classList.remove('d-none');
                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Enter your number</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
            }

            if (numberQuestion == questions.length + 1) {
                sendBtn.classList.add('d-none');
                formAnswers.textContent = `Спасибо за пройденный тест!`
                setTimeout(() => {
                    modalBlock.classList.remove('d-block')
                }, 2000);
            }
        }
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};

            const inputs = [...formAnswers.elements]
                .filter(elem => elem.checked || elem.id == 'numberPhone')

            inputs.forEach((elem, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = elem.value;
                }
                if (numberQuestion == questions.length) {
                    obj[`Номер телефона`] = elem.value;
                }
            })
            finalAnswers.push(obj)
        }

        nextBtn.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }
        
        prevBtn.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }
        
        sendBtn.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            console.log(finalAnswers);
        }
    }    
})

