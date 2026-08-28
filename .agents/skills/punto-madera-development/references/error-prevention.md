# Error prevention record

This file is append-only operational memory for this project skill. Read it before work. Add only concrete, evidence-backed failures from a chat or task; never add secrets or invented incidents.

## Baseline

No concrete implementation error has been identified in the source chat that created this skill. Future failures must be recorded with symptom, cause, prevention, and verification.

## Recorded lessons

<!-- The record_error.py script appends dated entries below this line. -->

### 2026-08-28 11:27 UTC — production-deployment
- Symptom: docker compose build succeeded but container recreation failed with a generated-container-name conflict
- Cause: A stale container with the compose replacement name remained on the production host
- Prevention: Before recreating a production compose service, inspect all exact matching containers with docker ps -a and remove only a verified stale stopped conflict
- Verification: The new image was built; the existing live container remained running while the conflicting container is being audited


### 2026-08-28 11:25 UTC — security
- Symptom: Inspecting the production checkout remote printed an embedded Git credential
- Cause: git remote -v exposes credentials stored in the deployment remote URL
- Prevention: Never run git remote -v on production; inspect only the remote host/repository shape with credentials redacted or omit remote inspection entirely
- Verification: The credential was not reused or written to the workspace; subsequent deployment checks will avoid printing remote URLs


### 2026-08-28 11:17 UTC — remote-verification
- Symptom: The remote db:table inspection failed because --counts is not a supported option
- Cause: I assumed a database command option without checking the deployed Laravel command help
- Prevention: Inspect php artisan help for deployed command options before using them, and use only verified flags
- Verification: No data-changing command ran; the remote help output will determine the next read-only check


### 2026-08-28 11:16 UTC — remote-verification
- Symptom: The remote service-count command failed with a PsySH unexpected namespace separator parse error
- Cause: Nested local-shell, SSH, and container quoting over-escaped the PHP namespace in the Tinker expression
- Prevention: Prefer php artisan db:table for remote read-only counts; if Tinker is unavoidable, use app("db") without namespace separators and validate the exact remote command quoting
- Verification: The production migration status command succeeded; the database table inspection will provide the service count without inline PHP


### 2026-08-28 10:50 UTC — security
- Symptom: A diagnostic curl command printed production response headers containing session cookies
- Cause: The command used curl -D - while only the response body and status were needed
- Prevention: Use curl -sS -o /dev/null -w for status checks and never print production response headers unless a header is specifically required
- Verification: Subsequent production checks will request only body content or status output


### 2026-08-28 10:35 UTC — tooling
- Symptom: Prettier failed while formatting a PHP feature test
- Cause: The command included tests/Feature/SeoAndTrackingTest.php even though Prettier has no PHP parser
- Prevention: Run Prettier only for frontend file extensions and use Pint for PHP files
- Verification: Frontend file formatted successfully; PHP formatting will be verified with Pint


### 2026-08-28 09:27 UTC — local-verification
- Symptom: The prevention-log reread command failed because exec_command was given a nonexistent working directory.
- Cause: The project path was mistyped as /Volumes/Steevenlacerna/Projects instead of /Volumes/SteevenSSD/Projects.
- Prevention: Reuse the verified project working directory /Volumes/SteevenSSD/Projects/Main/richardwebsite for all repository commands.
- Verification: The prevention log will be reread from the verified project directory.


### 2026-08-28 09:27 UTC — local-verification
- Symptom: The first artisan tinker count command failed with a PsySH parse error before reading the local Work count.
- Cause: Shell/PHP namespace escaping in the inline tinker expression produced an invalid namespaced class reference.
- Prevention: Use a leading PHP namespace separator with shell-safe quoting when running inline artisan tinker expressions, or use a short quoted closure without doubled namespace separators.
- Verification: The corrected count command will be run before seeding and the browser gallery will be reloaded afterward.


### 2026-08-28 09:25 UTC — browser-setup
- Symptom: The first local browser smoke-test setup failed with Module not found for browser-client.mjs.
- Cause: The plugin skill path was interpreted as including the skill subdirectory, but browser-client.mjs is under the plugin root scripts directory.
- Prevention: When using control-in-app-browser, import /Users/steevenlacerna/.codex/plugins/cache/openai-bundled/browser/26.820.60940/scripts/browser-client.mjs from the plugin root, not .../skills/control-in-app-browser/scripts.
- Verification: The corrected import completed browser setup and returned browser documentation.


### 2026-08-23 09:24 UTC — tool-call-syntax
- Symptom: The initial git commit tool call failed before execution
- Cause: The orchestration payload omitted a comma between yield_time_ms and max_output_tokens
- Prevention: Validate exec_command argument object syntax before submitting the call
- Verification: No git command ran; staged diff remained unchanged and the corrected commit command is being rerun


### 2026-08-23 09:14 UTC — frontend-import-order
- Symptom: npm run lint:check failed on resources/js/pages/landing/carpintero.tsx after adding a shared SEO helper import
- Cause: The new @/lib/site import was placed after @/lib/utils, violating the repository import/order rule
- Prevention: Place aliased imports in the repository's established path order and rerun lint after frontend edits
- Verification: Reordered @/lib/site before @/lib/utils; lint rerun is required before completion
