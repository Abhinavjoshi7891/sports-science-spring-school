<?php
// public/api/contact.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$name = strip_tags($input['name'] ?? '');
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = strip_tags($input['subject'] ?? 'Inquiry from Spring School Website');
$message = strip_tags($input['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

$to = "sports_iitd_exeter@admin.iitd.ac.in";
$email_subject = "New Contact Form Submission: $subject";
$email_body = "You have received a new message from the Spring School website.\n\n" .
    "Details:\n" .
    "Name: $name\n" .
    "Email: $email\n\n" .
    "Message:\n$message";

$headers = "From: webmaster@iitd.ac.in\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}
?>