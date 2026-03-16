---
name: api-contract-sync
description: Generates TypeScript interfaces from Django serializers for a specified app. Invoke with /api-contract-sync <app-name>.
allowed-tools: Read, Grep, Glob
context: fork
model: sonnet
user-invocable: true
disable-model-invocation: true
argument-hint: "<app-name>"
---
# API Contract Sync — Django Serializers → TypeScript Interfaces

Generate TypeScript interfaces for the Django app `$ARGUMENTS`.

## Steps

1. **Read the serializer file** at `Backend/src/$ARGUMENTS/serializers.py`
   - Identify all serializer classes
   - For each serializer, extract: class name, model reference, field list
   - For ModelSerializer: read the `fields` or `Meta.fields` list
   - For explicit fields: note the field type (CharField, IntegerField, etc.)

2. **Read the views file** at `Backend/src/$ARGUMENTS/views.py`
   - Identify which serializers are used by which views
   - Extract the URL patterns and HTTP methods (GET, POST, PUT, DELETE)
   - Note any views that return custom (non-serializer) responses

3. **Map Django types to TypeScript** using the type mapping at `.claude/skills/api-contract-sync/templates/type-mapping.json`
   - Read the mapping file
   - For each serializer field, look up the TypeScript equivalent
   - For nested serializers, generate a referenced interface
   - For SerializerMethodField, use `unknown` and add a comment

4. **Generate the interface file** following the template at `.claude/skills/api-contract-sync/templates/interface.ts.tmpl`
   - One interface per serializer class
   - Interface name: serializer class name with "Serializer" removed (e.g., ContractSerializer → Contract)
   - Include a comment header with source file and generation timestamp
   - Mark optional fields with `?` if the serializer field has `required=False`
   - Export all interfaces

5. **Output** the complete TypeScript file content and a summary of:
   - How many interfaces generated
   - How many fields mapped
   - Any fields that couldn't be automatically mapped (SerializerMethodField, custom fields)
   - Suggested file path: `Frontend/src/types/{app_name}.ts`
