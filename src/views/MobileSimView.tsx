import React, { useState, useMemo, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  ArrowRight, 
  Printer, 
  FileText, 
  Upload, 
  Camera, 
  Calendar, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Eye, 
  Smartphone, 
  HelpCircle, 
  Image as ImageIcon,
  Award,
  Bell,
  User,
  Navigation,
  Search,
  BarChart3,
  Home,
  GraduationCap,
  Send,
  History,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Star,
  Check,
  X,
  Users,
  Building2,
  BookOpen
} from 'lucide-react';
import { Student, Company, WeeklySubmission, Form3SupervisionRecord, Form3Photo } from '../types';
import { StudentAvatar } from '../components/StudentAvatar';
import { StudentWeeklyReportModal } from '../components/Modals/StudentWeeklyReportModal';
import { generateAll18WeeklySubmissions } from '../data/weeksData';
import { subscribeForm3Supervisions } from '../services/firestoreService';

interface MobileSimViewProps {
  currentRole: 'student' | 'teacher';
  onChangeRole: (role: 'student' | 'teacher') => void;
  student: Student;
  students?: Student[];
  companies: Company[];
  submissions: Record<string, WeeklySubmission[]>;
  onOpenForm1: () => void;
  onOpenForm2: () => void;
  onOpenForm3: (studentId?: string) => void;
  onNavigateA4: (studentId?: string) => void;
  onOpenSheetsModal: () => void;
  onOpenLookerModal: () => void;
  onOpenStudentManual?: () => void;
}

// Helper to resolve real-world coordinates and zones for companies in Khon Kaen
function getCompanyCoordinates(name: string, index: number): { lat: number; lng: number; zone: string; distanceKm: number } {
  const lower = (name || '').toLowerCase();
  if (lower.includes('เชียงยืน')) return { lat: 16.4021, lng: 103.1022, zone: 'อ.เชียงยืน', distanceKm: 28.5 };
  if (lower.includes('บ้านฝาง')) return { lat: 16.4522, lng: 102.6321, zone: 'อ.บ้านฝาง', distanceKm: 22.0 };
  if (lower.includes('ท่าคันโท')) return { lat: 16.9211, lng: 103.2422, zone: 'อ.ท่าคันโท', distanceKm: 78.0 };
  if (lower.includes('น้ำหนาว')) return { lat: 16.7821, lng: 101.7222, zone: 'อ.น้ำหนาว', distanceKm: 142.0 };
  if (lower.includes('บ้านไผ่')) return { lat: 16.0592, lng: 102.7301, zone: 'อ.บ้านไผ่', distanceKm: 44.0 };
  if (lower.includes('ภูเขียว')) return { lat: 16.3721, lng: 102.1322, zone: 'อ.ภูเขียว', distanceKm: 85.0 };
  if (lower.includes('หนองเรือ')) return { lat: 16.4921, lng: 102.4822, zone: 'อ.หนองเรือ', distanceKm: 48.0 };
  if (lower.includes('น้ำพอง') || lower.includes('มิตรผล')) return { lat: 16.7112, lng: 102.8711, zone: 'อ.น้ำพอง', distanceKm: 34.0 };
  if (lower.includes('ชุมแพ')) return { lat: 16.5411, lng: 102.1011, zone: 'อ.ชุมแพ', distanceKm: 82.0 };
  if (lower.includes('ท่าพระ') || lower.includes('230kv') || lower.includes('กฟผ.')) return { lat: 16.3211, lng: 102.8011, zone: 'ต.ท่าพระ', distanceKm: 14.5 };
  if (lower.includes('ศิลา') || lower.includes('โซล่าร์') || lower.includes('kkp')) return { lat: 16.4821, lng: 102.8422, zone: 'ต.ศิลา', distanceKm: 8.5 };
  if (lower.includes('มิตซูบิชิ') || lower.includes('แอร์') || lower.includes('consumer')) return { lat: 16.4111, lng: 102.8922, zone: 'นิคมอุตสาหกรรม', distanceKm: 12.0 };
  if (lower.includes('การไฟฟ้า') || lower.includes('pea')) return { lat: 16.4367, lng: 102.8415, zone: 'อ.เมืองขอนแก่น', distanceKm: 4.2 };

  const angle = (index * 47) % 360;
  const rad = (angle * Math.PI) / 180;
  const dist = 3 + ((index * 7) % 15);
  const lat = 16.4322 + (Math.sin(rad) * dist * 0.005);
  const lng = 102.8236 + (Math.cos(rad) * dist * 0.005);
  return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)), zone: 'อ.เมืองขอนแก่น', distanceKm: Number((dist * 1.2).toFixed(1)) };
}

export const MobileSimView: React.FC<MobileSimViewProps> = ({
  currentRole,
  onChangeRole,
  student,
  students = [],
  companies,
  submissions,
  onOpenForm1,
  onOpenForm2,
  onOpenForm3,
  onNavigateA4,
  onOpenSheetsModal,
  onOpenLookerModal,
  onOpenStudentManual,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'student' | 'form' | 'history' | 'help'>('home');
  const [activeTeacherFilter, setActiveTeacherFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'graded' | 'pending'>('all');
  const [selectedReportSub, setSelectedReportSub] = useState<WeeklySubmission | null>(null);
  const [selectedReportWeek, setSelectedReportWeek] = useState<number>(student.currentWeek || 8);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<Form3Photo | null>(null);
  const [isSupervisionDetailExpanded, setIsSupervisionDetailExpanded] = useState<boolean>(true);

  // Teacher mobile states
  const [selectedCompanyIdForTeacher, setSelectedCompanyIdForTeacher] = useState<string>('');
  const [teacherSearchTerm, setTeacherSearchTerm] = useState<string>('');
  const [teacherCompanyFilter, setTeacherCompanyFilter] = useState<'all' | 'supervised' | 'pending'>('all');
  const [expandedCompanyMobileId, setExpandedCompanyMobileId] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(true);

  // Real-time supervision records from Firestore
  const [liveSupervisions, setLiveSupervisions] = useState<Form3SupervisionRecord[]>([]);

  useEffect(() => {
    const unsub = subscribeForm3Supervisions((records) => {
      setLiveSupervisions(records);
    });
    return () => unsub();
  }, []);

  // Find supervision record specifically matching this student
  const studentSupervision = useMemo<Form3SupervisionRecord | null>(() => {
    if (!student) return null;
    const match = liveSupervisions.find(r => 
      r.studentId === student.id || 
      r.studentCode === student.studentCode || 
      r.studentName === student.name ||
      (r.companyName && student.companyName && r.companyName.trim().toLowerCase() === student.companyName.trim().toLowerCase())
    );
    return match || null;
  }, [liveSupervisions, student]);

  // Default fallback supervision record if no custom visit recorded in Firestore yet
  const effectiveSupervision = useMemo<Form3SupervisionRecord>(() => {
    if (studentSupervision) return studentSupervision;

    return {
      id: `f3-sample-${student.id}`,
      timestamp: '21/10/2569 13:30:00',
      visitDate: '21 ต.ค. 2569 (13:30 น.)',
      studentId: student.id,
      studentCode: student.studentCode,
      studentName: student.name,
      studentRoom: student.room,
      levelDepartment: `${student.level} • ${student.department}`,
      companyName: student.companyName || 'การไฟฟ้าส่วนภูมิภาค สาขาขอนแก่น (PEA Khon Kaen)',
      companyDepartment: student.companyRegistration?.department || 'แผนกปฏิบัติการระบบจำหน่ายไฟฟ้าและสถานีไฟฟ้าย่อย',
      teacherName: student.supervisorTeacher || 'นายทักษิณ โสภาปิยะ',
      mentorName: student.companyRegistration?.mentorName || 'นายชาญชัย มงคลศรี',
      mentorFeedback: 'นักศึกษามีความรับผิดชอบ ขยัน ตรงต่อเวลา เรียนรู้งานได้เร็วมาก และปฏิบัติตามคำสั่งของหัวหน้างานอย่างเคร่งครัด',
      safetyPassed: true,
      score: 19.5,
      grade: 'A',
      teacherComment: 'นักศึกษาปฏิบัติงานได้ตามมาตรฐานช่างไฟฟ้า การ wiring ตู้ควบคุมเรียบร้อย สวมใส่อุปกรณ์ความปลอดภัย PPE ครบถ้วน ปฏิบัติตามกฎโรงงานดีมาก',
      status: 'ตรวจแล้ว',
      photos: [
        {
          id: 'p-sup-1',
          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
          title: 'ภาพขณะครูนิเทศก์ตรวจเช็กการ Wiring ตู้ควบคุม',
          caption: 'อ.ทักษิณ และพี่เลี้ยง ตรวจสอบความถูกต้องและปลอดภัยของการเดินสายวงจร',
          uploadedAt: '21 ต.ค. 2569'
        },
        {
          id: 'p-sup-2',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
          title: 'ภาพตรวจอุปกรณ์คุ้มครองความปลอดภัยส่วนบุคคล PPE',
          caption: 'ตรวจสอบหมวกนิรภัย แว่นตา และถุงมือป้องกันไฟฟ้าตามมาตรฐาน สอศ.',
          uploadedAt: '21 ต.ค. 2569'
        },
        {
          id: 'p-sup-3',
          url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
          title: 'ภาพบันทึกร่วมกับครูพี่เลี้ยงและครูนิเทศก์หน้างาน',
          caption: 'หารือประเมินสมรรถนะวิชาชีพร่วมกับพี่เลี้ยงสถานประกอบการ',
          uploadedAt: '21 ต.ค. 2569'
        }
      ]
    };
  }, [studentSupervision, student]);

  // Full 18 weeks list with existing submissions overlaid
  const fullSubmissionsList = useMemo(() => {
    const generated = generateAll18WeeklySubmissions(student.id, student.name, student.companyName);
    const map = new Map<number, WeeklySubmission>();
    generated.forEach(g => map.set(g.weekNumber, g));
    const passedSubs = submissions[student.id] || [];
    passedSubs.forEach(s => map.set(s.weekNumber, s));
    return Array.from(map.values()).sort((a, b) => a.weekNumber - b.weekNumber);
  }, [submissions, student]);

  // Filtered submissions for mobile view
  const filteredSubmissions = useMemo(() => {
    if (historyFilter === 'graded') return fullSubmissionsList.filter(s => s.status === 'graded');
    if (historyFilter === 'pending') return fullSubmissionsList.filter(s => s.status === 'pending');
    return fullSubmissionsList;
  }, [fullSubmissionsList, historyFilter]);

  const handleOpenWeeklyReport = (sub: WeeklySubmission) => {
    setSelectedReportSub(sub);
    setSelectedReportWeek(sub.weekNumber);
    setIsReportModalOpen(true);
  };

  // Aggregated companies with students and supervision records for mobile view
  const teacherCompanies = useMemo(() => {
    return companies.map((c, idx) => {
      const geo = getCompanyCoordinates(c.name, idx);
      const lat = c.lat || geo.lat;
      const lng = c.lng || geo.lng;
      const zone = c.zone && c.zone !== '-' ? c.zone : geo.zone;
      const distanceKm = c.distanceKm || geo.distanceKm;

      // Find matching students
      const matchedStudents = (students || []).filter(s => 
        (s.companyName && c.name && s.companyName.trim().toLowerCase() === c.name.trim().toLowerCase()) ||
        (s.companyId && c.id && s.companyId === c.id)
      );

      // Find supervision records from Firestore
      const f3List = liveSupervisions.filter(r => 
        (r.companyName && c.name && r.companyName.trim().toLowerCase() === c.name.trim().toLowerCase()) ||
        (r.companyId && c.id && r.companyId === c.id) ||
        matchedStudents.some(s => s.id === r.studentId || s.studentCode === r.studentCode)
      );

      const isSupervised = f3List.length > 0 || c.status === 'completed';
      const latestSupervision = f3List[0] || null;

      const mentorName = latestSupervision?.mentorName || 
        matchedStudents[0]?.companyRegistration?.mentorName || 
        c.contactPerson || 
        'นายชาญชัย มงคลศรี';
      const mentorPhone = matchedStudents[0]?.companyRegistration?.mentorPhone || c.phone || '081-987-6543';

      return {
        id: c.id || `comp-${idx}`,
        name: c.name,
        shortName: c.shortName || c.name.slice(0, 24),
        address: c.address || 'จ.ขอนแก่น',
        zone,
        lat,
        lng,
        distanceKm,
        studentsCount: matchedStudents.length || c.studentsCount || 1,
        students: matchedStudents,
        isSupervised,
        form3Records: f3List,
        latestSupervision,
        mentorName,
        mentorPhone,
        department: matchedStudents[0]?.companyRegistration?.department || c.jobScope || 'แผนกไฟฟ้ากำลัง'
      };
    });
  }, [companies, students, liveSupervisions]);

  // Active company for map & visit card
  const activeCompanyForTeacher = useMemo(() => {
    if (!teacherCompanies || teacherCompanies.length === 0) return null;
    if (selectedCompanyIdForTeacher) {
      const found = teacherCompanies.find(c => c.id === selectedCompanyIdForTeacher);
      if (found) return found;
    }
    return teacherCompanies[0];
  }, [teacherCompanies, selectedCompanyIdForTeacher]);

  // Filtered companies for teacher table
  const filteredTeacherCompanies = useMemo(() => {
    return teacherCompanies.filter(c => {
      if (teacherSearchTerm.trim()) {
        const q = teacherSearchTerm.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchZone = c.zone.toLowerCase().includes(q);
        const matchStudent = c.students.some(s => s.name.toLowerCase().includes(q) || s.studentCode.includes(q));
        if (!matchName && !matchZone && !matchStudent) return false;
      }
      if (teacherCompanyFilter === 'supervised' && !c.isSupervised) return false;
      if (teacherCompanyFilter === 'pending' && c.isSupervised) return false;
      return true;
    });
  }, [teacherCompanies, teacherSearchTerm, teacherCompanyFilter]);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6 print:hidden">
      {/* Role switch pill for mobile view */}
      <div className="mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs">
        <span className="text-slate-500 font-medium">สลับมุมมองหน้าจอมือถือ:</span>
        <button
          onClick={() => onChangeRole('student')}
          className={`px-3 py-1 rounded-full font-bold transition ${
            currentRole === 'student' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          นักศึกษา (Screenshot 5)
        </button>
        <button
          onClick={() => onChangeRole('teacher')}
          className={`px-3 py-1 rounded-full font-bold transition ${
            currentRole === 'teacher' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ครูนิเทศก์ (Screenshot 6)
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="w-full max-w-[430px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 mr-3"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full bg-slate-50 rounded-[36px] overflow-hidden min-h-[820px] flex flex-col justify-between pt-7 relative border border-slate-200 text-slate-800">
          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-xs">
            {currentRole === 'student' ? (
              /* SCREENSHOT 5: STUDENT MOBILE VIEW */
              <>
                {/* Mobile Top Header */}
                <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src="./assets/aistudio/unnamed_54baf6fc.jpg"
                        alt="KKTECH Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-none text-slate-900">KKTECH ช่างไฟฟ้า</div>
                      <div className="text-[10px] text-slate-500">@kktech.ac.th</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Bell className="w-4 h-4 text-slate-500" />
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                      ธส
                    </div>
                  </div>
                </div>

                {/* Student Profile Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-3">
                    <StudentAvatar
                      student={student}
                      size="md"
                      showUploadButton={false}
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{student.name}</h3>
                      <div className="text-[10px] text-slate-500">
                        {student.level} • รหัสนักศึกษา: {student.studentCode} • ห้อง {student.room}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      <span>{student.companyName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>ครูนิเทศก์: {student.supervisorTeacher}</span>
                      <span className="text-emerald-700 font-semibold">• พิกัด GPS ตรวจยืนยันแล้ว</span>
                    </div>
                  </div>

                  {/* Hours Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" /> สะสมชั่วโมงฝึกงานวิชาชีพ
                      </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {student.accumulatedHours} / {student.requiredHours} ชม.
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(student.accumulatedHours / student.requiredHours) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>ผ่านไปแล้ว 8 จาก 18 สัปดาห์</span>
                      <span className="text-emerald-700 font-semibold">สำเร็จ 80% (ตามเกณฑ์)</span>
                    </div>
                  </div>
                </div>

                {/* Current Urgent Task Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                      ภารกิจปัจจุบัน • กำหนดส่ง 17:00 น. วันนี้
                    </span>
                    <span className="text-sky-300 font-mono">สัปดาห์ที่ {student.currentWeek}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">
                      ส่งบันทึกประจำสัปดาห์ & รูปถ่ายปฏิบัติงาน
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      งานติดตั้งตู้ Distribution Board (MDB) & Wiring Control สายวงจรไฟฟ้าโรงงาน
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200">
                      📷 ภาพถ่ายหน้างาน (3 ภาพ)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200">
                      🛡️ เครื่องมือ & อุปกรณ์ PPE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200">
                      ⏱️ ครบยอด 40 ชม./สัปดาห์
                    </span>
                  </div>

                  <button
                    onClick={onOpenForm2}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>เปิด Google Form #2 เพื่อส่งงาน</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-[10px] text-slate-400 text-center">
                    ระบบจำกัดสิทธิ์เฉพาะบัญชี @kktech.ac.th ข้อมูลลง Google Sheets วิทยาลัยอัตโนมัติ
                  </div>
                </div>

                {/* Company Info Card (Form #1) */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">ข้อมูลสถานประกอบการ</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ส่งแล้ว
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">สัญญาการฝึกงานและข้อมูลครูพี่เลี้ยงภาคสนาม</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                    <div>
                      <div className="text-slate-500 text-[10px]">อัปเดตล่าสุด: 15 พ.ค. 2567</div>
                      <div className="font-semibold text-slate-800">พี่เลี้ยง: ช่างเอกชัย พลอยงาม</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={onOpenForm1}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-[10px] transition cursor-pointer"
                      >
                        ดูข้อมูล / แก้ไข
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo Guidelines Preview Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-sky-600" />
                      <span>ตัวอย่างภาพถ่ายหน้างานที่ถูกต้อง</span>
                    </span>
                    <span className="text-[10px] text-slate-400">เกณฑ์เทคนิคขอนแก่น</span>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-[10px] text-amber-900">
                    💡 <strong>คำแนะนำ:</strong> ภาพถ่ายต้องเห็นใบหน้าชัดเจนขณะสวมหมวกนิรภัย (Safety Helmet) และแว่นตานิรภัย มองเห็นป้ายชื่อตู้ควบคุมหรือหม้อแปลงชัดเจน และหลีกเลี่ยงมุมถ่ายย้อนแสง
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80"
                        alt="ตัวอย่างภาพ"
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-1 text-[9px] text-slate-700 font-medium">ตัวอย่าง: ตรวจสอบสาย (สวม PPE ครบถ้วน)</div>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
                        alt="ตัวอย่างภาพ"
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-1 text-[9px] text-slate-700 font-medium">ตัวอย่าง: รายละเอียดงาน (เห็นมิเตอร์และฉลาก)</div>
                    </div>
                  </div>
                </div>

                {/* Student User Manual Button */}
                {onOpenStudentManual && (
                  <button
                    type="button"
                    onClick={onOpenStudentManual}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border border-sky-200 shadow-2xs hover:bg-sky-100 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">คู่มือการใช้งานสำหรับนักศึกษา</div>
                        <div className="text-[10px] text-sky-700">ภาพประกอบขั้นตอน & ดาวน์โหลดไฟล์ PDF</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-sky-600 shrink-0" />
                  </button>
                )}

                {/* Quick Action Buttons (2 items) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigateA4()}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-left transition"
                  >
                    <FileText className="w-4 h-4 text-sky-600 mb-1" />
                    <div className="font-bold text-slate-900 text-xs">พรีวิวเล่มรายงาน</div>
                    <div className="text-[10px] text-slate-500">แบบฟอร์ม สอศ. ฉบับย่อ</div>
                  </button>

                  <a
                    href="tel:0891234567"
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-left transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-bold text-slate-900 text-xs">โทรหาครูนิเทศก์</div>
                    <div className="text-[10px] text-slate-500">อ.ทักษิณ (081-987-xxxx)</div>
                  </a>
                </div>

                {/* PEA Hotline Banner */}
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-900">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-rose-200 text-rose-700">
                      <Zap className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-bold text-[11px]">สายด่วนเหตุด่วนไฟฟ้า PEA</div>
                      <div className="text-[9px] text-rose-700">ศูนย์บริการ 24 ชม. กรณีเกิดอุบัติเหตุ</div>
                    </div>
                  </div>
                  <a
                    href="tel:1129"
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                  >
                    โทร 1129
                  </a>
                </div>

                {/* =========================================================================
                    1. บล็อกผลการตรวจนิเทศก์ (Supervision Inspection Result)
                    ========================================================================= */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">ผลการตรวจนิเทศก์ภาคสนาม</h4>
                        <div className="text-[10px] text-slate-500">มาตรฐานงานนิเทศก์ วท.ขอนแก่น</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>นิเทศแล้ว (ผ่านเกณฑ์)</span>
                    </span>
                  </div>

                  {/* Score & Teacher Visit Summary Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-900 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-700" />
                        <span>วันที่เข้านิเทศ: {effectiveSupervision.visitDate}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-900 mt-0.5">
                        ครูนิเทศก์: {effectiveSupervision.teacherName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        พี่เลี้ยง: {effectiveSupervision.mentorName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">คะแนนประเมิน</div>
                      <div className="text-lg font-black text-emerald-700 font-mono leading-none mt-0.5">
                        {effectiveSupervision.score} <span className="text-[10px] text-slate-500 font-normal">/20</span>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-black bg-emerald-600 text-white">
                        เกรด {effectiveSupervision.grade}
                      </span>
                    </div>
                  </div>

                  {/* Safety PPE Checklist & GPS Verification */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>การประเมินความปลอดภัย PPE & หน้างาน:</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ผ่าน 100%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> หมวกนิรภัย (Hard Hat)
                      </span>
                      <span className="flex items-center gap-1 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ถุงมือฉนวนกันไฟฟ้า
                      </span>
                      <span className="flex items-center gap-1 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> รองเท้าเซฟตี้ ESD
                      </span>
                      <span className="flex items-center gap-1 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ขั้นตอน LOTO ถูกต้อง
                      </span>
                    </div>
                  </div>

                  {/* Comments from Teacher & Mentor */}
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1">
                      <div className="font-bold text-sky-950 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-sky-700" />
                        <span>ข้อเสนอแนะครูนิเทศก์:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[10px]">
                        "{effectiveSupervision.teacherComment}"
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                      <div className="font-bold text-amber-950 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-amber-700" />
                        <span>ความคิดเห็นพี่เลี้ยงสถานประกอบการ:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[10px]">
                        "{effectiveSupervision.mentorFeedback}"
                      </p>
                    </div>
                  </div>

                  {/* Supervision Photos */}
                  {effectiveSupervision.photos && effectiveSupervision.photos.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-sky-600" />
                          <span>ภาพถ่ายหลักฐานการนิเทศก์ ({effectiveSupervision.photos.length} รูป):</span>
                        </span>
                        <span className="text-[9px] text-slate-400">แตะเพื่อขยาย</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {effectiveSupervision.photos.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPreviewPhoto(p)}
                            className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 group focus:outline-hidden"
                          >
                            <img
                              src={p.url}
                              alt={p.title || 'รูปนิเทศก์'}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* =========================================================================
                    2. บล็อกประวัติการส่งรายงานปฏิบัติงาน (Weekly Submission History - ครบ 18 สัปดาห์)
                    ========================================================================= */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-sky-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">ประวัติการส่งรายงานปฏิบัติงาน</h4>
                        <div className="text-[10px] text-slate-500">ภาคเรียนที่ 2/2569 (18 สัปดาห์)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      ตรวจแล้ว {fullSubmissionsList.filter(s => s.status === 'graded').length}/18
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('all')}
                      className={`px-2.5 py-1 rounded-full font-bold transition ${
                        historyFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      ทั้งหมด ({fullSubmissionsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('graded')}
                      className={`px-2.5 py-1 rounded-full font-bold transition ${
                        historyFilter === 'graded' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      ตรวจผ่านแล้ว ({fullSubmissionsList.filter(s => s.status === 'graded').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter('pending')}
                      className={`px-2.5 py-1 rounded-full font-bold transition ${
                        historyFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      รอตรวจ ({fullSubmissionsList.filter(s => s.status === 'pending').length})
                    </button>
                  </div>

                  {/* Weekly Cards List */}
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
                    {filteredSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 font-mono">
                              สัปดาห์ที่ {sub.weekNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">({sub.dateRange})</span>
                          </div>
                          {sub.status === 'graded' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{sub.teacherGrade}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>รอตรวจประเมิน</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] font-medium text-slate-800 line-clamp-2">
                          {sub.taskTitle}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-slate-700">{sub.totalHours} ชม.</span>
                            <span>•</span>
                            <span>📷 {sub.photos?.length || 3} รูป</span>
                            <span>•</span>
                            <span className="italic">อ.{sub.teacherSignature || 'ทักษิณ'}</span>
                          </div>
                        </div>

                        {/* Action buttons on mobile: View Report & Print PDF */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleOpenWeeklyReport(sub)}
                            className="py-1.5 px-2 rounded-lg bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                            title="เปิดดูรายงานบันทึกประจำสัปดาห์นี้"
                          >
                            <Eye className="w-3 h-3 text-sky-600" />
                            <span>เรียกดูรายงาน</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenWeeklyReport(sub)}
                            className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                            title="สั่งพิมพ์หรือดาวน์โหลด PDF รายงานหน้านี้"
                          >
                            <Printer className="w-3 h-3" />
                            <span>พิมพ์ PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Link to Full A4 Report */}
                  <button
                    type="button"
                    onClick={() => onNavigateA4()}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>เปิดแบบบันทึกประเมินผล A4 ฉบับทางการ →</span>
                  </button>
                </div>
              </>
            ) : (
              /* SCREENSHOT 6: TEACHER MOBILE VIEW */
              <>
                {/* Header */}
                <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src="./assets/aistudio/unnamed_54baf6fc.jpg"
                        alt="KKTECH Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-none text-slate-900">KKTECH • ไฟฟ้ากำลัง</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Sheets ซิงค์แล้ว</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <User className="w-4 h-4 text-slate-700" />
                  </div>
                </div>

                {/* Supervisor Badge */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">นายทักษิณ โสภาปิยะ</h3>
                      <span className="text-[10px] text-sky-700 font-medium">
                        ครูนิเทศก์ กลุ่ม ปวส.2 ช่างไฟฟ้ากำลัง (ทวิภาคี)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                      Auto-Sync 2.5 นาที
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 pt-1 text-center border-t border-slate-100">
                    <div className="p-1 rounded bg-slate-50">
                      <div className="font-bold text-slate-900 text-xs">42</div>
                      <div className="text-[9px] text-slate-400">นักศึกษา</div>
                    </div>
                    <div className="p-1 rounded bg-slate-50">
                      <div className="font-bold text-slate-900 text-xs">24</div>
                      <div className="text-[9px] text-slate-400">สถานที่</div>
                    </div>
                    <div className="p-1 rounded bg-slate-50">
                      <div className="font-bold text-emerald-600 text-xs">18</div>
                      <div className="text-[9px] text-emerald-600">เสร็จ (75%)</div>
                    </div>
                    <div className="p-1 rounded bg-slate-50">
                      <div className="font-bold text-amber-600 text-xs">6</div>
                      <div className="text-[9px] text-amber-600">รอสัปดาห์นี้</div>
                    </div>
                  </div>
                </div>

                {/* Supervision Quick Action Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950 to-indigo-950 text-white shadow-md space-y-2.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-semibold uppercase tracking-wide">
                      แบบประเมินนิเทศงาน มาตรฐาน สอศ.
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">บันทึกผลการนิเทศหน้างาน & ประเมินสมรรถนะ</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      พิกัด GPS อัตโนมัติ • ภาพหน้างาน 3-5 ภาพ • ประเมิน PPE & LOTO
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenForm3()}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>เปิดแบบฟอร์มนิเทศฝึกงาน</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* =========================================================================
                    TEACHER SECTION 1: แผนที่พิกัดสถานประกอบการ (Company Map & GPS Navigation)
                    ========================================================================= */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-sky-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">แผนที่พิกัดสถานประกอบการ</h4>
                        <div className="text-[10px] text-slate-500">จุดลงพื้นที่ & พิกัด GPS ขอนแก่น</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {teacherCompanies.length} แห่งในระบบ
                    </span>
                  </div>

                  {/* Visual SVG Mini Map of Khon Kaen */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
                    {/* SVG Map Canvas */}
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                      {/* Grid / Roads background */}
                      <defs>
                        <pattern id="mobileMapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="400" height="240" fill="#0f172a" />
                      <rect width="400" height="240" fill="url(#mobileMapGrid)" />

                      {/* Major Highways */}
                      <path d="M 0 120 Q 200 110 400 130" stroke="#334155" strokeWidth="3" fill="none" />
                      <path d="M 200 0 Q 210 120 190 240" stroke="#334155" strokeWidth="3" fill="none" />
                      <path d="M 50 200 L 350 40" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" fill="none" />

                      {/* Origin: Khon Kaen Technical College (KKTECH) */}
                      <circle cx="200" cy="120" r="14" fill="#0284c7" fillOpacity="0.2" className="animate-ping" />
                      <circle cx="200" cy="120" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="200" y="105" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">
                        วท.ขอนแก่น (ศูนย์กลาง)
                      </text>

                      {/* Company Pins */}
                      {teacherCompanies.slice(0, 16).map((c, i) => {
                        // Project lat/lng around KKTECH (16.4322, 102.8236) into 400x240 box
                        const relX = 200 + (c.lng - 102.8236) * 480;
                        const relY = 120 - (c.lat - 16.4322) * 480;
                        const posX = Math.max(20, Math.min(380, relX));
                        const posY = Math.max(20, Math.min(220, relY));
                        const isSelected = activeCompanyForTeacher?.id === c.id;

                        return (
                          <g 
                            key={c.id} 
                            onClick={() => setSelectedCompanyIdForTeacher(c.id)}
                            className="cursor-pointer group"
                          >
                            {isSelected && (
                              <circle cx={posX} cy={posY} r="12" fill="#f43f5e" fillOpacity="0.3" className="animate-ping" />
                            )}
                            <circle
                              cx={posX}
                              cy={posY}
                              r={isSelected ? "7" : "5"}
                              fill={isSelected ? "#f43f5e" : c.isSupervised ? "#10b981" : "#f59e0b"}
                              stroke="#ffffff"
                              strokeWidth={isSelected ? "2.5" : "1.5"}
                            />
                            {isSelected && (
                              <text x={posX} y={posY - 10} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                                {c.name.slice(0, 12)}..
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Map Overlay Badge */}
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded-md text-[9px] text-white flex items-center gap-1.5 border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>นิเทศแล้ว ({teacherCompanies.filter(c => c.isSupervised).length})</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 ml-1"></span>
                      <span>รอนิเทศ ({teacherCompanies.filter(c => !c.isSupervised).length})</span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-sky-300 font-mono border border-slate-700">
                      พิกัด GPS อ้างอิง สอศ.
                    </div>
                  </div>

                  {/* Active Selected Company Navigation Card */}
                  {activeCompanyForTeacher && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50 to-slate-50 border border-sky-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 text-[10px] text-sky-800 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{activeCompanyForTeacher.zone}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-mono">ระยะทาง ~{activeCompanyForTeacher.distanceKm} กม.</span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 leading-tight mt-0.5">
                            {activeCompanyForTeacher.name}
                          </h5>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            พิกัด: {activeCompanyForTeacher.lat.toFixed(4)}, {activeCompanyForTeacher.lng.toFixed(4)}
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 border ${
                          activeCompanyForTeacher.isSupervised
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {activeCompanyForTeacher.isSupervised ? '✓ นิเทศแล้ว' : '⏱ รอนิเทศ'}
                        </span>
                      </div>

                      {/* Navigation and Actions */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-sky-100">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${activeCompanyForTeacher.lat},${activeCompanyForTeacher.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold text-center flex items-center justify-center gap-1 shadow-2xs transition"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>นำทาง GPS</span>
                        </a>
                        <a
                          href={`tel:${activeCompanyForTeacher.mentorPhone}`}
                          className="py-1.5 px-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-medium text-center flex items-center justify-center gap-1 shadow-2xs transition"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>โทรพี่เลี้ยง</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onOpenForm3(activeCompanyForTeacher.students[0]?.id || 'std-68301040105')}
                          className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold text-center flex items-center justify-center gap-1 shadow-2xs transition"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>ประเมินนิเทศ</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Horizontal Scroll Quick Company Selector */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-medium">แตะเพื่อเลือกสถานประกอบการบนแผนที่:</div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {teacherCompanies.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCompanyIdForTeacher(c.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] shrink-0 font-medium border transition flex items-center gap-1 ${
                            activeCompanyForTeacher?.id === c.id
                              ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${c.isSupervised ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span>{c.shortName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    TEACHER SECTION 2: ข้อมูลการเข้านิเทศ (Supervision Visit Details)
                    ========================================================================= */}
                {activeCompanyForTeacher && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">ข้อมูลการเข้านิเทศภาคสนาม</h4>
                          <div className="text-[10px] text-slate-500">{activeCompanyForTeacher.name}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        activeCompanyForTeacher.isSupervised
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {activeCompanyForTeacher.isSupervised ? 'นิเทศแล้ว (100% เกณฑ์)' : 'เตรียมเข้านิเทศ'}
                      </span>
                    </div>

                    {/* Visit Meta & Co-interns Banner */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          <span>กำหนดการ/วันที่นิเทศ:</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          {activeCompanyForTeacher.latestSupervision?.visitDate || 'สัปดาห์ที่ 8 • นัดหมาย 13:30 น.'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>นักศึกษาฝึกงาน ({activeCompanyForTeacher.studentsCount} คน):</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {activeCompanyForTeacher.students.length > 0 
                            ? activeCompanyForTeacher.students.map(s => s.name.split(' ')[0]).join(', ')
                            : 'นายธนากร, นายกิตติศักดิ์'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                        <span className="text-slate-500 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          <span>พี่เลี้ยงสถานประกอบการ:</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {activeCompanyForTeacher.mentorName} ({activeCompanyForTeacher.mentorPhone})
                        </span>
                      </div>
                    </div>

                    {/* Safety PPE Checklist Assessment */}
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[10px] text-emerald-950 space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                          <span>ผลการตรวจความปลอดภัย PPE ประจำสถานประกอบการ</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                          100% ผ่านเกณฑ์
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-emerald-900">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> หมวกนิรภัย (Hard Hat)
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ถุงมือฉนวนกันไฟฟ้า
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> รองเท้าเซฟตี้ ESD
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ขั้นตอน Lockout/Tagout
                        </span>
                      </div>
                    </div>

                    {/* Teacher & Mentor Comments */}
                    {activeCompanyForTeacher.latestSupervision ? (
                      <div className="space-y-1.5 text-[11px]">
                        <div className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-[10px] text-slate-700">
                          <strong>ข้อเสนอแนะครูนิเทศก์:</strong> {activeCompanyForTeacher.latestSupervision.teacherComment}
                        </div>
                        {activeCompanyForTeacher.latestSupervision.photos && activeCompanyForTeacher.latestSupervision.photos.length > 0 && (
                          <div className="pt-1">
                            <div className="text-[10px] text-slate-500 font-medium mb-1">ภาพถ่ายหลักฐานการนิเทศก์:</div>
                            <div className="grid grid-cols-3 gap-1">
                              {activeCompanyForTeacher.latestSupervision.photos.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setPreviewPhoto(p)}
                                  className="aspect-4/3 rounded-lg overflow-hidden border border-slate-200"
                                >
                                  <img src={p.url} alt="รูปนิเทศก์" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[10px] text-amber-900 flex items-center justify-between">
                        <span>สถานประกอบการนี้ยังไม่มีบันทึกการนิเทศในสัปดาห์นี้</span>
                        <button
                          type="button"
                          onClick={() => onOpenForm3(activeCompanyForTeacher.students[0]?.id)}
                          className="px-2 py-1 rounded bg-amber-600 text-white font-bold text-[9px]"
                        >
                          + บันทึกนิเทศเดี๋ยวนี้
                        </button>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onOpenForm3(activeCompanyForTeacher.students[0]?.id)}
                        className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>บันทึก/แก้ไขการนิเทศ (Form #3)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateA4(activeCompanyForTeacher.students[0]?.id)}
                        className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>ดูรายงาน A4</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    TEACHER SECTION 3: ตารางรายชื่อสถานประกอบการทั้งหมด & บันทึกการนิเทศ
                    ========================================================================= */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">ตารางรายชื่อสถานประกอบการ & ผลนิเทศ</h4>
                        <div className="text-[10px] text-slate-500">ทั้งหมด {teacherCompanies.length} แห่ง (อัปเดตแบบเรียลไทม์)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono">
                      {filteredTeacherCompanies.length} แห่ง
                    </span>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={teacherSearchTerm}
                        onChange={(e) => setTeacherSearchTerm(e.target.value)}
                        placeholder="ค้นหาชื่อสถานประกอบการ, โซน, หรือ นศ..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setTeacherCompanyFilter('all')}
                        className={`px-2.5 py-1 rounded-full font-bold transition ${
                          teacherCompanyFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        ทั้งหมด ({teacherCompanies.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeacherCompanyFilter('supervised')}
                        className={`px-2.5 py-1 rounded-full font-bold transition ${
                          teacherCompanyFilter === 'supervised' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        นิเทศแล้ว ({teacherCompanies.filter(c => c.isSupervised).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeacherCompanyFilter('pending')}
                        className={`px-2.5 py-1 rounded-full font-bold transition ${
                          teacherCompanyFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        รอนิเทศ ({teacherCompanies.filter(c => !c.isSupervised).length})
                      </button>
                    </div>
                  </div>

                  {/* Mobile Roster Cards List */}
                  <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-0.5">
                    {filteredTeacherCompanies.map((comp, idx) => {
                      const isExpanded = expandedCompanyMobileId === comp.id;

                      return (
                        <div
                          key={comp.id}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-slate-400 text-[10px] font-bold">#{idx + 1}</span>
                                <h5 className="font-bold text-xs text-slate-900">{comp.name}</h5>
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{comp.zone}</span>
                                <span>•</span>
                                <span className="text-sky-700 font-semibold">{comp.studentsCount} คน</span>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 border ${
                              comp.isSupervised 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}>
                              {comp.isSupervised ? '✓ นิเทศแล้ว' : '⏱ รอนิเทศ'}
                            </span>
                          </div>

                          {/* Quick Student Badges */}
                          {comp.students && comp.students.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {comp.students.map((s) => (
                                <span key={s.id} className="px-1.5 py-0.5 rounded text-[9px] bg-white border border-slate-200 text-slate-700">
                                  {s.name} ({s.room})
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons for this company */}
                          <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCompanyIdForTeacher(comp.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="py-1 px-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[9px] font-bold transition flex items-center justify-center gap-1"
                              title="ดูพิกัดบนแผนที่"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>พิกัด</span>
                            </button>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${comp.lat},${comp.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1 px-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[9px] font-bold transition flex items-center justify-center gap-1"
                              title="นำทางด้วย Google Maps"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>นำทาง</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => onOpenForm3(comp.students[0]?.id)}
                              className="py-1 px-1.5 rounded-lg bg-slate-900 text-white text-[9px] font-bold transition flex items-center justify-center gap-1"
                              title="บันทึกผลการนิเทศ (Form #3)"
                            >
                              <Camera className="w-3 h-3 text-emerald-400" />
                              <span>นิเทศ</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setExpandedCompanyMobileId(isExpanded ? null : comp.id)}
                              className="py-1 px-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[9px] font-medium transition flex items-center justify-center gap-1"
                            >
                              <span>{isExpanded ? 'ซ่อน' : 'รายละเอียด'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>

                          {/* Expanded Details Drawer */}
                          {isExpanded && (
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[10px] space-y-1.5 animate-in fade-in">
                              <div className="flex justify-between text-slate-600">
                                <span>พี่เลี้ยงสถานประกอบการ:</span>
                                <span className="font-semibold text-slate-900">{comp.mentorName} ({comp.mentorPhone})</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>แผนกงาน:</span>
                                <span className="font-semibold text-slate-900">{comp.department}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>พิกัดละติจูด/ลองจิจูด:</span>
                                <span className="font-mono text-slate-700">{comp.lat.toFixed(4)}, {comp.lng.toFixed(4)}</span>
                              </div>
                              {comp.latestSupervision && (
                                <div className="p-1.5 rounded bg-emerald-50 text-emerald-800 text-[9px]">
                                  <strong>ผลนิเทศ:</strong> {comp.latestSupervision.score}/20 ({comp.latestSupervision.grade}) • วันที่ {comp.latestSupervision.visitDate}
                                </div>
                              )}
                              <div className="pt-1 flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onNavigateA4(comp.students[0]?.id)}
                                  className="text-[10px] text-sky-600 font-bold hover:underline flex items-center gap-0.5"
                                >
                                  <span>เปิดรายงาน A4 ของสถานประกอบการนี้ →</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Switch to Full Table View */}
                  <button
                    type="button"
                    onClick={() => onNavigateA4()}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
                    <span>เปิดตารางเต็มฉบับทางการ (Google Sheets Live) →</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Bottom Mobile Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-medium text-slate-500 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 ${
                activeTab === 'home' ? 'text-sky-600 font-bold' : 'hover:text-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>หน้าแรก</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('student');
                onChangeRole('student');
              }}
              className={`flex flex-col items-center gap-0.5 ${
                activeTab === 'student' ? 'text-sky-600 font-bold' : 'hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>ส่วนนักศึกษา</span>
            </button>
            <button
              onClick={currentRole === 'student' ? onOpenForm2 : () => onOpenForm3()}
              className="flex flex-col items-center gap-0.5 text-white bg-slate-900 rounded-full p-2 -mt-4 shadow-md"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-0.5 ${
                activeTab === 'history' ? 'text-sky-600 font-bold' : 'hover:text-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>ประวัติ/นิเทศ</span>
            </button>
            <button
              onClick={onOpenSheetsModal}
              className={`flex flex-col items-center gap-0.5 ${
                activeTab === 'help' ? 'text-sky-600 font-bold' : 'hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ชีตข้อมูล</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Weekly Report PDF Preview & Print Modal (View & Print directly from mobile) */}
      {isReportModalOpen && selectedReportSub && (
        <StudentWeeklyReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          student={student}
          submission={selectedReportSub}
          weekNumber={selectedReportWeek}
        />
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-700"
          >
            <div className="relative">
              <img 
                src={previewPhoto.url} 
                alt={previewPhoto.title} 
                className="w-full max-h-80 object-cover" 
              />
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3.5 space-y-1">
              <div className="font-bold text-slate-900 text-xs">{previewPhoto.title}</div>
              {previewPhoto.caption && (
                <div className="text-[11px] text-slate-500 leading-relaxed">{previewPhoto.caption}</div>
              )}
              {previewPhoto.uploadedAt && (
                <div className="text-[10px] text-sky-600 font-medium">บันทึกเมื่อ: {previewPhoto.uploadedAt}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
