# Calendly Integration Plan

## A. Recommended Embed Approach
**Recommendation:** Multi-Step Lead Capture Modal leading to `react-calendly` Popup/Inline embed.

**Reasoning:**
1. **Higher Conversion Intent:** Asking qualification questions *before* showing the calendar increases the quality of booked calls.
2. **Modal Experience:** The user requested the booking widget to appear inside a modal triggered by a "Book a Call" CTA, rather than inline on the webpage, maintaining a cleaner landing page design.
3. **Data Pre-filling:** By capturing the user's Name and Email in our own form first, we can securely pass this data into the Calendly component using the `prefill` prop. This prevents the user from typing their details twice.
4. **Performance:** The Calendly script is only loaded when the user actually reaches the calendar step of the modal.

---

## B. Step-by-Step Task List
- [x] **Remove Global Script:** Remove the hardcoded `<script src="https://assets.calendly.com/assets/external/widget.js">` from `index.html`.
- [x] **Setup Configuration:** Define Calendly environment variables (`VITE_CALENDLY_URL`) and brand colors in a central config file (`src/config/calendly.ts`).
- [x] **Install Library:** `react-calendly` is installed.
- [ ] **Create Form State Store/Context:** Manage the state for the 5-question pre-step form (e.g., current step, answers, name, email).
- [ ] **Build Lead Capture Modal Component:** Create a multi-step modal (`src/components/BookingModal.tsx`) that:
  - Step 1-X: Asks the qualification questions.
  - Final Step: Asks for Name & Email.
  - Submit: Shows the Calendly Inline widget *inside* the modal, passing Name/Email via the `prefill` prop.
- [ ] **Refactor Existing Components:** Remove `CalendlyInlineWidget` and `CalendlyPopupWidget`. Use only the new `BookingModal`.
- [ ] **Integrate to CTA Buttons:** Update "Book a Call" buttons in `Hero.tsx` and `Contact.tsx` to trigger the new `BookingModal`.

---

## C. Files & Components to Add or Modify
- **[NEW]** `src/components/BookingModal.tsx`: The multi-step modal housing the questions and the calendar.
- **[DELETE]** `src/components/CalendlyInlineWidget.tsx` and `src/components/CalendlyPopupWidget.tsx`: No longer needed as we are using a custom wrapper modal.
- **[MODIFY]** `src/components/Hero.tsx` & `src/components/Contact.tsx`: Update buttons to open the new `BookingModal`.
- **[MODIFY]** `src/pages/ContactPage.tsx`: Update to use the new modal trigger instead of the inline widget.

---

#### Suggested Pre-Booking Questions
To qualify leads effectively before they reach the calendar, the modal will ask the following 5 questions (one step per screen):

1. **"What is your biggest operational bottleneck right now?"** 
   *Options: Missing website leads & slow after-hours responses, Missing phone calls while agents are busy, Website traffic isn't converting into leads, Too much manual data entry & CRM management, Other / Multiple areas*
2. **"How many team members/agents do you currently have?"** 
   *(Options: Just me, 2-5, 6-15, 16-50, 50+)*
3. **"Are you currently using a CRM system?"**
   *(Options: Yes (Salesforce/Hubspot/etc), Yes (Real Estate specific), We use spreadsheets, No)*
4. **"What is your primary goal for implementing AI automation?"**
   *(Free-text input or Options: Save time, Increase lead conversion, Reduce operational costs, Scale without hiring)*
5. **"Where should we send the calendar invitation and audit details?"**
   *(Inputs: Full Name, Email Address, optional Phone Number)* -> *These map to the Calendly prefill.*

---

## D. Environment and Config Needed
**Environment Variables (.env):**
```env
VITE_CALENDLY_URL=https://calendly.com/erdemerolsuer/virtuenex
```

**Configuration File (`src/config/calendly.ts`):**
Store brand colors (without the `#` as required by Calendly) and standard flags:
```ts
export const CALENDLY_CONFIG = {
  url: import.meta.env.VITE_CALENDLY_URL,
  primaryColor: 'e4cc25', // VirtueNex Gold
  backgroundColor: '111111', // Match dark mode theme
  textColor: 'ffffff', // White
  hideGdprBanner: true, // We will handle cookie consent on our own site wrapper
  hideEventTypeDetails: false // Adjust based on design preference
};
```

---

## E. QA Checklist
- [ ] **Responsive Design:** Ensure no horizontal scrolling or clipped dates on small devices (320px wide).
- [ ] **Cross-Browser:** Test on strict-tracking browsers like Safari and Firefox. Calendly relies on some cookies; verify the booking flow doesn't break.
- [ ] **Adblockers:** Verify behavior with uBlock Origin/Brave Shields. If the widget is blocked, does the fallback external link `"Book on Calendly"` appear?
- [ ] **Cookie Banner Alignment:** Ensure `hide_gdpr_banner=1` functions correctly so users aren't prompted by Calendly *and* VirtueNex.
- [ ] **Timezone Correctness:** Verify the timezone auto-detects based on the browser's local time setting (Calendly handles this natively, but verify it isn't forced to a static zone in the URL).
- [ ] **No Layout Shifts:** Confirm the parent container has a `min-height` (e.g., `700px`) so the page doesn't jump while the inner iframe initializes.

---

## F. Rollout Plan
1. **Local Development:** Implement components and verify functionality with the existing (`/contact`) event URL.
2. **Staging Verification:** Deploy to Vercel preview environments.
   - Verify the popup modal works correctly across different routes (e.g., interacting with React Router).
   - Ensure the script correctly cleans up and doesn't leave orphaned DOM nodes or double-injected scripts when navigating away and back.
3. **Production Release:** Merge to `main`.
4. **Post-Deploy Monitoring:** Monitor Vercel Web Vitals to ensure removing the global script improved `index.html` Time to Interactive (TTI) for non-booking pages.

---

## H. Future Upgrades
1. **Webhook Syncing Form Data:** Pass the form data (answers from the 5 questions) into a local Supabase database table (e.g., `lead_captures`) instantly when they hit the calendar step, ensuring we capture partial leads even if they don't finish booking a time.
2. **Advanced Event Tracking (UTM & Pixels):** Listen to `calendly.event_scheduled` window messages to fire custom Meta/Google Ads conversion events.
