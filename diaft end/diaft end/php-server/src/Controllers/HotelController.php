<?php

namespace Diafat\Controllers;

use Diafat\Models\Hotel;

class HotelController extends BaseController {
    public function index($params = []) {
        $filters = [];
        if (isset($_GET['city'])) $filters['city'] = $_GET['city'];
        if (isset($_GET['featured'])) $filters['featured'] = true;
        if (isset($_GET['offer'])) $filters['offer'] = true;
        if (isset($_GET['adminView']) && $_GET['adminView'] === 'true') $filters['adminView'] = true;
        if (isset($_GET['checkIn'])) $filters['checkIn'] = $_GET['checkIn'];
        if (isset($_GET['checkOut'])) $filters['checkOut'] = $_GET['checkOut'];
        if (isset($_GET['guests'])) $filters['guests'] = (int)$_GET['guests'];

        $hotelModel = new Hotel();
        $hotels = $hotelModel->findAll($filters);

        return $this->success($hotels, 'Hotels retrieved successfully');
    }

    public function featured($params = []) {
        $hotelModel = new Hotel();
        $hotels = $hotelModel->findAll(['featured' => true]);
        return $this->success($hotels, 'Featured hotels retrieved');
    }

    public function show($params) {
        $slug = $params['slug'] ?? null;
        if (!$slug) {
            return $this->error('Hotel slug required', 400);
        }

        $filters = [];
        if (isset($_GET['checkIn'])) $filters['checkIn'] = $_GET['checkIn'];
        if (isset($_GET['checkOut'])) $filters['checkOut'] = $_GET['checkOut'];
        if (isset($_GET['guests'])) $filters['guests'] = (int)$_GET['guests'];

        $hotelModel = new Hotel();
        $hotel = $hotelModel->findBySlug($slug, $filters);

        if (!$hotel) {
            return $this->error('Hotel not found', 404);
        }

        return $this->success($hotel, 'Hotel details retrieved');
    }

    public function showById($params) {
        $id = $params['id'] ?? null;
        if (!$id) {
            return $this->error('Hotel ID required', 400);
        }

        $filters = [];
        if (isset($_GET['checkIn'])) $filters['checkIn'] = $_GET['checkIn'];
        if (isset($_GET['checkOut'])) $filters['checkOut'] = $_GET['checkOut'];
        if (isset($_GET['guests'])) $filters['guests'] = (int)$_GET['guests'];

        $hotelModel = new Hotel();
        $hotel = $hotelModel->findById($id, $filters);

        if (!$hotel) {
            return $this->error('Hotel not found', 404);
        }

        return $this->success($hotel, 'Hotel details retrieved');
    }

    public function create($params = []) {
        $this->validateAdmin();
        $data = $this->getInput();
        $hotelModel = new Hotel();
        $id = $hotelModel->create($data);
        return $this->success(['id' => $id], 'Hotel created successfully', 201);
    }

    public function update($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $data = $this->getInput();
        $hotelModel = new Hotel();
        $hotelModel->update($id, $data);
        return $this->success([], 'Hotel updated successfully');
    }

    public function delete($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $hotelModel = new Hotel();
        $hotelModel->delete($id);
        return $this->success([], 'Hotel deleted successfully');
    }

    public function getByIds($params = []) {
        $idsStr = $_GET['ids'] ?? '';
        if (empty($idsStr)) {
            return $this->success([], 'No IDs provided');
        }
        $ids = explode(',', $idsStr);
        $hotelModel = new Hotel();
        $hotels = $hotelModel->findByIds($ids);
        return $this->success($hotels, 'Hotels retrieved successfully');
    }

    public function toggleVisibility($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $hotelModel = new Hotel();
        $hotelModel->toggleField($id, 'isVisible');
        return $this->success([], 'Visibility toggled successfully');
    }

    public function toggleFeatured($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $hotelModel = new Hotel();
        $hotelModel->toggleField($id, 'isFeatured');
        return $this->success([], 'Featured toggled successfully');
    }

    public function createRoom($params) {
        $this->validateAdmin();
        $hotelId = $params['hotelId'] ?? null;
        if (!$hotelId) return $this->error('Hotel ID required', 400);

        $data = $this->getInput();
        $data['hotelId'] = $hotelId;
        $hotelModel = new Hotel();
        $id = $hotelModel->createRoom($data);
        return $this->success(['id' => $id], 'Room created successfully', 201);
    }

    public function updateRoom($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $data = $this->getInput();
        $hotelModel = new Hotel();
        $hotelModel->updateRoom($id, $data);
        return $this->success([], 'Room updated successfully');
    }

    public function deleteRoom($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $hotelModel = new Hotel();
        $hotelModel->deleteRoom($id);
        return $this->success([], 'Room deleted successfully');
    }

    public function destinations($params = []) {
        $hotelModel = new Hotel();
        $cities = $hotelModel->getCities();
        return $this->success(['destinations' => $cities], 'Destinations retrieved');
    }
}
