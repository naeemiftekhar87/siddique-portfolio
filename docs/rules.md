# AI Project Rules

## 1. Instruction Priority

The AI must follow the project owner's instructions as the primary source of truth for this project.

- Follow the user's explicit instructions exactly.
- Do not override project-specific instructions with personal assumptions.
- Do not introduce requirements that the user did not request.
- If the user's latest instruction conflicts with an earlier instruction, follow the latest explicit instruction.
- If an instruction is unclear, ask for clarification before making a significant decision.
- Never silently change the project scope.

---

## 2. Project Scope

This project is a personal portfolio, professional profile, research, publication, eBook, resume/CV, and content-management platform.

The AI must stay within the defined project scope unless the user explicitly requests a new feature or change.

Do not add:

- Unrequested features
- Unrequested pages
- Unrequested integrations
- Unrequested libraries
- Unrequested authentication providers
- Unrequested payment systems
- Unrequested AI functionality
- Unrequested database entities

If a potentially useful feature is identified, mention it as a suggestion instead of implementing it automatically.

---

## 3. User Approval

The AI must request user approval before making decisions that materially affect:

- Project architecture
- Database structure
- Authentication
- Authorization
- API design
- Deployment architecture
- Major dependencies
- Third-party services
- Pricing-related functionality
- Data migration
- Existing functionality
- Public URLs/routes
- Security configuration

Do not make major architectural decisions without explicit approval unless the user has already defined the architecture.

---

## 4. Do Not Assume

The AI must not assume:

- Requirements that were not provided
- Business rules that were not specified
- Data that does not exist
- API behavior
- Database relationships
- User permissions
- Design requirements
- Deployment configuration
- Third-party service configuration

When information is missing, either:

1. Ask the user, or
2. Clearly state the assumption before proceeding if the decision is minor and reversible.

---

## 5. Existing Code Comes First

Before modifying existing functionality:

- Inspect the relevant code.
- Understand the current implementation.
- Preserve existing behavior unless the user requests a change.
- Do not rewrite working code unnecessarily.
- Do not replace an existing library or architecture simply because another approach is preferred.

Prefer incremental changes over unnecessary rewrites.

---

## 6. Do Not Break Existing Features

When implementing a new feature:

- Check how it interacts with existing functionality.
- Preserve existing routes.
- Preserve existing API contracts where possible.
- Preserve existing database relationships.
- Preserve existing UI behavior unless requested otherwise.
- Avoid introducing regressions.

If a requested change requires breaking an existing feature, explain the impact before making the change.

---

## 7. Technology Decisions

Use the project's existing technology stack unless the user explicitly requests a change.

Do not introduce a new framework, library, database, service, or architectural pattern merely because it is popular or preferred by the AI.

Before adding a dependency, determine whether the existing project can accomplish the requirement without it.

If a new dependency is necessary, explain:

- Why it is needed
- What it does
- Its impact on the project
- Whether it introduces additional configuration or cost

---

## 8. Code Quality

All code must be:

- Clean
- Readable
- Maintainable
- Strongly typed
- Consistent with the existing project
- Modular
- Properly validated
- Production-oriented

Avoid:

- `any` unless absolutely necessary
- Duplicate logic
- Unnecessary abstractions
- Dead code
- Temporary hacks
- Unused imports
- Unused dependencies
- Hardcoded values where configuration is appropriate

---

## 9. TypeScript

If TypeScript is used:

- Prefer explicit types.
- Avoid `any`.
- Reuse existing types where possible.
- Keep API request/response types consistent.
- Properly type database results.
- Properly type component props.
- Do not bypass the type system simply to make code compile.

---

## 10. Database Rules

The database is the source of truth for dynamic portfolio content.

Do not hardcode dynamic content into the frontend when that content is supposed to be managed through the admin panel.

Examples include:

- Experience
- Education
- Skills
- Achievements
- Certificates
- Projects
- Publications
- Research papers
- Research interests
- Upcoming research
- Working papers
- eBooks
- Messages
- Website configuration

Before changing a database model:

- Check existing relationships.
- Check existing queries.
- Check API usage.
- Consider migration requirements.
- Do not delete or rename fields without approval if existing data may depend on them.

---

## 11. Admin Panel Rules

The admin panel is the primary content-management interface.

If content is intended to be editable by the administrator, the AI must ensure that the required CRUD functionality exists.

CRUD means:

- Create
- Read
- Update
- Delete

Destructive actions must include confirmation.

Admin-only functionality must never be exposed to unauthenticated public users.

---

## 12. Public Website Rules

The public website should consume managed content from the project's data layer.

Do not duplicate the same content in multiple places unnecessarily.

For example, a research paper should have one source of truth and be reused by:

- Research page
- Research detail page
- Publications page where applicable
- Homepage research section

---

## 13. API Rules

APIs must:

- Validate input
- Validate authorization
- Return predictable responses
- Handle errors properly
- Avoid exposing sensitive information
- Use appropriate HTTP methods/status codes
- Avoid unnecessary database queries

Never trust client-side validation alone.

All important validation must also happen server-side.

---

## 14. Security

Security must never be weakened to make implementation easier.

Do not:

- Expose passwords
- Expose authentication secrets
- Expose private environment variables
- Return unnecessary sensitive database fields
- Bypass authorization
- Disable security middleware without approval
- Store secrets in source code
- Commit `.env` files

Use environment variables for secrets and credentials.

---

## 15. UI/UX Rules

Follow the project's established visual language:

- Deep navy
- Dark glassmorphism
- Cyan accents
- White/light content areas
- Amber highlights where specified
- Clean typography
- Responsive layouts
- Subtle animations

Do not redesign an existing page unless the user asks for a redesign.

When adding a new component, match the existing design system.

---

## 16. Responsive Design

Every new public-facing feature must work on:

- Desktop
- Tablet
- Mobile

Do not implement desktop-only layouts unless explicitly requested.

Admin interfaces should also remain usable on smaller screens.

---

## 17. Accessibility

New UI components should follow basic accessibility practices:

- Semantic HTML
- Proper labels
- Keyboard accessibility
- Visible focus states
- Accessible buttons
- Appropriate alt text
- Accessible dialogs
- Accessible accordions
- Sufficient contrast

Do not sacrifice accessibility for visual effects.

---

## 18. SEO

Public pages should remain SEO-friendly.

When creating or modifying public pages, consider:

- Page title
- Meta description
- Canonical URL
- Open Graph metadata
- Semantic HTML
- Proper headings
- Indexing configuration

Do not accidentally disable indexing for public pages unless instructed.

---

## 19. Content

Never invent personal information for the portfolio.

Do not fabricate:

- Jobs
- Companies
- Degrees
- GPA
- Certificates
- Awards
- Publications
- Research papers
- Authors
- Research metrics
- Skills
- Achievements
- Contact information
- Social profiles

If information is missing, use a clearly marked placeholder only when appropriate, or ask the user.

---

## 20. Research and Publication Data

Research-related information must be treated carefully.

Do not invent:

- DOI numbers
- Citation counts
- h-index
- i10-index
- Publication status
- Journal names
- Authors
- Publication dates
- Research results

If external research information is required, verify it from an appropriate source before using it.

---

## 21. Resume/CV Rules

Resume, CV, and infographic content should be generated from the project's structured data whenever possible.

Do not create separate hardcoded copies of:

- Experience
- Education
- Skills
- Certifications
- Publications
- Research

The resume system should use the existing data source.

---

## 22. Media Rules

Images and documents should be managed through the project's media system when one exists.

Do not hardcode uploaded file paths throughout the application.

Use reusable media references/URLs.

Before deleting media, check whether it is referenced elsewhere when the system supports such checks.

---

## 23. Error Handling

Every important operation should handle:

- Loading state
- Success state
- Validation errors
- Server errors
- Empty states
- Network failures where applicable

Do not leave users with silent failures.

Errors shown to users should be understandable and should not expose internal stack traces or secrets.

---

## 24. Testing

Before considering a significant feature complete, verify:

- Happy path
- Validation
- Error handling
- Authentication/authorization
- Mobile layout
- Existing related functionality
- CRUD operations where applicable

Do not claim that something works if it has not been verified.

---

## 25. Changes and Commits

Keep changes focused.

Do not combine unrelated changes into one implementation.

When modifying an existing feature:

1. Explain what will change.
2. Make the smallest reasonable change.
3. Verify related functionality.
4. Report what was changed.

---

## 26. File and Folder Structure

Follow the existing project structure.

Do not reorganize the entire project unless explicitly requested.

Create new files only when they have a clear purpose.

Avoid unnecessary files such as:

- Duplicate utility files
- Duplicate types
- Temporary test files
- Unused components
- Unused configuration files

---

## 27. Dependencies

Before installing a package:

- Check whether an existing dependency already provides the functionality.
- Prefer established project dependencies.
- Avoid unnecessary packages.
- Avoid packages that duplicate existing functionality.

Do not install dependencies automatically for minor tasks when native functionality is sufficient.

---

## 28. External Services

Do not connect or configure third-party services without explicit instruction.

Examples:

- Google APIs
- Google Scholar
- ORCID
- ResearchGate
- Cloud storage
- Email services
- Payment providers
- Analytics providers
- Authentication providers

If an external service is needed, tell the user before implementing it.

---

## 29. AI Behavior

The AI is an implementation assistant, not the product owner.

The AI must:

- Follow the user's instructions.
- Preserve the user's decisions.
- Ask when important information is missing.
- Explain meaningful trade-offs.
- Avoid silently changing requirements.
- Avoid imposing personal preferences.
- Avoid unnecessary complexity.
- Avoid changing architecture without approval.

The AI may recommend alternatives, but recommendations must remain separate from the requested implementation.

---

## 30. When Instructions Conflict

When multiple instructions appear to conflict:

1. Follow the user's latest explicit instruction.
2. Follow the project's documented rules.
3. Preserve existing behavior where possible.
4. Ask for clarification if the conflict affects architecture, data, security, or scope.

Never silently choose a major interpretation.

---

## 31. Definition of Done

A feature is considered complete only when:

- The requested functionality is implemented.
- The implementation matches the requirements.
- Existing related functionality still works.
- Validation is implemented.
- Error handling is implemented.
- Authorization is correct.
- The UI is responsive where applicable.
- No unnecessary dependencies were introduced.
- No unrelated code was changed.
- The implementation has been tested or verified to the extent possible.

---

## 32. Most Important Rule

> **Do exactly what the project owner asks. Do not make product decisions on the owner's behalf.**

If something is not specified, do not invent a requirement.

If the missing information materially affects the implementation, ask first.

The AI should optimize for **correctness, maintainability, simplicity, and alignment with the owner's instructions** rather than adding features or complexity for its own reasons.
