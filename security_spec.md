# Security Specification & Threat Model — Kids Cartoon World

## 1. Data Invariants

1. **Owner-Only Video Catalog Management (`/videos/{videoId}`)**:
   - Ordinary visitors (including unauthenticated children and families) may only `get` or `list` videos where `isPublished == true`.
   - Unpublished drafts (`isPublished == false`) are strictly invisible to non-admins.
   - Only a verified administrator (`isAdmin()`) may `create`, `update`, or `delete` video documents.
   - Every created or updated video MUST have `rightsConfirmed == true`, valid category/source enums, bounded string lengths matching `firebase-blueprint.json`, immutable `ownerUid` and `createdAt`, and server-enforced `request.time` timestamps.
2. **PII-Isolated Parent Contact Inquiries (`/inquiries/{inquiryId}`)**:
   - Contains adult parent/guardian name and email (PII).
   - Never readable via blanket `isSignedIn()` queries.
   - Only `isAdmin()` or the exact authenticated sender (`existing().ownerUid == request.auth.uid`) can `get` an inquiry, and `list` explicitly restricts `resource.data.ownerUid == request.auth.uid || isBootstrappedAdmin()` with zero `get()`/`exists()` calls.
   - New inquiries MUST have `status == 'open'`, `isAdultConfirmed == true`, `ownerUid == request.auth.uid`, and `createdAt == request.time`.
   - Terminal State Locking: Once `status == 'resolved'`, non-admins cannot modify an inquiry. Only `isAdmin()` can update `status` or delete inquiries.
3. **Privilege Escalation Prevention (`/admins/{adminUid}`)**:
   - Only the bootstrapped website owner (`ahmadauto4645@gmail.com` with `email_verified == true`) can create, update, or delete admin records.
   - Regular users cannot self-assign admin roles.
4. **Global Default Deny**:
   - Any unmatched collection path is unconditionally denied (`allow read, write: if false;`).

## 2. The "Dirty Dozen" Adversarial Payloads (All Must Return PERMISSION_DENIED)

1. **Unauthenticated Video Create**: Anonymous visitor tries `setDoc('/videos/vid1', validVideoPayload)` -> DENIED (not admin).
2. **Non-Admin Verified User Video Create**: Signed-in non-owner user (`attacker@example.com`, `email_verified: true`) tries to add a video -> DENIED (`isAdmin()` false).
3. **Email Spoofing Attack**: Signed-in user with `email: "ahmadauto4645@gmail.com"` and `email_verified: false` tries to create a video -> DENIED (`email_verified == true` required).
4. **Shadow / Ghost Field Injection**: Admin sends valid video payload plus `"isVerified": true` -> DENIED (`keys().hasOnly(...)` fails).
5. **Path ID Poisoning**: Admin attempts to write to `/videos/../../evil$id!` or a 200-character ID -> DENIED (`isValidId(videoId)` fails).
6. **Rights Bypass Payload**: Admin tries to create a video with `rightsConfirmed: false` -> DENIED (`data.rightsConfirmed == true` fails).
7. **Timestamp Forgery**: Admin submits a client-forged `createdAt` timestamp instead of `serverTimestamp()` -> DENIED (`incoming().createdAt == request.time` fails).
8. **Immutable Field Tampering**: Admin tries to mutate `ownerUid` or `createdAt` during an update -> DENIED (`affectedKeys().hasOnly(...)` and immutability checks fail).
9. **Value Poisoning / Oversized String**: Admin tries to update `title` with a 500-character string or integer `12345` -> DENIED (`isValidVideo(incoming())` rejects type/length).
10. **Unpublished Draft Scraping**: Unauthenticated visitor tries `getDoc('/videos/draft1')` where `isPublished: false` -> DENIED.
11. **PII Cross-User Read**: Authenticated user B attempts `getDoc('/inquiries/inqByUserA')` -> DENIED (PII isolation).
12. **Self-Assigned Admin Escalation**: Regular user attempts `setDoc('/admins/' + uid, { email: 'me@example.com', role: 'admin', createdAt: serverTimestamp() })` -> DENIED (bootstrapped owner only).
