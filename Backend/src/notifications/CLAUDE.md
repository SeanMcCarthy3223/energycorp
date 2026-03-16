# notifications App

API prefix: `/api/notifications/`

## Purpose
Manages system notifications for users — alerts, warnings, and informational messages.

## Notification Model
- `user` — FK to `CustomUser` (CASCADE delete)
- `title` — Short notification title (max 200 chars)
- `message` — Full notification body (TextField)
- `notification_type` — 1=info, 2=warning, 3=alert
- `is_read` — Whether the user has seen it
- `is_active` — Soft-delete flag
- `created_at` — Auto-set on creation

## Endpoints
| Method | URL | View | Permission |
|--------|-----|------|------------|
| GET | `/` | NotificationList | Manager |
| POST | `/create/` | NotificationCreate | Admin |
| GET | `/<pk>/` | NotificationDetail | Manager |
| PUT | `/update/<pk>/` | NotificationUpdate | Admin |
| PATCH | `/inactivate/<pk>/` | NotificationInactivate | Admin |
| DELETE | `/delete/<pk>/` | NotificationDelete | Admin |

## Permissions
- Read (list, detail): Manager (type 2)
- Write (create, update, delete, inactivate): Admin (type 1)
