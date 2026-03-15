# Backend CLAUDE.md

Backend for the Energy Corporation Management System — a Django 3.0.3 REST API with DRF, token auth, and role-based permissions.

## Build & Run Commands

```bash
# From Backend/ directory
# Note: use python3 (not python) — python is not available on this system
python3 -m pip install -r requirements.txt   # Install dependencies (or: pipenv install)
python3 src/manage.py runserver              # Start dev server
python3 src/manage.py test                   # Run all tests
python3 src/manage.py test users             # Run tests for a single app
python3 src/manage.py makemigrations         # Create migrations
python3 src/manage.py migrate                # Apply migrations
python3 src/manage.py createsuperuser        # Create admin user

# Coverage (requires: pip install coverage)
cd src && python3 -m coverage run --source='.' manage.py test && python3 -m coverage report
```

## Post-Edit Checks

After editing any `models.py`, `views.py`, or `serializers.py` file in the Backend, run the `django-check` skill to validate the changes and output the report for me to view at the end of your response.

## Architecture

Settings in `src/rest/settings.py`. Root URL conf in `src/rest/urls.py`. Python 3.6.

### Django Apps and API Prefixes

| App | API Prefix | Purpose |
|-----|-----------|---------|
| `users` | `/api/user/` | Custom user model (`CustomUser`), client/worker profiles, login endpoint |
| `energytransfers` | `/api/energytransfers/` | Substations, transformers, counters, consumption history |
| `contract` | `/api/invoice/` | Contracts linking clients to counters, invoice generation/PDF/email |
| `payments` | `/api/pay/` | Direct and bank payments against invoices |
| `bancks` | `/api/bancks/` | Bank records |
| `commercial` | `/api/commercial/` | Advertising/publicity |
| `reports` | `/api/reports/` | Suspension, overdue, and distribution reports |

Each app follows: `models.py` → `serializers.py` → `views.py` → `urls.py`.

### API View Patterns

Most apps use **DRF generic views** (not ViewSets):
- `ListCreateAPIView` — List + Create
- `RetrieveAPIView` — Detail retrieval
- `ListAPIView` — List only
- `UpdateAPIView` — Update
- `DestroyAPIView` — Delete

**Exception:** `reports` uses `django.views.generic.View` + `HttpResponse(json.dumps(...))`, not DRF. Its tests use `django.test.Client` with `json.loads()`.

### Auth & Permissions

- **Auth model:** Custom `CustomUser` with email-based authentication (`AUTH_USER_MODEL = 'users.CustomUser'`)
- **Token auth:** `rest_framework.authtoken` — login returns a token + user type
- **Role-based permissions** (defined in each app's `permissions.py`):
  - Type 1 = Admin (`AllowAdmin`)
  - Type 2 = Manager (`AllowManager`)
  - Type 3 = Operator (`AllowOperator`)
- Each permission class checks `Worker.objects.filter(user=request.user.id).values('user_type')`

### Key Model Relationships

```
Substation → has many Transformator → has many Counter → has History records
Client (→ CustomUser) → Contract (links client to counter) → Invoice → Payment
Worker (→ CustomUser) has user_type field (1/2/3) for role permissions
```

## App-Specific Details

### `users` App (`src/users/`, API prefix `/api/user/`)

#### Models

- **CustomUser** (extends `AbstractUser`) — Email-based auth (`USERNAME_FIELD = 'email'`). Custom `UserManager` with `create_user`, `create_staffuser`, `create_superuser`. Key fields: `id_user` (CharField, regex-validated 7–10 digits), `name`, `email` (unique), `phone` (unique, same regex), `address`, `neighborhood`, `date_of_birth`, `is_active`.
- **Client** (OneToOne → CustomUser, cascade) — `type_client`: 1=natural (individual), 2=juridica (company).
- **Worker** (OneToOne → CustomUser, cascade) — `user_type`: 1=admin, 2=manager, 3=operator. This field drives role-based permissions across the entire API.

#### Serializers

| Serializer | Purpose | Notes |
|------------|---------|-------|
| `UserSerializer` | Read-only user data | Includes password field (not write_only) |
| `CreateUserSerializer` | Create user | Password write_only, hashed via `make_password()` |
| `UpdateUserSerializer` | Update user | Hashes password via `make_password()` |
| `ClientSerializer` | Read-only, nests `UserSerializer` | Returns full user data inline |
| `CreateClientSerializer` | Link existing user to client | FK to existing CustomUser |
| `CreateNewClientSerializer` | Create user + client together | Nested create: pops user data, creates both |
| `UpdateClientSerializer` | Update client `type_client` only | |
| `WorkerSerializer` | Read-only worker | |
| `CreateNewWorkerSerializer` | Create user + worker together | Same nested pattern as client |

#### Views & Endpoints

**Login** (`POST /api/user/login/`) — Accepts `id_user` (treated as email) + `password`. Looks up Worker by email (case-insensitive), verifies with `check_password()`, returns token via `Token.objects.get_or_create()`. Returns 200 with token on success, 204 on failure.

**Permission classes** are defined inline in `views.py` (not a separate `permissions.py`). They check `Worker.objects.filter(user=request.user.id).values('user_type')`.

| Endpoint | Methods | View | Purpose |
|----------|---------|------|---------|
| `/` | GET | UserList | List all users |
| `/login/` | POST | Login | Authenticate, return token |
| `/create/` | GET, POST | UserCreate | Create user |
| `/<pk>/` | GET | UserDetail | Get user by ID |
| `/<pk>/update/` | PUT, PATCH | UserUpdate | Update user |
| `/<pk>/delete/` | DELETE | DeleteUser | Delete user |
| `/client/` | GET | ClientList | List all clients |
| `/client/create/` | GET, POST | ClientCreate | Create client (existing user) |
| `/client/create-new/` | GET, POST | NewClientCreate | Create client + user |
| `/client/create/bulk/` | POST | CreateMultipleClient | Bulk create clients |
| `/client/<pk>/` | GET | ClientDetail | Get client by ID |
| `/client/<pk>/update/` | PUT, PATCH | ClientUpdate | Update client |
| `/client/<pk>/delete/` | DELETE | DeleteClient | Delete client (not user) |
| `/worker/` | GET | WorkerList | List all workers |
| `/worker/create/` | GET, POST | CreateWorker | Create worker (existing user) |
| `/worker/create-new/` | GET, POST | NewWorkerCreate | Create worker + user |
| `/worker/create/bulk/` | POST | CreateMultipleWorker | Bulk create workers |
| `/worker/<pk>` | GET | WorkerDetail | Get worker by ID |
| `/worker/<pk>/update` | PUT, PATCH | WorkerUpdate | Update worker |
| `/worker/<pk>/delete` | DELETE | DeleteWorker | Delete worker |

#### Quirks

- Permission classes defined in `views.py`, not a separate file — variable name is `quey` (typo for "query")
- Serializers use `make_password()` instead of the model's `set_password()` method
- Bulk create views (`CreateMultipleClient`, `CreateMultipleWorker`) have no transaction wrapping — partial failures leave orphaned records
- `DeleteClient`/`DeleteWorker` delete only the profile, not the linked CustomUser
- Views have no `permission_classes` set — endpoints are publicly accessible
- Debug print statements remain in `UpdateClientSerializer`

#### Tests (44)

Model tests (7), Client model (3), Worker model (3), Login view (5), User CRUD (8), Client CRUD (8), Worker CRUD (5), Permission classes (4). Uses factory helpers from `tests/helpers.py`.

---

### `contract` App (`src/contract/`, API prefix `/api/invoice/`)

#### Models

- **Contract** — Links a Client to a Counter. Fields: `contractNumber` (AutoField PK), `interes_mora` (FloatField, late payment interest rate), `client` (FK → Client, PROTECT), `counter` (OneToOne → Counter, PROTECT, unique).
- **Invoice** — Monthly billing record. Key fields: `codeInvoice` (AutoField PK), `billingDate`, `deadDatePay` (default today+10), `counter` (denormalized PositiveIntegerField), `address`, `stratum` (1–6 socioeconomic level), `currentRecord`/`pastRecord` (meter readings), `basicTake` (≤173 kWh), `remainder` (>173 kWh), `unitaryValue` (cost/kWh, fixed at 589), `interestMora`, `totalMora`, `overdue` (unpaid prior balance), `intakes` (CSV of last 5 months consumption), `referencecodeInvoice` (unique payment ref), `total`, `stateInvoice` (True=paid), `is_active` (True=latest), `contract` (FK → Contract, PROTECT), `publicity` (FK → Commercial, default=1).

#### Serializers

| Serializer | Purpose | Notes |
|------------|---------|-------|
| `CreateInvoiceSerializer` | Create invoice | `fields = '__all__'` |
| `InvoiceSerializer` | Read invoice | `fields = '__all__'` |
| `UpdateInvoiceSerializer` | Update `stateInvoice` only | |
| `InactivateInvoiceSerializer` | Mark invoice inactive | |
| `ContractSerializer` | CRUD for contracts | Explicit fields |
| `CreateFullContractSerializer` | Nested create: contract + client + counter | |
| `ContractClientSerializer` | Read contract with nested client | |
| `ContractClienteInvoiceSerializer` | Contract + client + invoice via context | |
| `SuperJoinSerializer` | Contract + client + counter histories + last 5 invoices | |

#### Views & Endpoints

| Endpoint | Methods | View | Purpose |
|----------|---------|------|---------|
| `/` | GET | InvoiceList | List all invoices |
| `/create/` | GET, POST | InvoiceCreate | Create invoice |
| `/update/<pk>` | PATCH, PUT | InvoiceUpdate | Update invoice (`stateInvoice`) |
| `/delete/<pk>` | DELETE | InvoiceDelete | Delete invoice |
| `/inactivate/<pk>/` | PATCH | InvoiceInactivate | Mark invoice inactive |
| `/by-contract/` | POST | GetInvoiceByContract | Query last 5 invoices by contract |
| `/generate/` | GET | CreateInvoices | Trigger bulk invoice generation |
| `/pdf/<contract>/<factura>/` | GET | GeneratePdf | Generate PDF via WeasyPrint |
| `/sendemail/<contract>/<factura>/` | GET | SendEmail | Generate PDF and email to client |
| `/contract/` | GET | ContractList | List contracts |
| `/contract/create/` | GET, POST | CreateContract | Create contract |
| `/contract-full/` | GET, POST | GetFullContractJoin | List contracts with nested data |
| `/contract-full/create/` | GET, POST | CreateFullContract | Create contract + nested resources |
| `/<pk>/` | GET | InvoiceDetail | Retrieve single invoice |

#### Invoice Generation (`utils.py`)

`generateHistoryAndInvoices()` — Batch-creates monthly invoices and history records for all active contracts:
1. Gets latest History record and Invoice for each contract's counter
2. Calculates consumption: `currentRegistry - lastRegistry`
3. Splits into `basicTake` (≤173 kWh) and `remainder`
4. Applies stratum-based subsidies: stratum 1 → 60%, stratum 2 → 50%, stratum 3 → 15%, stratum 4+ → 0%
5. If `interes_mora` set: `totalMora = lastInvoice.total * interes_mora`
6. If previous invoice unpaid: adds `overdue = lastInvoice.total`; if overdue + unpaid, suspends counter (`is_active = False`) and sets 30% penalty
7. Builds `intakes` CSV string (last 5 months), generates unique `referencecodeInvoice`

`getInvoiceData(query)` — Transforms serialized data into template context for PDF rendering. Hardcoded Spanish month names.

#### PDF & Email

- **PDF:** Django template (`templates/contract/index.html`) rendered to PDF via WeasyPrint. Letter-size layout with consumption table, bar chart, and advertising section.
- **Email:** `EmailMultiAlternatives` with PDF attachment via `settings.EMAIL_HOST_USER`.

#### Quirks

- Invoice model denormalizes counter fields (`counter`, `address`, `stratum`) as plain fields instead of FK references
- Most serializers use `fields = '__all__'` (violates project convention for explicit field lists)
- Views have no `permission_classes` — all endpoints publicly accessible
- Subsidy rates, `unitaryValue` (589), and `basicTake` threshold (173) are hardcoded constants
- PDF template and `getInvoiceData()` are Spanish-only (hardcoded month names)
- `SendEmail` view calls `generateHistoryAndInvoices()` on every request
- App config name is `'factures'` (in `apps.py`) despite folder being `contract`

#### Tests (20)

Contract model + PROTECT cascades (4), Invoice model + defaults (2), Invoice generation with subsidy tiers (11), Contract/Invoice API endpoints (3). Uses factory helpers from `tests/helpers.py`.

---

## Dependencies

```
Django==3.0.3
djangorestframework==3.11.0
django-cors-headers==3.2.1
weasyprint==51                 # PDF generation for invoices
dj-database-url~=0.5.0        # PostgreSQL URL parsing (Pipfile)
psycopg2-binary~=2.8.5        # PostgreSQL driver (Pipfile)
```

## Testing

133 tests across all apps. Run from `Backend/` directory.

| App | Tests |
|-----|-------|
| `users` | 44 |
| `energytransfers` | 34 |
| `contract` | 20 |
| `payments` | 12 |
| `bancks` | 8 |
| `commercial` | 8 |
| `reports` | 7 |

Shared factory helpers in `src/tests/helpers.py`: `create_custom_user`, `create_client`, `create_worker`, `create_substation`, `create_transformator`, `create_counter`, `create_contract`, `create_invoice`, `create_history`, `create_commercial`, `create_banck`.

## Deployment

- **Docker** on Heroku (`Dockerfile` + `heroku.yml`)
- Image: `python:3.6-stretch`, runs as non-root user `myuser`
- Database: SQLite locally, PostgreSQL on Heroku
