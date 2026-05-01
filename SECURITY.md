# Security Policy

## Supported Versions

Currently, only the latest branch of this repository is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| Main    | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please do not disclose it publicly. Instead, contact the repository owners directly.

## Security Features in this Project

This project incorporates the following security practices (OWASP Top 10 considered):

- **Input Sanitization & SQL Injection Prevention:** All database operations are handled via `SQLModel` (built on SQLAlchemy and Pydantic). Inputs are validated via strictly typed schemas, and queries are parameterized automatically.
- **Credential Management:** API keys and sensitive configurations (e.g., `GROQ_API_KEY`) are managed via `.env` files using `python-dotenv`. These files are excluded from version control via `.gitignore`.
- **Rate Limiting (DDoS & Spam Protection):** The AI Waiter endpoint uses `slowapi` to limit the number of requests per minute, preventing quota exhaustion and abuse.
- **CORS Policies:** The backend enforces specific origins in production to prevent Cross-Origin Resource Sharing attacks.
