# Error prevention record

This file is append-only operational memory for this project skill. Read it before work. Add only concrete, evidence-backed failures from a chat or task; never add secrets or invented incidents.

## Baseline

No concrete implementation error has been identified in the source chat that created this skill. Future failures must be recorded with symptom, cause, prevention, and verification.

## Recorded lessons

<!-- The record_error.py script appends dated entries below this line. -->

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
