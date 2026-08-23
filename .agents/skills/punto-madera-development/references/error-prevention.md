# Error prevention record

This file is append-only operational memory for this project skill. Read it before work. Add only concrete, evidence-backed failures from a chat or task; never add secrets or invented incidents.

## Baseline

No concrete implementation error has been identified in the source chat that created this skill. Future failures must be recorded with symptom, cause, prevention, and verification.

## Recorded lessons

<!-- The record_error.py script appends dated entries below this line. -->

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
