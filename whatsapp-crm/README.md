# WhatsApp Micro CRM (Laravel + Tailwind + shadcn/ui + Supabase)

Production-ready starter architecture for a mobile-first WhatsApp-style micro CRM.

## Stack
- Laravel backend structure (controllers, models, repositories, services)
- Tailwind CSS for utility-first design
- shadcn/ui-inspired component primitives in React/TS
- Supabase for auth/data sync support and reminders processing

## Modules
- Authentication (`AuthController`, middleware-ready route group)
- Inbox (`InboxController`) with WhatsApp-style layout and conversation list
- Contacts management (`Contact`, tags, notes)
- Follow-up reminders (`FollowUpReminder`) with due-date workflow
- Tags and Notes (many-to-many + notes feed)
- SaaS dashboard shell with responsive sidebar and mobile nav

## Environment
Copy `.env.example` and set:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_PASSWORD`

## Next Steps
1. Run `composer install` and complete Laravel app bootstrap if building from this template.
2. Wire migrations to Supabase Postgres database.
3. Add queue worker + scheduler for reminder delivery.
4. Add policies and request validation classes.
