import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  User, 
  Award, 
  BookOpen, 
  Plus, 
  Trash2, 
  Clock, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon,
  Building2,
  RefreshCw,
  Edit3,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  Upload,
  Check,
  RotateCcw,
  FolderOpen
} from 'lucide-react';
import { AuthUser, Student, Form3SupervisionRecord, WeeklySubmission } from '../types';
import { WEEKS_1_TO_15, getCurrentWeekInfo, getWeekDates } from '../data/weeksData';
import { getAllLoginSheetTeachers } from '../services/sheetAuthService';
import { 
  getCoursesByTeacher, 
  getAllTeachersFromData, 
  DATA_SHEET_CONFIG,
  fetchDataSheetCourses,
  fetchPivotSheetCourses
} from '../services/courseDataService';

interface WorkplaceTeachingReportViewProps {
  currentUser?: AuthUser | null;
  students: Student[];
  form3List: Form3SupervisionRecord[];
  submissions: Record<string, WeeklySubmission[]>;
}

export interface TeachingCourseItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  teachDate: string; // YYYY-MM-DD
  teachTime: string; // e.g. "15.00-17.00"
}

const POSITION_OPTIONS = [
  'ครูพิเศษสอน',
  'พนักงานราชการครู',
  'ครูผู้ช่วย',
  'ครู',
  'ครู วิทยฐานะครูชำนาญการ',
  'ครู วิทยฐานะครูชำนาญการพิเศษ',
  'ครู วิทยฐานะครูเชี่ยวชาญ'
];

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

function formatThaiDateFull(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = THAI_MONTHS_FULL[d.getMonth()];
  const yearBE = d.getFullYear() + 543;
  return `${day} ${month} ${yearBE}`;
}

function formatThaiDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const yearBE = (d.getFullYear() + 543) % 100;
  return `${day} ${month} ${yearBE}`;
}

interface MemoDocumentContentProps {
  reporterName: string;
  position: string;
  thaiReportDateStr: string;
  selectedWeek: number;
  courses: TeachingCourseItem[];
}

const MemoDocumentContent: React.FC<MemoDocumentContentProps> = ({
  reporterName,
  position,
  thaiReportDateStr,
  selectedWeek,
  courses
}) => {
  return (
    <>
      {/* Top row: Garuda & Title Center, Receipt Stamp Box Right */}
      <div className="relative mb-2">
        {/* Receipt stamp box on top right - shifted right 1cm (-10mm) */}
        <div 
          className="absolute top-0 border border-black p-2 text-left"
          style={{ 
            right: '-10mm',
            width: '62mm', 
            fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
            fontSize: '13pt', 
            lineHeight: 1.3 
          }}
        >
          <div className="font-bold text-center">ฝ่ายวิชาการ วิทยาลัยเทคนิคขอนแก่น</div>
          <div>เลขรับภายใน...........................................</div>
          <div>วันที่.................................................</div>
          <div>เวลา..................................................</div>
        </div>

        {/* Garuda Emblem + บันทึกข้อความ (ขนาด 14.4mm) */}
        <div className="flex flex-col items-start pt-0">
          <img 
            src="/assets/aistudio/pic1_206a0c1e.jpg" 
            alt="ตราครุฑ" 
            className="h-auto object-contain mb-1" 
            style={{ width: '14.4mm' }}
          />
        </div>

        <div className="text-center font-bold text-[28pt] tracking-wide -mt-8 mb-2">
          บันทึกข้อความ
        </div>
      </div>

      {/* Official memo body: ฟอนต์ TH SarabunPSK ขนาด 15 (15pt) */}
      <div
        style={{
          fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
          fontSize: '15pt',
          lineHeight: 1.38
        }}
      >
        {/* Header fields */}
        <div className="space-y-1 pt-1">
          <div className="flex items-baseline">
            <span className="font-bold mr-2 whitespace-nowrap">ส่วนราชการ</span>
            <span>ฝ่ายวิชาการ วิทยาลัยเทคนิคขอนแก่น</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline flex-1">
              <span className="font-bold mr-2 whitespace-nowrap">ที่</span>
              <span>แผนกวิชาช่างไฟฟ้ากำลัง</span>
            </div>
            <div className="flex items-baseline mr-10">
              <span className="font-bold mr-2 whitespace-nowrap">วันที่</span>
              <span>{thaiReportDateStr}</span>
            </div>
          </div>

          <div className="flex items-baseline pb-1 border-b border-black">
            <span className="font-bold mr-2 whitespace-nowrap">เรื่อง</span>
            <span>รายงานการจัดการเรียนการสอนบูรณาการในสถานประกอบการ ประจำภาคเรียนที่ 2/2569 (สัปดาห์ที่ {selectedWeek})</span>
          </div>

          <div className="flex items-baseline pt-1">
            <span className="font-bold mr-3 whitespace-nowrap">เรียน</span>
            <span>ผู้อำนวยการวิทยาลัยเทคนิคขอนแก่น</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline">
              <span className="font-bold mr-3 whitespace-nowrap">สิ่งที่ส่งมาด้วย</span>
              <span>รายงานการจัดการเรียนการสอนในสถานประกอบการแบบบูรณาการ</span>
            </div>
            <div className="mr-14">
              <span>จำนวน 1 ชุด</span>
            </div>
          </div>
        </div>

        {/* Paragraph 1 */}
        <div className="mt-3 text-justify indent-[2.5cm] leading-relaxed">
          ตามที่วิทยาลัยเทคนิคขอนแก่น ได้กำหนดแนวปฏิบัติในการจัดตารางเรียน ตารางสอน ปีการศึกษา 2569 โดยรายวิชาฝึกประสบการณ์วิชาชีพ (หลักสูตร 2567) จัดให้มีครูผู้สอนรับผิดชอบรายวิชาให้ครบตามแผนการเรียนที่นำไปจัดสอนและฝึกประสบการณ์อาชีพหรือฝึกงานในสถานประกอบการหรือจัดสอนนอกสถานศึกษา ตามแนวทางของสำนักงานคณะกรรมการการอาชีวศึกษา ให้เป็นชั่วโมงสอนที่ครูผู้สอนได้ทำการสอนทั้งการจัดการเรียนการสอนในรูปแบบออนไลน์ เช่น Google Meet, Google Classroom, Zoom Meeting หรือชั่วโมงการนิเทศผ่านระบบสารสนเทศ
        </div>

        {/* Paragraph 2 & Assigned courses */}
        <div className="mt-2.5 text-justify leading-relaxed">
          <div className="indent-[2.5cm]">
            ข้าพเจ้า <span className="font-bold">{reporterName}</span> ได้รับมอบหมายให้รับผิดชอบสอน
          </div>

          <div className="my-1 pl-[1.5cm] space-y-0.5">
            {courses.map((c, i) => (
              <div key={c.id}>
                {i + 1}. รหัสวิชา <span className="font-bold">{c.subjectCode}</span> รายวิชา <span className="font-bold">{c.subjectName}</span>
              </div>
            ))}
          </div>

          <div>
            ในสถานประกอบการตามแผนการเรียน ปีการศึกษา 2569 ขออนุญาตรายงานการจัดการเรียนการสอนตามแนวปฏิบัติในการจัดตารางเรียน ตารางสอน ประจำภาคเรียนที่ 2/2569 ตามเอกสารที่แนบมาพร้อมนี้
          </div>
        </div>

        {/* Closing */}
        <div className="mt-3 indent-[2.5cm]">
          จึงเรียนมาเพื่อโปรดพิจารณา
        </div>

        {/* Signature Box */}
        <div className="mt-3 flex justify-end">
          <div className="text-center w-[75mm] space-y-0.5">
            <div>ลงชื่อ............................................................</div>
            <div className="font-bold">({reporterName})</div>
            <div>ตำแหน่ง {position}</div>
          </div>
        </div>

        {/* 2 Opinion Boxes (Head of Dept & Head of Curriculum) */}
        <div className="mt-4 grid grid-cols-2 gap-3" style={{ fontSize: '14pt' }}>
          {/* Box 1 */}
          <div className="border border-black p-2 flex flex-col justify-between min-h-[30mm]">
            <div className="space-y-0.5">
              <div className="font-bold text-center border-b border-black pb-0.5">ความเห็นของหัวหน้าแผนกวิชา</div>
              <div className="pt-0.5">( &nbsp; ) เพื่อโปรดพิจารณา</div>
              <div>( &nbsp; ) อื่น ๆ....................................................................</div>
            </div>
            <div className="text-center pt-2">
              <div>(นายกิตติศักดิ์ ทิพบุญชู)</div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="border border-black p-2 flex flex-col justify-between min-h-[30mm]">
            <div className="space-y-0.5">
              <div className="font-bold text-center border-b border-black pb-0.5">ความเห็นของหัวหน้างานพัฒนาหลักสูตรและการจัดการเรียนรู้</div>
              <div className="pt-0.5">( &nbsp; ) เพื่อโปรดพิจารณาทราบ</div>
              <div>( &nbsp; ) อื่น ๆ....................................................................</div>
            </div>
            <div className="text-center pt-2">
              <div>(นายเอกสิทธิ์ ด้วงนิล)</div>
            </div>
          </div>
        </div>

        {/* Deputy Director Box */}
        <div className="mt-2.5 space-y-0.5" style={{ fontSize: '14pt' }}>
          <div className="font-bold underline">ความคิดเห็นของรองผู้อำนวยการฝ่ายวิชาการ</div>
          <div className="flex items-center gap-6 pt-0.5">
            <span>( &nbsp; ) ทราบ</span>
            <span>( &nbsp; ) ปรับปรุง/ข้อเสนอแนะ</span>
            <span>( &nbsp; ) อื่น ๆ ........................................</span>
          </div>

          <div className="pt-2 text-center ml-auto w-[90mm] space-y-0.5">
            <div>ว่าที่ร้อยตรี</div>
            <div>(ไชยา ทับวิธร)</div>
            <div>รองผู้อำนวยการฝ่ายวิชาการ ปฏิบัติหน้าที่แทน</div>
            <div>ผู้อำนวยการวิทยาลัยเทคนิคขอนแก่น</div>
          </div>
        </div>
      </div>
    </>
  );
};

interface WeeklyReportPage1ContentProps {
  reporterName: string;
  position: string;
  specialDuty: string;
  selectedWeek: number;
  startDayFull: string;
  endDayFull: string;
  courses: TeachingCourseItem[];
  learningOutcome: string;
}

const WeeklyReportPage1Content: React.FC<WeeklyReportPage1ContentProps> = ({
  reporterName,
  position,
  specialDuty,
  selectedWeek,
  startDayFull,
  endDayFull,
  courses,
  learningOutcome
}) => {
  return (
    <>
      {/* Top Page number */}
      <div className="text-right text-[12pt] text-slate-400 mb-1">
        2
      </div>

      {/* Header Box with College Logo */}
      <div className="border border-black p-3 mb-4 flex items-center gap-4">
        <div className="w-[28mm] flex-shrink-0 flex items-center justify-center border-r border-black pr-3">
          <img 
            src="/assets/aistudio/LogoKKTech_f25116a9.jpg" 
            alt="ตราวิทยาลัยเทคนิคขอนแก่น" 
            className="w-[24mm] h-auto object-contain"
          />
        </div>

        <div className="flex-1 text-center space-y-0.5">
          <div className="font-bold text-[18pt]">วิทยาลัยเทคนิคขอนแก่น</div>
          <div className="font-bold text-[16pt]">รายงานการจัดการเรียนการสอนบูรณาการในสถานประกอบการ</div>
          <div className="font-bold text-[15pt]">ประจำภาคเรียนที่ 2 ปีการศึกษา 2569</div>
          <div className="font-bold text-[14pt]">
            สัปดาห์ที่ {selectedWeek} ระหว่างวันที่ {startDayFull} ถึงวันที่ {endDayFull}
          </div>
        </div>
      </div>

      {/* Teacher info lines */}
      <div className="grid grid-cols-12 gap-y-2 text-[15pt] mb-4">
        <div className="col-span-6 flex items-baseline gap-3">
          <span className="w-24 shrink-0 text-black">ชื่อครูผู้สอน</span>
          <span className="text-black">{reporterName}</span>
        </div>
        <div className="col-span-6 flex items-baseline gap-3">
          <span className="w-20 shrink-0 text-black">ตำแหน่ง</span>
          <span className="text-black">{position}</span>
        </div>

        <div className="col-span-6 flex items-baseline gap-3">
          <span className="w-24 shrink-0 text-black">แผนกวิชา</span>
          <span className="text-black">ช่างไฟฟ้ากำลัง</span>
        </div>
        <div className="col-span-6 flex items-baseline gap-3">
          <span className="w-20 shrink-0 text-black">หน้าที่พิเศษ</span>
          <span className="text-black">{specialDuty || '-'}</span>
        </div>
      </div>

      {/* Table 1: Courses & Teaching Applications */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-black text-center text-[14pt]">
          <thead>
            <tr className="bg-slate-50 font-bold">
              <th className="border border-black p-1.5 w-[12mm]">ลำดับ</th>
              <th className="border border-black p-1.5 w-[30mm]">รหัสวิชา</th>
              <th className="border border-black p-1.5">ชื่อวิชา</th>
              <th className="border border-black p-1.5 w-[42mm]">กลุ่มเรียน</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, idx) => (
              <tr key={c.id}>
                <td className="border border-black p-1.5">{idx + 1}</td>
                <td className="border border-black p-1.5 font-bold">{c.subjectCode}</td>
                <td className="border border-black p-1.5 text-left px-2">{c.subjectName}</td>
                <td className="border border-black p-1.5">{c.room}</td>
              </tr>
            ))}
            <tr>
              <td className="border border-black p-2 font-bold align-top" colSpan={2}>
                โปรแกรม หรือ Application<br />ที่ใช้ในการสอน
              </td>
              <td className="border border-black p-2 text-left" colSpan={2}>
                <div>1. Google Classroom (ใช้ในการสอน/มอบหมายงาน/ส่งงาน)</div>
                <div>2. Google Meet (ใช้ในการสอนกลุ่มออนไลน์ และนำเสนองาน)</div>
                <div>3. Line (ใช้ในการประสานงาน/แนะนำ)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Subheader: สัปดาห์ที่ X */}
      <div className="font-bold text-center text-[16pt] my-3">
        สัปดาห์ที่ {selectedWeek}
      </div>

      {/* Table 2: Teaching Schedule */}
      <div className="mb-5">
        <table className="w-full border-collapse border border-black text-center text-[14pt]">
          <thead>
            <tr className="bg-slate-50 font-bold">
              <th className="border border-black p-1.5 w-[28mm]">วัน/เดือน/ปี</th>
              <th className="border border-black p-1.5 w-[26mm]">เวลา</th>
              <th className="border border-black p-1.5 w-[28mm]">รหัสวิชา</th>
              <th className="border border-black p-1.5">กิจกรรมการเรียนการสอน</th>
              <th className="border border-black p-1.5 w-[35mm]">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={`sched-${c.id}`}>
                <td className="border border-black p-1.5">{formatThaiDateShort(c.teachDate)}</td>
                <td className="border border-black p-1.5">{c.teachTime}</td>
                <td className="border border-black p-1.5 font-bold">{c.subjectCode}</td>
                <td className="border border-black p-1.5 text-left px-2">{c.subjectName}</td>
                <td className="border border-black p-1.5">{c.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results / Outcomes */}
      <div className="mt-6 space-y-3">
        <div className="font-bold text-[15pt]">
          ผลที่เกิดจากการจัดการเรียนรู้ (โปรดระบุ)
        </div>
        <div className="indent-[1.5cm] leading-relaxed text-justify px-2 text-[15pt]">
          {learningOutcome}
        </div>
      </div>
    </>
  );
};

export interface TeachingReportPhoto {
  id?: string;
  url: string;
  caption: string;
  sourceType?: 'submission' | 'supervision' | 'standard' | 'uploaded' | 'custom';
  sourceTitle?: string;
  studentName?: string;
  companyName?: string;
  date?: string;
}

export const VOCATIONAL_STANDARD_CHIPS = [
  { label: '🛡️ PPE 100% & LOTO', text: 'การตรวจเช็กและปฏิบัติตามมาตรฐานความปลอดภัย สวมใส่อุปกรณ์ PPE 100% และขั้นตอน LOTO ในสถานประกอบการ' },
  { label: '⚡ ตู้ควบคุมไฟฟ้า MDB', text: 'งานตรวจซ่อมบำรุงและจัดระเบียบสายวงจรตู้ควบคุมไฟฟ้า Main Distribution Board (MDB) ตามมาตรฐาน วสท.' },
  { label: '📏 วัดค่าความเป็นฉนวน', text: 'ใช้เครื่องมือวัด Insulation Resistance Tester ตรวจวัดค่าความเป็นฉนวนสายไฟฟ้าและขดลวดมอเตอร์' },
  { label: '🔌 ตรวจวัดระบบต่อลงดิน', text: 'การตรวจวัดค่าความต้านทานดินของระบบต่อลงดิน (Grounding System) ให้อยู่ในเกณฑ์มาตรฐานไม่เกิน 5 โอห์ม' },
  { label: '⚙️ วงจรควบคุมมอเตอร์', text: 'การต่อวงจร ทดสอบ และบำรุงรักษาวงจรควบคุมมอเตอร์ไฟฟ้าและอุปกรณ์ Magnetic Contactor & Overload Relay' },
  { label: '📋 นิเทศและประเมินสมรรถนะ', text: 'ครูนิเทศก์ร่วมกับครูฝึกนิเทศติดตาม ประเมินสมรรถนะวิชาชีพบูรณาการ และสรุปผลการฝึกปฏิบัติงานจริง' },
  { label: '❄️ ระบบปรับอากาศอุตสาหกรรม', text: 'การตรวจวัดแรงดันน้ำยาและตรวจเช็กระบบทำความเย็นเครื่องปรับอากาศอุตสาหกรรมในสถานประกอบการ' },
  { label: '🔧 เดินท่อร้อยสายไฟฟ้า', text: 'งานดัดท่อร้อยสายไฟ EMT และการจัดวางระบบราง Wireway ตามแบบแปลนทางวิศวกรรมไฟฟ้า' }
];

export const CURATED_VOCATIONAL_PHOTOS: TeachingReportPhoto[] = [
  {
    id: 'std-p1',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    caption: 'การตรวจเช็กและปฏิบัติตามมาตรฐานความปลอดภัย สวมใส่อุปกรณ์คุ้มครอง PPE 100% และขั้นตอน LOTO ในสถานประกอบการ',
    sourceType: 'standard',
    sourceTitle: 'มาตรฐานความปลอดภัยโรงงาน (PPE 100% & LOTO)'
  },
  {
    id: 'std-p2',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    caption: 'งานตรวจซ่อมบำรุงและจัดระเบียบสายวงจรตู้ควบคุมไฟฟ้า Main Distribution Board (MDB) ตามมาตรฐาน วสท.',
    sourceType: 'standard',
    sourceTitle: 'งานตู้ควบคุมไฟฟ้า Main Distribution Board (MDB)'
  },
  {
    id: 'std-p3',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    caption: 'ใช้เครื่องมือวัด Insulation Resistance Tester ตรวจวัดค่าความเป็นฉนวนสายไฟฟ้าตามมาตรฐาน วสท.',
    sourceType: 'standard',
    sourceTitle: 'การทดสอบค่าความเป็นฉนวนสายไฟฟ้า'
  },
  {
    id: 'std-p4',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    caption: 'การตรวจวัดค่าความต้านทานดินของระบบต่อลงดิน (Grounding System) ให้อยู่ในเกณฑ์มาตรฐานไม่เกิน 5 โอห์ม',
    sourceType: 'standard',
    sourceTitle: 'การวัดค่าความต้านทานระบบต่อลงดิน'
  },
  {
    id: 'std-p5',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    caption: 'การติดตั้ง ทดสอบ และบำรุงรักษาวงจรควบคุมมอเตอร์ไฟฟ้าและอุปกรณ์สวิตช์เกียร์',
    sourceType: 'standard',
    sourceTitle: 'การควบคุมมอเตอร์และ Magnetic Contactor'
  },
  {
    id: 'std-p6',
    url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80',
    caption: 'ครูนิเทศก์ร่วมกับครูฝึกนิเทศติดตาม ประเมินสมรรถนะวิชาชีพบูรณาการ และสรุปผลการฝึกปฏิบัติงานจริง',
    sourceType: 'standard',
    sourceTitle: 'การนิเทศติดตามและประเมินผลสมรรถนะวิชาชีพ'
  },
  {
    id: 'std-p7',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    caption: 'การตรวจวัดแรงดันน้ำยาและตรวจเช็กระบบทำความเย็นเครื่องปรับอากาศอุตสาหกรรมในสถานประกอบการ',
    sourceType: 'standard',
    sourceTitle: 'ระบบปรับอากาศในงานอุตสาหกรรม'
  },
  {
    id: 'std-p8',
    url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80',
    caption: 'งานดัดท่อร้อยสายไฟ EMT และการจัดวางระบบราง Wireway ตามแบบแปลนทางวิศวกรรมไฟฟ้า',
    sourceType: 'standard',
    sourceTitle: 'งานติดตั้งท่อร้อยสายและ Wireway'
  }
];

export function generateDefaultWeekPhotos(
  week: number,
  courses: TeachingCourseItem[],
  subs: Record<string, WeeklySubmission[]>,
  f3s: Form3SupervisionRecord[],
  studentsList: Student[]
): TeachingReportPhoto[] {
  const result: TeachingReportPhoto[] = [];
  const primaryCourseName = courses[0]?.subjectName || 'งานบำรุงรักษาระบบไฟฟ้า';

  // 1. Student submission photos for this specific week
  const allSubs = Object.values(subs).flat();
  const weekSubs = allSubs.filter(s => s.weekNumber === week);
  const studentPhotos: TeachingReportPhoto[] = [];

  for (const sub of weekSubs) {
    if (sub.photos && sub.photos.length > 0) {
      const st = studentsList.find(s => s.id === sub.studentId || s.studentCode === sub.studentId);
      for (const p of sub.photos) {
        if (p.url && !studentPhotos.some(x => x.url === p.url)) {
          studentPhotos.push({
            id: `sub-${sub.id}-${p.id}`,
            url: p.url,
            caption: p.caption || p.title || `ปฏิบัติงานตามมาตรฐานวิชาชีพ ${sub.taskTitle || primaryCourseName}`,
            sourceType: 'submission',
            sourceTitle: sub.taskTitle || 'บันทึกการปฏิบัติงานประจำสัปดาห์',
            studentName: st?.name || 'นักศึกษาฝึกงาน',
            companyName: st?.companyName || 'สถานประกอบการ'
          });
        }
      }
    }
  }

  // 2. Supervisor teacher visit photos
  const supervisionPhotos: TeachingReportPhoto[] = [];
  for (const f3 of f3s) {
    if (f3.photos && f3.photos.length > 0) {
      for (const p of f3.photos) {
        if (p.url && !supervisionPhotos.some(x => x.url === p.url)) {
          supervisionPhotos.push({
            id: `f3-${f3.id}-${p.id || Math.random()}`,
            url: p.url,
            caption: p.caption || `ครูนิเทศก์ตรวจเยี่ยมนิเทศและประเมินสมรรถนะวิชาชีพ ณ ${f3.companyName}`,
            sourceType: 'supervision',
            sourceTitle: `การนิเทศสถานประกอบการ: ${f3.companyName}`,
            companyName: f3.companyName,
            date: f3.visitDate
          });
        }
      }
    }
  }

  // 3. Week-specific curriculum photos from WEEKS_1_TO_15
  const weekMeta = WEEKS_1_TO_15.find(w => w.weekNumber === week);
  const weekSamplePhotos: TeachingReportPhoto[] = [];
  if (weekMeta && weekMeta.samplePhotos) {
    for (const sp of weekMeta.samplePhotos) {
      if (sp.url) {
        weekSamplePhotos.push({
          id: `wmeta-${sp.id}`,
          url: sp.url,
          caption: sp.caption || `${weekMeta.title} (${weekMeta.defaultTask})`,
          sourceType: 'standard',
          sourceTitle: weekMeta.title
        });
      }
    }
  }

  const standardPool = [...CURATED_VOCATIONAL_PHOTOS];
  let supIndex = 0;
  let stuIndex = 0;
  let sampleIndex = 0;
  let stdIndex = 0;

  for (let slot = 0; slot < 6; slot++) {
    let chosen: TeachingReportPhoto | null = null;

    if (slot === 5 && supervisionPhotos.length > supIndex) {
      chosen = supervisionPhotos[supIndex++];
    } else if (studentPhotos.length > stuIndex) {
      chosen = studentPhotos[stuIndex++];
    } else if (supervisionPhotos.length > supIndex) {
      chosen = supervisionPhotos[supIndex++];
    } else if (weekSamplePhotos.length > sampleIndex) {
      chosen = weekSamplePhotos[sampleIndex++];
    } else {
      chosen = standardPool[stdIndex % standardPool.length];
      stdIndex++;
    }

    if (chosen) {
      let cleanCaption = chosen.caption.replace(/^ภาพที่\s*\d+\s*[:.]\s*/, '').trim();
      if (!cleanCaption) {
        cleanCaption = `การจัดการเรียนการสอนบูรณาการในสถานประกอบการ รายวิชา${primaryCourseName}`;
      }
      result.push({
        ...chosen,
        caption: `ภาพที่ ${slot + 1}: ${cleanCaption}`
      });
    }
  }

  return result.slice(0, 6);
}

interface WeeklyReportPage2ContentProps {
  selectedWeek: number;
  startDayNum: string;
  endDayNum: string;
  monthFull: string;
  weekPhotos: TeachingReportPhoto[];
  isInteractive?: boolean;
  onOpenPhotoPicker?: (slotIndex: number) => void;
  onDeletePhoto?: (slotIndex: number) => void;
  onUploadPhoto?: (slotIndex: number, file: File) => void;
  onOpenCaptionModal?: (slotIndex: number) => void;
}

const WeeklyReportPage2Content: React.FC<WeeklyReportPage2ContentProps> = ({
  selectedWeek,
  startDayNum,
  endDayNum,
  monthFull,
  weekPhotos,
  isInteractive = false,
  onOpenPhotoPicker,
  onDeletePhoto,
  onUploadPhoto,
  onOpenCaptionModal
}) => {
  const paddedPhotos: TeachingReportPhoto[] = useMemo(() => {
    const list = [...weekPhotos];
    while (list.length < 6) {
      list.push({
        id: `empty-${list.length}`,
        url: '',
        caption: `ภาพที่ ${list.length + 1}: การจัดการเรียนการสอนบูรณาการ`
      });
    }
    return list.slice(0, 6);
  }, [weekPhotos]);

  return (
    <>
      {/* Top Page number */}
      <div className="text-right text-[12pt] text-slate-400 mb-2">
        3
      </div>

      {/* Page Title */}
      <div className="text-center space-y-1 mb-5">
        <div className="font-bold text-[16pt]">
          ประมวลภาพการรายงานการจัดการเรียนการสอนบูรณาการในสถานประกอบการ
        </div>
        <div className="font-bold text-[15pt]">
          ประจำภาคเรียนที่ 2 ปีการศึกษา 2569
        </div>
        <div className="font-bold text-[14pt]">
          สัปดาห์ที่ {selectedWeek} ระหว่างวันที่ {startDayNum} - {endDayNum} {monthFull} พ.ศ. 2569
        </div>
      </div>

      {/* 2 x 3 Photos Grid */}
      <div 
        className="grid grid-cols-2 border-t border-l border-black" 
        style={{ width: '100%' }}
      >
        {paddedPhotos.map((photo, pIdx) => (
          <div 
            key={pIdx} 
            className="border-r border-b border-black p-2 flex flex-col items-center justify-between text-center relative group/cell"
            style={{ height: '68mm' }}
          >
            {/* Image Container */}
            <div className="w-full h-[50mm] bg-slate-50 flex items-center justify-center overflow-hidden rounded-xs relative">
              {photo.url ? (
                <img 
                  src={photo.url} 
                  alt={`ภาพที่ ${pIdx + 1}`} 
                  className="w-full h-full object-cover" 
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full border border-dashed border-slate-300 flex flex-col items-center justify-center p-2 text-slate-500 bg-slate-50/70">
                  <ImageIcon className="w-7 h-7 text-slate-400 mb-1" />
                  <span className="text-[11pt] font-sans font-semibold text-slate-700">ไม่มีรูปภาพ</span>
                  <span className="text-[9pt] font-sans text-slate-400">คลิกเพื่อเลือกจากคลัง หรืออัปโหลด</span>
                </div>
              )}

              {/* Interactive Hover Actions Overlay */}
              {isInteractive && (
                <div 
                  className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/cell:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 print:hidden z-10"
                  data-html2canvas-ignore="true"
                >
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => onOpenPhotoPicker?.(pIdx)}
                      className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-sans font-semibold flex items-center gap-1 shadow cursor-pointer transition"
                      title="เลือกรูปภาพจากคลังบันทึกฝึกงาน / การนิเทศ / มาตรฐานวิชาชีพ"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>เปลี่ยนรูป</span>
                    </button>

                    <label
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-sans font-semibold flex items-center gap-1 shadow cursor-pointer transition"
                      title="อัปโหลดรูปภาพใหม่จากเครื่อง"
                    >
                      <Upload className="w-3 h-3" />
                      <span>อัปโหลด</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) onUploadPhoto?.(pIdx, f);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {photo.url && (
                      <button
                        type="button"
                        onClick={() => onDeletePhoto?.(pIdx)}
                        className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-sans font-semibold flex items-center gap-1 shadow cursor-pointer transition"
                        title="ลบรูปภาพนี้"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>ลบ</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCaptionModal?.(pIdx)}
                    className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-sans font-semibold flex items-center gap-1 shadow cursor-pointer transition mt-0.5"
                    title="แก้ไขคำอธิบายใต้ภาพตามมาตรฐานวิชาชีพ"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>แก้ไขคำอธิบาย</span>
                  </button>
                </div>
              )}
            </div>

            {/* Caption Area */}
            <div className="mt-1 w-full flex flex-col items-center justify-center px-1">
              <div 
                className="text-[13pt] text-slate-800 leading-tight w-full text-center line-clamp-2"
                title={photo.caption}
              >
                {photo.caption || `ภาพที่ ${pIdx + 1}: การจัดการเรียนการสอนบูรณาการ`}
              </div>

              {/* Interactive buttons on screen */}
              {isInteractive && (
                <div className="flex items-center gap-2 mt-0.5 print:hidden" data-html2canvas-ignore="true">
                  <button
                    type="button"
                    onClick={() => onOpenCaptionModal?.(pIdx)}
                    className="inline-flex items-center gap-1 text-[9pt] font-sans text-sky-600 hover:text-sky-800 hover:underline cursor-pointer opacity-75 hover:opacity-100"
                    title="คลิกเพื่อแก้ไขคำอธิบายใต้ภาพ"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>แก้ไขคำอธิบาย</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenPhotoPicker?.(pIdx)}
                    className="inline-flex items-center gap-1 text-[9pt] font-sans text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer opacity-75 hover:opacity-100"
                    title="เปลี่ยนรูปภาพ"
                  >
                    <ImageIcon className="w-2.5 h-2.5" />
                    <span>เปลี่ยนรูป</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const WorkplaceTeachingReportView: React.FC<WorkplaceTeachingReportViewProps> = ({
  currentUser,
  students,
  form3List,
  submissions
}) => {
  // 1. Teacher selection (default to logged-in user or "นายทักษิณ โสภาปิยะ")
  const allTeachers = useMemo(() => {
    const list = getAllLoginSheetTeachers();
    const sheetTeacherNames = getAllTeachersFromData();
    const map = new Map<string, string>();
    list.forEach(t => map.set(t.name.trim(), t.name.trim()));
    sheetTeacherNames.forEach(name => {
      const clean = name.trim();
      if (clean && !clean.includes('สุพรรณี')) {
        map.set(clean, clean);
      }
    });
    // Ensure "นายทักษิณ โสภาปิยะ" is present
    if (!map.has('นายทักษิณ โสภาปิยะ')) {
      map.set('นายทักษิณ โสภาปิยะ', 'นายทักษิณ โสภาปิยะ');
    }
    return Array.from(map.values()).sort();
  }, []);

  const defaultTeacher = useMemo(() => {
    if (currentUser?.name && !currentUser.name.includes('นักศึกษา')) {
      const match = allTeachers.find(t => t.includes(currentUser.name) || currentUser.name.includes(t));
      if (match) return match;
    }
    return 'นายทักษิณ โสภาปิยะ';
  }, [currentUser, allTeachers]);

  const [reporterName, setReporterName] = useState<string>(defaultTeacher);
  const [position, setPosition] = useState<string>('ครู วิทยฐานะครูชำนาญการพิเศษ');
  const [specialDuty, setSpecialDuty] = useState<string>('-');
  const [reportDate, setReportDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const currentWeekCalculated = useMemo(() => {
    return getCurrentWeekInfo().weekNumber || 1;
  }, []);

  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeekCalculated);

  // Generate weeks 1-18 with exact dates
  const weeksList = useMemo(() => {
    return Array.from({ length: 18 }, (_, idx) => {
      const w = idx + 1;
      const dates = getWeekDates(w);
      const start = dates[0];
      const end = dates[4];
      return {
        weekNumber: w,
        label: `สัปดาห์ที่ ${w} (${start.dateStr} - ${end.dateStr})`,
        startDate: start.fullDate,
        endDate: end.fullDate,
        startDay: start.dateStr.split(' ')[0],
        endDay: end.dateStr.split(' ')[0],
        monthStr: start.dateStr.split(' ')[1],
        yearBE: 2569
      };
    });
  }, []);

  const currentWeekMeta = useMemo(() => {
    return weeksList.find(w => w.weekNumber === selectedWeek) || weeksList[0];
  }, [weeksList, selectedWeek]);

  // Course list state - dynamically loaded by teacher
  const [courses, setCourses] = useState<TeachingCourseItem[]>([]);

  // Reload teacher courses whenever selected teacher changes
  useEffect(() => {
    const rawCourses = getCoursesByTeacher(reporterName);
    const defaultDate = new Date().toISOString().slice(0, 10);
    
    if (rawCourses && rawCourses.length > 0) {
      // Group unique subject codes and aggregate rooms
      const map = new Map<string, { code: string; name: string; rooms: Set<string> }>();
      rawCourses.forEach(c => {
        const key = c.subjectCode.trim();
        if (!map.has(key)) {
          map.set(key, { code: key, name: c.subjectName.trim(), rooms: new Set() });
        }
        if (c.room) map.get(key)!.rooms.add(c.room.trim());
      });

      const items: TeachingCourseItem[] = Array.from(map.values()).map((c, idx) => ({
        id: `crs-${idx + 1}-${c.code}`,
        subjectCode: c.code,
        subjectName: c.name,
        room: Array.from(c.rooms).sort().join(', ') || 'สอฟ.2/5, สอฟ.2/6',
        teachDate: defaultDate,
        teachTime: idx === 0 ? '15.00-17.00' : '14.00-19.00'
      }));

      setCourses(items);
    } else {
      // Fallback default courses for นายทักษิณ โสภาปิยะ
      setCourses([
        {
          id: 'crs-1',
          subjectCode: '30000-2005',
          subjectName: 'กิจกรรมในสถานประกอบการ 1',
          room: 'สอฟ.2/7, สอฟ.2/8',
          teachDate: defaultDate,
          teachTime: '15.00-17.00'
        },
        {
          id: 'crs-2',
          subjectCode: '30104-2028',
          subjectName: 'ระบบปรับอากาศในงานอุตสาหกรรม',
          room: 'สอฟ.2/5, สอฟ.2/6',
          teachDate: defaultDate,
          teachTime: '14.00-19.00'
        }
      ]);
    }
  }, [reporterName]);

  const [isSyncingCourses, setIsSyncingCourses] = useState(false);
  const [courseSyncMsg, setCourseSyncMsg] = useState<string | null>(null);

  const handleSyncCoursesFromSheets = async () => {
    setIsSyncingCourses(true);
    try {
      const refreshed = await fetchDataSheetCourses(true);
      const rawCourses = getCoursesByTeacher(reporterName, refreshed);
      if (rawCourses && rawCourses.length > 0) {
        const map = new Map<string, { code: string; name: string; rooms: Set<string> }>();
        rawCourses.forEach(c => {
          const key = c.subjectCode.trim();
          if (!map.has(key)) {
            map.set(key, { code: key, name: c.subjectName.trim(), rooms: new Set() });
          }
          if (c.room) map.get(key)!.rooms.add(c.room.trim());
        });

        const items: TeachingCourseItem[] = Array.from(map.values()).map((c, idx) => ({
          id: `crs-${idx + 1}-${c.code}`,
          subjectCode: c.code,
          subjectName: c.name,
          room: Array.from(c.rooms).sort().join(', ') || 'สอฟ.2/5, สอฟ.2/6',
          teachDate: reportDate,
          teachTime: idx === 0 ? '15.00-17.00' : '14.00-19.00'
        }));
        setCourses(items);
      }
      setCourseSyncMsg('อัปเดตและซิงค์ข้อมูลรายวิชาจาก Google Sheets (data & ตาราง Pivot 1) เรียบร้อย');
      setTimeout(() => setCourseSyncMsg(null), 5000);
    } catch (e: any) {
      setCourseSyncMsg('ซิงค์ข้อมูลไม่สำเร็จ: ' + (e.message || String(e)));
      setTimeout(() => setCourseSyncMsg(null), 5000);
    } finally {
      setIsSyncingCourses(false);
    }
  };

  const handleAddCourse = () => {
    const newId = `crs-${Date.now()}`;
    setCourses(prev => [
      ...prev,
      {
        id: newId,
        subjectCode: '30104-2011',
        subjectName: 'การประมาณการระบบไฟฟ้า',
        room: 'สอฟ.2/5',
        teachDate: reportDate,
        teachTime: '13.00-16.00'
      }
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateCourse = (id: string, field: keyof TeachingCourseItem, value: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // 2. Learning Outcomes / ผลที่เกิดจากการจัดการเรียนรู้
  // Max 6 lines, pulled from student daily logs or supervision notes
  const [learningOutcome, setLearningOutcome] = useState<string>(
    'มีความรู้เกี่ยวกับกิจกรรมในสถานประกอบการตามหลักการและกระบวนการ'
  );

  // Auto-summarize from database whenever selected week or teacher changes
  useEffect(() => {
    // 1. Check if Form 3 records exist for this week
    const weekRecords = form3List.filter(r => {
      if (!r.teacherName?.includes(reporterName.replace(/^(นาย|นางสาว|นาง)\s*/, ''))) {
        return false;
      }
      return true;
    });

    const f3WithComments = weekRecords.find(r => r.teacherComment && r.teacherComment.length > 10);

    if (f3WithComments && f3WithComments.teacherComment) {
      const trimmed = f3WithComments.teacherComment.trim();
      setLearningOutcome(`นักศึกษาปฏิบัติงานได้อย่างถูกต้อง ปลอดภัย มีความรู้ความเข้าใจในกระบวนการทำงาน ${trimmed}`);
      return;
    }

    // 2. Check submissions for that week
    const allSubs = Object.values(submissions).flat();
    const weekSubs = allSubs.filter(s => s.weekNumber === selectedWeek);
    if (weekSubs.length > 0 && weekSubs[0].dailyLogs && weekSubs[0].dailyLogs.length > 0) {
      const topLog = weekSubs[0].dailyLogs[0].taskDescription;
      setLearningOutcome(`นักศึกษามีความรู้และทักษะเกี่ยวกับ ${topLog.slice(0, 70)} ตามมาตรฐานวิชาชีพ`);
      return;
    }

    // 3. Week meta default
    const meta = WEEKS_1_TO_15.find(w => w.weekNumber === selectedWeek);
    if (meta) {
      setLearningOutcome(`มีความรู้เกี่ยวกับ${meta.title}ในสถานประกอบการตามหลักการและกระบวนการ`);
    } else {
      setLearningOutcome('มีความรู้เกี่ยวกับกิจกรรมในสถานประกอบการตามหลักการและกระบวนการ');
    }
  }, [selectedWeek, reporterName, form3List, submissions]);

  // 3. 6 Photos for Page 2 (Auto-detected per week & customizable)
  const defaultWeekPhotos = useMemo(() => {
    return generateDefaultWeekPhotos(selectedWeek, courses, submissions, form3List, students);
  }, [selectedWeek, courses, submissions, form3List, students]);

  const STORAGE_PHOTOS_KEY = 'kktech_page2_photos_by_week_v2';
  const [customPhotosByWeek, setCustomPhotosByWeek] = useState<Record<number, TeachingReportPhoto[]>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PHOTOS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load custom week photos:', e);
    }
    return {};
  });

  const saveCustomPhotos = (week: number, photos: TeachingReportPhoto[]) => {
    setCustomPhotosByWeek(prev => {
      const next = { ...prev, [week]: photos };
      try {
        localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save custom week photos to localStorage:', e);
      }
      return next;
    });
  };

  const currentWeekPhotos = useMemo(() => {
    const custom = customPhotosByWeek[selectedWeek];
    if (custom && custom.length === 6) {
      return custom;
    }
    return defaultWeekPhotos;
  }, [customPhotosByWeek, selectedWeek, defaultWeekPhotos]);

  const [autoPullToast, setAutoPullToast] = useState<string | null>(null);

  const handleUpdatePhoto = (slotIndex: number, newPhoto: Partial<TeachingReportPhoto>) => {
    const base = [...currentWeekPhotos];
    base[slotIndex] = {
      ...base[slotIndex],
      ...newPhoto,
      caption: newPhoto.caption !== undefined 
        ? newPhoto.caption 
        : (base[slotIndex]?.caption || `ภาพที่ ${slotIndex + 1}: การจัดการเรียนการสอนบูรณาการ`)
    };
    saveCustomPhotos(selectedWeek, base);
  };

  const handleDeletePhoto = (slotIndex: number) => {
    const base = [...currentWeekPhotos];
    base[slotIndex] = {
      id: `empty-${Date.now()}-${slotIndex}`,
      url: '',
      caption: `ภาพที่ ${slotIndex + 1}: (คลิกเพื่อเลือกหรืออัปโหลดรูปภาพใหม่)`,
      sourceType: 'custom'
    };
    saveCustomPhotos(selectedWeek, base);
  };

  const handleUploadPhoto = (slotIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        handleUpdatePhoto(slotIndex, {
          id: `upload-${Date.now()}`,
          url: dataUrl,
          sourceType: 'uploaded',
          sourceTitle: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCaptionChange = (slotIndex: number, newCaption: string) => {
    const base = [...currentWeekPhotos];
    base[slotIndex] = {
      ...base[slotIndex],
      caption: newCaption
    };
    saveCustomPhotos(selectedWeek, base);
  };

  const handleResetWeekPhotos = () => {
    setCustomPhotosByWeek(prev => {
      const next = { ...prev };
      delete next[selectedWeek];
      try {
        localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to reset week photos in localStorage:', e);
      }
      return next;
    });
    setAutoPullToast(`คืนค่ารูปภาพสัปดาห์ที่ ${selectedWeek} เป็นค่าเริ่มต้นเรียบร้อย`);
    setTimeout(() => setAutoPullToast(null), 3000);
  };

  const handleAutoPullWeekPhotos = () => {
    const fresh = generateDefaultWeekPhotos(selectedWeek, courses, submissions, form3List, students);
    saveCustomPhotos(selectedWeek, fresh);
    setAutoPullToast(`ดึงรูปภาพจากการนิเทศและบันทึกฝึกงานสัปดาห์ที่ ${selectedWeek} เรียบร้อยแล้ว`);
    setTimeout(() => setAutoPullToast(null), 3500);
  };

  // Photo Library Picker Modal state
  const [activePhotoSlotModal, setActivePhotoSlotModal] = useState<number | null>(null);
  const [isPhotoPickerModalOpen, setIsPhotoPickerModalOpen] = useState(false);
  const [photoPickerTab, setPhotoPickerTab] = useState<'submissions' | 'supervision' | 'standards' | 'upload'>('submissions');
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState('');

  // Caption Edit Modal state
  const [activeCaptionSlotIndex, setActiveCaptionSlotIndex] = useState<number | null>(null);
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
  const [editCaptionText, setEditCaptionText] = useState('');

  const availableStudentWeekPhotos = useMemo(() => {
    const allSubs = Object.values(submissions).flat();
    const weekSubs = allSubs.filter(s => s.weekNumber === selectedWeek);
    const list: TeachingReportPhoto[] = [];

    for (const sub of weekSubs) {
      if (sub.photos && sub.photos.length > 0) {
        const st = students.find(s => s.id === sub.studentId || s.studentCode === sub.studentId);
        for (const p of sub.photos) {
          if (p.url) {
            list.push({
              id: `pick-sub-${sub.id}-${p.id}`,
              url: p.url,
              caption: p.caption || p.title || `ปฏิบัติงานตามมาตรฐานวิชาชีพ ${sub.taskTitle || 'งานบำรุงรักษาระบบไฟฟ้า'}`,
              sourceType: 'submission',
              sourceTitle: sub.taskTitle || 'บันทึกการปฏิบัติงานประจำสัปดาห์',
              studentName: st?.name || 'นักศึกษาฝึกงาน',
              companyName: st?.companyName || 'สถานประกอบการ'
            });
          }
        }
      }
    }
    return list;
  }, [submissions, selectedWeek, students]);

  const availableSupervisionPhotos = useMemo(() => {
    const list: TeachingReportPhoto[] = [];
    for (const f3 of form3List) {
      if (f3.photos && f3.photos.length > 0) {
        for (const p of f3.photos) {
          if (p.url) {
            list.push({
              id: `pick-f3-${f3.id}-${p.id || Math.random()}`,
              url: p.url,
              caption: p.caption || `ครูนิเทศก์ตรวจเยี่ยมนิเทศและประเมินสมรรถนะวิชาชีพ ณ ${f3.companyName}`,
              sourceType: 'supervision',
              sourceTitle: `การนิเทศสถานประกอบการ: ${f3.companyName}`,
              companyName: f3.companyName,
              date: f3.visitDate
            });
          }
        }
      }
    }
    return list;
  }, [form3List]);

  // Loading states for PDF buttons
  const [isGeneratingMemo, setIsGeneratingMemo] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Print Preview state for Document 1 (Memo)
  const [isMemoPreviewOpen, setIsMemoPreviewOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);

  const handleNativePrintMemo = () => {
    document.body.classList.add('print-memo-mode');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-memo-mode');
    }, 1000);
  };

  // Print Preview state for Document 2 (Weekly Report Page 1)
  const [isReportPage1PreviewOpen, setIsReportPage1PreviewOpen] = useState(false);
  const [reportPage1Zoom, setReportPage1Zoom] = useState<number>(0.85);
  const [isGeneratingReportPage1, setIsGeneratingReportPage1] = useState(false);

  const handleNativePrintReportPage1 = () => {
    document.body.classList.add('print-report1-mode');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-report1-mode');
    }, 1000);
  };

  const handlePrintReportPage1PDF = async () => {
    const el = document.getElementById('weekly-report-page-1');
    if (!el) {
      window.print();
      return;
    }

    setIsGeneratingReportPage1(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(el, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));

      const fileName = `รายงานการจัดการเรียนการสอนบูรณาการ_${reporterName}_สัปดาห์ที่${selectedWeek}_หน้า1.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.warn('PDF report page 1 print notice:', err);
      window.print();
    } finally {
      setIsGeneratingReportPage1(false);
    }
  };

  // Print Preview state for Document 2 (Weekly Report Page 2)
  const [isReportPage2PreviewOpen, setIsReportPage2PreviewOpen] = useState(false);
  const [reportPage2Zoom, setReportPage2Zoom] = useState<number>(0.85);
  const [isGeneratingReportPage2, setIsGeneratingReportPage2] = useState(false);

  // Print Preview state for Document 2 (Both Pages 1 and 2 Full Report)
  const [isWeeklyFullPreviewOpen, setIsWeeklyFullPreviewOpen] = useState(false);
  const [weeklyFullZoom, setWeeklyFullZoom] = useState<number>(0.85);

  const handleNativePrintReportPage2 = () => {
    document.body.classList.add('print-report2-mode');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-report2-mode');
    }, 1000);
  };

  const handlePrintReportPage2PDF = async () => {
    const el = document.getElementById('weekly-report-page-2');
    if (!el) {
      window.print();
      return;
    }

    setIsGeneratingReportPage2(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(el, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));

      const fileName = `รายงานการจัดการเรียนการสอนบูรณาการ_${reporterName}_สัปดาห์ที่${selectedWeek}_หน้า2.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.warn('PDF report page 2 print notice:', err);
      window.print();
    } finally {
      setIsGeneratingReportPage2(false);
    }
  };

  const handleNativePrintWeeklyFull = () => {
    document.body.classList.add('print-weekly-full-mode');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-weekly-full-mode');
    }, 1000);
  };

  // Printable dates formatted in Thai
  const thaiReportDateStr = useMemo(() => formatThaiDateFull(reportDate), [reportDate]);
  const currentWeekDates = useMemo(() => getWeekDates(selectedWeek), [selectedWeek]);
  const startDayFull = currentWeekDates[0]?.fullDate || '19 ตุลาคม 2569';
  const endDayFull = currentWeekDates[4]?.fullDate || '23 ตุลาคม 2569';
  const startDayNum = currentWeekDates[0]?.dateStr.split(' ')[0] || '19';
  const endDayNum = currentWeekDates[4]?.dateStr.split(' ')[0] || '23';
  const monthFull = THAI_MONTHS_FULL[9]; // ตุลาคม or derived from dates

  // BUTTON 1: "พิมพ์บันทึกข้อความรายงานการจัดการเรียนรู้" (1-Page A4 PDF)
  const handlePrintMemoPDF = async () => {
    const el = document.getElementById('memo-printable-page');
    if (!el) {
      window.print();
      return;
    }

    setIsGeneratingMemo(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(el, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));

      const fileName = `บันทึกข้อความ_รายงานการสอนบูรณาการ_${reporterName}_สัปดาห์ที่${selectedWeek}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.warn('PDF memo print notice:', err);
      window.print();
    } finally {
      setIsGeneratingMemo(false);
    }
  };

  // BUTTON 2: "พิมพ์รายงานการจัดการเรียนรู้รายสัปดาห์" (2-Page A4 PDF in a single file)
  const handlePrintWeeklyReportPDF = async () => {
    const page1El = document.getElementById('weekly-report-page-1');
    const page2El = document.getElementById('weekly-report-page-2');

    if (!page1El || !page2El) {
      window.print();
      return;
    }

    setIsGeneratingReport(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const maxPdfHeight = pdf.internal.pageSize.getHeight();

      // Render Page 1
      const canvas1 = await html2canvas(page1El, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.98);
      const height1 = (canvas1.height * pdfWidth) / canvas1.width;
      pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, Math.min(height1, maxPdfHeight));

      // Add Page 2
      pdf.addPage();

      // Render Page 2
      const canvas2 = await html2canvas(page2El, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData2 = canvas2.toDataURL('image/jpeg', 0.98);
      const height2 = (canvas2.height * pdfWidth) / canvas2.width;
      pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, Math.min(height2, maxPdfHeight));

      const fileName = `รายงานการจัดการเรียนรู้รายสัปดาห์_${reporterName}_สัปดาห์ที่${selectedWeek}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.warn('PDF weekly report print notice:', err);
      window.print();
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Configuration Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                รายงานการจัดการเรียนการสอนบูรณาการในสถานประกอบการ (A4 Formatter)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              สัดส่วนมาตรฐานกระดาษราชการ A4 (210mm x 297mm) • แผนกวิชาช่างไฟฟ้ากำลัง วิทยาลัยเทคนิคขอนแก่น
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsMemoPreviewOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs shadow-md transition cursor-pointer"
              title="พิมพ์หรือดาวน์โหลด PDF บันทึกข้อความรายงานการจัดการเรียนรู้ (แสดงตัวอย่างก่อนพิมพ์คงสัดส่วน A4)"
            >
              <Eye className="w-4 h-4 text-sky-300" />
              <span>พิมพ์บันทึกข้อความรายงานการจัดการเรียนรู้</span>
            </button>

            <button
              onClick={() => setIsWeeklyFullPreviewOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
              title="พิมพ์หรือดาวน์โหลด PDF รายงานการจัดการเรียนรู้รายสัปดาห์ (แสดงตัวอย่างก่อนพิมพ์ครบทั้ง 2 หน้า A4)"
            >
              <Eye className="w-4 h-4 text-emerald-200" />
              <span>พิมพ์รายงานการจัดการเรียนรู้รายสัปดาห์</span>
            </button>
          </div>
        </div>

        {/* Inputs Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1 text-xs">
          {/* 1. ชื่อผู้รายงาน */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>ชื่อผู้รายงาน:</span>
            </label>
            <select
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {allTeachers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 2. ตำแหน่ง */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>ตำแหน่ง:</span>
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {POSITION_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 3. หน้าที่พิเศษ */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>หน้าที่พิเศษ:</span>
            </label>
            <input
              type="text"
              value={specialDuty}
              onChange={(e) => setSpecialDuty(e.target.value)}
              placeholder="เช่น - หรือ หัวหน้างาน..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 4. วันที่รายงาน */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>วันที่รายงาน:</span>
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 5. สัปดาห์ที่รายงาน */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>สัปดาห์ที่รายงาน:</span>
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {weeksList.map(w => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course dynamic table */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>ข้อมูลรายวิชาสอนในสถานประกอบการ (ซิงค์จากตารางสอน Google Sheets: data & ตาราง Pivot 1):</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncCoursesFromSheets}
                disabled={isSyncingCourses}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition disabled:opacity-60 cursor-pointer"
                title="ซิงค์และอัปเดตรายวิชาจาก Google Sheets (data และ ตาราง Pivot 1) ให้เป็นปัจจุบัน"
              >
                <RefreshCw className={`w-3 h-3 text-emerald-700 ${isSyncingCourses ? 'animate-spin' : ''}`} />
                <span>{isSyncingCourses ? 'กำลังซิงค์ชีต...' : 'ซิงค์ชีตตารางสอน'}</span>
              </button>
              <button
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>เพิ่มรายวิชา</span>
              </button>
            </div>
          </div>

          {/* Sync notification */}
          {courseSyncMsg && (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{courseSyncMsg}</span>
            </div>
          )}

          <div className="space-y-2.5 overflow-x-auto">
            {/* Desktop column headers (Strictly aligned with input columns) */}
            <div className="hidden md:grid md:grid-cols-[28px_110px_minmax(160px,1fr)_260px_135px_126px_32px] gap-2.5 px-3 py-1 text-[11px] font-bold text-slate-500 items-center md:min-w-[880px]">
              <span className="text-center">#</span>
              <span>รหัสวิชา</span>
              <span>ชื่อรายวิชา</span>
              <span>กลุ่มเรียน</span>
              <span>วันที่สอน</span>
              <span>ช่วงเวลาสอน</span>
              <span></span>
            </div>

            {courses.map((course, idx) => (
              <div 
                key={course.id} 
                className="flex flex-col md:grid md:grid-cols-[28px_110px_minmax(160px,1fr)_260px_135px_126px_32px] gap-2.5 p-3 bg-slate-50/90 rounded-xl border border-slate-200 text-xs shadow-2xs items-center md:min-w-[880px]"
              >
                {/* 1. # */}
                <div className="flex items-center justify-between md:justify-center">
                  <span className="md:hidden text-[10px] font-semibold text-slate-500">ลำดับ</span>
                  <span className="font-bold text-slate-600 text-center">#{idx + 1}</span>
                </div>

                {/* 2. รหัสวิชา */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 md:hidden">รหัสวิชา</label>
                  <input
                    type="text"
                    value={course.subjectCode}
                    onChange={(e) => handleUpdateCourse(course.id, 'subjectCode', e.target.value)}
                    placeholder="รหัสวิชา"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 3. ชื่อรายวิชา */}
                <div className="min-w-0">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 md:hidden">ชื่อรายวิชา</label>
                  <input
                    type="text"
                    value={course.subjectName}
                    onChange={(e) => handleUpdateCourse(course.id, 'subjectName', e.target.value)}
                    placeholder="ชื่อรายวิชา"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 truncate"
                  />
                </div>

                {/* 4. กลุ่มเรียน */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 md:hidden">กลุ่มเรียน</label>
                  <input
                    type="text"
                    value={course.room}
                    onChange={(e) => handleUpdateCourse(course.id, 'room', e.target.value)}
                    placeholder="กลุ่มเรียน เช่น สอฟ.2/5"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 5. วันที่สอน */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 md:hidden">วันที่สอน</label>
                  <input
                    type="date"
                    value={course.teachDate}
                    onChange={(e) => handleUpdateCourse(course.id, 'teachDate', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 6. ช่วงเวลาสอน: ปรับเป็น 3/4 จาก 168px เหลือ 126px */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 md:hidden">ช่วงเวลาสอน</label>
                  <input
                    type="text"
                    value={course.teachTime}
                    onChange={(e) => handleUpdateCourse(course.id, 'teachTime', e.target.value)}
                    placeholder="เช่น 15.00-17.00 น."
                    title="ช่วงเวลาสอน (เช่น 15.00-17.00 น.)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* 7. Action Button */}
                <div className="flex items-center justify-end md:justify-center">
                  {courses.length > 1 ? (
                    <button
                      onClick={() => handleRemoveCourse(course.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                      title="ลบรายวิชา"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning outcomes text editor */}
        <div className="pt-2 border-t border-slate-100">
          <label className="font-semibold text-slate-700 text-xs block mb-1">
            ผลที่เกิดจากการจัดการเรียนรู้:
          </label>
          <textarea
            rows={2}
            value={learningOutcome}
            onChange={(e) => setLearningOutcome(e.target.value)}
            className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* DOCUMENT PREVIEWS CONTAINER */}
      <div className="space-y-10 flex flex-col items-center">

        {/* ------------------------------------------------------------- */}
        {/* DOCUMENT 1: MEMORANDUM PAGE (1-PAGE A4)                       */}
        {/* Exact match to Screenshot 2026-11-03 154437                  */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-[210mm] shadow-lg rounded-sm overflow-hidden bg-white border border-slate-300">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between print:hidden">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>เอกสารที่ 1: บันทึกข้อความรายงานการจัดการเรียนรู้ (1 หน้ากระดาษ A4)</span>
            </span>
            <button
              onClick={() => setIsMemoPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>สั่งพิมพ์หรือดาวน์โหลด PDF หน้านี้</span>
            </button>
          </div>

          <div
            id="memo-printable-page"
            className="bg-white text-black font-serif"
            style={{
              width: '210mm',
              minHeight: '297mm',
              margin: '0 auto',
              padding: '10mm 20mm 35mm 20mm', // ปรับขยายขอบกระดาษส่วนล่างเพิ่มอีก 2 ซม. (35mm)
              boxSizing: 'border-box',
              fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
              color: '#000000'
            }}
          >
            <MemoDocumentContent
              reporterName={reporterName}
              position={position}
              thaiReportDateStr={thaiReportDateStr}
              selectedWeek={selectedWeek}
              courses={courses}
            />
          </div>
        </div>


        {/* ------------------------------------------------------------- */}
        {/* DOCUMENT 2: WEEKLY REPORT PAGE 1 (A4)                         */}
        {/* Exact match to Screenshot 2026-11-03 162344                  */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-[210mm] shadow-lg rounded-sm overflow-hidden bg-white border border-slate-300">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between print:hidden">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>เอกสารที่ 2 (หน้าที่ 1/2): รายงานการจัดการเรียนการสอนบูรณาการในสถานประกอบการ</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">หน้า 1</span>
              <button
                onClick={() => setIsReportPage1PreviewOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 hover:underline font-semibold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์หรือดาวน์โหลด PDF หน้านี้</span>
              </button>
            </div>
          </div>

          <div
            id="weekly-report-page-1"
            className="bg-white text-black p-[18mm] relative"
            style={{
              width: '210mm',
              minHeight: '297mm',
              margin: '0 auto',
              boxSizing: 'border-box',
              fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
              fontSize: '15pt',
              lineHeight: 1.35,
              color: '#000000'
            }}
          >
            <WeeklyReportPage1Content
              reporterName={reporterName}
              position={position}
              specialDuty={specialDuty}
              selectedWeek={selectedWeek}
              startDayFull={startDayFull}
              endDayFull={endDayFull}
              courses={courses}
              learningOutcome={learningOutcome}
            />
          </div>
        </div>


        {/* ------------------------------------------------------------- */}
        {/* DOCUMENT 3: WEEKLY REPORT PAGE 2 (A4 PHOTO GALLERY)           */}
        {/* Exact match to Screenshot 2026-11-03 165818                  */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-[210mm] shadow-lg rounded-sm overflow-hidden bg-white border border-slate-300">
          {/* Header Management Bar */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 print:hidden" data-html2canvas-ignore="true">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-sky-100 text-sky-700">
                <ImageIcon className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>เอกสารที่ 2 (หน้าที่ 2/2): ประมวลภาพการจัดการเรียนการสอนบูรณาการในสถานประกอบการ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">
                    สัปดาห์ที่ {selectedWeek}
                  </span>
                </span>
                <p className="text-[11px] text-slate-500">
                  ดึงรูปภาพจากการนิเทศและบันทึกฝึกงานอัตโนมัติตามสัปดาห์ • ปรับเปลี่ยน ลบ หรืออัปโหลดรูปใหม่ได้อิสระ
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAutoPullWeekPhotos}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                title="ดึงรูปภาพจากบันทึกฝึกงานนักศึกษาและภาพการนิเทศของสัปดาห์นี้ใหม่อัตโนมัติ"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ดึงรูปภาพอัตโนมัติตามสัปดาห์</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePhotoSlotModal(0);
                  setIsPhotoPickerModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-sm transition cursor-pointer"
                title="เปิดคลังรูปภาพทั้งหมดเพื่อเลือกภาพสำหรับช่องต่าง ๆ"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>คลังรูปภาพ</span>
              </button>

              <button
                type="button"
                onClick={handleResetWeekPhotos}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition cursor-pointer"
                title="คืนค่ารูปภาพเป็นค่าเริ่มต้นของสัปดาห์นี้"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>คืนค่าเริ่มต้น</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReportPage2PreviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                title="สั่งพิมพ์หรือดาวน์โหลด PDF หน้านี้ (แสดงตัวอย่างก่อนพิมพ์คงสัดส่วน A4)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์/PDF</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {autoPullToast && (
            <div 
              className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs px-4 py-2 flex items-center justify-between print:hidden"
              data-html2canvas-ignore="true"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{autoPullToast}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setAutoPullToast(null)}
                className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div
            id="weekly-report-page-2"
            className="bg-white text-black p-[18mm] relative"
            style={{
              width: '210mm',
              minHeight: '297mm',
              margin: '0 auto',
              boxSizing: 'border-box',
              fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
              fontSize: '15pt',
              lineHeight: 1.35,
              color: '#000000'
            }}
          >
            <WeeklyReportPage2Content
              selectedWeek={selectedWeek}
              startDayNum={startDayNum}
              endDayNum={endDayNum}
              monthFull={monthFull}
              weekPhotos={currentWeekPhotos}
              isInteractive={true}
              onOpenPhotoPicker={(slotIdx) => {
                setActivePhotoSlotModal(slotIdx);
                setIsPhotoPickerModalOpen(true);
              }}
              onDeletePhoto={handleDeletePhoto}
              onUploadPhoto={handleUploadPhoto}
              onOpenCaptionModal={(slotIdx) => {
                setActiveCaptionSlotIndex(slotIdx);
                setEditCaptionText(currentWeekPhotos[slotIdx]?.caption || `ภาพที่ ${slotIdx + 1}: `);
                setIsCaptionModalOpen(true);
              }}
            />
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRINT PREVIEW MODAL (DOCUMENT 1: MEMO - 1 PAGE A4)           */}
      {/* ------------------------------------------------------------- */}
      {isMemoPreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md overflow-hidden print:hidden animate-in fade-in duration-200">
          {/* Top Preview Toolbar */}
          <div className="flex-none bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            {/* Title & Document Badge */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/30 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    ตัวอย่างก่อนพิมพ์ (Print Preview)
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    เอกสารที่ 1: บันทึกข้อความ A4 (210 × 297 มม.)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {reporterName} • สัปดาห์ที่ {selectedWeek} • คงสัดส่วนเอกสารราชการมาตรฐาน 1 หน้า A4 แท้
                </p>
              </div>
            </div>

            {/* Controls & Actions */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700/80 p-0.5 text-xs shadow-inner">
                <button
                  onClick={() => setPreviewZoom(z => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ย่อขนาดตัวอย่าง"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-slate-200 text-xs min-w-[48px] text-center select-none">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  onClick={() => setPreviewZoom(z => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ขยายขนาดตัวอย่าง"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewZoom(0.85)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    previewZoom === 0.85 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="ปรับขนาดให้พอดีหน้าจอ"
                >
                  พอดีจอ
                </button>
                <button
                  onClick={() => setPreviewZoom(1)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    previewZoom === 1 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="100% สัดส่วนขนาดจริงกระดาษ A4"
                >
                  100% (จริง)
                </button>
              </div>

              {/* Print Button */}
              <button
                onClick={handleNativePrintMemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                title="สั่งพิมพ์เอกสารผ่านหน้าต่างการพิมพ์ของเบราว์เซอร์ (1 หน้า A4)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={handlePrintMemoPDF}
                disabled={isGeneratingMemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                title="ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูง (1 หน้า A4)"
              >
                {isGeneratingMemo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังสร้าง PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด PDF</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsMemoPreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
                title="ปิดหน้าต่างตัวอย่างก่อนพิมพ์"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Preview Canvas Viewport */}
          <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-8 flex justify-center items-start">
            <div
              className="transition-transform duration-150 origin-top shrink-0"
              style={{
                transform: `scale(${previewZoom})`,
                marginBottom: `${Math.max(40, (previewZoom - 1) * 320)}px`
              }}
            >
              {/* Paper sheet representation (Exact 210mm x 297mm A4 aspect ratio) */}
              <div
                className="bg-white text-black font-serif shadow-2xl ring-1 ring-black/20 rounded-xs"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  height: '297mm',
                  padding: '10mm 20mm 35mm 20mm', // ปรับขยายขอบกระดาษส่วนล่างเพิ่มอีก 2 ซม. (35mm)
                  boxSizing: 'border-box',
                  fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              >
                <MemoDocumentContent
                  reporterName={reporterName}
                  position={position}
                  thaiReportDateStr={thaiReportDateStr}
                  selectedWeek={selectedWeek}
                  courses={courses}
                />
              </div>
            </div>
          </div>

          {/* Floating bottom quick bar for fast actions */}
          <div className="flex-none p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              สัดส่วนมาตรฐาน A4 (210 × 297 มม.) • สัปดาห์ที่ {selectedWeek}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNativePrintMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร</span>
              </button>
              <button
                onClick={handlePrintMemoPDF}
                disabled={isGeneratingMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด PDF</span>
              </button>
              <button
                onClick={() => setIsMemoPreviewOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRINT PREVIEW MODAL - DOCUMENT 2 (Weekly Report Page 1)       */}
      {/* ------------------------------------------------------------- */}
      {isReportPage1PreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-between animate-fadeIn print:hidden">
          {/* Top Floating Control Bar */}
          <div className="flex-none p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ตัวอย่างก่อนพิมพ์ - เอกสารที่ 2 (หน้าที่ 1/2): รายงานการจัดการเรียนการสอนบูรณาการ</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    สัดส่วน A4 (1 หน้า)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  แสดงผลลัพธ์ขนาดสัดส่วนเหมือนกับเอกสารจริงบนหน้าเพจทุกประการ (210 × 297 มม.)
                </p>
              </div>
            </div>

            {/* Quick Actions & Zoom Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => setReportPage1Zoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ย่อขนาดแสดงผล (-10%)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-200 select-none min-w-[50px] text-center">
                  {Math.round(reportPage1Zoom * 100)}%
                </span>
                <button
                  onClick={() => setReportPage1Zoom(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ขยายขนาดแสดงผล (+10%)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReportPage1Zoom(0.85)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    reportPage1Zoom === 0.85 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="ปรับขนาดให้พอดีหน้าจอ"
                >
                  พอดีจอ
                </button>
                <button
                  onClick={() => setReportPage1Zoom(1)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    reportPage1Zoom === 1 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="100% สัดส่วนขนาดจริงกระดาษ A4"
                >
                  100% (จริง)
                </button>
              </div>

              {/* Print Button */}
              <button
                onClick={handleNativePrintReportPage1}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                title="สั่งพิมพ์เอกสารผ่านหน้าต่างการพิมพ์ของเบราว์เซอร์ (1 หน้า A4)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={handlePrintReportPage1PDF}
                disabled={isGeneratingReportPage1}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                title="ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูง (1 หน้า A4)"
              >
                {isGeneratingReportPage1 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังสร้าง PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด PDF</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsReportPage1PreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
                title="ปิดหน้าต่างตัวอย่างก่อนพิมพ์"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Preview Canvas Viewport */}
          <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-8 flex justify-center items-start">
            <div
              className="transition-transform duration-150 origin-top shrink-0"
              style={{
                transform: `scale(${reportPage1Zoom})`,
                marginBottom: `${Math.max(40, (reportPage1Zoom - 1) * 320)}px`
              }}
            >
              {/* Paper sheet representation (Exact 210mm x 297mm A4 aspect ratio) */}
              <div
                className="bg-white text-black font-serif shadow-2xl ring-1 ring-black/20 rounded-xs"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  height: '297mm',
                  padding: '18mm',
                  boxSizing: 'border-box',
                  fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
                  fontSize: '15pt',
                  lineHeight: 1.35,
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              >
                <WeeklyReportPage1Content
                  reporterName={reporterName}
                  position={position}
                  specialDuty={specialDuty}
                  selectedWeek={selectedWeek}
                  startDayFull={startDayFull}
                  endDayFull={endDayFull}
                  courses={courses}
                  learningOutcome={learningOutcome}
                />
              </div>
            </div>
          </div>

          {/* Floating bottom quick bar for fast actions */}
          <div className="flex-none p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              สัดส่วนมาตรฐาน A4 (210 × 297 มม.) • สัปดาห์ที่ {selectedWeek} • หน้าที่ 1/2
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNativePrintReportPage1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร</span>
              </button>
              <button
                onClick={handlePrintReportPage1PDF}
                disabled={isGeneratingReportPage1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด PDF</span>
              </button>
              <button
                onClick={() => setIsReportPage1PreviewOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRINT PREVIEW MODAL - DOCUMENT 2 (Weekly Report Page 2)       */}
      {/* ------------------------------------------------------------- */}
      {isReportPage2PreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-between animate-fadeIn print:hidden">
          {/* Top Floating Control Bar */}
          <div className="flex-none p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <ImageIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ตัวอย่างก่อนพิมพ์ - เอกสารที่ 2 (หน้าที่ 2/2): ประมวลภาพการจัดการเรียนการสอนบูรณาการ</span>
                  <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full font-mono">
                    สัดส่วน A4 (1 หน้า - 210 × 297 มม.)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  แสดงผลลัพธ์ขนาดสัดส่วนเหมือนกับเอกสารจริงบนหน้าเพจทุกประการ (210 × 297 มม.)
                </p>
              </div>
            </div>

            {/* Quick Actions & Zoom Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => setReportPage2Zoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ย่อขนาดแสดงผล (-10%)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-200 select-none min-w-[50px] text-center">
                  {Math.round(reportPage2Zoom * 100)}%
                </span>
                <button
                  onClick={() => setReportPage2Zoom(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ขยายขนาดแสดงผล (+10%)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReportPage2Zoom(0.85)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    reportPage2Zoom === 0.85 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="ปรับขนาดให้พอดีหน้าจอ"
                >
                  พอดีจอ
                </button>
                <button
                  onClick={() => setReportPage2Zoom(1)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    reportPage2Zoom === 1 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="100% สัดส่วนขนาดจริงกระดาษ A4"
                >
                  100% (จริง)
                </button>
              </div>

              {/* Print Button */}
              <button
                onClick={handleNativePrintReportPage2}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                title="สั่งพิมพ์เอกสารผ่านหน้าต่างการพิมพ์ของเบราว์เซอร์ (หน้าที่ 2/2)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={handlePrintReportPage2PDF}
                disabled={isGeneratingReportPage2}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                title="ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูง (1 หน้า A4)"
              >
                {isGeneratingReportPage2 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังสร้าง PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด PDF</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsReportPage2PreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
                title="ปิดหน้าต่างตัวอย่างก่อนพิมพ์"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Preview Canvas Viewport */}
          <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-8 flex justify-center items-start">
            <div
              className="transition-transform duration-150 origin-top shrink-0"
              style={{
                transform: `scale(${reportPage2Zoom})`,
                marginBottom: `${Math.max(40, (reportPage2Zoom - 1) * 320)}px`
              }}
            >
              {/* Paper sheet representation (Exact 210mm x 297mm A4 aspect ratio) */}
              <div
                className="bg-white text-black font-serif shadow-2xl ring-1 ring-black/20 rounded-xs"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  height: '297mm',
                  padding: '18mm',
                  boxSizing: 'border-box',
                  fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
                  fontSize: '15pt',
                  lineHeight: 1.35,
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              >
                <WeeklyReportPage2Content
                  selectedWeek={selectedWeek}
                  startDayNum={startDayNum}
                  endDayNum={endDayNum}
                  monthFull={monthFull}
                  weekPhotos={currentWeekPhotos}
                  isInteractive={false}
                />
              </div>
            </div>
          </div>

          {/* Floating bottom quick bar for fast actions */}
          <div className="flex-none p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              สัดส่วนมาตรฐาน A4 (210 × 297 มม.) • สัปดาห์ที่ {selectedWeek} • หน้าที่ 2/2
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNativePrintReportPage2}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร</span>
              </button>
              <button
                onClick={handlePrintReportPage2PDF}
                disabled={isGeneratingReportPage2}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด PDF</span>
              </button>
              <button
                onClick={() => setIsReportPage2PreviewOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRINT PREVIEW MODAL - DOCUMENT 2 FULL (BOTH PAGES 1 & 2)       */}
      {/* ------------------------------------------------------------- */}
      {isWeeklyFullPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col justify-between animate-fadeIn print:hidden">
          {/* Top Floating Control Bar */}
          <div className="flex-none p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ตัวอย่างก่อนพิมพ์ (Print Preview)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                    เอกสารที่ 2: รายงานการจัดการเรียนรู้รายสัปดาห์ (ครบทั้ง 2 หน้า A4 - 210 × 297 มม.)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {reporterName} • สัปดาห์ที่ {selectedWeek} • แสดงครบทั้ง 2 หน้าตามสัดส่วนกระดาษราชการ A4 แท้ (210 × 297 มม.)
                </p>
              </div>
            </div>

            {/* Quick Actions & Zoom Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => setWeeklyFullZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ย่อขนาดแสดงผล (-10%)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-200 select-none min-w-[50px] text-center">
                  {Math.round(weeklyFullZoom * 100)}%
                </span>
                <button
                  onClick={() => setWeeklyFullZoom(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                  title="ขยายขนาดแสดงผล (+10%)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWeeklyFullZoom(0.85)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    weeklyFullZoom === 0.85 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="ปรับขนาดให้พอดีหน้าจอ"
                >
                  พอดีจอ
                </button>
                <button
                  onClick={() => setWeeklyFullZoom(1)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                    weeklyFullZoom === 1 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="100% สัดส่วนขนาดจริงกระดาษ A4"
                >
                  100% (จริง)
                </button>
              </div>

              {/* Print Button (Both Pages) */}
              <button
                onClick={handleNativePrintWeeklyFull}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                title="สั่งพิมพ์เอกสารทั้ง 2 หน้าผ่านหน้าต่างการพิมพ์ของเบราว์เซอร์"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร (ทั้ง 2 หน้า)</span>
              </button>

              {/* Download PDF Button (Both Pages in 1 file) */}
              <button
                onClick={handlePrintWeeklyReportPDF}
                disabled={isGeneratingReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                title="ดาวน์โหลดเป็นไฟล์ PDF ทั้ง 2 หน้าในไฟล์เดียวกัน"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังสร้าง PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด PDF (ทั้ง 2 หน้า)</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsWeeklyFullPreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
                title="ปิดหน้าต่างตัวอย่างก่อนพิมพ์"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Preview Canvas Viewport showing BOTH pages */}
          <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-8 flex justify-center items-start">
            <div
              className="transition-transform duration-150 origin-top shrink-0 flex flex-col items-center gap-10"
              style={{
                transform: `scale(${weeklyFullZoom})`,
                marginBottom: `${Math.max(60, (weeklyFullZoom - 1) * 650)}px`
              }}
            >
              {/* PAGE 1 BLOCK */}
              <div className="flex flex-col items-center">
                <div className="mb-2 px-3.5 py-1 rounded-full bg-slate-800/90 text-slate-200 text-xs font-semibold border border-slate-700 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>เอกสารที่ 2 (หน้าที่ 1/2): รายงานการจัดการเรียนการสอนบูรณาการในสถานประกอบการ</span>
                </div>
                <div
                  className="bg-white text-black font-serif shadow-2xl ring-1 ring-black/20 rounded-xs"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    height: '297mm',
                    padding: '18mm',
                    boxSizing: 'border-box',
                    fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
                    fontSize: '15pt',
                    lineHeight: 1.35,
                    color: '#000000',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <WeeklyReportPage1Content
                    reporterName={reporterName}
                    position={position}
                    specialDuty={specialDuty}
                    selectedWeek={selectedWeek}
                    startDayFull={startDayFull}
                    endDayFull={endDayFull}
                    courses={courses}
                    learningOutcome={learningOutcome}
                  />
                </div>
              </div>

              {/* PAGE 2 BLOCK */}
              <div className="flex flex-col items-center">
                <div className="mb-2 px-3.5 py-1 rounded-full bg-slate-800/90 text-slate-200 text-xs font-semibold border border-slate-700 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>เอกสารที่ 2 (หน้าที่ 2/2): ประมวลภาพการจัดการเรียนการสอนบูรณาการในสถานประกอบการ</span>
                </div>
                <div
                  className="bg-white text-black font-serif shadow-2xl ring-1 ring-black/20 rounded-xs"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    height: '297mm',
                    padding: '18mm',
                    boxSizing: 'border-box',
                    fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
                    fontSize: '15pt',
                    lineHeight: 1.35,
                    color: '#000000',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <WeeklyReportPage2Content
                    selectedWeek={selectedWeek}
                    startDayNum={startDayNum}
                    endDayNum={endDayNum}
                    monthFull={monthFull}
                    weekPhotos={currentWeekPhotos}
                    isInteractive={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating bottom quick bar for fast actions */}
          <div className="flex-none p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              สัดส่วนมาตรฐาน A4 (210 × 297 มม.) • สัปดาห์ที่ {selectedWeek} • ครบทั้ง 2 หน้า (หน้า 1/2 และ หน้า 2/2)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNativePrintWeeklyFull}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์เอกสาร (ทั้ง 2 หน้า)</span>
              </button>
              <button
                onClick={handlePrintWeeklyReportPDF}
                disabled={isGeneratingReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด PDF (ทั้ง 2 หน้า)</span>
              </button>
              <button
                onClick={() => setIsWeeklyFullPreviewOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHOTO LIBRARY & PICKER MODAL (สัปดาห์ที่ {selectedWeek})      */}
      {/* ------------------------------------------------------------- */}
      {isPhotoPickerModalOpen && activePhotoSlotModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto print:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <span>คลังรูปภาพสำหรับภาพที่ {activePhotoSlotModal + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 font-normal">
                      สัปดาห์ที่ {selectedWeek}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    ดึงรูปภาพจากการนิเทศและบันทึกฝึกงานอัตโนมัติ หรือเลือกภาพมาตรฐานวิชาชีพ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoPickerModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Slot Switcher Bar */}
            <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-500 font-semibold mr-1 shrink-0">กำลังเปลี่ยนช่อง:</span>
              {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                const isActive = activePhotoSlotModal === slotIdx;
                const slotPhoto = currentWeekPhotos[slotIdx];
                return (
                  <button
                    key={slotIdx}
                    type="button"
                    onClick={() => setActivePhotoSlotModal(slotIdx)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>ช่อง {slotIdx + 1}</span>
                    {slotPhoto?.url ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Source Category Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-2 pt-2 text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setPhotoPickerTab('submissions')}
                className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  photoPickerTab === 'submissions'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>บันทึกฝึกงานสัปดาห์ที่ {selectedWeek} ({availableStudentWeekPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoPickerTab('supervision')}
                className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  photoPickerTab === 'supervision'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>บันทึกการนิเทศ ({availableSupervisionPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoPickerTab('standards')}
                className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  photoPickerTab === 'standards'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>มาตรฐานวิชาชีพช่างไฟฟ้า ({CURATED_VOCATIONAL_PHOTOS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoPickerTab('upload')}
                className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  photoPickerTab === 'upload'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>อัปโหลด / ใส่ URL</span>
              </button>
            </div>

            {/* Modal Body / Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: Student submissions for this week */}
              {photoPickerTab === 'submissions' && (
                <div>
                  {availableStudentWeekPhotos.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700 text-sm">
                        ยังไม่มีรูปภาพจากบันทึกฝึกงานของนักศึกษาในสัปดาห์ที่ {selectedWeek}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        คุณสามารถเลือกรูปจากแท็บ &quot;บันทึกการนิเทศ&quot; หรือ &quot;มาตรฐานวิชาชีพช่างไฟฟ้า&quot; ด้านบนได้
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {availableStudentWeekPhotos.map((photo, idx) => (
                        <div 
                          key={photo.id || idx}
                          className="border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col bg-white group"
                        >
                          <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
                            <img 
                              src={photo.url} 
                              alt={photo.caption} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                              crossOrigin="anonymous" 
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono backdrop-blur-xs">
                              {photo.studentName}
                            </span>
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                                {photo.companyName}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                                {photo.caption}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdatePhoto(activePhotoSlotModal, {
                                  id: photo.id,
                                  url: photo.url,
                                  caption: `ภาพที่ ${activePhotoSlotModal + 1}: ${photo.caption.replace(/^ภาพที่\s*\d+\s*[:.]\s*/, '')}`,
                                  sourceType: 'submission',
                                  sourceTitle: photo.sourceTitle,
                                  studentName: photo.studentName,
                                  companyName: photo.companyName
                                });
                                setIsPhotoPickerModalOpen(false);
                              }}
                              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>เลือกรูปนี้ใส่ช่อง {activePhotoSlotModal + 1}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Form 3 supervision visit photos */}
              {photoPickerTab === 'supervision' && (
                <div>
                  {availableSupervisionPhotos.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700 text-sm">
                        ยังไม่มีรูปภาพจากการนิเทศของครูนิเทศก์ในระบบ
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        สามารถเลือกจากแท็บมาตรฐานวิชาชีพ หรืออัปโหลดรูปภาพใหม่ได้
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {availableSupervisionPhotos.map((photo, idx) => (
                        <div 
                          key={photo.id || idx}
                          className="border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col bg-white group"
                        >
                          <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
                            <img 
                              src={photo.url} 
                              alt={photo.caption} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                              crossOrigin="anonymous" 
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-900/80 text-indigo-100 text-[10px] font-semibold backdrop-blur-xs">
                              {photo.companyName}
                            </span>
                            {photo.date && (
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] backdrop-blur-xs">
                                {photo.date}
                              </span>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                                {photo.sourceTitle}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                                {photo.caption}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdatePhoto(activePhotoSlotModal, {
                                  id: photo.id,
                                  url: photo.url,
                                  caption: `ภาพที่ ${activePhotoSlotModal + 1}: ${photo.caption.replace(/^ภาพที่\s*\d+\s*[:.]\s*/, '')}`,
                                  sourceType: 'supervision',
                                  sourceTitle: photo.sourceTitle,
                                  companyName: photo.companyName,
                                  date: photo.date
                                });
                                setIsPhotoPickerModalOpen(false);
                              }}
                              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>เลือกรูปนี้ใส่ช่อง {activePhotoSlotModal + 1}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Curated vocational photos */}
              {photoPickerTab === 'standards' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-600 bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>
                      คลังภาพมาตรฐานวิชาชีพช่างไฟฟ้ากำลังและความปลอดภัยในสถานประกอบการ คัดสรรให้สอดคล้องกับมาตรฐาน วสท. และสมรรถนะรายวิชา
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {CURATED_VOCATIONAL_PHOTOS.map((photo, idx) => (
                      <div 
                        key={photo.id || idx}
                        className="border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col bg-white group"
                      >
                        <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
                          <img 
                            src={photo.url} 
                            alt={photo.caption} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            crossOrigin="anonymous" 
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold backdrop-blur-xs">
                            {photo.sourceTitle}
                          </span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                            {photo.caption}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdatePhoto(activePhotoSlotModal, {
                                id: photo.id,
                                url: photo.url,
                                caption: `ภาพที่ ${activePhotoSlotModal + 1}: ${photo.caption.replace(/^ภาพที่\s*\d+\s*[:.]\s*/, '')}`,
                                sourceType: 'standard',
                                sourceTitle: photo.sourceTitle
                              });
                              setIsPhotoPickerModalOpen(false);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>เลือกรูปนี้ใส่ช่อง {activePhotoSlotModal + 1}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Upload / Custom URL */}
              {photoPickerTab === 'upload' && (
                <div className="space-y-4 max-w-xl mx-auto py-2">
                  {/* File Upload Dropzone */}
                  <label className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-2xl p-6 bg-indigo-50/40 hover:bg-indigo-50/70 transition flex flex-col items-center justify-center cursor-pointer text-center group">
                    <Upload className="w-10 h-10 text-indigo-500 group-hover:scale-110 transition duration-200 mb-2" />
                    <span className="font-bold text-sm text-slate-800">
                      คลิกเพื่ออัปโหลดไฟล์รูปภาพจากอุปกรณ์
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      รองรับไฟล์ JPG, PNG, WEBP จากเครื่องคอมพิวเตอร์หรือโทรศัพท์มือถือ
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadPhoto(activePhotoSlotModal, file);
                          setIsPhotoPickerModalOpen(false);
                        }
                      }}
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-xs text-slate-400 font-semibold">หรือใส่ลิงก์รูปภาพ (Image URL)</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">
                      URL ของรูปภาพ:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={customPhotoUrlInput}
                        onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={!customPhotoUrlInput.trim()}
                        onClick={() => {
                          if (customPhotoUrlInput.trim()) {
                            handleUpdatePhoto(activePhotoSlotModal, {
                              id: `custom-url-${Date.now()}`,
                              url: customPhotoUrlInput.trim(),
                              sourceType: 'custom',
                              caption: `ภาพที่ ${activePhotoSlotModal + 1}: การจัดการเรียนการสอนบูรณาการในสถานประกอบการ`
                            });
                            setCustomPhotoUrlInput('');
                            setIsPhotoPickerModalOpen(false);
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        นำไปใช้
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>สามารถคลิกเปลี่ยนรูปภาพหรือลบรูปภาพได้ทุกเมื่อ</span>
              <button
                type="button"
                onClick={() => setIsPhotoPickerModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CAPTION EDIT MODAL WITH OCCUPATIONAL STANDARDS CHIPS           */}
      {/* ------------------------------------------------------------- */}
      {isCaptionModalOpen && activeCaptionSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto print:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-200" />
                <div>
                  <h3 className="font-bold text-base text-white">
                    แก้ไขคำอธิบายใต้ภาพที่ {activeCaptionSlotIndex + 1}
                  </h3>
                  <p className="text-xs text-amber-100">
                    พิมพ์แก้ไขได้อิสระ หรือคลิกเลือกข้อความสมรรถนะวิชาชีพแนะนำด้านล่าง
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCaptionModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ข้อความคำอธิบายใต้ภาพ (แสดงในเอกสารทางการ):
                </label>
                <textarea
                  rows={3}
                  value={editCaptionText}
                  onChange={(e) => setEditCaptionText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder={`ภาพที่ ${activeCaptionSlotIndex + 1}: ...`}
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>คลิกเพื่อใช้ข้อความมาตรฐานวิชาชีพแนะนำ (วสท. & สอศ.):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {VOCATIONAL_STANDARD_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEditCaptionText(`ภาพที่ ${activeCaptionSlotIndex + 1}: ${chip.text}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium transition cursor-pointer text-left"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const defaultPhoto = defaultWeekPhotos[activeCaptionSlotIndex];
                  if (defaultPhoto) {
                    setEditCaptionText(defaultPhoto.caption);
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                คืนค่าคำอธิบายเริ่มต้น
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCaptionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCaptionChange(activeCaptionSlotIndex, editCaptionText.trim());
                    setIsCaptionModalOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  บันทึกคำอธิบาย
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
