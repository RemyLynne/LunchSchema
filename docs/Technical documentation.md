# Technical Documentation

## Architecture

The application is a monolith full-stack application

Backend files lay under the root, with the frontend under `/WebContent`

## Choice of technology

### Backend

- language/kotlin: it's just java, but with some nice help, for example explicit null and non-null types
- dependency/Spring boot: abstracts out a lot of boilerplate code
- dependency/flyway: Simple sql based migrations, for an sql database

### Frontend

- language/typescript: Industry standard, and at least warns you when diverging from your own types
- framework/react: simple & light framework, for a small app
- dependencies/(base-ui/tailwind/shadcn): less ui boilerplate && more consistent design
- dependency/i18next: simple translation system
- dependency/zod: type validation

## Safety considerations

Per the EU General Data Protection Regulation (GDPR), Article 5(1)(c), the amount of personal data should be kept to a minimum

The only personal data that the application should handle, is that to say who the person is (email, name), as well as their credentials

For standard security reasons, the password MUST be hashed, not encrypted, as any unauthorized access to the database should not expose the password. The password should also not be accessed unless explicitly required, as to keep the exposing risk relativly low

## Issues and errors

As the application revolves around 1 period = 1 month, your test data will automatically shift on the first of the next month, which is expected, but might not be optimal during development
