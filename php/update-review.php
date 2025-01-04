<?php
// Подключение к базе данных
$host = 'localhost';
$dbname = 'review';
$username = 'root';
$password = 'root';

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Получаем данные из формы
    $name = $_POST['name'] ?? '';
    $review = $_POST['review'] ?? '';
    $rating = $_POST['rating'] ?? 0;
    $files = $_POST['files'] ?? ''; // Загруженные файлы (если они есть)
    $review_id = $_POST['review_id'] ?? 0; // ID отзыва для обновления

    if ($review_id > 0 && !empty($name) && !empty($review)) {
        // Подготовим запрос для обновления отзыва
        $stmt = $pdo->prepare("UPDATE user_reviews SET name = :name, review = :review, rating = :rating WHERE id = :review_id");
        $stmt->execute([
            ':name' => $name,
            ':review' => $review,
            ':rating' => $rating,
            ':review_id' => $review_id
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Отзыв успешно обновлен']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка: все поля должны быть заполнены']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
