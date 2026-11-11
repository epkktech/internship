import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  limit,
  writeBatch
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Student, Company, WeeklySubmission, Announcement, Form3SupervisionRecord } from '../types';
import { getAllLoginSheetStudents } from './sheetAuthService';

export const COLLECTIONS = {
  STUDENTS: 'students',
  COMPANIES: 'companies',
  SUBMISSIONS: 'submissions',
  ANNOUNCEMENTS: 'announcements',
  FORM3_SUPERVISIONS: 'form3_supervisions',
  APP_METADATA: 'app_metadata',
} as const;

/**
 * Listen for real-time changes to the Students collection
 */
export function subscribeStudents(
  onData: (students: Student[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = COLLECTIONS.STUDENTS;
  return onSnapshot(
    collection(db, colPath),
    (snapshot) => {
      const items: Student[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Student);
      });
      onData(items);
    },
    (error) => {
      console.warn(`Firestore subscription notice for ${colPath}:`, error.message);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Listen for real-time changes to the Companies collection
 */
export function subscribeCompanies(
  onData: (companies: Company[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = COLLECTIONS.COMPANIES;
  return onSnapshot(
    collection(db, colPath),
    (snapshot) => {
      const items: Company[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Company);
      });
      onData(items);
    },
    (error) => {
      console.warn(`Firestore subscription notice for ${colPath}:`, error.message);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Listen for real-time changes to the Submissions collection
 */
export function subscribeSubmissions(
  onData: (submissions: WeeklySubmission[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = COLLECTIONS.SUBMISSIONS;
  return onSnapshot(
    collection(db, colPath),
    (snapshot) => {
      const items: WeeklySubmission[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as WeeklySubmission);
      });
      onData(items);
    },
    (error) => {
      console.warn(`Firestore subscription notice for ${colPath}:`, error.message);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Save or update a student document in Firestore
 */
export async function saveStudentToFirestore(student: Student): Promise<void> {
  const path = `${COLLECTIONS.STUDENTS}/${student.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save or update a company document in Firestore
 */
export async function saveCompanyToFirestore(company: Company): Promise<void> {
  const path = `${COLLECTIONS.COMPANIES}/${company.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.COMPANIES, company.id), company, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save or update a weekly submission in Firestore
 */
export async function saveSubmissionToFirestore(submission: WeeklySubmission): Promise<void> {
  const path = `${COLLECTIONS.SUBMISSIONS}/${submission.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, submission.id), submission, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Seed initial data if the Firestore collection is empty
 * Strictly seeds directly from Google Sheets "login" tab students & companies
 */
export async function seedFirestoreIfEmpty(
  _mockStudents: Student[],
  mockCompanies: Company[],
  mockWeeklySubmissions: Record<string, WeeklySubmission[]>,
  mockAnnouncements: Announcement[]
): Promise<void> {
  try {
    const studentSnapshot = await getDocs(query(collection(db, COLLECTIONS.STUDENTS), limit(1)));
    if (studentSnapshot.empty) {
      console.log('Seeding initial data into Firestore (internship2-2569) from Google Sheets login tab...');
      
      // Seed real students from Google Sheets login tab
      const realStudents = getAllLoginSheetStudents();
      for (const student of realStudents) {
        await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student);
      }

      // Seed companies
      for (const company of mockCompanies) {
        await setDoc(doc(db, COLLECTIONS.COMPANIES, company.id), company);
      }

      // Seed submissions
      for (const studentSubs of Object.values(mockWeeklySubmissions)) {
        for (const sub of studentSubs) {
          await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, sub.id), sub);
        }
      }

      // Seed announcements
      for (const ann of mockAnnouncements) {
        await setDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, ann.id), ann);
      }
      console.log('Firestore seed completed successfully from Google Sheets login tab.');
    }
  } catch (error) {
    console.warn('Seed operation check note:', error);
  }
}

/**
 * Save or update a Form_3 supervision report in Firestore
 */
export async function saveForm3SupervisionToFirestore(record: Form3SupervisionRecord): Promise<void> {
  const path = `${COLLECTIONS.FORM3_SUPERVISIONS}/${record.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.FORM3_SUPERVISIONS, record.id), record, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Listen for real-time changes to the Form3 Supervisions collection
 */
export function subscribeForm3Supervisions(
  onData: (records: Form3SupervisionRecord[]) => void,
  onError?: (err: Error) => void
) {
  const colPath = COLLECTIONS.FORM3_SUPERVISIONS;
  return onSnapshot(
    collection(db, colPath),
    (snapshot) => {
      const items: Form3SupervisionRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Form3SupervisionRecord);
      });
      onData(items);
    },
    (error) => {
      console.warn(`Firestore subscription notice for ${colPath}:`, error.message);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Delete a single weekly submission document from Firestore
 */
export async function deleteSubmissionFromFirestore(submissionId: string): Promise<void> {
  const path = `${COLLECTIONS.SUBMISSIONS}/${submissionId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.SUBMISSIONS, submissionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Delete all weekly submissions for a specific student from Firestore
 */
export async function deleteSubmissionsForStudent(studentId: string): Promise<number> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.SUBMISSIONS));
    let deletedCount = 0;
    const batch = writeBatch(db);
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.studentId === studentId) {
        batch.delete(docSnap.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
    }
    return deletedCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.SUBMISSIONS);
  }
}

/**
 * Delete ALL weekly submissions from Firestore
 */
export async function deleteAllSubmissionsFromFirestore(): Promise<number> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.SUBMISSIONS));
    let deletedCount = 0;
    const batch = writeBatch(db);

    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
      deletedCount++;
    });

    if (deletedCount > 0) {
      await batch.commit();
    }
    return deletedCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.SUBMISSIONS);
  }
}

/**
 * Delete a company document from Firestore and optionally its associated Form 3 supervision records
 * Also unassigns any students enrolled in that company and records company as deleted
 */
export async function deleteCompanyFromFirestore(companyId: string, companyName?: string): Promise<void> {
  const path = `${COLLECTIONS.COMPANIES}/${companyId}`;
  try {
    const batch = writeBatch(db);

    // 1. Delete company doc
    if (companyId) {
      batch.delete(doc(db, COLLECTIONS.COMPANIES, companyId));
    }

    // 2. Delete any company docs by name match
    if (companyName) {
      const companiesSnap = await getDocs(collection(db, COLLECTIONS.COMPANIES));
      companiesSnap.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.name === companyName || d.id === companyId) {
          batch.delete(docSnap.ref);
        }
      });
    }

    // 3. Delete associated supervision records if companyName or companyId is provided
    if (companyName || companyId) {
      const supervisionsSnap = await getDocs(collection(db, COLLECTIONS.FORM3_SUPERVISIONS));
      supervisionsSnap.forEach((docSnap) => {
        const d = docSnap.data() as Form3SupervisionRecord;
        if ((companyName && d.companyName === companyName) || d.companyId === companyId) {
          batch.delete(docSnap.ref);
        }
      });
    }

    // 4. Clear companyName for students assigned to this company
    if (companyName || companyId) {
      const studentsSnap = await getDocs(collection(db, COLLECTIONS.STUDENTS));
      studentsSnap.forEach((docSnap) => {
        const d = docSnap.data() as Student;
        if ((companyName && d.companyName === companyName) || d.companyId === companyId) {
          batch.update(docSnap.ref, {
            companyName: '',
            companyId: ''
          });
        }
      });
    }

    // 5. Update deleted_companies metadata in Firestore
    if (companyName) {
      const metaRef = doc(db, COLLECTIONS.APP_METADATA, 'deleted_companies');
      try {
        const metaSnap = await getDoc(metaRef);
        let list: string[] = [];
        if (metaSnap.exists()) {
          list = metaSnap.data().deletedNames || [];
        }
        if (!list.includes(companyName)) {
          list.push(companyName);
        }
        batch.set(metaRef, { deletedNames: list, allDeleted: false }, { merge: true });
      } catch {
        batch.set(metaRef, { deletedNames: [companyName], allDeleted: false }, { merge: true });
      }
    }

    await batch.commit();

    // Cache in localStorage for instant local reactivity
    if (companyName) {
      try {
        const stored = localStorage.getItem('kktech_deleted_companies');
        const list: string[] = stored ? JSON.parse(stored) : [];
        if (!list.includes(companyName)) {
          list.push(companyName);
          localStorage.setItem('kktech_deleted_companies', JSON.stringify(list));
        }
      } catch {}
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Delete a single Form 3 supervision record from Firestore
 */
export async function deleteForm3SupervisionFromFirestore(recordId: string): Promise<void> {
  const path = `${COLLECTIONS.FORM3_SUPERVISIONS}/${recordId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.FORM3_SUPERVISIONS, recordId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Delete ALL companies and ALL Form 3 supervision records from Firestore
 */
export async function deleteAllCompaniesAndSupervisionsFromFirestore(): Promise<{ deletedCompanies: number; deletedSupervisions: number }> {
  try {
    const compSnapshot = await getDocs(collection(db, COLLECTIONS.COMPANIES));
    const supSnapshot = await getDocs(collection(db, COLLECTIONS.FORM3_SUPERVISIONS));
    const stdSnapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    
    let deletedCompanies = 0;
    let deletedSupervisions = 0;

    const batch = writeBatch(db);

    compSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
      deletedCompanies++;
    });

    supSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
      deletedSupervisions++;
    });

    stdSnapshot.forEach((docSnap) => {
      batch.update(docSnap.ref, {
        companyName: '',
        companyId: ''
      });
    });

    const metaRef = doc(db, COLLECTIONS.APP_METADATA, 'deleted_companies');
    batch.set(metaRef, { deletedNames: ['__ALL__'], allDeleted: true });

    await batch.commit();

    try {
      localStorage.setItem('kktech_deleted_companies', JSON.stringify(['__ALL__']));
    } catch {}

    return { deletedCompanies, deletedSupervisions };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.COMPANIES}+${COLLECTIONS.FORM3_SUPERVISIONS}`);
  }
}

/**
 * Real-time subscription to deleted companies list
 */
export function subscribeDeletedCompanies(
  onData: (deletedNames: string[], allDeleted: boolean) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    doc(db, COLLECTIONS.APP_METADATA, 'deleted_companies'),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const names = (data.deletedNames as string[]) || [];
        const allDeleted = !!data.allDeleted || names.includes('__ALL__');
        onData(names, allDeleted);
      } else {
        try {
          const stored = localStorage.getItem('kktech_deleted_companies');
          const list: string[] = stored ? JSON.parse(stored) : [];
          onData(list, list.includes('__ALL__'));
        } catch {
          onData([], false);
        }
      }
    },
    (error) => {
      console.warn('Deleted companies stream note:', error.message);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Reset deleted companies tracking (called when re-importing fresh data from Google Sheet)
 */
export async function resetDeletedCompanies(): Promise<void> {
  try {
    const metaRef = doc(db, COLLECTIONS.APP_METADATA, 'deleted_companies');
    await setDoc(metaRef, { deletedNames: [], allDeleted: false });
    try {
      localStorage.removeItem('kktech_deleted_companies');
    } catch {}
  } catch (error) {
    console.warn('Reset deleted companies notice:', error);
  }
}

/**
 * Restore all deleted data back to original:
 * 1. Resets deleted_companies metadata in Firestore
 * 2. Clears local storage deletion flags
 * 3. Restores all 123 students with their original company assignment from Google Sheets login tab
 * 4. Restores default companies in Firestore
 * 5. Restores weekly submissions in Firestore
 */
export async function restoreAllDeletedDataToOriginal(
  mockCompanies: Company[],
  mockWeeklySubmissions: Record<string, WeeklySubmission[]>
): Promise<{ restoredStudents: number; restoredCompanies: number; restoredSubmissions: number }> {
  console.log('[Restore] Restoring all deleted data back to original...');
  let restoredStudents = 0;
  let restoredCompanies = 0;
  let restoredSubmissions = 0;

  try {
    // 1. Reset deleted companies metadata
    const metaRef = doc(db, COLLECTIONS.APP_METADATA, 'deleted_companies');
    await setDoc(metaRef, { deletedNames: [], allDeleted: false });
    try {
      localStorage.removeItem('kktech_deleted_companies');
    } catch {}

    // 2. Restore all students from Google Sheets login tab
    const sheetStudents = getAllLoginSheetStudents();
    for (const student of sheetStudents) {
      if (student && student.id) {
        await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student, { merge: true });
        restoredStudents++;
      }
    }

    // 3. Restore all companies
    for (const company of mockCompanies) {
      if (company && company.id) {
        await setDoc(doc(db, COLLECTIONS.COMPANIES, company.id), company, { merge: true });
        restoredCompanies++;
      }
    }

    // 4. Restore submissions
    for (const studentSubs of Object.values(mockWeeklySubmissions)) {
      for (const sub of studentSubs) {
        await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, sub.id), sub, { merge: true });
        restoredSubmissions++;
      }
    }

    // Dispatch global event for live views
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kktech_data_restored', {
        detail: { restoredStudents, restoredCompanies, restoredSubmissions }
      }));
    }

    console.log(`[Restore] Successfully restored: ${restoredStudents} students, ${restoredCompanies} companies, ${restoredSubmissions} submissions.`);
    return { restoredStudents, restoredCompanies, restoredSubmissions };
  } catch (error) {
    console.error('Error during data restoration:', error);
    throw error;
  }
}

