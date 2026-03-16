---
name: scaffold-django-app
description: Creates a complete Django app structure with models, views, serializers, URLs, and tests following project conventions. Invoke with /scaffold-django-app <app-name>.
allowed-tools: Read, Write, Edit, Bash, Glob
disable-model-invocation: true
user-invocable: true
argument-hint: "<app-name>"
---
# Scaffold Django App

Create a new Django app named `$ARGUMENTS` in `Backend/src/` following energycorp conventions.

## Steps

1. Create the app directory structure:
   
   Backend/src/$ARGUMENTS/
   ├── __init__.py
   ├── models.py          (with base model class)
   ├── views.py           (from template)
   ├── serializers.py     (with base serializer)
   ├── urls.py            (with router setup)
   ├── tests.py           (with test scaffolding)
   ├── admin.py           (with admin registration)
   └── CLAUDE.md          (module-level conventions)
   

2. Reference the views template at `.claude/skills/scaffold-django-app/templates/views_template.py` for the views.py structure. Replace `{app_name}` with the actual app name and `{ModelName}` with a PascalCase placeholder.

3. For models.py: Create a base model with a descriptive comment. Import from django.db and use the same field patterns as other energycorp apps (see Backend/src/users/models.py for reference).

4. For serializers.py: Create a base serializer importing from rest_framework.serializers. Always use explicit field lists (never `fields = '__all__'`).

5. For urls.py: Use `urlpatterns` list with `path()` calls matching the router pattern in Backend/src/urls.py.

6. For tests.py: Import TestCase from django.test and APIClient from rest_framework.test. Include helper imports from tests.helpers.

7. For CLAUDE.md: Create a module-level CLAUDE.md documenting the app's purpose, key models, and conventions.

8. Register the app: Add `'$ARGUMENTS'` to INSTALLED_APPS in Backend/src/config/settings.py.

## Important
- Do NOT run migrations automatically
- Do NOT modify any existing app files
- DO follow the permission pattern: AllowAdmin, AllowManager, AllowOperator
- DO use TokenAuthentication on all views