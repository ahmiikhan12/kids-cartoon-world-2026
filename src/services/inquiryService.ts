import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { ParentInquiry } from '../types/video';

const INQUIRIES_COLLECTION = 'inquiries';

function toMillis(ts: unknown): number {
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as Timestamp).toMillis === 'function') {
    return (ts as Timestamp).toMillis();
  }
  return Date.now();
}

export interface CreateInquiryInput {
  senderName: string;
  senderEmail: string;
  topic: ParentInquiry['topic'];
  message: string;
  isAdultConfirmed: boolean;
}

export async function submitParentInquiry(
  input: CreateInquiryInput,
  ownerUid: string
): Promise<string> {
  const senderName = input.senderName.trim().slice(0, 80);
  const senderEmail = input.senderEmail.trim().slice(0, 120);
  const message = input.message.trim().slice(0, 1000);

  if (senderName.length < 2) {
    throw new Error('Please enter your name (at least 2 characters).');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  if (message.length < 10) {
    throw new Error('Please enter a message of at least 10 characters.');
  }
  if (!input.isAdultConfirmed) {
    throw new Error('Only parents or guardians (18+) may submit a contact message.');
  }

  const inquiryId = `inq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;

  try {
    await setDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), {
      senderName,
      senderEmail,
      topic: input.topic,
      message,
      isAdultConfirmed: true,
      status: 'open',
      ownerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeAdminInquiries(
  onUpdate: (inquiries: ParentInquiry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, INQUIRIES_COLLECTION),
    (snapshot) => {
      const list: ParentInquiry[] = snapshot.docs
        .map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            senderName: String(data.senderName ?? ''),
            senderEmail: String(data.senderEmail ?? ''),
            topic: (data.topic as ParentInquiry['topic']) ?? 'General Question',
            message: String(data.message ?? ''),
            isAdultConfirmed: Boolean(data.isAdultConfirmed),
            status: (data.status === 'resolved' ? 'resolved' : 'open') as 'open' | 'resolved',
            ownerUid: String(data.ownerUid ?? ''),
            createdAtMs: toMillis(data.createdAt),
          };
        })
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onUpdate(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, INQUIRIES_COLLECTION);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function setInquiryStatus(
  inquiryId: string,
  status: 'open' | 'resolved'
): Promise<void> {
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await updateDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(inquiryId: string): Promise<void> {
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await deleteDoc(doc(db, INQUIRIES_COLLECTION, inquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
