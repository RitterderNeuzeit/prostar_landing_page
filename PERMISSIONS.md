**Repository Permission & Consent Form**

This document records the explicit permissions you grant to the automation assistant for operations performed on this repository and related GitHub settings.

Purpose
- Ensure transparent, auditable consent for actions taken by the assistant.

Actions already performed by the assistant
- Created repository `RitterderNeuzeit/prostar_landing_page` and pushed branch `Branch-von-mir-erstellt-jonas`.
- Added CI guard workflow: `.github/workflows/ci-guard.yml` (PR checks run in DEMO_MODE by default).
- Added `.github/CODEOWNERS` to request owner review for PRs.
- Opened a Pull Request: https://github.com/RitterderNeuzeit/prostar_landing_page/pull/1

Requested next actions (these require repository-level settings or a short-lived token / `gh` CLI):
- Create repository secret `ALLOW_REAL_EMAILS=false` (ensures CI E2E tests run in demo mode by default).
- Create Branch Protection rules for `main`:
  - Require pull request reviews before merging (1 reviewer)
  - Require code owner reviews
  - Require status checks to pass before merging (CI Guard)
  - Include administrators

How you can approve these actions (pick one):
1) Run the included setup script locally (recommended, secure). See `scripts/setup-github-protection.sh`.
2) Add a short-lived Personal Access Token (PAT) with `repo` scope and run the `gh` commands above locally; do NOT paste tokens into issues or chat.
3) Use the GitHub UI (Settings → Branches and Settings → Secrets) and apply the values listed in this file.

Consent record
- I, [REPO_OWNER_NAME], grant permission to the assistant to perform the above actions on `RitterderNeuzeit/prostar_landing_page` on my behalf.

Signature (type your name and date in a new issue or comment on the PR):

Name: _______________________  Date: _______________

Notes & Audit
- The assistant will never request persistent credentials in chat. If you choose option 1 (local `gh`), the `gh` CLI encrypts secrets before sending.
- After you run the setup script or apply the settings, please create a short issue comment with your name and the date to finalise consent.

