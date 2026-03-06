# Sierra & Sea Suite

Repository structure:

- `website/`:
  Deployable static website.

- `team/`:
  Internal team/task-manager workspace (dashboard, docs, features, scripts, local artifacts).

## Notes

- Keep production web assets and pages inside `website/`.
- Keep planning, task tracking, QA captures, and tooling inside `team/`.

## Deployment

- AWS auto-deploy is configured via GitHub Actions in `.github/workflows/deploy-website.yml`.
- Setup steps and required secrets are documented in `DEPLOYMENT.md`.
