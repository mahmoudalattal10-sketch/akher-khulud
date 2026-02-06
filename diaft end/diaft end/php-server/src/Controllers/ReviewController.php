<?php

namespace Diafat\Controllers;

use Diafat\Models\Review;

class ReviewController extends BaseController {
    public function index($params = []) {
        // Since router might pass hotelId differently depending on route
        // We will assume query param or body or just specific route handling
        // But mapped route is /api/hotels/{id}/reviews usually
        
        // However, our router is simple. Let's look at how we'll call it.
        // If we map /api/hotels/{id}/reviews, params['id'] will be set by Router regex.
        $hotelId = $params['id'] ?? $_GET['hotelId'] ?? null;

        if (!$hotelId) {
            return $this->jsonResponse(['error' => 'Hotel ID required'], 400);
        }

        $reviewModel = new Review();
        $reviews = $reviewModel->findByHotel($hotelId);
        return $this->jsonResponse($reviews);
    }

    public function create($params = []) {
        $user = $this->authenticate();
        if (!$user) {
            return $this->jsonResponse(['error' => 'Authentication required to post a review'], 401);
        }

        $data = $this->getInput();

        if (empty($data['hotelId']) || empty($data['rating']) || empty($data['text'])) {
            return $this->jsonResponse(['error' => 'Missing fields'], 400);
        }

        // Use the authenticated user's name (fetching from sub/decoded if needed)
        // For now, sub is ID, let's assume we want to fetch the user model to be sure of the name
        $userModel = new \Diafat\Models\User();
        $userData = $userModel->findById($user->sub);
        
        if (!$userData) {
            return $this->jsonResponse(['error' => 'User not found'], 404);
        }

        $data['userName'] = $userData['name'];

        $reviewModel = new Review();
        try {
            $review = $reviewModel->create($data);
            return $this->jsonResponse($review, 201);
        } catch (\Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function delete($params) {
        $this->validateAdmin();
        $id = $params['id'];
        $reviewModel = new Review();
        $reviewModel->delete($id);
        return $this->jsonResponse(['message' => 'Review deleted']);
    }
}
