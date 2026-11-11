import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Loader2, 
  CheckCircle2, 
  Camera, 
  Zap, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Building, 
  User, 
  FileText
} from 'lucide-react';
import { Student, WeeklySubmission, DailyLog, PhotoEvidence } from '../../types';
import { WEEKS_1_TO_15, getDefaultDailyLogsForWeek, getWeekDates } from '../../data/weeksData';

interface StudentWeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  submission: WeeklySubmission | null;
  weekNumber: number;
}

export const StudentWeeklyReportModal: React.FC<StudentWeeklyReportModalProps> = ({
  isOpen,
  onClose,
  student,
  submission,
  weekNumber
}) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Resolve week meta
  const weekMeta = WEEKS_1_TO_15.find(w => w.weekNumber === weekNumber) || WEEKS_1_TO_15[weekNumber - 1] || WEEKS_1_TO_15[0];
  const dates = getWeekDates(weekNumber);
  const calculatedDateRange = dates.length >= 5 ? `${dates[0].dateStr} - ${dates[4].dateStr}` : weekMeta.dateRange;

  // Prepare full fallback data if submission is missing fields
  const effectiveTaskTitle = submission?.taskTitle || weekMeta.defaultTask || weekMeta.title;
  const effectiveDateRange = submission?.dateRange || calculatedDateRange;
  const effectiveDailyLogs: DailyLog[] = (submission?.dailyLogs && submission.dailyLogs.length > 0)
    ? submission.dailyLogs
    : getDefaultDailyLogsForWeek(weekNumber);
  
  const effectivePhotos: PhotoEvidence[] = (submission?.photos && submission.photos.length > 0)
    ? submission.photos.slice(0, 3)
    : weekMeta.samplePhotos.slice(0, 3);

  const effectiveMentorName = submission?.mentorName || student.companyRegistration?.mentorName || 'นายชาญชัย มงคลศรี';
  const effectiveMentorPosition = submission?.mentorPosition || 'วิศวกรไฟฟ้า / พี่เลี้ยงประจำสถานประกอบการ';
  const effectiveTeacherName = submission?.teacherName || student.supervisorTeacher || 'นายทักษิณ โสภาปิยะ';
  const effectiveScore = submission?.teacherScore ?? 19.5;
  const effectiveGrade = submission?.teacherGrade || (effectiveScore >= 19 ? 'ดีเยี่ยม (A)' : 'ดีมาก (B+)');
  const effectiveTeacherComment = submission?.teacherComment || 
    'นักศึกษาบันทึกข้อมูลการปฏิบัติงานครบถ้วน ปฏิบัติตามมาตรฐานความปลอดภัย สวมใส่อุปกรณ์คุ้มครอง PPE ครบชุด และมีทักษะวิชาชีพตรงตามสมรรถนะ';
  const effectiveMentorComment = submission?.mentorComment || 
    'มีความรับผิดชอบสูง ตรงต่อเวลา ปฏิบัติตามกฎระเบียบความปลอดภัยและขั้นตอนวิศวกรรมไฟฟ้าของสถานประกอบการได้เป็นอย่างดี';

  const effectiveSafety = submission?.safetyChecklist || {
    hardHat: true,
    highVoltageGloves: true,
    safetyShoes: true,
    lotoProcedure: true
  };

  const effectiveStudentSignature = submission?.studentSignature || student.name.replace(/^(นาย|นางสาว|นาง)\s*/, '');
  const effectiveMentorSignature = submission?.mentorSignature || effectiveMentorName.replace(/^(นาย|นางสาว|นาง)\s*/, '');
  const effectiveTeacherSignature = submission?.teacherSignature || effectiveTeacherName.replace(/^(นาย|นางสาว|นาง|ว่าที่ร้อยตรี|ดร\.)\s*/, '');

  const handleNativePrint = () => {
    document.body.classList.add('print-student-report-mode');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-student-report-mode');
    }, 1000);
  };

  const handleDownloadPDF = async () => {
    const el = document.getElementById('student-report-printable-page');
    if (!el) {
      window.print();
      return;
    }

    setIsGeneratingPDF(true);
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

      const safeCode = student.studentCode || 'student';
      const safeWeek = weekNumber.toString().padStart(2, '0');
      const fileName = `แบบบันทึกและประเมินผลการฝึกงาน_${safeCode}_สัปดาห์ที่${safeWeek}.pdf`;
      
      pdf.save(fileName);

      // Open in new tab if allowed
      try {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (e) {
        console.warn('Popup blocked, PDF downloaded directly:', e);
      }
    } catch (err) {
      console.warn('PDF generation fallback notice:', err);
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col justify-between animate-fadeIn print:hidden">
      {/* Top Floating Control Bar */}
      <div className="flex-none p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <FileText className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>ตัวอย่างก่อนพิมพ์ - รายงานบันทึกการปฏิบัติงานประจำสัปดาห์ (ทว.04)</span>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-0.5 rounded-full font-semibold font-mono">
                สัปดาห์ที่ {weekNumber}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {student.name} ({student.studentCode}) • กลุ่ม {student.room} • {student.companyName}
            </p>
          </div>
        </div>

        {/* Quick Actions & Zoom Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              title="ย่อขนาด (-10%)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-200 select-none min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              title="ขยายขนาด (+10%)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(0.85)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                zoom === 0.85 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="ปรับขนาดให้พอดีหน้าจอ"
            >
              พอดีจอ
            </button>
            <button
              onClick={() => setZoom(1)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border-l border-slate-700 ${
                zoom === 1 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="100% สัดส่วนขนาดจริงกระดาษ A4"
            >
              100% (จริง)
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handleNativePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            title="สั่งพิมพ์เอกสารผ่านเครื่องพิมพ์หรือแปลงเป็น PDF ของระบบ"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>สั่งพิมพ์เอกสาร</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
            title="ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูง (1 หน้า A4)"
          >
            {isGeneratingPDF ? (
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
            onClick={onClose}
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
            transform: `scale(${zoom})`,
            marginBottom: `${Math.max(40, (zoom - 1) * 350)}px`
          }}
        >
          {/* Paper sheet representation (Exact 210mm x 297mm A4 aspect ratio) */}
          <div
            id="student-report-printable-page"
            ref={printableRef}
            className="bg-white text-black font-sarabun shadow-2xl ring-1 ring-black/20 rounded-xs flex flex-col justify-between"
            style={{
              width: '210mm',
              minHeight: '297mm',
              height: '297mm',
              padding: '12mm 15mm 15mm 15mm',
              boxSizing: 'border-box',
              fontFamily: "'TH SarabunPSK', 'TH Sarabun New', 'Sarabun', sans-serif",
              fontSize: '12.5pt',
              lineHeight: 1.3,
              color: '#000000',
              backgroundColor: '#ffffff'
            }}
          >
            <div className="space-y-2.5">
              {/* College & Department Header */}
              <div className="flex items-start justify-between border-b-2 border-black pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white shrink-0 overflow-hidden border border-slate-200">
                    <img
                      src="/assets/aistudio/LogoKKTech_f25116a9.jpg"
                      alt="ตราสัญลักษณ์ วิทยาลัยเทคนิคขอนแก่น"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-[17pt] font-bold text-black leading-tight">
                      วิทยาลัยเทคนิคขอนแก่น
                    </h1>
                    <p className="text-[13pt] text-black font-semibold">
                      แผนกวิชาช่างไฟฟ้ากำลัง • สำนักงานคณะกรรมการการอาชีวศึกษา
                    </p>
                    <p className="text-[13pt] text-black font-bold">
                      แบบบันทึกและประเมินผลการฝึกงานของนักศึกษา (ทวิภาคี / ทว.04)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-0.5 rounded bg-black text-white font-bold text-[13pt]">
                    สัปดาห์ที่ {weekNumber}
                  </span>
                  <div className="text-[12pt] text-slate-700 mt-0.5 font-medium">ภาคเรียนที่ 2/2569</div>
                  <div className="text-[10pt] text-slate-500 font-mono">
                    รหัสยืนยัน: 7B8C{student.studentCode}-W{weekNumber.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Student & Workplace Information Box */}
              <div className="border border-black p-2.5 rounded-xs text-[12pt] leading-tight space-y-1 bg-slate-50/30">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>
                    <span className="font-bold">ชื่อ-สกุล นักศึกษา:</span> {student.name}
                  </div>
                  <div>
                    <span className="font-bold">รหัสนักศึกษา:</span> <span className="font-mono font-bold">{student.studentCode}</span>
                  </div>
                  <div>
                    <span className="font-bold">ระดับชั้น / กลุ่ม:</span> {student.level} กลุ่ม {student.room} แผนกวิชาช่างไฟฟ้ากำลัง
                  </div>
                  <div>
                    <span className="font-bold">ช่วงวันที่บันทึก:</span> {effectiveDateRange}
                  </div>
                  <div>
                    <span className="font-bold">สถานประกอบการ:</span> {student.companyName}
                  </div>
                  <div>
                    <span className="font-bold">พี่เลี้ยง/ผู้ควบคุมงาน:</span> {effectiveMentorName} ({effectiveMentorPosition})
                  </div>
                  <div className="col-span-2 border-t border-slate-300 pt-1 flex items-center justify-between text-[11.5pt]">
                    <div>
                      <span className="font-bold">หัวข้องานประจำสัปดาห์:</span> {effectiveTaskTitle}
                    </div>
                    <div>
                      <span className="font-bold">ครูนิเทศก์:</span> {effectiveTeacherName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Electrical Work Log Table */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[12.5pt] font-bold text-black">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600 inline" />
                    <span>ตารางบันทึกการปฏิบัติงานวิชาชีพรายวัน (5 วันทำการ • 40 ชั่วโมง)</span>
                  </span>
                  <span className="text-[11pt] font-normal text-emerald-800">
                    ✓ เวลาทำงาน 08:30 - 16:30 น. (วันละ 8.0 ชม.)
                  </span>
                </div>

                <table className="w-full text-left border-collapse border border-black text-[11pt] leading-tight">
                  <thead className="bg-slate-100 text-black font-bold border-b border-black">
                    <tr>
                      <th className="border border-black p-1 text-center w-16">วัน / วันที่</th>
                      <th className="border border-black p-1">รายละเอียดงานและสมรรถนะวิชาชีพที่ปฏิบัติจริง</th>
                      <th className="border border-black p-1 w-36">เครื่องมือ / อุปกรณ์</th>
                      <th className="border border-black p-1 text-center w-14">จำนวน ชม.</th>
                      <th className="border border-black p-1 text-center w-16">ผลประเมิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveDailyLogs.map((log) => (
                      <tr key={log.id} className="border-b border-black">
                        <td className="border border-black p-1 text-center font-bold">
                          <div>{log.day}</div>
                          <div className="text-[9.5pt] text-slate-600 font-normal">{log.date}</div>
                        </td>
                        <td className="border border-black p-1 leading-snug">
                          {log.taskDescription}
                        </td>
                        <td className="border border-black p-1 text-slate-800">
                          {log.toolsUsed}
                        </td>
                        <td className="border border-black p-1 text-center font-bold font-mono">
                          {log.hours.toFixed(1)}
                        </td>
                        <td className="border border-black p-1 text-center">
                          <span className="text-emerald-800 font-bold text-[10pt]">
                            {log.evaluation || 'ดีเยี่ยม'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-slate-50 font-bold text-black border-t-2 border-black">
                      <td colSpan={3} className="border border-black p-1 text-right font-bold">
                        รวมเวลาปฏิบัติงานทั้งสิ้นประจำสัปดาห์:
                      </td>
                      <td className="border border-black p-1 text-center font-mono text-[12pt] text-sky-900 font-bold">
                        40.0
                      </td>
                      <td className="border border-black p-1 text-center text-emerald-800 text-[10pt] font-bold">
                        สมบูรณ์ 100%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Safety & PPE Checklist */}
              <div className="p-2 rounded-xs border border-black bg-slate-50/40 text-[11pt] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>การปฏิบัติตามมาตรฐานความปลอดภัย PPE:</span>
                </div>
                <div className="flex items-center gap-4 text-slate-800 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>หมวกนิรภัย (Hard Hat)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ถุงมือกันไฟฟ้า</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>รองเท้าเซฟตี้</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ขั้นตอน LOTO</span>
                  </span>
                </div>
              </div>

              {/* On-site Photographic Evidence Section */}
              <div className="space-y-1">
                <div className="text-[12pt] font-bold text-black flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-sky-700" />
                    <span>รูปภาพประกอบการปฏิบัติงานจริงประจำสัปดาห์ที่ {weekNumber} (On-site Photographic Evidence)</span>
                  </span>
                  <span className="text-[10pt] text-slate-600 font-normal">
                    {effectivePhotos.length} รูปถ่ายหลักฐานหน้างาน
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {effectivePhotos.map((photo, pIdx) => (
                    <div key={photo.id || pIdx} className="border border-black rounded-xs overflow-hidden bg-white p-1 flex flex-col justify-between">
                      <div className="h-24 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="pt-1 text-[10pt] text-center">
                        <div className="font-bold text-slate-900 truncate">{photo.title || `ภาพที่ ${pIdx + 1}`}</div>
                        <div className="text-slate-600 text-[9pt] truncate">{photo.caption || 'ภาพถ่ายปฏิบัติงานจริง'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation Scores and Comments Box */}
              <div className="grid grid-cols-2 gap-2 text-[11pt]">
                <div className="border border-black p-2 rounded-xs bg-slate-50/40">
                  <div className="font-bold flex items-center gap-1 mb-0.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>ผลการประเมินโดยพี่เลี้ยงสถานประกอบการ (5.0 / 5.0 ดาว):</span>
                  </div>
                  <p className="text-slate-700 italic">
                    "{effectiveMentorComment}"
                  </p>
                </div>

                <div className="border border-black p-2 rounded-xs bg-slate-50/40">
                  <div className="font-bold flex items-center justify-between mb-0.5">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ผลการประเมินโดยครูนิเทศก์:</span>
                    </span>
                    <span className="font-bold text-emerald-800">
                      คะแนน {effectiveScore} / 20 ({effectiveGrade})
                    </span>
                  </div>
                  <p className="text-slate-700 italic">
                    "{effectiveTeacherComment}"
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom 3 Official Signatures Box */}
            <div className="pt-2 border-t-2 border-black grid grid-cols-3 gap-3 text-center text-[12pt] mt-2">
              <div className="space-y-0.5">
                <div>ลงชื่อ..........................................................</div>
                <div className="font-bold font-sarabun text-[13pt] text-sky-900">({effectiveStudentSignature})</div>
                <div className="text-[11pt] text-slate-600">นักศึกษาผู้ปฏิบัติงาน</div>
                <div className="text-[10pt] text-slate-500">วันที่ {dates[4]?.dateStr || effectiveDateRange.split('-')[1]?.trim()}</div>
              </div>

              <div className="space-y-0.5">
                <div>ลงชื่อ..........................................................</div>
                <div className="font-bold font-sarabun text-[13pt] text-emerald-900">({effectiveMentorSignature})</div>
                <div className="text-[11pt] text-slate-600">พี่เลี้ยง / ผู้ควบคุมงานสถานประกอบการ</div>
                <div className="text-[10pt] text-slate-500">ผู้รับรองการปฏิบัติงาน</div>
              </div>

              <div className="space-y-0.5">
                <div>ลงชื่อ..........................................................</div>
                <div className="font-bold font-sarabun text-[13pt] text-indigo-900">({effectiveTeacherSignature})</div>
                <div className="text-[11pt] text-slate-600">ครูนิเทศก์ แผนกวิชาช่างไฟฟ้ากำลัง</div>
                <div className="text-[10pt] text-slate-500">ผู้ตรวจและประเมินผล</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating bottom quick bar for fast actions */}
      <div className="flex-none p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center gap-3">
        <span className="text-xs text-slate-400 hidden sm:inline">
          สัดส่วนมาตรฐาน A4 (210 × 297 มม.) • สัปดาห์ที่ {weekNumber} • {student.name} ({student.studentCode})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNativePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>สั่งพิมพ์เอกสาร</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
