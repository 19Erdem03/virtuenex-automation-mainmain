# Implementation Plan: VirtueNex Backend & Dashboards

This document outlines the detailed plan to add a Supabase backend and complete admin/client dashboards to the VirtueNex Automation website, tailored for an AI Automation Agency focused on Real Estate professionals.

## Goal
To implement a robust authentication, database, and dashboard system using Supabase, React Router, and Shadcn UI. The immediate priority is to set up the Supabase database schema and Row Level Security (RLS) policies, implement user authentication (signup/login), handle user roles (Lead, Client, Admin), and create mockup admin and user dashboards to test these flows. 

Subsequent phases will expand on this foundation to manage Client System Deployments, Lead capturing, and manual Crypto Payment verification, all adhering to the VirtueNex brand aesthetics.


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
- `client_id`: UUID (references `profiles.id`, nullable)
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

## 4. Phased Implementation & Verification Plan

### Phase 1: Foundation (Current Priority)
This phase focuses on establishing the core infrastructure and verifying access control.

1. **Supabase Setup:**
   - Create all database tables as defined in Section 1.
   - Implement Row Level Security (RLS) policies for all tables based on user roles (`Admin`, `Client`, `Lead`).
2. **Authentication & Roles:**
   - Implement Signup and Login pages using Supabase Auth.
   - Default new signups to the `'Lead'` role.
   - *Manual Step:* Create an Admin user directly in the Supabase dashboard by manually assigning the `'Admin'` role to a specific user's `profiles` record.
3. **Mockup Dashboards:**
   - Create a basic Admin Dashboard (`/admin`).
   - Create a basic User Dashboard (`/profile` or `/client` / `/lead/bookings` depending on the role).
4. **Verification:**
   - Sign up a new user and verify they are assigned the `'Lead'` role and directed to the appropriate dashboard.
   - Log in with the manually created Admin account and verify access to the Admin Dashboard.
   - Test RLS policies (e.g., ensure a Lead cannot view Admin or Client pages/data).
5. **Navbar Profile Integration:**
   - [x] Add Profile button with dropdown replacing `Log In` / `Book a Call` on Navbar for authenticated users.
   - [x] Dropdown should contain Profile picture placeholder, user email, `Profile` link, and `Log Out` link.
   - [x] Create `/profile` page for all users (accessible via `Dashboard` route wrapper or standalone).

### Phase 2: Core Features (Future)
*This phase will be tackled after Phase 1 is verified.*

- Implement detailed Admin CRM flows (managing users, updating roles from Lead to Client, banning users).
- Implement Deployment flows (creating System Deployments for Clients).
- Implement CRM flows (Lead Captures).
- Implement manual Crypto Payment verification flows.
- Integrate Shadcn UI components and VirtueNex branding extensively.

---
