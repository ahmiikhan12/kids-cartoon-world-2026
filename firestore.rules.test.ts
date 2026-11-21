/**
 * Security Rule Verification Suite — Kids Cartoon World
 *
 * Documents the 12 adversarial "Dirty Dozen" test cases defined in security_spec.md
 * against firestore.rules. Run with the Firebase Rules Unit Testing emulator suite
 * (`@firebase/rules-unit-testing`) when testing locally against the Firestore emulator.
 */

export interface SecurityTestCase {
  id: string;
  name: string;
  collection: 'videos' | 'inquiries' | 'admins';
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  rationale: string;
  samplePayload: Record<string, unknown>;
}

export const DIRTY_DOZEN_SECURITY_TESTS: SecurityTestCase[] = [
  {
    id: 'DD-01',
    name: 'Unauthenticated Video Create',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'Anonymous visitors must never be allowed to write to /videos.',
    samplePayload: { title: 'Unauthorized Upload', isPublished: true },
  },
  {
    id: 'DD-02',
    name: 'Non-Admin Verified User Video Create',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'Only the verified website owner or registered admin can create videos.',
    samplePayload: { title: 'Non-Owner Upload', rightsConfirmed: true },
  },
  {
    id: 'DD-03',
    name: 'Unverified Email Spoofing Attack',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'email_verified == true is strictly required alongside owner email.',
    samplePayload: { title: 'Spoofed Owner', ownerUid: 'spoof-uid' },
  },
  {
    id: 'DD-04',
    name: 'Shadow / Ghost Field Injection',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'isValidVideo enforces keys().hasOnly(...) to block unexpected fields.',
    samplePayload: { title: 'Valid Title', isVerified: true, secretFlag: 1 },
  },
  {
    id: 'DD-05',
    name: 'Path ID Poisoning',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'isValidId rejects IDs containing illegal symbols or exceeding 128 chars.',
    samplePayload: { docId: '../evil$path!', title: 'Poisoned ID' },
  },
  {
    id: 'DD-06',
    name: 'Rights Confirmation Bypass',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'rightsConfirmed must be strictly boolean true on every create/update.',
    samplePayload: { title: 'Unlicensed Clip', rightsConfirmed: false },
  },
  {
    id: 'DD-07',
    name: 'Client Timestamp Forgery',
    collection: 'videos',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'createdAt and updatedAt must equal server request.time.',
    samplePayload: { title: 'Backdated Video', createdAt: '2020-01-01T00:00:00Z' },
  },
  {
    id: 'DD-08',
    name: 'Immutable Owner/CreatedAt Tampering',
    collection: 'videos',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    rationale: 'affectedKeys().hasOnly(...) forbids mutating ownerUid or createdAt.',
    samplePayload: { ownerUid: 'hijacked-uid' },
  },
  {
    id: 'DD-09',
    name: 'Value Poisoning / Oversized String',
    collection: 'videos',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    rationale: 'isValidVideo rejects titles > 120 chars or non-string types.',
    samplePayload: { title: 'X'.repeat(500) },
  },
  {
    id: 'DD-10',
    name: 'Unpublished Draft Read by Visitor',
    collection: 'videos',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    rationale: 'Visitors may only read documents where existing().isPublished == true.',
    samplePayload: { docId: 'draft-video-1' },
  },
  {
    id: 'DD-11',
    name: 'Cross-User Inquiry PII Read',
    collection: 'inquiries',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    rationale: 'Parent inquiries contain PII and are readable only by sender or admin.',
    samplePayload: { docId: 'inquiry-owned-by-other-parent' },
  },
  {
    id: 'DD-12',
    name: 'Self-Assigned Admin Privilege Escalation',
    collection: 'admins',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    rationale: 'Only isBootstrappedAdmin() may write to /admins/{adminUid}.',
    samplePayload: { email: 'attacker@example.com', role: 'admin' },
  },
];
