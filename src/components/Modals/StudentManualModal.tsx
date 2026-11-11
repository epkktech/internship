import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Loader2, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  Smartphone, 
  ShieldCheck, 
  Upload, 
  Camera, 
  Check, 
  Award, 
  AlertTriangle, 
  User, 
  Key, 
  Layers, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Phone,
  HelpCircle
} from 'lucide-react';
import { Student } from '../../types';

interface StudentManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
}

export const StudentManualModal: React.FC<StudentManualModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [activeTab, setActiveTab] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printableContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleNativePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');

      const pageElements = document.querySelectorAll<HTMLElement>('.manual-pdf-page');
      if (!pageElements || pageElements.length === 0) {
        window.print();
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        
        // Render canvas at high scale for crisp text & images
        const canvas = await html2canvas(pageEl, {
          scale: 2.2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const fileName = `คู่มือการใช้งานระบบสำหรับนักศึกษา_วท_ขอนแก่น.pdf`;
      pdf.save(fileName);

      // Open in new tab if permitted
      try {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (e) {
        console.warn('Popup blocked, PDF saved directly:', e);
      }
    } catch (err) {
      console.error('PDF export error:', err);
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
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                คู่มือการใช้งานระบบสำหรับนักศึกษา (Student User Manual)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                ฉบับสมบูรณ์ 4 หน้า A4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง • พร้อมภาพประกอบและดาวน์โหลดเป็น PDF
            </p>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            แสดงทั้งหมด (4 หน้า)
          </button>
          <button
            onClick={() => setActiveTab('1')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeTab === '1' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            หน้า 1
          </button>
          <button
            onClick={() => setActiveTab('2')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeTab === '2' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            หน้า 2
          </button>
          <button
            onClick={() => setActiveTab('3')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeTab === '3' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            หน้า 3
          </button>
          <button
            onClick={() => setActiveTab('4')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeTab === '4' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            หน้า 4
          </button>
        </div>

        {/* Zoom & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
              title="ย่อขนาด"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.2, prev + 0.1))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
              title="ขยายขนาด"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleNativePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer"
            title="สั่งพิมพ์คู่มือผ่านเบราว์เซอร์"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">พิมพ์คู่มือ</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold shadow-md transition cursor-pointer"
            title="ดาวน์โหลดคู่มือการใช้งานเป็นไฟล์ PDF (.pdf)"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังสร้าง PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดคู่มือ PDF (.pdf)</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer ml-1"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Document Container */}
      <div 
        ref={printableContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 bg-slate-950/60"
      >
        {/* =========================================================================
            PAGE 1: บทนำ, ภาพรวมระบบ, และการเข้าสู่ระบบ (Getting Started & Login)
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === '1') && (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="manual-pdf-page w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[16mm] shadow-2xl relative font-['Prompt',sans-serif] flex flex-col justify-between"
          >
            {/* Page Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-sky-900 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-white shadow-2xs">
                    <img 
                      src="./assets/aistudio/unnamed_54baf6fc.jpg" 
                      alt="KKTECH Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-sky-950 text-base leading-tight">
                      วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      คู่มือการใช้งานระบบบันทึกและประเมินผลการฝึกงานวิชาชีพ (สำหรับนักศึกษา)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-[11px] border border-sky-300">
                    หน้า 1 / 4
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">ภาคเรียนที่ 2/2569</div>
                </div>
              </div>

              {/* Title Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white mb-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-300 font-bold tracking-wider uppercase">
                      STUDENT USER GUIDE • ระบบฝึกอาชีพและนิเทศก์งาน
                    </span>
                    <h1 className="text-xl font-black mt-0.5 leading-tight text-white">
                      คู่มือขั้นตอนการใช้งานระบบสำหรับนักศึกษา
                    </h1>
                    <p className="text-xs text-sky-200 mt-1">
                      แนวทางปฏิบัติสำหรับการบันทึกข้อมูลประจำสัปดาห์ การแนบภาพถ่าย PPE และการตรวจเช็คผลการนิเทศ
                    </p>
                  </div>
                  <div className="hidden sm:block w-14 h-14 rounded-xl bg-white/10 p-1 border border-white/20">
                    <img 
                      src="./assets/aistudio/garuda_emblem.png" 
                      alt="Garuda" 
                      className="w-full h-full object-contain filter brightness-110"
                    />
                  </div>
                </div>
              </div>

              {/* Workflow Diagram: 5 Key Steps */}
              <div className="mb-5">
                <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-700" />
                  <span>ภาพรวม 5 ขั้นตอนหลักในการใช้งานระบบตลอดภาคเรียน:</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center mx-auto text-xs">1</div>
                    <div className="font-bold text-slate-900">เข้าสู่ระบบ</div>
                    <div className="text-slate-500">อีเมล @kktech หรือรหัส นศ.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto text-xs">2</div>
                    <div className="font-bold text-slate-900">เช็กสถานประกอบการ</div>
                    <div className="text-slate-500">Form #1 และครูพี่เลี้ยง</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mx-auto text-xs">3</div>
                    <div className="font-bold text-slate-900">ส่งบันทึกสัปดาห์</div>
                    <div className="text-slate-500">Form #2 + รูป PPE 3 รูป</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-xs">4</div>
                    <div className="font-bold text-slate-900">ตรวจผลการนิเทศ</div>
                    <div className="text-slate-500">คะแนน เกรด และรูปนิเทศ</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto text-xs">5</div>
                    <div className="font-bold text-slate-900">พิมพ์เล่มรายงาน</div>
                    <div className="text-slate-500">สั่งพิมพ์ A4 / โหลด PDF</div>
                  </div>
                </div>
              </div>

              {/* Step 1: Login & Identity */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs">1</span>
                  <span>ขั้นตอนที่ 1: การเข้าสู่ระบบ (Login with Google Workspace @kktech.ac.th)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-7 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                    <p>
                      1.1 เปิดเว็บไซต์ระบบ และเลือกเมนู <strong>"1. นักศึกษา (Student Portal)"</strong> ในหน้าเข้าสู่ระบบ
                    </p>
                    <p>
                      1.2 กรอกอีเมลวิทยาลัย <code>@kktech.ac.th</code> หรือรหัสนักศึกษา 11 หลัก เช่น <code>68301040105</code>
                    </p>
                    <p>
                      1.3 ระบบจะทำการจับคู่ข้อมูลนักศึกษาจากแผ่นงาน <strong>Login Sheet</strong> ของวิทยาลัยโดยอัตโนมัติ เพื่อดึงสถานประกอบการและครูนิเทศก์ประจำตัว
                    </p>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                      💡 <strong>ข้อแนะนำ:</strong> หากเข้าใช้งานครั้งแรก ให้ใช้รหัสนักศึกษา หรือแตะเลือกชื่อของตนเองจากหน้าเลือกบทบาทได้ทันที
                    </div>
                  </div>
                  <div className="md:col-span-5 rounded-lg overflow-hidden border border-slate-300 shadow-xs bg-white">
                    <img 
                      src="./assets/aistudio/Screenshot_2026-11-03_154437_c14045ab.png" 
                      alt="หน้าจอเข้าสู่ระบบ" 
                      className="w-full h-36 object-cover object-top"
                    />
                    <div className="p-1 text-[9px] text-center text-slate-500 bg-slate-100 border-t border-slate-200">
                      ภาพที่ 1: หน้าจอเลือกเข้าสู่ระบบพอร์ทัลฝึกงานวิชาชีพ
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Student Profile & Hours Progress */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs">2</span>
                  <span>ขั้นตอนที่ 2: ตรวจสอบข้อมูลส่วนตัวและสะสมชั่วโมงฝึกงานวิชาชีพ</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  เมื่อเข้าสู่ระบบสำเร็จ จะปรากฏแถบข้อมูลนักศึกษา รหัสนักศึกษา ห้องเรียน พร้อมหลอดความคืบหน้าสะสมชั่วโมงฝึกงาน 
                  โดยเกณฑ์มาตรฐานต้องสะสมครบ <strong>320 ชั่วโมง (ภาคเรียนละ 18 สัปดาห์ สัปดาห์ละ 40 ชม.)</strong>
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500">เกณฑ์ชั่วโมงรวม</div>
                    <div className="font-bold text-slate-900 text-sm">320 ชั่วโมง</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-[10px] text-emerald-700">สะสมปัจจุบัน</div>
                    <div className="font-bold text-emerald-800 text-sm">320 / 320 ชม. (ครบ 100%)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-50 border border-sky-200">
                    <div className="text-[10px] text-sky-700">สถานะปัจจุบัน</div>
                    <div className="font-bold text-sky-900 text-sm">พร้อมส่งออกผลคะแนน</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>แผนกวิชาช่างไฟฟ้ากำลัง • วิทยาลัยเทคนิคขอนแก่น</span>
              <span>เอกสารคู่มือการใช้งานระบบสารสนเทศฝึกอาชีพ (Rev. 2569.2)</span>
              <span>หน้า 1 จาก 4</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 2: ข้อมูลสถานประกอบการ (Form 1) และการส่งงานประจำสัปดาห์ (Form 2)
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === '2') && (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="manual-pdf-page w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[16mm] shadow-2xl relative font-['Prompt',sans-serif] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-sky-900 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-white shadow-2xs">
                    <img 
                      src="./assets/aistudio/unnamed_54baf6fc.jpg" 
                      alt="KKTECH Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sky-950 text-sm">
                      วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง
                    </div>
                    <div className="text-xs text-slate-500">
                      คู่มือนักศึกษา: ขั้นตอนการลงทะเบียน Form #1 และส่งงานสัปดาห์ Form #2
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-[11px] border border-sky-300">
                  หน้า 2 / 4
                </span>
              </div>

              {/* Step 3: Form #1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs">3</span>
                  <span>ขั้นตอนที่ 3: ตรวจสอบและลงทะเบียนข้อมูลสถานประกอบการ (Google Form #1)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  ก่อนเริ่มการฝึกงาน หรือเมื่อมีการเปลี่ยนแปลงสถานที่ฝึกงาน นักศึกษาต้องตรวจสอบข้อมูลสถานประกอบการในระบบ
                  หากข้อมูลยังไม่สมบูรณ์ ให้กดปุ่ม <strong>"ดูข้อมูล / อัปเดตข้อมูลสถานประกอบการ"</strong> เพื่อบันทึก:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <div className="font-semibold text-slate-800 text-[11px]">1. ชื่อสถานประกอบการ</div>
                    <div className="text-[10px] text-slate-500">และแผนกที่เข้าฝึกงาน</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <div className="font-semibold text-slate-800 text-[11px]">2. ชื่อครูพี่เลี้ยง</div>
                    <div className="text-[10px] text-slate-500">พร้อมเบอร์โทรติดต่อหน้างาน</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <div className="font-semibold text-slate-800 text-[11px]">3. พิกัด GPS หมุดแผนที่</div>
                    <div className="text-[10px] text-slate-500">สำหรับครูนิเทศก์ลงพื้นที่</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <div className="font-semibold text-slate-800 text-[11px]">4. เบอร์โทรฉุกเฉิน</div>
                    <div className="text-[10px] text-slate-500">กรณีเกิดอุบัติเหตุฉุกเฉิน</div>
                  </div>
                </div>
              </div>

              {/* Step 4: Form #2 Weekly Submission */}
              <div className="p-4 rounded-xl border-2 border-sky-600 bg-white mb-4 space-y-3">
                <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs">4</span>
                    <span>ขั้นตอนที่ 4: การส่งบันทึกการปฏิบัติงานประจำสัปดาห์ (Google Form #2)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    ส่งทุกวันอาทิตย์ ก่อน 23:59 น.
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  ในแต่ละสัปดาห์ (สัปดาห์ที่ 1 - 18) นักศึกษาต้องบันทึกรายละเอียดงานที่ทำ เครื่องมือที่ใช้ และอัปโหลดภาพถ่ายหลักฐาน 
                  โดยกดปุ่ม <strong>"เปิดหน้าบันทึกการปฏิบัติงาน & แนบรูปถ่าย"</strong> หรือกรอกผ่านแบบฟอร์มป๊อปอัปด่วน
                </p>

                {/* Sub-steps of Form #2 */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-sky-50/60 border border-sky-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 text-xs">4.1 บันทึกเวลาและรายละเอียดงานรายวัน:</strong>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        บันทึกงานวันจันทร์ถึงวันศุกร์ รวมครบ 40 ชั่วโมง/สัปดาห์ (08:30 - 16:30 น.) ระบุงานติดตั้ง, ซ่อมบำรุง, wiring, หรือทดสอบระบบ
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-sky-50/60 border border-sky-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 text-xs">4.2 ระบุเครื่องมือช่างและอุปกรณ์ความปลอดภัย:</strong>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        เช่น Digital Multimeter, Clamp Meter, Megger Test, เครื่องมือประจำตัวช่าง และมาตรการ Lockout/Tagout (LOTO)
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-950 text-xs">4.3 อัปโหลดภาพถ่ายหลักฐานหน้างานขั้นต่ำ 3 รูป (ตามเกณฑ์ PPE):</strong>
                      <p className="text-slate-700 text-[11px] mt-0.5">
                        ภาพที่ 1: ภาพขณะปฏิบัติงานจริง • ภาพที่ 2: ภาพชิ้นงาน/ตู้ควบคุมที่ประกอบเสร็จ • ภาพที่ 3: ภาพถ่ายร่วมกับครูพี่เลี้ยงหน้างาน
                      </p>
                    </div>
                  </div>
                </div>

                {/* Illustrated Photos Guideline */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-sky-600" />
                    <span>เกณฑ์ภาพถ่ายหน้างานที่ถูกต้อง (PPE Standard):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img 
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80" 
                        alt="สวม PPE" 
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50">
                        ✓ ถูกต้อง: สวมหมวกนิรภัย แว่นตา และถุงมือฉนวนครบชุด
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img 
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80" 
                        alt="เครื่องมือวัด" 
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50">
                        ✓ ถูกต้อง: เห็นรายละเอียดการวัดค่าและป้ายฉลากตู้ชัดเจน
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>แผนกวิชาช่างไฟฟ้ากำลัง • วิทยาลัยเทคนิคขอนแก่น</span>
              <span>เอกสารคู่มือการใช้งานระบบสารสนเทศฝึกอาชีพ (Rev. 2569.2)</span>
              <span>หน้า 2 จาก 4</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 3: ประวัติการส่งรายงาน, ผลการตรวจนิเทศก์ และการสั่งพิมพ์ PDF
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === '3') && (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="manual-pdf-page w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[16mm] shadow-2xl relative font-['Prompt',sans-serif] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-sky-900 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-white shadow-2xs">
                    <img 
                      src="./assets/aistudio/unnamed_54baf6fc.jpg" 
                      alt="KKTECH Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sky-950 text-sm">
                      วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง
                    </div>
                    <div className="text-xs text-slate-500">
                      คู่มือนักศึกษา: การตรวจผลนิเทศก์ และการสั่งพิมพ์หรือดาวน์โหลด PDF
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-[11px] border border-sky-300">
                  หน้า 3 / 4
                </span>
              </div>

              {/* Step 5: Supervision Inspection Results */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs">5</span>
                    <span>ขั้นตอนที่ 5: การตรวจเช็คประวัติการส่งรายงานและผลการตรวจนิเทศก์</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    อัปเดตแบบ Real-time
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  นักศึกษาสามารถเข้ามาตรวจสอบความคืบหน้าการตรวจประเมินของครูนิเทศก์ได้ตลอดเวลา ในตารางประวัติจะมีข้อมูล:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>คะแนนและเกรด</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      คะแนนเต็ม 20 คะแนน (เช่น 19.5/20) พร้อมระดับผลการเรียน A, B+, B
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ผลประเมิน PPE</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      ตรวจสอบหมวก แว่นตา ถุงมือ และขั้นตอน LOTO ผ่าน 100%
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>ข้อคิดเห็นครู & พี่เลี้ยง</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      คำแนะนำทักษะเชิงลึกจากครูนิเทศก์ และการรับรองของพี่เลี้ยง
                    </p>
                  </div>
                </div>

                {/* Screenshot of Supervision Inspection Section */}
                <div className="rounded-lg overflow-hidden border border-slate-300 shadow-xs bg-white">
                  <img 
                    src="./assets/aistudio/Screenshot_2026-11-03_162344_2a9430ce.png" 
                    alt="ตารางประวัติและผลนิเทศ" 
                    className="w-full h-36 object-cover object-center"
                  />
                  <div className="p-1 text-[9px] text-center text-slate-500 bg-slate-100 border-t border-slate-200">
                    ภาพที่ 2: ตารางประวัติการส่งรายงานและผลการตรวจนิเทศก์พร้อมปุ่มสั่งพิมพ์ PDF
                  </div>
                </div>
              </div>

              {/* Step 6: Viewing & Printing PDF */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs">6</span>
                  <span>ขั้นตอนที่ 6: การเรียกดูเอกสารรายงาน A4 และการสั่งพิมพ์หรือดาวน์โหลด PDF</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  ในแต่ละสัปดาห์ นักศึกษาสามารถกดปุ่ม <strong>"เรียกดู"</strong> หรือ <strong>"พิมพ์ PDF"</strong> เพื่อเปิดเอกสารฉบับทางการ:
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-bold text-sky-950 flex items-center gap-1 text-xs">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>เอกสารที่ 1: บันทึกข้อความทางการ</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      แบบบันทึกข้อความราชการ สอศ. มีตราครุฑ เรียนเสนอผู้อำนวยการวิทยาลัยเทคนิคขอนแก่น พร้อมลายเซ็นรับรองของครูนิเทศก์และหัวหน้าแผนก
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-bold text-sky-950 flex items-center gap-1 text-xs">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>เอกสารที่ 2: แบบบันทึกปฏิบัติงาน (2 หน้า)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      หน้าที่ 1: ตารางบันทึกงาน จันทร์-ศุกร์ ครบ 40 ชม. • หน้าที่ 2: ภาพถ่ายหลักฐาน 3 ภาพ พร้อมช่องคะแนน ลายเซ็นพี่เลี้ยงและครูนิเทศก์
                    </p>
                  </div>
                </div>

                {/* Print instructions */}
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>วิธีสั่งพิมพ์/บันทึก PDF:</strong> เมื่อกดปุ่ม "พิมพ์ PDF" ระบบจะแสดงตัวอย่างก่อนพิมพ์ โดยคงสัดส่วน A4 เป๊ะ และดาวน์โหลดไฟล์ <code>.pdf</code> ลงอุปกรณ์อัตโนมัติ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>แผนกวิชาช่างไฟฟ้ากำลัง • วิทยาลัยเทคนิคขอนแก่น</span>
              <span>เอกสารคู่มือการใช้งานระบบสารสนเทศฝึกอาชีพ (Rev. 2569.2)</span>
              <span>หน้า 3 จาก 4</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 4: การใช้งานในโหมดมือถือ (Mobile Mode) และข้อกำหนดความปลอดภัย
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === '4') && (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="manual-pdf-page w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[16mm] shadow-2xl relative font-['Prompt',sans-serif] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-sky-900 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-white shadow-2xs">
                    <img 
                      src="./assets/aistudio/unnamed_54baf6fc.jpg" 
                      alt="KKTECH Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sky-950 text-sm">
                      วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง
                    </div>
                    <div className="text-xs text-slate-500">
                      คู่มือนักศึกษา: การใช้งานผ่านมือถือ (Mobile Mode) และข้อกำหนดความปลอดภัย
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-[11px] border border-sky-300">
                  หน้า 4 / 4
                </span>
              </div>

              {/* Step 7: Mobile Mode Guide */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs">7</span>
                    <span>ขั้นตอนที่ 7: การใช้งานระบบผ่านสมาร์ตโฟน (Mobile Mode)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                    รองรับทุกอุปกรณ์
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-7 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <p>
                      เมื่อเปิดเว็บไซต์ผ่านโทรศัพท์มือถือ หรือกดปุ่ม <strong>"สลับดูโหมดมือถือ"</strong> ด้านบน ระบบจะปรับหน้าจอเข้าสู่มุมมองมือถือที่ใช้งานง่าย:
                    </p>
                    <ul className="space-y-1.5 pl-2 text-[11px]">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>ส่วนนักศึกษา:</strong> ตรวจสอบชั่วโมงสะสม และส่ง Google Form #2</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>ผลตรวจนิเทศก์:</strong> ดูผลคะแนน ข้อเสนอแนะ และภาพถ่ายหน้างาน</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>ประวัติ/นิเทศ:</strong> เรียกดูรายงาน 18 สัปดาห์ และสั่งพิมพ์ PDF ได้ทันที</span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-5 rounded-lg overflow-hidden border border-slate-300 shadow-xs bg-white">
                    <img 
                      src="./assets/aistudio/Screenshot_2026-11-03_185010_5d55a01a.png" 
                      alt="โหมดมือถือนักศึกษา" 
                      className="w-full h-36 object-cover object-top"
                    />
                    <div className="p-1 text-[9px] text-center text-slate-500 bg-slate-100 border-t border-slate-200">
                      ภาพที่ 3: มุมมองแอปมือถือส่วนนักศึกษา (Screenshot 5)
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading Criteria & Rules */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4 space-y-2.5">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>เกณฑ์การให้คะแนนและการตัดเกรดการฝึกงาน (สอศ. มาตรฐาน)</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="text-[10px] text-amber-800 font-bold">ครูพี่เลี้ยงสถานประกอบการ</div>
                    <div className="text-lg font-black text-amber-900 font-mono my-0.5">50%</div>
                    <div className="text-[10px] text-slate-500">วินัย ความรับผิดชอบ และทักษะงาน</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200">
                    <div className="text-[10px] text-sky-800 font-bold">ครูนิเทศก์ประจำกลุ่ม</div>
                    <div className="text-lg font-black text-sky-900 font-mono my-0.5">30%</div>
                    <div className="text-[10px] text-slate-500">สมรรถนะวิชาชีพ มาตรฐาน PPE และการแก้ปัญหา</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="text-[10px] text-purple-800 font-bold">สมุดบันทึก & เล่มรายงาน</div>
                    <div className="text-lg font-black text-purple-900 font-mono my-0.5">20%</div>
                    <div className="text-[10px] text-slate-500">ความถูกต้อง ครบ 18 สัปดาห์ และรูปภาพ</div>
                  </div>
                </div>
              </div>

              {/* Safety Rules & Emergency Contacts */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-rose-900 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-rose-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>ข้อปฏิบัติความปลอดภัยทางไฟฟ้า & ช่องทางติดต่อฉุกเฉิน 24 ชั่วโมง</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  ต้องสวมหมวกนิรภัย แว่นตานิรภัย และรองเท้าเซฟตี้ตลอดเวลาที่อยู่ในสถานประกอบการ ปฏิบัติตามกฎ LOTO อย่างเคร่งครัด
                  หากเกิดอุบัติเหตุหรือเหตุฉุกเฉินทางไฟฟ้า ให้แจ้งหัวหน้างานและติดต่อครูนิเทศก์ทันที
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold">
                  <div className="p-1.5 rounded bg-white border border-rose-200 text-center">
                    📞 ครูนิเทศก์: 081-987-6543
                  </div>
                  <div className="p-1.5 rounded bg-white border border-rose-200 text-center">
                    📞 แผนกช่างไฟฟ้า: 043-221-987
                  </div>
                  <div className="p-1.5 rounded bg-white border border-rose-200 text-center text-rose-700">
                    🚨 สายด่วน PEA: 1129 (24 ชม.)
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>แผนกวิชาช่างไฟฟ้ากำลัง • วิทยาลัยเทคนิคขอนแก่น</span>
              <span>เอกสารคู่มือการใช้งานระบบสารสนเทศฝึกอาชีพ (Rev. 2569.2)</span>
              <span>หน้า 4 จาก 4 (จบเล่ม)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
