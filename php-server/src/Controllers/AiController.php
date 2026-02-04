<?php

namespace Diafat\Controllers;

class AiController extends BaseController {
    
    public function parseSearch($params = []) {
        $data = $this->getInput();
        $query = $data['query'] ?? '';

        if (empty($query)) {
            return $this->error('Query required', 400);
        }

        $apiKey = $_ENV['GEMINI_API_KEY'] ?? '';
        if (!$apiKey) {
            $this->logError("AI Configuration Missing");
            return $this->error('AI Service is currently unavailable', 503);
        }

        $systemInstruction = "You are a hotel booking assistant. Parse this query into JSON: {destination, checkIn, checkOut, adults, children, rooms}. Query: ";
        
        $payload = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $systemInstruction . $query]
                    ]
                ]
            ]
        ];

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" . $apiKey;

        try {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                throw new \Exception(curl_error($ch));
            }
            curl_close($ch);

            $result = json_decode($response, true);
            
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            
            $text = str_replace(['```json', '```'], '', $text);
            $json = json_decode($text, true);

            return $this->success($json, 'AI search parsing complete');
        } catch (\Exception $e) {
            $this->logError("AI Parsing Failed", ['error' => $e->getMessage()]);
            return $this->error('AI failed to process the request', 500);
        }
    }

    public function generateWelcome($params = []) {
        $data = $this->getInput();
        $guestName = $data['guestName'] ?? 'Our Valued Guest';
        $hotelName = $data['hotelName'] ?? 'our hotel';
        $roomType = $data['roomType'] ?? 'room';

        $apiKey = $_ENV['GEMINI_API_KEY'] ?? '';
        if (!$apiKey) {
            return $this->error('AI Service is currently unavailable', 503);
        }

        $prompt = "Generate a warm, professional, and personalized welcome message for a hotel guest named {$guestName} staying at {$hotelName} in a {$roomType}. Keep it concise (max 2 sentences). Make it feel extremely luxurious and welcoming. Language: English.";
        
        $payload = [
            "contents" => [["parts" => [["text" => $prompt]]]]
        ];

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

        try {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

            $response = curl_exec($ch);
            curl_close($ch);

            $result = json_decode($response, true);
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? "Welcome to {$hotelName}. We are delighted to host you.";

            return $this->success(['message' => trim($text)], 'Welcome message generated');
        } catch (\Exception $e) {
            return $this->error('AI failed to process the request', 500);
        }
    }

    public function translate($params = []) {
        $data = $this->getInput();
        $input = $data['text'] ?? '';
        
        if (empty($input)) {
            return $this->error('Text required', 400);
        }

        // Translation logic disabled by user request.
        // Returning original text as is.
        return $this->success(['translated' => $input]);
    }
}
