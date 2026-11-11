import JSZip from 'jszip';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from './firestoreService';
import { getAllLoginSheetStudents } from './sheetAuthService';
import { mockCompanies, mockStudents, mockWeeklySubmissions, mockAnnouncements } from '../data/mockData';

export interface PackageDownloadProgress {
  status: 'idle' | 'fetching' | 'processing' | 'ready' | 'error';
  message: string;
}

/**
 * Download the complete web server zip with the very latest code and live data from Firestore / localStorage
 */
export async function downloadLatestWebServerZip(
  onProgress?: (progress: PackageDownloadProgress) => void
): Promise<void> {
  const update = (status: PackageDownloadProgress['status'], message: string) => {
    if (onProgress) onProgress({ status, message });
  };

  try {
    update('fetching', 'กำลังดาวน์โหลดโครงสร้างไฟล์เว็บเวอร์ชันล่าสุด...');

    // 1. Fetch base zip with cache-busting timestamp
    const zipUrl = `./appserv_publish.zip?v=${Date.now()}`;
    const zipRes = await fetch(zipUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!zipRes.ok) {
      throw new Error(`ไม่สามารถโหลดไฟล์เว็บเซิร์ฟเวอร์ได้ (HTTP ${zipRes.status})`);
    }

    const zipBlob = await zipRes.blob();

    update('processing', 'กำลังดึงข้อมูลล่าสุดจากฐานข้อมูล Cloud Firestore และหน่วยความจำ...');

    // 2. Fetch live data from Firestore in parallel
    const [studentsSnap, companiesSnap, submissionsSnap, form3Snap, announcementsSnap] = await Promise.allSettled([
      getDocs(collection(db, COLLECTIONS.STUDENTS)),
      getDocs(collection(db, COLLECTIONS.COMPANIES)),
      getDocs(collection(db, COLLECTIONS.SUBMISSIONS)),
      getDocs(collection(db, COLLECTIONS.FORM3_SUPERVISIONS)),
      getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS))
    ]);

    const liveStudents: unknown[] = [];
    if (studentsSnap.status === 'fulfilled' && !studentsSnap.value.empty) {
      studentsSnap.value.forEach(d => liveStudents.push(d.data()));
    } else {
      // Fallback to sheetAuth or mock
      const sheetStudents = getAllLoginSheetStudents();
      liveStudents.push(...(sheetStudents.length > 0 ? sheetStudents : mockStudents));
    }

    const liveCompanies: unknown[] = [];
    if (companiesSnap.status === 'fulfilled' && !companiesSnap.value.empty) {
      companiesSnap.value.forEach(d => liveCompanies.push(d.data()));
    } else {
      liveCompanies.push(...mockCompanies);
    }

    const liveSubmissions: unknown[] = [];
    if (submissionsSnap.status === 'fulfilled' && !submissionsSnap.value.empty) {
      submissionsSnap.value.forEach(d => liveSubmissions.push(d.data()));
    } else {
      liveSubmissions.push(...Object.values(mockWeeklySubmissions).flat());
    }

    const liveForm3: unknown[] = [];
    if (form3Snap.status === 'fulfilled' && !form3Snap.value.empty) {
      form3Snap.value.forEach(d => liveForm3.push(d.data()));
    }

    const liveAnnouncements: unknown[] = [];
    if (announcementsSnap.status === 'fulfilled' && !announcementsSnap.value.empty) {
      announcementsSnap.value.forEach(d => liveAnnouncements.push(d.data()));
    } else {
      liveAnnouncements.push(...mockAnnouncements);
    }


    // Collect localStorage offline caches
    const localSavedKeys: Record<string, unknown> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('kktech_') || k.startsWith('sheet_') || k.startsWith('form1_') || k.startsWith('form3_'))) {
            try {
              const val = localStorage.getItem(k);
              localSavedKeys[k] = val ? JSON.parse(val) : val;
            } catch {
              localSavedKeys[k] = localStorage.getItem(k);
            }
          }
        }
      } catch (e) {
        console.warn('Could not read all localStorage keys:', e);
      }
    }

    update('processing', 'กำลังรวมข้อมูลปัจจุบันเข้าสู่ไฟล์ Zip...');

    // 3. Load ZIP into JSZip
    const zip = await JSZip.loadAsync(zipBlob);

    const now = new Date();
    const thaiDateStr = now.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const fullExportData = {
      exportVersion: '2.0.0',
      exportedAt: now.toISOString(),
      exportedAtThai: thaiDateStr,
      systemName: 'ระบบบันทึกข้อมูลการฝึกงาน แผนกวิชาช่างไฟฟ้ากำลัง วิทยาลัยเทคนิคขอนแก่น',
      department: 'แผนกวิชาช่างไฟฟ้ากำลัง',
      college: 'วิทยาลัยเทคนิคขอนแก่น',
      weeksCovered: 'สัปดาห์ที่ 1 - 18',
      summary: {
        totalStudents: liveStudents.length,
        totalCompanies: liveCompanies.length,
        totalSubmissions: liveSubmissions.length,
        totalForm3Supervisions: liveForm3.length,
        totalAnnouncements: liveAnnouncements.length
      },
      collections: {
        students: liveStudents,
        companies: liveCompanies,
        submissions: liveSubmissions,
        form3_supervisions: liveForm3,
        announcements: liveAnnouncements
      },
      localCaches: localSavedKeys
    };

    // Add or replace latest data files in the ZIP
    zip.file('data/latest_database_export.json', JSON.stringify(fullExportData, null, 2));
    zip.file('data/students_latest.json', JSON.stringify(liveStudents, null, 2));
    zip.file('data/companies_latest.json', JSON.stringify(liveCompanies, null, 2));
    zip.file('data/submissions_latest.json', JSON.stringify(liveSubmissions, null, 2));
    zip.file('data/form3_supervisions_latest.json', JSON.stringify(liveForm3, null, 2));

    // Summary report text file
    const summaryText = `======================================================================
ระบบบันทึกและประเมินผลการฝึกประสบการณ์วิชาชีพ
แผนกวิชาช่างไฟฟ้ากำลัง วิทยาลัยเทคนิคขอนแก่น
======================================================================
วันที่ส่งออกข้อมูลล่าสุด: ${thaiDateStr}
การจัดการเรียนการสอน: สัปดาห์ที่ 1 - 18
ที่อยู่: อาคาร 8 ชั้น 3 วิทยาลัยเทคนิคขอนแก่น
โทรศัพท์: 043-221290 ต่อ 8002

สรุปรายการข้อมูลล่าสุดในระบบ:
- จำนวนนักศึกษาทั้งหมด: ${liveStudents.length} นาย/คน
- จำนวนสถานประกอบการ: ${liveCompanies.length} แห่ง
- จำนวนบันทึกการนิเทศงาน: ${liveForm3.length} รายการ
- ข้อมูลระบบเชื่อมต่อ: Google Cloud Firestore (internship2-2569) & Google Sheets

คำแนะนำการนำไปใช้งาน:
1. แตกไฟล์ ZIP ทั้งหมดไปวางใน C:\\AppServ\\www\\ หรือ C:\\xampp\\htdocs\\
2. เปิดบราวเซอร์เข้าสู่ http://localhost/ เพื่อใช้งานได้ทันที
======================================================================
`;
    zip.file('LATEST_DATA_SUMMARY.txt', summaryText);

    // Update README_INSTALL.txt
    const readmeContent = `=== คู่มือการติดตั้งระบบบันทึกข้อมูลการฝึกงาน แผนกวิชาช่างไฟฟ้ากำลัง วท.ขอนแก่น บน AppServ / Web Server จริง ===
แพ็กเกจนี้ประกอบด้วยข้อมูลและโค้ดล่าสุด (อัปเดต: ${thaiDateStr} | สัปดาห์ที่ 1 - 18)

1. นำไฟล์และโฟลเดอร์ทั้งหมดใน zip นี้ ไปวางในโฟลเดอร์ Web Root ของเซิร์ฟเวอร์
   - สำหรับ AppServ: นำไปวางใน C:\\AppServ\\www\\ หรือ C:\\AppServ\\www\\internship\\
   - สำหรับ XAMPP: นำไปวางใน C:\\xampp\\htdocs\\ หรือ C:\\xampp\\htdocs\\internship\\
   - สำหรับ Linux / Apache: /var/www/html/

2. เปิดเว็บบราวเซอร์ (Chrome, Edge, Safari) แล้วเรียกใช้งาน:
   - กรณีวางใน root: http://localhost/ หรือ http://[IP_เครื่อง_Server]/
   - กรณีวางในโฟลเดอร์ย่อย: http://localhost/internship/

3. ระบบเชื่อมต่อฐานข้อมูล Google Cloud Firebase Firestore (internship2-2569) แบบออนไลน์ทันที ข้อมูลบันทึกและซิงค์แบบเรียลไทม์
   และมีไฟล์ข้อมูลสำรองล่าสุดเก็บไว้ในโฟลเดอร์ /data/ ครบถ้วน
`;
    zip.file('README_INSTALL.txt', readmeContent);

    update('processing', 'กำลังสร้างไฟล์ ZIP ชุดล่าสุดเพื่อดาวน์โหลด...');

    // 4. Generate updated zip blob
    const generatedZipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // 5. Trigger download
    const filenameDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `kktech_internship_web_server_latest_${filenameDate}.zip`;

    const blobUrl = URL.createObjectURL(generatedZipBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);

    update('ready', 'ดาวน์โหลดไฟล์เว็บทั้งหมดพร้อมข้อมูลล่าสุดสำเร็จแล้ว!');
  } catch (error) {
    console.error('Error generating web server package:', error);
    update('error', 'เกิดข้อผิดพลาดในการรวมข้อมูลล่าสุด กำลังดาวน์โหลดไฟล์แพ็กเกจสำรอง...');
    
    // Fallback: direct download with cache buster
    const fallbackAnchor = document.createElement('a');
    fallbackAnchor.href = `./appserv_publish.zip?t=${Date.now()}`;
    fallbackAnchor.download = 'kktech_internship_web_server.zip';
    document.body.appendChild(fallbackAnchor);
    fallbackAnchor.click();
    document.body.removeChild(fallbackAnchor);
  }
}
