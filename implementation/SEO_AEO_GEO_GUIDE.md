# SEO, AEO, and GEO Implementation Guide

This document outlines the detailed steps to implement the SEO, AEO, and GEO optimization strategy for the VirtueNex Automation website.

## 1. Project Scope & Architecture
- **In-Code SEO**: Implement `react-helmet-async` for route-based dynamic metadata injection. We are optimizing for search engine crawlers (Google/Bing) and accepting that social media crawlers will only see the default `index.html` metadata.
- **Content Strategy**:
  - FAQs will be implemented as **static** components.
  - Articles/Blogs are planned to be dynamic or added iteratively. For the initial launch, we will create a `/blogs` page with **3 static blog posts** relevant to our niche (AI & Tech, Real Estate solutions/problems).
- **Mapping & Gatekeeping**:
  - Automatically generate `sitemap.xml` for all public pages, including the new `/blogs` routing.
  - Explicitly exclude restricted routes (`/admin`, `/dashboard`, `/login`) from `sitemap.xml`.
  - Create a `/public/robots.txt` that disallows crawling of restricted routes and points to the sitemap.
- **Footer Updates**: Add a visible "Last Updated" timestamp to the site footer.

## 2. Step-by-Step Implementation Plan

### Phase 1: Setup & Core Infrastructure
1. **Dependencies**: 
   - Install `react-helmet-async` for metadata management.
   - Install `vite-plugin-sitemap` for build-time sitemap generation.
2. **SEO Component**: Create a reusable `<SEO>` component (`src/components/SEO.tsx`) that accepts props:
   - `title`
   - `description`
   - `canonicalUrl`
   - `jsonLd` (for structured data)
3. **App Integration**: Wrap the main application tree in `<HelmetProvider>` within `src/main.tsx` or `src/App.tsx`.

### Phase 2: Content & the New "/blogs" Page
1. **Blog Assets**: Generate 3 AI images corresponding to the topics of our initial static blogs (Niche solutions, Real Estate Problems, AI & Tech advancements).
2. **Blog Pages**: 
   - Create the `BlogsPage.tsx` listing the articles.
   - Create 3 static individual blog post components (e.g., `BlogPostOne.tsx`, etc.).
3. **Routing**: Add the `/blogs` and individual blog routes to `src/App.tsx` within the public layout.
4. **Footer**: Update `src/components/Footer.tsx` to include a "Last Updated: [Date]" element.

### Phase 3: Metadata & Structured Data Injection
Inject the `<SEO>` component into **all** public-facing pages, adapting the metadata for each.

1. **HomePage (`/`)**: 
   - Relevant Title & Description.
   - Inject `Organization` and `WebSite` JSON-LD schema.
2. **Service Pages (`/services/*`)**:
   - Tailored titles (e.g., "AI Chat Assistants | VirtueNex").
   - Inject `Service` JSON-LD schema.
3. **Pricing & How It Works (`/pricing`, `/how-it-works`)**:
   - Relevant metadata.
4. **Contact Page (`/contact`)**:
   - Relevant metadata.
5. **Blog Pages (`/blogs/*`)**:
   - Inject `Article` JSON-LD schema on individual blog posts.
   - Relevant metadata for the listing page.
6. **FAQ Sections**:
   - Wherever static FAQs exist (e.g., on service pages or homepage), ensure `FAQPage` JSON-LD schema is injected via the respective page's `<SEO>` component.

### Phase 4: Sitemap & Robots.txt Configuration
1. **Sitemap (vite-plugin-sitemap)**: Configured in `vite.config.ts` to build standard `sitemap.xml` during the `npm run build` process.
   - Include dynamic paths if needed, but primarily list the known static routes (`/`, `/services/*`, `/pricing`, `/blogs/*`, etc.).
   - Explicitly ignore `/admin`, `/dashboard`, `/login`, etc.
2. **Robots.txt**: Create `public/robots.txt` with:
   ```txt
   User-agent: *
   Disallow: /admin/
   Disallow: /dashboard/
   Disallow: /login

   Sitemap: https://[your-domain]/sitemap.xml
   ```

## Next Steps Prompt
When ready to begin, we will proceed with **Phase 1: Setup & Core Infrastructure** and **Phase 2: Content & the New "/blogs" Page**.
