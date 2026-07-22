# Custom Rules for Cash-Book Project

## Database Schema Naming Convention
- Always use **snake_case** for database models, fields, and API payload request fields (e.g., `invite_name`, `inviter_email`, `inviter_id`, `cashbook_name`).
- Do **NOT** use camelCase for database properties.

## API Naming & Routing Convention
- Always use action-specific subpaths for API actions (GET -> `/select`, POST -> `/insert`, PUT -> `/update`, DELETE -> `/delete`) for invitations, cashbooks, and all other resources.
- Base URL format: `http://localhost:5001/api/<resource_name>/<action>` (e.g., `http://localhost:5001/api/invitation/select`, `http://localhost:5001/api/cashbook/insert`).
- Do **NOT** use query parameters in GET URL strings or path parameters (e.g. `/:id`) in frontend API calls.
- Pass the ID and update/delete parameters in the HTTP request body (`req.body`) for `/update` and `/delete` calls.
- For GET `/select` calls, fetch records and filter them on the client-side when necessary.
