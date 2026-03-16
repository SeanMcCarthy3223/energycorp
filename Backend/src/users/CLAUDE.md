# users App

API prefix: `/api/user/`. Custom user model with email-based auth.

## CustomUser Model
- Extends `AbstractUser` with `username = None`, `first_name = None`, `last_name = None` — these fields do NOT exist. Use `name` instead.
- `USERNAME_FIELD = 'email'`, auth is email-based. `id_user` is a separate identifier (7-10 digit string), not the login field.
- `UserManager` uses `set_password()`; serializers use `make_password()` — do not mix patterns.

## Permission System
- `Worker.user_type` drives all role-based access: 1=Admin (`AllowAdmin`), 2=Manager (`AllowManager`), 3=Operator (`AllowOperator`).
- Permission classes check `Worker.objects.filter(user=request.user.id).values('user_type')`.
- In this app, permission classes are defined inline in `views.py` (variable name is `quey` — typo). Other apps use separate `permissions.py`.

## Login Endpoint
- `POST /api/user/login/` accepts `id_user` (used as email lookup) + `password`.
- Returns 200 with token on success, 204 on failure. Token via `Token.objects.get_or_create()`.

## Quirks
- Existing views have NO `permission_classes` — endpoints are publicly accessible.
- `DeleteClient`/`DeleteWorker` delete only the profile, not the linked `CustomUser`.
- Bulk create views have no transaction wrapping — partial failures leave orphans.
