<?php
// Подключение к базе данных
$servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "review";

// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка подключения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Запрос для получения всех отзывов
$sql = "SELECT rating FROM user_reviews"; 
$result = $conn->query($sql);

// Переменные для подсчета
$totalReviews = 0;
$totalRating = 0;

// Подсчитываем количество отзывов и суммарную оценку
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $totalReviews++;
        $totalRating += $row['rating'];
    }
} else {
    $totalReviews = 0;
    $totalRating = 0;
}

// Вычисляем среднюю оценку
$averageRating = $totalReviews > 0 ? round($totalRating / $totalReviews, 1) : 0;


// Закрытие соединения
$conn->close();

// Вывод данных
echo json_encode([
    'totalReviews' => $totalReviews,
    'averageRating' => $averageRating
]);
?>
