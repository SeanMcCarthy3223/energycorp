# API Design Conventions

## View Layer

### Base Classes

Use DRF generic views (not ViewSets) for standard CRUD:

| Operation | Base Class | HTTP Methods |
|-----------|-----------|--------------|
| List | `ListAPIView` | GET |
| List + Create | `ListCreateAPIView` | GET, POST |
| Detail | `RetrieveAPIView` | GET |
| Update | `UpdateAPIView` | PUT, PATCH |
| Delete | `DestroyAPIView` | DELETE |
| Custom logic | `APIView` | Define `get()`, `post()`, etc. |

Use `APIView` for non-CRUD endpoints (bulk operations, PDF generation, email, aggregation queries).

**Exception:** The `reports` app has legacy views using `django.views.generic.View` + `HttpResponse(json.dumps(...))`. New reports endpoints should use DRF `APIView` + `Response()` instead (see `OverdueClients` view as the reference pattern).

### Permissions

- **Always set `permission_classes` explicitly** on every view
- Permission types map to `Worker.user_type`:
  - Type 1 = `AllowAdmin`
  - Type 2 = `AllowManager`
  - Type 3 = `AllowOperator`
- Each permission class checks `Worker.objects.filter(user=request.user.id).values('user_type')`
- Define permission classes in a separate `permissions.py` per app (not inline in `views.py`)
- For endpoints requiring authentication, also set `authentication_classes = [TokenAuthentication]`

### Querysets

- Set `queryset` as a class attribute for standard CRUD views
- Override `get_queryset()` only when filtering is needed (e.g., by path parameter or query string)
- Use path parameters for resource-scoped queries: `/history/last/<counter>/`

## Serializer Layer

### Field Declarations

- **Always use explicit `fields` lists**, never `fields = '__all__'`
- Create separate serializers for each operation when field sets differ:
  - `CreateXSerializer` — fields needed for creation (password as `write_only`)
  - `XSerializer` — fields for read/list operations
  - `UpdateXSerializer` — only the mutable fields
  - `InactivateXSerializer` — just `is_active`

### Nested Serializers

- Use nested serializers for read operations that need related data (e.g., `ClientSerializer` nesting `UserSerializer`)
- For write operations, accept FK IDs (not nested objects) unless creating related objects atomically
- Use `SerializerMethodField` for computed or filtered related data

### Custom create/update

- Put business logic in serializer `create()`/`update()` methods, not in views
- Hash passwords with `make_password()` in serializer `create()`/`update()` (existing pattern)
- For atomic nested creation (e.g., user + client), pop nested data, create parent first, then child

## URL Layer

### Patterns

- API prefix: `/api/<app-name>/` (configured in `rest/urls.py`)
- Standard CRUD pattern for each resource:

```
/                          # List (GET)
/create/                   # Create (POST) or List+Create (GET, POST)
/<pk>/                     # Detail (GET)
/update/<pk>/              # Update (PUT, PATCH)
/delete/<pk>/              # Delete (DELETE)
/inactivate/<pk>/          # Soft-delete (PATCH)
```

- Use trailing slashes consistently on all URL patterns
- Bulk operations: `/create/bulk/` (POST, accepts array in body)
- Resource-scoped queries use path parameters: `/by-contract/`, `/pdf/<contract>/<factura>/`

### Naming

- Use lowercase, hyphen-separated names for multi-word URLs: `/overdue-clients/`, `/payment-summary/`
- Sub-resources nest under parent: `/api/user/client/`, `/api/user/worker/`

## Response Format

### Standard DRF Responses

Most endpoints return DRF's default serialized response. No wrapper needed for standard CRUD.

### Custom Responses (APIView endpoints)

For login and custom query endpoints, use this format:

```python
# Success
{"message": "...", "code": 200, "data": {...}}

# Error
{"message": "...", "code": <http_code>, "data": {}}
```

### Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (created) |
| 204 | Successful DELETE (or login failure in legacy pattern) |
| 400 | Validation error |
| 401 | Unauthenticated (missing/invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |

## Global Settings

- No `DEFAULT_PERMISSION_CLASSES` or `DEFAULT_AUTHENTICATION_CLASSES` are set globally — each view must declare its own
- No `DEFAULT_PAGINATION_CLASS` — pagination is not used
- Token auth enabled via `rest_framework.authtoken` in `INSTALLED_APPS`
- CORS: `django-cors-headers` with `CORS_ORIGIN_ALLOW_ALL = True` (dev only)
