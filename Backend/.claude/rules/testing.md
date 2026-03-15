# Testing Conventions

## Running Tests

```bash
# From Backend/ directory (use python3, not python)
python3 src/manage.py test                   # All tests (133 across 7 apps)
python3 src/manage.py test users             # Single app
python3 src/manage.py test users.tests.LoginViewTests  # Single test class

# Coverage
cd src && python3 -m coverage run --source='.' manage.py test && python3 -m coverage report
```

## Test Structure

### Base Class

Always use `django.test.TestCase`. Never use `APITestCase`, `SimpleTestCase`, or custom base classes. TestCase provides per-test transaction rollback — no tearDown or manual cleanup needed.

### Organization

Group tests into classes by functional area within each app's `tests.py`:

```python
class ModelTests(TestCase):          # Model creation, constraints, cascades
class CRUDTests(TestCase):           # API endpoint success/error cases
class PermissionTests(TestCase):     # Authorization enforcement
class BusinessLogicTests(TestCase):  # Calculations, filtering, aggregation
```

### Naming

Test methods follow `test_<action>_<condition>_<expected>`:

```python
test_create_user                          # Happy path
test_create_user_no_email_raises          # Validation error
test_login_wrong_password                 # Auth failure
test_cascade_delete_from_user             # FK behavior
test_stratum1_subsidy_60                  # Business logic
test_get_overdue_clients_as_operator_returns_403  # Permission denial
```

## Test Data

### Factory Helpers

Always create test data using the shared factory functions in `src/tests/helpers.py`. Do not construct model instances inline.

```python
from tests.helpers import (
    create_custom_user, create_client, create_worker,
    create_substation, create_transformator, create_counter,
    create_contract, create_invoice, create_history,
    create_commercial, create_banck
)
```

Key signatures and defaults:

| Factory | Key Params | Defaults |
|---------|-----------|----------|
| `create_custom_user` | `id_user, name, email, phone` | `password='testpass123'`, `address='Calle 1'` |
| `create_client` | `user` | `type_client=1` (natural) |
| `create_worker` | `user` | `user_type=1` (admin) |
| `create_counter` | `transformator` | `value=500`, `stratum=3` |
| `create_contract` | `client, counter` | `interes_mora=0.0` |
| `create_invoice` | `contract` | Sensible defaults; accepts `**kwargs` for overrides |

### setUp Pattern

```python
def setUp(self):
    self.client_api = APIClient()  # DRF client, named client_api consistently
    self.user = create_custom_user('1234567', 'Test', 'test@t.com', '1234567')
    self.worker = create_worker(self.user, user_type=2)
    # ... create related objects as needed
```

## API Client Usage

### DRF Endpoints (most apps)

Use `rest_framework.test.APIClient`:

```python
from rest_framework.test import APIClient

self.client_api = APIClient()
resp = self.client_api.get('/api/user/')
resp = self.client_api.post('/api/user/create/', {...}, format='json')
resp = self.client_api.put('/api/user/1/update/', {...}, format='json')
resp = self.client_api.delete('/api/user/1/delete/')
```

Use `format='json'` for POST/PUT/PATCH with nested or complex payloads.

### Non-DRF Endpoints (legacy reports views)

For views using `django.views.generic.View` + `HttpResponse(json.dumps(...))`, use Django's raw test client and parse JSON manually:

```python
from django.test import Client as DjangoClient
import json

self.http = DjangoClient()
resp = self.http.get('/api/reports/moraandsuspended/')
data = json.loads(resp.content)
```

### Authentication

For endpoints with `permission_classes`, authenticate via token:

```python
from rest_framework.authtoken.models import Token

user = create_custom_user(...)
create_worker(user, user_type=2)  # Manager
token = Token.objects.create(user=user)
self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
```

Do not use `force_authenticate()` — always test through the real auth flow.

## Required Test Coverage

### Every new endpoint must have

1. **Success case** — Correct status code and response shape
2. **Permission enforcement** — If the view has `permission_classes`:
   - Unauthenticated request returns 401
   - Wrong role returns 403
   - Correct role returns 200/201

### Endpoint test patterns

```python
# List
def test_list_returns_200(self):
    resp = self.client_api.get('/api/app/resource/')
    self.assertEqual(resp.status_code, 200)
    self.assertEqual(len(resp.data), expected_count)

# Create
def test_create_returns_201(self):
    resp = self.client_api.post('/api/app/resource/create/', {...}, format='json')
    self.assertEqual(resp.status_code, 201)

# Detail
def test_detail_returns_200(self):
    resp = self.client_api.get(f'/api/app/resource/{self.obj.pk}/')
    self.assertEqual(resp.status_code, 200)
    self.assertEqual(resp.data['field'], expected)

# Update
def test_update_returns_200(self):
    resp = self.client_api.put(f'/api/app/resource/update/{self.obj.pk}/', {...})
    self.assertEqual(resp.status_code, 200)
    self.obj.refresh_from_db()
    self.assertEqual(self.obj.field, 'updated_value')

# Delete
def test_delete_returns_204(self):
    resp = self.client_api.delete(f'/api/app/resource/delete/{self.obj.pk}/')
    self.assertEqual(resp.status_code, 204)
    self.assertEqual(Model.objects.count(), 0)

# Permission denied
def test_endpoint_unauthenticated_returns_401(self):
    resp = self.client_api.get('/api/app/resource/')
    self.assertEqual(resp.status_code, 401)

def test_endpoint_wrong_role_returns_403(self):
    # Authenticate as operator (type 3) for a manager-only endpoint
    token = Token.objects.create(user=operator_user)
    self.client_api.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    resp = self.client_api.get('/api/app/resource/')
    self.assertEqual(resp.status_code, 403)
```

### Model tests should cover

- Object creation with valid data
- Unique constraint violations (`with self.assertRaises(Exception)`)
- FK cascade behavior (CASCADE deletes, PROTECT raises exception)
- Custom methods (`__str__`, `get_full_name`, etc.)

### Business logic tests should cover

- Calculation correctness (e.g., subsidy tiers, mora interest)
- Boundary conditions (zero consumption, empty histories)
- Filtering behavior (active/inactive records)
- Use `assertAlmostEqual(expected, actual, places=0)` for float comparisons

## Assertion Patterns

```python
# Status codes
self.assertEqual(resp.status_code, 200)

# Response data
self.assertEqual(len(resp.data), 1)
self.assertEqual(resp.data['name'], 'Expected')
self.assertIn('field', resp.data)
self.assertTrue(resp.data['is_active'])

# Database state after request
self.obj.refresh_from_db()
self.assertEqual(self.obj.name, 'Updated')
self.assertEqual(Model.objects.count(), 0)
self.assertTrue(Model.objects.filter(email='x@t.com').exists())

# Constraint violations
with self.assertRaises(Exception):
    create_custom_user('111', 'Dup', 'dup@t.com', '111')

# Sorted results
values = [item['value'] for item in data['items']]
self.assertEqual(values, sorted(values, reverse=True))

# Float comparisons (invoice totals, subsidies)
self.assertAlmostEqual(invoice.total, expected, places=0)

# JSON parsing (non-DRF views only)
data = json.loads(resp.content)
self.assertEqual(data['key'], value)
```
