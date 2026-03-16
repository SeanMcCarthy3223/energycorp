# contract App

API prefix: `/api/invoice/`. Manages contracts, invoices, PDF generation, and email.

## Contract Model
- `contractNumber` is an `AutoField` PK — do not set manually.
- Links a `Client` to a `Counter` (OneToOne, PROTECT). `interes_mora` is the late-payment interest rate.

## Invoice Model
- `stateInvoice`: `True` = paid, `False` = unpaid. `is_active`: `True` = latest invoice for that contract.
- `counter`, `address`, `stratum` are denormalized plain fields (not FK references).
- `unitaryValue` fixed at 589, `basicTake` threshold at 173 kWh — hardcoded constants.
- `referencecodeInvoice` is a unique payment reference string.

## Invoice Generation (`utils.py`)
- `generateHistoryAndInvoices()` batch-creates invoices for all active contracts.
- Stratum subsidies: 1→60%, 2→50%, 3→15%, 4+→0%. Two consecutive unpaid invoices suspend the counter with 30% penalty.

## Serializer Patterns
- Most serializers use `fields = '__all__'` (violates project convention — use explicit fields for new ones).
- `SuperJoinSerializer` joins contract + client + counter histories + last 5 invoices.

## Quirks
- App config name is `'factures'` in `apps.py` despite folder being `contract`.
- PDF/email are Spanish-only. `SendEmail` re-runs `generateHistoryAndInvoices()` on every request.
- Views have NO `permission_classes` — all endpoints publicly accessible.
