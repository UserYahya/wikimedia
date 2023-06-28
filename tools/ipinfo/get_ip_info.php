<?php
$apiKey = "YOUR_API_KEY_HERE";
$ipAddress = $_GET['ip'];

$url = "https://ipinfo.io/{$ipAddress}?token={$apiKey}";

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl);
curl_close($curl);

header('Content-Type: application/json');
echo $response;
?>
