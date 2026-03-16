# Reports App

API prefix: `/api/reports/`

## Legacy vs New Views

**Legacy views** use `django.views.generic.View` + `HttpResponse(json.dumps(...))` — NOT DRF. They have no authentication or permission checks. Tests use `django.test.Client` with `json.loads(resp.content)`.

**New views** should use DRF `APIView` (or generic views) with `permission_classes` set explicitly. Tests should use `rest_framework.test.APIClient`.

## Transition Pattern

- Existing legacy endpoints: keep as-is unless refactoring
- New endpoints: always use DRF `APIView` + token auth + role permissions (`AllowAdmin`, `AllowManager`, `AllowOperator`)
- When adding permissions to a legacy view, convert it to DRF first
