from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from tests.helpers import create_custom_user, create_worker
from notifications.models import Notification


def create_notification(user, title='Test Notification', message='Test message',
                        notification_type=1, is_read=False, is_active=True):
    return Notification.objects.create(
        user=user, title=title, message=message,
        notification_type=notification_type,
        is_read=is_read, is_active=is_active
    )


class NotificationModelTests(TestCase):

    def setUp(self):
        self.user = create_custom_user('1234567', 'Test', 'test@t.com', '1234567')

    def test_create(self):
        n = create_notification(self.user)
        self.assertEqual(n.title, 'Test Notification')
        self.assertFalse(n.is_read)
        self.assertTrue(n.is_active)

    def test_str(self):
        n = create_notification(self.user, title='My Alert')
        self.assertEqual(str(n), 'My Alert')

    def test_cascade_delete_from_user(self):
        create_notification(self.user)
        self.user.delete()
        self.assertEqual(Notification.objects.count(), 0)


class NotificationAPITests(TestCase):

    def setUp(self):
        self.client_api = APIClient()
        # Admin user for write operations
        self.admin_user = create_custom_user('1111111', 'Admin', 'admin@t.com', '1111111')
        self.admin_worker = create_worker(self.admin_user, user_type=1)
        self.admin_token = Token.objects.create(user=self.admin_user)
        # Manager user for read operations
        self.manager_user = create_custom_user('2222222', 'Manager', 'mgr@t.com', '2222222')
        self.manager_worker = create_worker(self.manager_user, user_type=2)
        self.manager_token = Token.objects.create(user=self.manager_user)
        # Operator user for wrong-role tests
        self.operator_user = create_custom_user('4444444', 'Operator', 'op@t.com', '4444444')
        self.operator_worker = create_worker(self.operator_user, user_type=3)
        self.operator_token = Token.objects.create(user=self.operator_user)
        # Target user for notifications
        self.target_user = create_custom_user('3333333', 'Target', 'target@t.com', '3333333')
        self.notif = create_notification(self.target_user)

    def test_list_as_manager_returns_200(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        resp = self.client_api.get('/api/notifications/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)

    def test_list_unauthenticated_returns_401(self):
        resp = self.client_api.get('/api/notifications/')
        self.assertEqual(resp.status_code, 401)

    def test_detail_as_manager_returns_200(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        resp = self.client_api.get(f'/api/notifications/{self.notif.pk}/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['title'], 'Test Notification')

    def test_create_as_admin_returns_201(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        resp = self.client_api.post('/api/notifications/create/', {
            'user': self.target_user.pk,
            'title': 'New Alert',
            'message': 'Something happened',
            'notification_type': 2,
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_create_as_manager_returns_403(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        resp = self.client_api.post('/api/notifications/create/', {
            'user': self.target_user.pk,
            'title': 'New Alert',
            'message': 'Something happened',
            'notification_type': 1,
        }, format='json')
        self.assertEqual(resp.status_code, 403)

    def test_update_as_admin_returns_200(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        resp = self.client_api.put(f'/api/notifications/update/{self.notif.pk}/', {
            'title': 'Updated',
            'message': 'Updated message',
            'notification_type': 3,
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.notif.refresh_from_db()
        self.assertEqual(self.notif.title, 'Updated')

    def test_inactivate_as_admin_returns_200(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        resp = self.client_api.patch(f'/api/notifications/inactivate/{self.notif.pk}/', {
            'is_active': False,
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.notif.refresh_from_db()
        self.assertFalse(self.notif.is_active)

    def test_delete_as_admin_returns_204(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)
        resp = self.client_api.delete(f'/api/notifications/delete/{self.notif.pk}/')
        self.assertEqual(resp.status_code, 204)
        self.assertEqual(Notification.objects.count(), 0)

    def test_delete_unauthenticated_returns_401(self):
        resp = self.client_api.delete(f'/api/notifications/delete/{self.notif.pk}/')
        self.assertEqual(resp.status_code, 401)

    def test_list_as_operator_returns_403(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.operator_token.key)
        resp = self.client_api.get('/api/notifications/')
        self.assertEqual(resp.status_code, 403)

    def test_detail_as_operator_returns_403(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.operator_token.key)
        resp = self.client_api.get(f'/api/notifications/{self.notif.pk}/')
        self.assertEqual(resp.status_code, 403)

    def test_create_unauthenticated_returns_401(self):
        resp = self.client_api.post('/api/notifications/create/', {
            'user': self.target_user.pk,
            'title': 'Test',
            'message': 'Test',
            'notification_type': 1,
        }, format='json')
        self.assertEqual(resp.status_code, 401)

    def test_update_unauthenticated_returns_401(self):
        resp = self.client_api.put(f'/api/notifications/update/{self.notif.pk}/', {
            'title': 'Test',
            'message': 'Test',
            'notification_type': 1,
        }, format='json')
        self.assertEqual(resp.status_code, 401)

    def test_update_as_manager_returns_403(self):
        self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + self.manager_token.key)
        resp = self.client_api.put(f'/api/notifications/update/{self.notif.pk}/', {
            'title': 'Test',
            'message': 'Test',
            'notification_type': 1,
        }, format='json')
        self.assertEqual(resp.status_code, 403)

    def test_inactivate_unauthenticated_returns_401(self):
        resp = self.client_api.patch(f'/api/notifications/inactivate/{self.notif.pk}/', {
            'is_active': False,
        }, format='json')
        self.assertEqual(resp.status_code, 401)
