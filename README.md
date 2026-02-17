# FinTrack

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci-cd-tests.yml`.

- Runs on `pull_request`, `push` to `main`, and manual trigger (`workflow_dispatch`).
- Backend: installs `backend` package and runs `pytest` from `backend/tests`.
- Frontend: installs dependencies in `frontend` and runs `npm run lint`.
- CD gate: on successful `push` to `main`, marks build as ready for deployment.
