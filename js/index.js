document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openButton = document.getElementById('openModal');
    const closeButton = document.getElementById('closeModal');

    // Открытие модального окна
    openButton.addEventListener('click', () => {
        document.body.style.overflow = 'hidden';
        modal.style.opacity = '1'; 
        modal.style.pointerEvents = 'all'; 
        modal.classList.remove('hide'); 
        modal.classList.add('show'); 
    });

    // Закрытие модального окна
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show'); 
        modal.classList.add('hide'); // Добавляем класс "hide" для анимации закрытия

        // Скрываем модальное окно после завершения анимации
        setTimeout(() => {
            modal.style.opacity = '0'; // Скрываем окно
            modal.style.pointerEvents = 'none'; // Отключаем взаимодействие
            modal.classList.remove('hide'); // Убираем "hide", чтобы сбросить состояние
            document.body.style.overflow = 'auto';
        }, 300); 
    });
    
});
document.addEventListener('DOMContentLoaded', () => {
    function getReviewsData() {
        fetch('../php/get-raitng.php') // Путь к PHP скрипту
            .then(response => response.json())
            .then(data => {
                // Обновляем количество отзывов
                document.getElementById('reviews-count').textContent = data.totalReviews;
    
                // Обновляем среднюю оценку
                const averageRating = data.averageRating;
                document.getElementById('average-rating').textContent = averageRating.toFixed(1).replace('.', ',');
    
                // Обновляем звезды
                updateStars(Math.round(averageRating)); // Обновляем звезды в соответствии с округленным рейтингом
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }
    
    // Функция для обновления звезд
    function updateStars(rating) {
        const stars = document.querySelectorAll('#stars-container svg');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.fill = '#FFCC00'; // Жёлтый для оценённых
            } else {
                star.style.fill = '#D3D3D3'; // Серый для неоценённых
            }
        });
    }
    
window.onload = getReviewsData;
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-review');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-review-id'); // Получаем ID отзыва

            if (!reviewId) {
                alert('ID отзыва не найден. Проверьте кнопку.');
                return;
            }

            if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
                // Отправляем запрос на сервер для удаления
                fetch('../php/delete-review.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ review_id: reviewId }), // Отправляем ID отзыва
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Ответ от сервера:', data); // Логируем ответ для отладки
                        if (data.status === 'success') {
                            alert('Отзыв успешно удален!');
                            // Удаляем отзыв из DOM
                            button.closest('.review').remove();
                        } else {
                            alert('Ошибка при удалении отзыва: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка:', error); // Печатаем ошибку в консоль
                        alert('Ошибка при отправке запроса на удаление.');
                    });
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalButtons = document.querySelectorAll('.edit-review');
    const closeButton = document.getElementById('closeModal');
    const nameInput = document.getElementById('nameInput');
    const ratingInput = document.getElementById('ratingInput');
    const reviewInput = document.getElementById('review');
    const uploadedPhotosContainer = document.querySelector('.uploaded-photos');
    const updateButton = document.getElementById('update'); // Кнопка для обновления


    // Открытие модального окна
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
            modal.style.opacity = '1'; // Восстанавливаем видимость
            modal.style.pointerEvents = 'all'; // Включаем взаимодействие
            modal.classList.remove('hide'); // Убираем класс "hide", если есть
            modal.classList.add('show'); // Добавляем класс "show" для появления

            // Извлекаем данные из кнопки редактирования
            const reviewId = button.getAttribute('data-id'); // ID отзыва
            const name = button.getAttribute('data-name');
            const rating = button.getAttribute('data-rating');
            const review = button.getAttribute('data-review');
            const files = button.getAttribute('data-files'); // Получаем файлы

            // Заполняем поля в модальном окне
            nameInput.value = name;
            ratingInput.value = rating;
            reviewInput.value = review;

            // Запоминаем ID отзыва для дальнейшего обновления
            updateButton.setAttribute('data-id', reviewId);

            // Обновляем звезды на основе рейтинга
            setStars(rating);

            // Обновляем фотографии
            updatePhotos(files);
        });
    });

    // Функция для установки звездного рейтинга
    function setStars(rating) {
        const stars = document.querySelectorAll('.stars-grade svg');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled'); // Убираем заполнение у остальных
            }
        });
    }

    // Функция для обновления фотографий
    function updatePhotos(files) {
        // Очищаем контейнер перед добавлением новых фотографий
        uploadedPhotosContainer.innerHTML = '';

        if (files) {
            // Преобразуем строку с файлами в массив
            const fileArray = files.split(',');

            // Генерируем HTML для каждого файла
            fileArray.forEach(file => {
                const imagePath = `../php/uploads/${file.trim()}`;
                const imgElement = document.createElement('div');
                imgElement.className = 'img-review';
                imgElement.innerHTML = `
                    <img src="${imagePath}" alt="Загруженное изображение">
                    <button class="delete-photo" title="Удалить файл" data-file="${file.trim()}">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="21" height="21">
                            <path d="M23.707.293a1,1,0,0,0-1.414,0L12,10.586,1.707.293A1,1,0,0,0,.293,1.707L10.586,12,.293,22.293a1,1,0,1,0,1.414,1.414L12,13.414,22.293,23.707a1,1,0,0,0,1.414-1.414L13.414,12,23.707,1.707A1,1,0,0,0,23.707.293Z"/>
                        </svg>
                    </button>
                `;
                uploadedPhotosContainer.appendChild(imgElement);
            });
        }
    }

    updateButton.addEventListener('click', (event) => {
        event.preventDefault(); // Отменяем стандартное поведение кнопки

        // Собираем данные из формы
        const reviewId = updateButton.getAttribute('data-id');
        const name = nameInput.value.trim();
        const rating = ratingInput.value.trim();
        const review = reviewInput.value.trim();

        // Отправляем данные на сервер для обновления отзыва
        fetch('../php/update-review.php', {
            method: 'POST',
            body: new URLSearchParams({
                'name': name,
                'rating': rating,
                'review': review,
                'review_id': reviewId // ID отзыва для обновления
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Отзыв успешно обновлен');
                window.location.reload(); // Перезагружаем страницу или можно обновить только нужный блок
            } else {
                alert('Ошибка: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при обновлении отзыва');
        });
    });
    // Закрытие модального окна
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show'); // Убираем класс "show"
        modal.classList.add('hide'); // Добавляем класс "hide" для анимации закрытия

        // Скрываем модальное окно после завершения анимации
        setTimeout(() => {
            modal.style.opacity = '0'; // Скрываем окно
            modal.style.pointerEvents = 'none'; // Отключаем взаимодействие
            modal.classList.remove('hide'); // Убираем "hide", чтобы сбросить состояние
            document.body.style.overflow = 'auto';
        }, 300);// Длительность совпадает с transition: 0.3s
    });
});


    


document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.stars-grade svg');
    const ratingInput = document.getElementById('ratingInput'); // Скрытое поле для рейтинга

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Сбрасываем заполнение у всех звёзд
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('filled'); // Заполняем звёзды до текущей
                } else {
                    s.classList.remove('filled'); // Убираем заполнение у остальных
                }
            });

            // Устанавливаем значение рейтинга в скрытое поле
            ratingInput.value = index + 1;
        });
    });
})

document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.stars-grade svg');
    const nameInput = document.getElementById('nameInput');
    const reviewInput = document.getElementById('review');
    const submitButton = document.getElementById('submit');
    const form = document.getElementById('reviewForm'); // Предположим, что форма имеет id="reviewForm"
    const hintReviews = document.querySelector('.hintReviews');
    const modal = document.getElementById('modal');

    const starsError = document.getElementById('starsError');
    const nameError = document.getElementById('nameError');
    const reviewError = document.getElementById('reviewError');

    let selectedStars = 0;

    // Обработка выбора звёзд
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedStars = index + 1; // Сохраняем количество выбранных звёзд
            stars.forEach((s, i) => {
                if (i < selectedStars) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
            starsError.textContent = ''; // Убираем текст ошибки, если звёзды выбраны
        });
    });

    // Убираем текст ошибки при вводе текста
    function handleInputValidation(input, errorElement) {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                errorElement.textContent = ''; // Сбрасываем текст ошибки
                input.classList.remove('error');
            }
        });
    }

    // Добавляем обработчики ввода для полей
    handleInputValidation(nameInput, nameError);
    handleInputValidation(reviewInput, reviewError);

    // Валидация при отправке формы
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Предотвращаем отправку формы

        let isValid = true;

        // Проверка звёзд
        if (selectedStars === 0) {
            starsError.textContent = 'Проставьте оценку';
            isValid = false;
        } else {
            starsError.textContent = '';
        }

        // Проверка имени
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Заполните имя';
            nameInput.classList.add('error');
            isValid = false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('error');
        }

        // Проверка отзыва
        if (reviewInput.value.trim() === '') {
            reviewError.textContent = 'Заполните отзыв';
            reviewInput.classList.add('error');
            isValid = false;
        } else {
            reviewError.textContent = '';
            reviewInput.classList.remove('error');
        }

        if (isValid) {
            const formData = new FormData(form); // Собираем данные формы
        
            fetch('../php/submit-review.php', { // Укажите корректный путь к вашему PHP-файлу
                method: 'POST', 
                body: formData
            })
            .then(response => {
                if (response.ok) { // Если статус HTTP-ответа успешный
                    return response.json(); // Парсим JSON-ответ
                } else {
                    throw new Error(`Ошибка при отправке данных: ${response.status}`); // Генерируем ошибку с кодом
                }
            })
            .then(data => {
                // Проверяем успешность ответа
                
                    console.log('Данные успешно отправлены:', data);
        
                    // Очистка формы
                    form.reset();
                    selectedStars = 0;
                    stars.forEach((s) => s.classList.remove('filled'));
        
                    // Закрытие модального окна
                    modal.classList.remove('show');
                    modal.classList.add('hide');
                    setTimeout(() => {
                        modal.style.opacity = '0';
                        modal.style.pointerEvents = 'none';
                        modal.classList.remove('hide');
                        document.body.style.overflow = 'auto';
                    }, 300);
        
                    // Показ уведомления
                    hintReviews.style.display = 'flex';
                    setTimeout(() => {
                        hintReviews.style.display = 'none';
                        form.style.display = 'block';
                    }, 4000);
                
            })
            .catch(error => {
                console.error('Ошибка:', error); // Логируем ошибку
                alert('Не удалось отправить данные. Попробуйте позже.');
            });
        }
    });
});


document.getElementById('file').addEventListener('change', function(event) {
    const files = event.target.files; // Получаем список файлов
    const maxFiles = 2; // Максимальное количество файлов
    const errorElement = document.getElementById('file-error');

    // Если количество файлов больше максимума, показываем ошибку
    if (files.length > maxFiles) {
        errorElement.textContent = `Вы можете выбрать не более ${maxFiles} файлов.`;
        event.target.value = ''; // Очистить выбранные файлы
    } else {
        errorElement.textContent = ''; // Убираем сообщение об ошибке
    }
});



// Загружаем данные при загрузке страницы





