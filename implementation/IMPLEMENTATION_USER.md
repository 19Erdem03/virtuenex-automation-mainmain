# Implementation Plan: User & Client Dashboard

This document outlines the implementation plan for the unified user dashboard (`/dashboard`), serving non-admin roles (Leads, Clients). The dashboard will adapt its features based on the user's role, providing a branded, premium experience aligned with VirtueNex's aesthetics.

## Key Principles & Branding
- **Aesthetics**: Distinctive VirtueNex branding (Black `#000000`, Golden Amber `#FFBF00`, Pure White `#FFFFFF`).
- **Data Privacy**: Ensure RLS (Row Level Security) restricts users to their own data only.
- **Role-Based Views**: Differentiate functionality based on whether the user is a Lead (prospective client) or abstracting it to general Client (active client).

---

## Features

### 1. Unified Dashboard Layout & Navigation
- **Navigation Sidebar / Header**: Role-aware navigation links.
- **Notifications Hub**: Integration with the new notifications system to display alerts and updates to the user.

### 2. Booking Management (All Roles)
- Allow Leads and Clients to book Strategy Sessions or Support Meetings with the VirtueNex team. Note: This is for our business, not for real estate agents to manage their own property tours.
- [x] **View**: A list/calendar of their upcoming and past meetings with VirtueNex.
- [x] **Actions**: Ability to view meeting details, reschedule, or cancel bookings.

### 3. Role-Specific Overview & Statistics (Clients Only)
- Statistics and high-level metrics visible only to users with the `Client` role.
- **Payment History summary**: Display a summary of manual payments made (e.g., crypto, in-person transfers) for past and current AI deployments. Since payments are off-app, these are recorded by admins and displayed here for transparency.
- **System Deployments**: A quick summary of their active or planning AI agents.
- **Note**: Leads will see a cleaner dashboard focused on onboarding and booking their first call.

---

## Implementation Phases Checklist

### Phase 1: Foundation & Layout
- [x] **1.1** Build the Dashboard layout container (`/dashboard`) conforming to VirtueNex branding styles.
- [x] **1.2** Implement role-based section rendering (Leads vs. Clients) on the dashboard overview.

### Phase 2: Booking Management Widget
- [x] **2.1** Create a "My Meetings" widget on the dashboard.
- [x] **2.2** Fetch the user's scheduled meetings with VirtueNex from Supabase (filtered by `user_id`).
- [x] **2.3** Display meeting link ("Join" button) and status badges for each meeting.

### Phase 3: Notifications Integration
- [x] **3.1** Add notifications bell with dropdown to the dashboard header.
- [x] **3.2** Connect to real-time Supabase subscription on `bookings` table (filtered by `user_id`); status changes trigger in-app notifications with unread badge.

### Phase 4: Client-Specific Statistics & Payments (Clients Only)
- [x] **4.1** Create "Payment History" widget — displays off-app payment records (`transaction_hash`, amount, date, status) recorded by admins. Pending payments trigger a notice banner.
- [x] **4.2** Display overview of AI System Deployments (title, description, start date, status badge).
- [x] **4.3** Stats row: Active Deployments count, Total Verified Paid ($), Total AI Systems count — Client-only.

### Phase 5: Polish & UX Details
- [x] **5.1** Responsive grid layout (1-col on mobile, 2-col on lg for Client dashboard, centered max-width containers).
- [x] **5.2** Hover states on all cards, amber accent on interactive elements, smooth transitions.
- [x] **5.3** Empty states for all widgets (meetings, deployments, payments) designed with icons and helpful copy.
