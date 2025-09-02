# Setup Steps (GitHub Website)

1. Create a new repository on GitHub and push this scaffold.
2. Create branches `dev` and `test` from `main`.
3. Protect branches (`Settings` → `Branches` → `Add rule`):
   - main → require PRs, 1–2 reviewers, status checks, restrict who can push.
   - test → require PRs, reviewers (QA + DevOps).
   - dev → allow dev team, optional PRs.
4. Create Environments: `staging` and `production` with required reviewers and secrets.
5. Push code to `dev`, merge PR → test → main as workflow.
