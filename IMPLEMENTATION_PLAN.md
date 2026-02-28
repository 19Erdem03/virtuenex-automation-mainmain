# Implementation Plan: VirtueNex Backend & Dashboards

This document outlines the detailed plan to add a Supabase backend and complete admin/client dashboards to the VirtueNex Automation website, tailored for an AI Automation Agency focused on Real Estate professionals.

## Goal
To implement a robust authentication, database, and dashboard system using Supabase, React Router, and Shadcn UI. The system will manage Client System Deployments (Chat Agents, Phone Agents, Data Sync), Lead capturing, User Roles, and manual Crypto Payment verification, all adhering to the VirtueNex brand aesthetics.

## User Review Required

> [!IMPORTANT]
> Please review the planned database tables and page routes below. Note that we are proposing adding a simple `packages` concept if needed, or folding package details into `system_deployments`. Let me know if the distinction between `Client Packages` and `System Deployments` should be strictly separate tables or combined.
>
> Also, verify if the top-left positioning for Toast notifications is acceptable (most default to bottom-right, but top-left is easily configurable).

### Questions for Feedback
*Please answer these directly inline!*

1. **Property Ownership:** Do `properties` belong to specific `Clients` (Real Estate Agents), or are they managed globally by the Admin across the whole VirtueNex platform? Should we add `client_id` to the `properties` table so Clients can see/manage their own properties eventually? YES
2. **Lead Accounts vs Lead Captures:** When an AI Agent captures a lead and creates a `lead_captures` record, does the system automatically create a user login account for them? Or are `lead_captures` just raw CRM entries and `profiles` with role `'Lead'` are a separate thing when someone explicitly signs up? 2ND OPTION
3. **Payments:** If payments happen outside the app (Crypto), does the Client manually submit a `transaction_hash` via the dashboard that goes to a `'Pending'` state for Admins to verify? Or does the Admin create the payment record entirely? NOT SURE, THE PAYMENTS IS JUST OUTSIDE OF THE PLATFORM.

---

## 1. Database Schema (Supabase)

We will configure the Supabase PostgreSQL database with the following core tables and Row Level Security (RLS) policies to ensure data privacy between Admins, Clients, and Leads.

### `profiles`
Extended user data linked to Supabase Auth (`auth.users`).
- `id`: UUID (Primary Key, references `auth.users.id`)
- `email`: String
- `role`: Enum (`'Lead'`, `'Client'`, `'Admin'`)
- `status`: Enum (`'Active'`, `'Banned'`, `'Rejected'`)
- `created_at`: Timestamp
- `last_login`: Timestamp

### `system_types`
Allows Admins to CRUD their own types of systems/sessions rather than relying on hardcoded enums.
- `id`: UUID (Primary Key)
- `name`: String (e.g., `'Chat Agent'`, `'Inbound Phone Agent'`)
- `description`: Text
- `created_at`: Timestamp

### `system_deployments`
Tracks the AI systems built for clients.
- `id`: UUID (Primary Key)
- `client_id`: UUID (references `profiles.id`)
- `system_type_id`: UUID (references `system_types.id`)
- `status`: Enum (`'Planning'`, `'Building'`, `'Active'`, `'Paused'`)
- `start_date`: Timestamp
- `end_date`: Timestamp (Optional, for ongoing access vs phased)
- `metrics`: JSONB (For tracking performance stats)
- `created_at`: Timestamp

### `lead_captures`
CRM entries for leads captured by the clients' AI agents.
- `id`: UUID (Primary Key)
- `client_id`: UUID (references `profiles.id`)
- `system_deployment_id`: UUID (references `system_deployments.id`, nullable)
- `lead_name`: String
- `lead_contact`: String (Email or Phone)
- `phone_prefix`: String
- `phone_number`: String
- `address_line_1`: String
- `address_line_2`: String (nullable)
- `post_code`: String
- `city`: String
- `county`: String
- `country`: String
- `interaction_logs`: JSONB (Transcripts or interaction history)
- `captured_at`: Timestamp

### `properties` (Real Estate Listings)
- `id`: UUID (Primary Key)
- `title`: String
- `price`: Numeric
- `location`: String
- `sqft`: Numeric
- `status`: Enum (`'Active'`, `'Pending'`, `'Sold'`)
- `created_at`: Timestamp

### `tours`
Types of tours available for a property.
- `id`: UUID (Primary Key)
- `property_id`: UUID (references `properties.id`)
- `max_slots`: Integer
- `duration_minutes`: Integer
- `created_at`: Timestamp

### `tour_availability`
Calendar availability rules for tours.
- `id`: UUID (Primary Key)
- `tour_id`: UUID (references `tours.id`)
- `start_time`: Timestamp
- `end_time`: Timestamp
- `is_ongoing`: Boolean
- `rules`: JSONB (Exceptions, specific active periods)

### `bookings`
Tours booked by Users (Leads).
- `id`: UUID (Primary Key)
- `tour_id`: UUID (references `tours.id`)
- `user_id`: UUID (references `profiles.id` - Lead)
- `status`: Enum (`'Scheduled'`, `'Rescheduled'`, `'Cancelled'`, `'Completed'`)
- `cancellation_reason`: Text (nullable)
- `scheduled_for`: Timestamp
- `created_at`: Timestamp

### `activity_logs`
System-wide audit logs.
- `id`: UUID (Primary Key)
- `user_id`: UUID (references `profiles.id`)
- `action_type`: String (e.g., `'login'`, `'system_interaction'`, `'lead_capture'`)
- `description`: Text
- `timestamp`: Timestamp

### `payments`
Manual crypto payment verification log.
- `id`: UUID (Primary Key)
- `client_id`: UUID (references `profiles.id`)
- `amount_paid`: Numeric
- `transaction_hash`: String (Unique)
- `payment_status`: Enum (`'Pending'`, `'Verified'`, `'Rejected'`)
- `verified_by`: UUID (references `profiles.id`, nullable - Admin who verified it)
- `created_at`: Timestamp

---

## 2. Frontend Routing & Pages Structure

We will use React Router to create protected routes based on user roles (`Lead`, `Client`, `Admin`).

### General User Pages (Public / Unrestricted)
- `/signup`: Registration page (defaults new users to `'Lead'`).
- `/login`: Authentication page.
- `/logout`: Action to clear session.
- `/profile`: Basic profile management.

### Admin Pages (VirtueNex Team)
Protected by `AdminRoute` wrapper.
- `/admin`: Global Dashboard (High-level metrics).
- `/admin/deployments`: **System Deployments** (CRUD for deployments and client packages).
- `/admin/deployments/:id`: Unique slug for managing a specific deployment.
- `/admin/system-types`: **System Types** (CRUD options for types of systems/sessions).
- `/admin/leads`: **Automated Lead Manager** (View all leads captured across the system).
- `/admin/crm`: **Client / CRM Manager** (Manage users, update roles from Lead to Client, ban users).
- `/admin/clients/:id`: Details view for a specific client.
- `/admin/properties`: **Property Listings** (CRUD properties and tours).
- `/admin/bookings`: **Tour Scheduler / Bookings** (Manage calendar availability and view bookings).
- `/admin/bookings/:id`: Details view for a specific booking.
- `/admin/payments`: View and manually verify Crypto transactions.
- `/admin/reporting`: Reporting and Analytics.
- `/admin/settings`: Admin preferences.

### Lead Pages (Prospective Buyers)
Protected by `LeadRoute` wrapper.
- `/lead/bookings`: **Manage Bookings** (View and reschedule property tours).
- `/lead/history`: View property viewing history and logins.

### Client Pages (Real Estate Agents/Brokers)
Protected by `ClientRoute` wrapper.
- `/client`: Client Dashboard.
- `/client/systems`: **System Management** (List of active Chat/Phone agents & Data syncs).
- `/client/systems/:id`: Unique slug to view specific system details and metrics.
- `/client/crm`: **Lead CRM Access** (View leads captured exclusively by their own agents).
- `/client/billing`: View their own payment history (Transaction hashes and status).

---

## 3. UI/UX Implementation Details

- **Branding**:
  - Pure Black (`#000000`) for backgrounds.
  - Golden Amber (`#FFBF00`) for primary accents, buttons, and active states.
  - Pure White (`#FFFFFF`) for primary text and high-contrast elements.
- **Component Library**:
  - We will integrate and customize **Shadcn UI** components (e.g., Tables, Cards, Inputs, Buttons) to match the dark, techy VirtueNex aesthetic.
- **Interactions**:
  - Modals (Dialogs in Shadcn) will be strictly reserved for confirmations (e.g., "Confirm Payment Verification", "Ban User") and small field edits.
  - Larger content changes will utilize dedicated slug-based pages.
- **Notifications**:
  - Implement a global Toast provider configured to appear at the **top-left** of the screen (`position="top-left"`).

---

## 4. Verification Plan

### Automated / Static Checks
1. Ensure TypeScript compilation passes (`npm run typecheck`).
2. Verify ESLint rules pass without new errors.
3. Validate Supabase types generation aligns with the schema.

### Manual Verification Steps
1. **User Flow**: Sign up a new user and verify they are assigned the `'Lead'` role.
2. **Admin CRM Flow**: Log in as an Admin, change the new user's role to `'Client'`, and verify the change persists. Ensure banning a user blocks their login.
3. **Deployment Flow**: Create a new System Deployment for a Client. Log in as the Client and verify they can see the deployment in `/client/systems`.
4. **CRM Flow**: Insert a dummy Lead Capture assigned to the Client. Verify the Client can see it in `/client/crm` but other clients cannot (testing RLS).
5. **Payment Flow**: Submit a dummy transaction hash as a Client. Log in as Admin, verify the payment, and ensure the Client's view updates to `'Verified'`.
6. **UI Constraints**: Trigger a toast message and verify it appears in the top-left. Open an edit dialog and ensure it behaves as a modal according to the design brief.
