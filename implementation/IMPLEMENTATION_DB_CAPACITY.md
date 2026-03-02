# Implementation Plan: Capacity & Description Adjustments

**GitHub Issue:** #10

## Context & Objectives
Add a `capacity` column to the `system_types` table so it loads that number by default when creating a new schedule session. Adjust the frontend to manage this field, and update the UI to show the `description` field from `system_types` more prominently across lists and modals.

## Changes Overview

### 1. Database Updates
- **Table:** `system_types`
- **Action:** Add `capacity` column (integer, nullable or default 0).
- **Migration:** Run an SQL query in Supabase SQL editor to execute `ALTER TABLE system_types ADD COLUMN capacity INTEGER DEFAULT 0;` (or similar).

### 2. Frontend: Admin System Types
- **File:** `AdminSystemTypes.tsx` (or where the UI for system types resides)
- **Action 1:** Show `capacity` field on the *Create Session Type* modal (default empty).
- **Action 2:** Show `capacity` field on the *Edit Session Type* modal.
- **Action 3:** Show `capacity` column on the System Types UI table.
- **Action 4:** Add `description` column in the System Types list (after Title, to stop truncation below Title).

### 3. Frontend: Admin Schedule Sessions
- **File:** `AdminSessions.tsx`
- **Action 1:** In the *Create Schedule Session* modal, auto-fill `capacity` when a session type is selected from the dropdown.
- **Action 2:** In the *Create/Edit Schedule Session* modal, display the `description` text of the selected system type.
- **Action 3:** In the *Active Sessions* UI table, add a new `description` column immediately after the session name.

---

## Progress Checklist

- [x] **Database & Types**
  - [x] Run migration in Supabase to add `capacity` to `system_types`.
  - [x] Update frontend Types/Interfaces (e.g., `src/types/supabase.ts` or custom types) for `SystemType` and `Session` (if necessary).

- [x] **Frontend: Session Types UI**
  - [x] Update creation modal to include a `capacity` number input.
  - [x] Update edit modal to include the `capacity` number input.
  - [x] Update the UI table for System Types:
    - Add `capacity` column.
    - Extract `description` to a dedicated column after the Title instead of showing it truncated.

- [x] **Frontend: Sessions UI**
  - [x] Update logic: When choosing a session type in the creation modal, auto-fill the session's capacity with the type's capacity.
  - [x] Update creation/edit modals to display the selected session type's `description`.
  - [x] Update the Active Sessions table to include a `description` column after the session name.

- [x] **Finalization**
  - [x] Verify everything works as expected (Supabase data saving, UI updating, interactions).
  - [x] Commit changes referencing Issue #10.
  - [x] Push branch and update issue on GitHub.
