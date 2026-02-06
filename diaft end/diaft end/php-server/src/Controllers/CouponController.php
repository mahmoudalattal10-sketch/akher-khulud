<?php

namespace Diafat\Controllers;

use Diafat\Models\Coupon;

class CouponController extends BaseController {
    public function index($params = []) {
        $this->validateAdmin();
        $model = new Coupon();
        $coupons = $model->findAll();
        return $this->success(['coupons' => $coupons], 'Coupons retrieved successfully');
    }

    public function create($params = []) {
        $this->validateAdmin();
        $data = $this->getInput();
        $model = new Coupon();
        $id = $model->create($data);
        return $this->success(['id' => $id], 'Coupon created successfully', 201);
    }

    public function update($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $data = $this->getInput();
        $model = new Coupon();
        $model->update($id, $data);
        return $this->success([], 'Coupon updated successfully');
    }

    public function delete($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $model = new Coupon();
        $model->delete($id);
        return $this->success([], 'Coupon deleted successfully');
    }

    public function verify($params = []) {
        $data = $this->getInput();
        $code = trim($data['code'] ?? '');
        $hotelId = $data['hotelId'] ?? null;

        if (empty($code)) {
            return $this->error('كود الكوبون مطلوب', 400);
        }

        $model = new Coupon();
        $coupon = $model->findByCode($code);

        if (!$coupon) {
            return $this->error('كود الخصم غير صحيح أو منتهي الصلاحية', 404);
        }

        if (!$coupon['isActive']) {
            return $this->error('عذراً، هذا الكوبون غير نشط حالياً', 410);
        }

        if ($coupon['usedCount'] >= $coupon['limit']) {
            return $this->error('عذراً، لقد تم استنفاذ الحد الأقصى لهذا الكوبون', 410);
        }

        // Check Hotel Restriction
        if (!empty($coupon['hotelId']) && $coupon['hotelId'] !== $hotelId) {
            return $this->error('عذراً، هذا الكوبون غير صالح لهذا الفندق', 400);
        }

        return $this->success([
            'discount' => (int)$coupon['discount'],
            'code' => $coupon['code'],
            'hotelId' => $coupon['hotelId']
        ], 'تم تطبيق كود الخصم بنجاح!');
    }
}
