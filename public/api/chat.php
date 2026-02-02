<?php
// public/api/chat.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the API Key from environment or hardcode it
// For IITD server, hardcoding is generally fine as the source is not public
$apiKey = "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"; 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => ['message' => 'Method not allowed']]);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => ['message' => 'Invalid JSON input']]);
    exit;
}

$messages = $input['messages'] ?? [];
$systemInstruction = $input['systemInstruction'] ?? '';

$postData = [
    'model' => 'nvidia/nemotron-3-nano-30b-a3b',
    'messages' => array_merge(
        [['role' => 'system', 'content' => $systemInstruction]],
        $messages
    ),
    'temperature' => 0.7,
    'top_p' => 1,
    'max_tokens' => 1024
];

$ch = curl_init('https://integrate.api.nvidia.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => ['message' => 'Connection to Nvidia API failed: ' . curl_error($ch)]]);
} else {
    http_response_code($httpCode);
    echo $response;
}
curl_close($ch);
?>
