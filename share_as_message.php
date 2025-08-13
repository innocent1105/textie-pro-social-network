<?php
include("./connection.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No JSON received"]);
    exit;
}

$userId = $data['user_id'] ?? null;
$post_id = $data['post_id'] ?? null;
$content = $data['content'] ?? "";
$selectedUsers = $data['selectedUsers'] ?? [];

if (empty($content)) {
    $content = "Attachment";
}

$response = [
    "user_id" => $userId,
    "post_id" => $post_id,
    "content" => $content,
    "selectedUsers" => $selectedUsers
];

// Debug output
echo json_encode($response);
