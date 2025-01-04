<?php
header('Content-Type: application/json');

try {
    // Подключение к базе данных
    $pdo = new PDO('mysql:host=localhost;dbname=review', 'root', 'root');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Получение данных из запроса
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['review_id'])) {
        $reviewId = $input['review_id'];

        // Удаляем отзыв из базы данных
        $stmt = $pdo->prepare('DELETE FROM user_reviews WHERE id = :id');
        $stmt->bindParam(':id', $reviewId, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Не удалось удалить отзыв.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'ID отзыва не указан.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}