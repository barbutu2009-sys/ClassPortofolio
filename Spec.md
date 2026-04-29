# Class Portfolio Platform — Product & Engineering Specification

## 1) Overview

### 1.1 Purpose

Build a simple, polished web platform for a class to upload and view projects permanently. The site should support images, videos, and external links, with a clean portfolio-style experience and minimal friction for uploading.

### 1.2 Product Goals

* Let anyone in the class upload a project quickly.
* Let visitors browse projects in a visually appealing gallery.
* Let anyone view a project’s details and media.
* Keep the system simple to build, maintain, and deploy.
* Prioritize strong UI/UX over feature complexity.

### 1.3 Non-Goals

* No complex user accounts.
* No private messaging.
* No comments system for the first version.
* No editable project ownership flow.
* No multi-tenant permissions model.
* No advanced social network features.

### 1.4 Recommended Scope

This should be a lightweight “class gallery” rather than a full platform. The MVP should work with:

* 1 homepage
* 1 upload page
* 1 project detail page
* 1 simple backend

---

## 2) Product Principles

### 2.1 Simplicity

Every screen should have one obvious job. Avoid clutter, deep menus, or unnecessary settings.

### 2.2 Visual Quality

The site should look intentional and modern even though the functionality is small.

### 2.3 Fast Interaction

Users should be able to upload and browse without friction.

### 2.4 Low Maintenance

Keep the architecture simple enough that one developer can manage it alone.

### 2.5 Resilience

The site should gracefully handle empty states, bad uploads, slow network, and missing media.

---

## 3) Proposed Stack

### 3.1 Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion for small animations

### 3.2 Backend

* Supabase Postgres for data storage
* Supabase Storage for uploaded media
* No authentication required for MVP

### 3.3 Hosting / Deployment

* GitHub for version control
* Vercel for frontend hosting
* Supabase for backend services

### 3.4 Why This Stack

* Next.js is ideal for structured pages, routing, and deployment.
* Tailwind speeds up UI iteration.
* Supabase avoids building a custom backend from scratch.
* Vercel keeps deployment simple.

---

## 4) Functional Requirements

### 4.1 Homepage

The homepage must:

* Show a gallery/grid of uploaded projects
* Display project title, media preview, and basic metadata
* Include a clear upload call-to-action
* Support search or filtering if time allows

### 4.2 Upload Flow

The upload page must:

* Accept a title
* Accept a description
* Accept either a file upload or a link
* Accept a content type selection
* Validate required fields before submission
* Show upload progress or a loading state
* Confirm success after submission

### 4.3 Project Detail Page

The detail page must:

* Show the media in a larger view
* Show the title and description
* Show the content type
* Show creation date
* Show a back navigation path to the gallery

### 4.4 Media Support

The platform must support:

* Images
* Videos
* External links

### 4.5 Empty State

If there are no projects yet, the site should display a polished empty state with a message and a clear upload button.

### 4.6 Error State

If upload fails, the site should clearly explain what happened and how to retry.

---

## 5) User Experience Requirements

### 5.1 Primary User Flow

1. User opens homepage.
2. User browses existing projects.
3. User clicks upload.
4. User submits a project.
5. Project appears in the gallery.
6. Visitors can open the project detail page.

### 5.2 Upload Experience

The upload form should feel fast and obvious:

* Use a centered layout.
* Keep fields in a clean order.
* Use a drag-and-drop area if possible.
* Make the submit button highly visible.
* Provide immediate feedback after submission.

### 5.3 Browse Experience

The gallery should feel like a curated portfolio:

* Use large cards with strong thumbnail previews.
* Include hover states.
* Make project cards feel clickable.
* Use consistent spacing and aspect ratios.

### 5.4 Mobile Experience

On mobile:

* Use a single-column layout.
* Keep buttons large enough for touch.
* Make media scale naturally.
* Avoid dense text blocks.

---

## 6) UI Direction

### 6.1 Visual Style

Recommended direction: modern dark mode with subtle accent color.

Suggested style properties:

* Dark background
* Soft borders
* Rounded cards
* Minimal shadows
* One accent color for buttons and highlights
* Large headlines
* Clean, readable body text

### 6.2 Design Goals

* Feel premium without being busy.
* Make projects look like featured content.
* Keep the interface calm and focused.

### 6.3 Layout System

Use a consistent spacing scale:

* Small spacing for internal card padding
* Medium spacing between sections
* Large spacing between major page blocks

### 6.4 Typography

* Use one modern sans-serif font.
* Keep headings bold and clear.
* Keep body text readable and not too small.
* Avoid decorative fonts.

### 6.5 Project Card Rules

Each card should include:

* Thumbnail or media preview
* Title
* Short description or excerpt
* Content type badge
* Hover transition

### 6.6 Motion Rules

Animations should be subtle:

* Card hover lift
* Button hover feedback
* Page fade-in or small slide-in
* Upload success confirmation animation

Avoid flashy or distracting motion.

---

## 7) Information Architecture

### 7.1 Pages

* `/` — Homepage / project gallery
* `/upload` — Upload form
* `/project/[id]` — Project detail page
* Optional: `/about` — simple class context page

### 7.2 Navigation

Top navigation should be minimal:

* Logo or site name
* Gallery link
* Upload link

No deep navigation hierarchy is needed.

---

## 8) Data Model

### 8.1 Core Table: `projects`

This is the only mandatory table for MVP.

Suggested schema:

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video', 'link')),
  created_at timestamp with time zone not null default now()
);
```

### 8.2 Optional Fields

If needed later:

* `thumbnail_url`
* `project_url`
* `tags`
* `source_name`

### 8.3 Why Keep It Small

A minimal schema reduces bugs and makes the project easier to finish quickly.

---

## 9) Storage Model

### 9.1 Storage Bucket

Create one public bucket for project media.

### 9.2 File Types

Allow:

* `.jpg`
* `.jpeg`
* `.png`
* `.webp`
* `.mp4`
* `.webm`

### 9.3 File Naming

Use generated unique file names rather than user-provided names.

### 9.4 Upload Strategy

* Upload file to Supabase Storage.
* Get the public URL.
* Save project metadata in the database.

---

## 10) Security Model

### 10.1 MVP Security Position

This app is intentionally simple and public-facing for class use.

### 10.2 Recommended Baseline

* Allow public reads.
* Allow public inserts only if you accept open uploads.
* Disable deletes for general users.
* Avoid update access unless specifically needed.

### 10.3 Practical Safety Notes

Because there is no auth, the upload form should still include:

* Client-side validation
* File type validation
* Size checks
* Rate-limiting if possible through the platform or hosting layer

### 10.4 RLS Strategy

If using Supabase Row Level Security, keep policies minimal and explicit.

Example concept:

* Public can read project records.
* Public can insert new records.
* Public cannot delete or update.

---

## 11) Component Inventory

### 11.1 Layout Components

* `Navbar`
* `Footer`
* `PageContainer`
* `SectionHeader`

### 11.2 Gallery Components

* `ProjectCard`
* `ProjectGrid`
* `EmptyState`
* `SearchBar` (optional)
* `FilterChip` (optional)

### 11.3 Upload Components

* `UploadForm`
* `Dropzone`
* `FilePreview`
* `SubmitButton`
* `UploadProgress`
* `SuccessMessage`
* `ErrorMessage`

### 11.4 Detail Components

* `MediaViewer`
* `ProjectMeta`
* `BackButton`

---

## 12) Page Specifications

### 12.1 Homepage Spec

Purpose:

* Show the class project gallery.

Sections:

* Hero header
* Upload CTA
* Project grid
* Optional filter/search row

Behavior:

* Default sort: newest first
* Cards should load fast
* Empty state should be visually strong

### 12.2 Upload Page Spec

Purpose:

* Let users submit a project.

Fields:

* Title
* Description
* Content type
* File upload or external link

Validation:

* Title required
* Content type required
* Either file or link required depending on content type

Behavior:

* Show upload progress
* Show success confirmation
* Redirect or link to the new project after submit

### 12.3 Detail Page Spec

Purpose:

* Show the full project.

Sections:

* Main media viewer
* Project title
* Description
* Metadata
* Back button

Behavior:

* Use responsive media sizing
* Preserve aspect ratio
* Handle missing previews gracefully

---

## 13) Validation Rules

### 13.1 Title

* Required
* Minimum length: 3 characters
* Maximum length: reasonable cap such as 120 characters

### 13.2 Description

* Optional
* Maximum length recommended to prevent abuse

### 13.3 Media

* Required
* File size limits should be enforced
* Accept only supported file types

### 13.4 Links

* Must be valid URLs
* Must be normalized before saving

---

## 14) Performance Guidelines

### 14.1 Frontend Performance

* Use optimized images.
* Avoid loading heavy media until needed.
* Keep bundles small.
* Split code by route.
* Do not overuse client-side state.

### 14.2 Media Performance

* Generate thumbnails if possible.
* Prefer compressed images.
* Use lazy loading for media below the fold.
* Avoid autoplaying videos on the homepage.

### 14.3 Database Performance

* Index the `created_at` column.
* Query only the fields needed for each view.
* Keep payloads small.

Example index:

```sql
create index if not exists projects_created_at_idx on projects (created_at desc);
```

---

## 15) Code Quality Guidelines

### 15.1 Component Design

* Keep components small.
* Move repeated UI into reusable pieces.
* Avoid duplicated markup.

### 15.2 Type Safety

* Use TypeScript everywhere.
* Define explicit types for project data.
* Avoid `any` where possible.

### 15.3 State Management

* Use local state only where necessary.
* Do not introduce a global state library unless the app grows.

### 15.4 Error Handling

* Handle network failures.
* Handle invalid media.
* Handle empty results.
* Provide clear, human-readable errors.

### 15.5 Naming

Use clear, descriptive names:

* `projectData`
* `isUploading`
* `selectedFile`
* `mediaType`

Avoid vague names.

---

## 16) Accessibility Guidelines

### 16.1 Essentials

* Maintain good color contrast.
* Ensure buttons are keyboard accessible.
* Label all form fields.
* Provide alt text for images.
* Provide accessible text for media actions.

### 16.2 Interaction Design

* Focus states must be visible.
* Touch targets should be large enough.
* Do not rely on color alone to communicate state.

### 16.3 Media Accessibility

* Use captions or descriptions where useful.
* Provide fallback text for unavailable content.

---

## 17) SEO / Sharing

### 17.1 Metadata

Each page should have meaningful:

* Title
* Description
* Open Graph image if possible

### 17.2 Shareability

Projects should be easy to open and view directly from a link.

### 17.3 Public Discovery

Because the site is public, the homepage should be indexable unless privacy requirements change.

---

## 18) Deployment Workflow

### 18.1 Repository Setup

* Create a GitHub repository.
* Push the Next.js app.
* Keep commits small and descriptive.

### 18.2 Environment Variables

Store secrets outside the repo.

Typical variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 18.3 Release Flow

1. Push code to GitHub.
2. Connect to Vercel.
3. Add environment variables.
4. Deploy.
5. Test upload and gallery flow end-to-end.

---

## 19) MVP Acceptance Criteria

The MVP is complete when:

* The homepage loads project cards from Supabase.
* Users can upload a project successfully.
* Uploaded projects appear in the gallery.
* Clicking a project opens a detail view.
* The site looks polished on desktop and mobile.
* The app handles empty state and error state gracefully.

---

## 20) Build Order

### Phase 1 — Foundation

* Set up Next.js project
* Set up Tailwind
* Connect Supabase
* Create projects table
* Build homepage shell

### Phase 2 — Upload System

* Build upload form
* Implement storage upload
* Save project metadata
* Add success/error states

### Phase 3 — Gallery + Detail

* Load projects into grid
* Build detail page
* Add media viewer logic

### Phase 4 — Polish

* Improve spacing and typography
* Add motion and hover states
* Add responsive behavior
* Add empty states and loading skeletons

---

## 21) Suggested UI Tone

The interface should feel:

* Clean
* Confident
* Modern
* Student-friendly
* Slightly premium

Avoid making it feel corporate, playful-chaotic, or overly technical.

---

## 22) Final Notes

This project should be built as a **small, elegant portfolio system** rather than a complex platform. The priority order is:

1. Works reliably
2. Looks excellent
3. Is easy to use
4. Is easy to maintain

A simple app with excellent UI will look more impressive than a feature-heavy app with weak design.
