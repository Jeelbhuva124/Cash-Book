# Custom Rules for Cash-Book Project

## Database Schema Naming Convention
- Always use **snake_case** for database models, fields, and API payload request fields (e.g., `invite_name`, `inviter_email`, `inviter_id`, `cashbook_name`).
- Do **NOT** use camelCase for database properties.

## API Naming & Routing Convention
- Always use the base URL **`http://localhost:5001/api/invitation`** for all invitation actions (GET, POST, PUT, DELETE).
- Do **NOT** use query parameters in GET URL strings (e.g. `?email=...`) or path parameters (e.g. `/:id` or `/:id/status`) in frontend API calls.
- Pass the invitation ID and update parameters in the HTTP request body (`req.body`) for PUT and DELETE calls.
- For GET calls, fetch all records using the clean base URL and filter them on the client-side.
