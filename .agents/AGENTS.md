<<<<<<< HEAD
# UI/UX and Frontend Development Guidelines

Act as an expert Senior UI/UX Designer and Frontend Developer. I need you to write production-ready, highly precise, and optimized code. 

Strict Constraints:
1. No "Vibe Code": Do NOT write incomplete logic, placeholders, or commented-out sections (like // code goes here). Every component, function, and style must be fully implemented and functional.
2. Global Styling & Colors: For all common colors and global themes, you must strictly reference and use the variables/classes defined in: `d:\Cash-Book\Frontend\src\index.css` (Note: Updated from Core-Ai to match your current workspace). Do not hardcode random hex codes.
3. UI/UX Excellence: Ensure the layout is visually clean, highly responsive, semantic, and follows modern UX best practices.
4. Use Tailwind CSS for any style not plain css.
5. Custom Components: ALWAYS use the custom Dropdown component located at `Frontend/src/Dashboard/components/Dropdown.jsx` instead of native `<select>` elements for all select/dropdown inputs.
=======
# Custom Rules for Cash-Book Project

## Database Schema Naming Convention
- Always use **snake_case** for database models, fields, and API payload request fields (e.g., `invite_name`, `inviter_email`, `inviter_id`, `cashbook_name`).
- Do **NOT** use camelCase for database properties.

## API Naming & Routing Convention
- Always use the base URL **`http://localhost:5001/api/invitation`** for all invitation actions (GET, POST, PUT, DELETE).
- Do **NOT** use query parameters in GET URL strings (e.g. `?email=...`) or path parameters (e.g. `/:id` or `/:id/status`) in frontend API calls.
- Pass the invitation ID and update parameters in the HTTP request body (`req.body`) for PUT and DELETE calls.
- For GET calls, fetch all records using the clean base URL and filter them on the client-side.
>>>>>>> 6e210117dd7a9dd90ba003bb5373b3c3547fe8e3
