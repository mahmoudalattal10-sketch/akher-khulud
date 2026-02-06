<?php

namespace Diafat\Controllers;

use Diafat\Models\ContactMessage;
use Diafat\Models\Notification;

class ContactController extends BaseController {
    
    public function submit($params = []) {
        $data = $this->getInput();
        
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            return $this->error('جميع الحقول مطلوبة', 400);
        }

        $model = new ContactMessage();
        $success = $model->create($data);

        if ($success) {
            // Create a notification for the admin
            $notif = new Notification();
            $notif->create(
                'CONTACT',
                'رسالة جديدة من ' . $data['name'],
                mb_substr($data['message'], 0, 100) . '...',
                ['email' => $data['email']]
            );
            
            return $this->success([], 'تم إرسال رسالتك بنجاح');
        }

        return $this->error('فشل إرسال الرسالة، يرجى المحاولة لاحقاً', 500);
    }

    public function index($params = []) {
        $this->validateAdmin();
        $model = new ContactMessage();
        $messages = $model->findAll();
        return $this->success(['messages' => $messages]);
    }

    public function markRead($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $model = new ContactMessage();
        $model->markAsRead($id);
        return $this->success([], 'تم تحديد الرسالة كمقروءة');
    }

    public function delete($params) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $model = new ContactMessage();
        $model->delete($id);
        return $this->success([], 'تم حذف الرسالة');
    }

    public function unreadCount($params = []) {
        $this->validateAdmin();
        $model = new ContactMessage();
        $count = $model->getUnreadCount();
        return $this->success(['count' => $count]);
    }
}
