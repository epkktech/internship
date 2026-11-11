import React, { useState } from 'react';
import { X, Printer, Download, ZoomIn, ZoomOut, Loader2, BookOpen, FileText, Camera, Check, Award, AlertTriangle, User, Layers, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types';

interface StudentManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
}

const ASSET_PATH = './assets/aistudio/';
const COLLEGE_LOGO = `${ASSET_PATH}LogoKKTech.jpg`;
const PORTAL_LOGO = `${ASSET_PATH}unnamed_54baf6fc.jpg`;

interface PageHeaderProps {
  page: number;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ page, subtitle }) => (
  <div className="flex items-center justify-between border-b-2 border-sky-900 pb-3 mb-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-white shadow-xs">
        <img src={COLLEGE_LOGO} alt="ตราวิทยาลัยเทคนิคขอนแก่น" className="w-full h-full object-contain" />
      </div>
      <div>
        <div className="font-extrabold text-sky-950 text-sm leading-tight">วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </div>
    <div className="text-right">
      <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-[11px] border border-sky-300">หน้า {page} / 4</span>
      {page === 1 && <div className="text-[10px] text-slate-400 mt-1 font-mono">ภาคเรียนที่ 2/2569</div>}
    </div>
  </div>
);

const PageFooter: React.FC<{ page: number }> = ({ page }) => (
  <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
    <span>แผนกวิชาช่างไฟฟ้ากำลัง • วิทยาลัยเทคนิคขอนแก่น</span>
    <span>เอกสารคู่มือการใช้งานระบบสารสนเทศฝึกอาชีพ (Rev. 2569.2)</span>
    <span>หน้า {page} จาก 4</span>
  </div>
);

const ManualPage: React.FC<{ page: number; zoom: number; children: React.ReactNode }> = ({ page, zoom, children }) => (
  <article
    style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
    className="manual-pdf-page w-[210mm] min-h-[297mm] box-border bg-white text-slate-800 p-[16mm] shadow-2xl relative font-['Prompt',sans-serif] flex flex-col justify-between"
  >
    <div className="flex-1">{children}</div>
    <PageFooter page={page} />
  </article>
);

const Screenshot: React.FC<{ src: string; alt: string; caption: string; fit?: string }> = ({ src, alt, caption, fit = 'object-cover' }) => (
  <div className="rounded-lg overflow-hidden border border-slate-300 shadow-xs bg-white">
    <img src={src} alt={alt} className={`w-full h-40 ${fit}`} />
    <div className="p-1 text-[9px] text-center text-slate-500 bg-slate-100 border-t border-slate-200">{caption}</div>
  </div>
);

export const StudentManualModal: React.FC<StudentManualModalProps> = ({ isOpen, onClose }) => {
  const [zoom, setZoom] = useState(0.85);
  const [activeTab, setActiveTab] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');
      const pageElements = document.querySelectorAll<HTMLElement>('.manual-pdf-page');
      if (pageElements.length === 0) {
        window.print();
        return;
      }

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      for (let i = 0; i < pageElements.length; i++) {
        const canvas = await html2canvas(pageElements[i], {
          scale: 2.2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      const fileName = 'คู่มือการใช้งานระบบสำหรับนักศึกษา_วท_ขอนแก่น.pdf';
      pdf.save(fileName);
      try {
        const blobUrl = URL.createObjectURL(pdf.output('blob'));
        window.open(blobUrl, '_blank');
      } catch (error) {
        console.warn('Popup blocked, PDF saved directly:', error);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const showPage = (page: '1' | '2' | '3' | '4') => activeTab === 'all' || activeTab === page;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col justify-between animate-fadeIn print:hidden">
      <div className="flex-none p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30"><BookOpen className="w-5 h-5" /></span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">คู่มือการใช้งานระบบสำหรับนักศึกษา (Student User Manual)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">ฉบับสมบูรณ์ 4 หน้า A4</span>
            </div>
            <p className="text-xs text-slate-400">วิทยาลัยเทคนิคขอนแก่น • แผนกวิชาช่างไฟฟ้ากำลัง • พร้อมภาพประกอบ</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          {(['all', '1', '2', '3', '4'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${activeTab === tab ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}>
              {tab === 'all' ? 'แสดงทั้งหมด (4 หน้า)' : `หน้า ${tab}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button onClick={() => setZoom(value => Math.max(0.5, value - 0.1))} className="p-1.5 text-slate-300 hover:text-white rounded" title="ย่อขนาด"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[11px] font-mono px-2 text-slate-300">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(value => Math.min(1.2, value + 0.1))} className="p-1.5 text-slate-300 hover:text-white rounded" title="ขยายขนาด"><ZoomIn className="w-3.5 h-3.5" /></button>
          </div>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-200 text-xs font-semibold" title="สั่งพิมพ์คู่มือผ่านเบราว์เซอร์"><Printer className="w-3.5 h-3.5" /><span className="hidden sm:inline">พิมพ์คู่มือ</span></button>
          <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold shadow-md">
            {isGeneratingPDF ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>กำลังสร้าง PDF...</span></> : <><Download className="w-3.5 h-3.5" /><span>ดาวน์โหลดคู่มือ PDF (.pdf)</span></>}
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white ml-1" title="ปิดหน้าต่าง"><X className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 bg-slate-950/60">
        {showPage('1') && <ManualPage page={1} zoom={zoom}>
          <PageHeader page={1} subtitle="คู่มือการใช้งานระบบบันทึกและประเมินผลการฝึกงานวิชาชีพสำหรับนักศึกษา" />
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white mb-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-300 font-bold tracking-wider">STUDENT USER GUIDE • ระบบฝึกอาชีพและนิเทศงาน</span>
                <h1 className="text-xl font-black mt-1 leading-tight">คู่มือขั้นตอนการใช้งานระบบสำหรับนักศึกษา</h1>
                <p className="text-xs text-sky-200 mt-1">แนวทางบันทึกข้อมูลประจำสัปดาห์ แนบภาพถ่าย และติดตามผลการฝึกงาน</p>
              </div>
              <div className="hidden sm:flex w-16 h-16 rounded-xl bg-white/10 p-1 border border-white/20 items-center justify-center">
                <img src={PORTAL_LOGO} alt="โลโก้ระบบ KKTECH" className="w-full h-full object-contain rounded-lg" />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5"><Layers className="w-4 h-4 text-sky-700" />ภาพรวม 5 ขั้นตอนหลักในการใช้งานระบบตลอดภาคเรียน</div>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
              {['เข้าสู่ระบบ', 'เช็กสถานประกอบการ', 'ส่งบันทึกสัปดาห์', 'ตรวจผลการนิเทศ', 'พิมพ์เล่มรายงาน'].map((step, index) => <div key={step} className="p-2 rounded-xl bg-sky-50 border border-sky-200"><div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center mx-auto mb-1">{index + 1}</div><div className="font-bold text-slate-900">{step}</div></div>)}
            </div>
          </div>
          <section className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4">
            <h2 className="font-bold text-slate-900 text-sm mb-2">ขั้นตอนที่ 1: การเข้าสู่ระบบ</h2>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-7 text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>1. เปิดเว็บไซต์ระบบและเลือกเมนู <strong>นักศึกษา (Student Portal)</strong></p>
                <p>2. ใช้อีเมลวิทยาลัย <code>@kktech.ac.th</code> หรือรหัสนักศึกษา 11 หลักเพื่อเข้าสู่ระบบ</p>
                <p>3. ตรวจสอบว่าระบบจับคู่ชื่อและข้อมูลนักศึกษาถูกต้อง หากข้อมูลไม่ถูกต้องให้ติดต่อครูประจำแผนก</p>
                <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">💡 เข้าใช้งานครั้งแรกให้เตรียมรหัสนักศึกษาและบัญชีวิทยาลัย</div>
              </div>
              <div className="col-span-5"><Screenshot src={`${ASSET_PATH}pigture1.jpg`} alt="ภาพที่ 1 หน้าระบบสำหรับนักศึกษา" caption="ภาพที่ 1: หน้าระบบบันทึกและติดตามการฝึกงาน" /></div>
            </div>
          </section>
          <section className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">ขั้นตอนที่ 2: ตรวจสอบข้อมูลส่วนตัวและชั่วโมงฝึกงาน</h2>
            <p className="text-xs text-slate-700 leading-relaxed">หลังเข้าสู่ระบบ ตรวจสอบรหัสนักศึกษา ระดับชั้น สถานประกอบการ และชั่วโมงสะสมให้ถูกต้อง นักศึกษาควรบันทึกการปฏิบัติงานอย่างสม่ำเสมอตลอดภาคเรียน</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="p-2 rounded-lg bg-slate-50 border">เกณฑ์ชั่วโมงรวม<strong className="block text-sm">320 ชั่วโมง</strong></div><div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">ติดตามชั่วโมง<strong className="block">ตรวจสอบในระบบ</strong></div><div className="p-2 rounded-lg bg-sky-50 border border-sky-200">สถานะ<strong className="block">ติดตามผลได้</strong></div></div>
          </section>
        </ManualPage>}

        {showPage('2') && <ManualPage page={2} zoom={zoom}>
          <PageHeader page={2} subtitle="การลงทะเบียนข้อมูลสถานประกอบการและส่งงานประจำสัปดาห์" />
          <section className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm">ขั้นตอนที่ 3: ตรวจสอบและลงทะเบียนข้อมูลสถานประกอบการ (Form #1)</h2>
            <p className="text-xs text-slate-700 leading-relaxed">ก่อนเริ่มฝึกงาน ตรวจสอบข้อมูลสถานประกอบการและครูพี่เลี้ยง หากมีการเปลี่ยนแปลงสถานที่ฝึกหรือผู้ติดต่อ ให้อัปเดตข้อมูลในแบบฟอร์มโดยเร็ว</p>
            <div className="grid grid-cols-2 gap-2 text-xs">{['ชื่อสถานประกอบการและแผนกที่ฝึกงาน', 'ชื่อครูพี่เลี้ยงและเบอร์ติดต่อ', 'พิกัด GPS สำหรับการนิเทศ', 'เบอร์โทรฉุกเฉินหน้างาน'].map(item => <div key={item} className="p-2 rounded-lg bg-white border border-slate-200">{item}</div>)}</div>
          </section>
          <section className="p-4 rounded-xl border-2 border-sky-600 bg-white mb-4 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2 gap-2"><h2 className="font-bold text-slate-900 text-sm">ขั้นตอนที่ 4: ส่งบันทึกการปฏิบัติงานประจำสัปดาห์ (Form #2)</h2><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">ส่งทุกวันอาทิตย์ ก่อน 23:59 น.</span></div>
            <p className="text-xs text-slate-700 leading-relaxed">ในแต่ละสัปดาห์ บันทึกงานที่ปฏิบัติจริงให้ครบถ้วน ตรวจสอบข้อมูลก่อนส่ง และแนบภาพถ่ายประกอบการปฏิบัติงาน</p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 flex gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span><strong>บันทึกเวลาและรายละเอียดงาน:</strong> บันทึกงานประจำวันตามเวลาปฏิบัติงานจริง</span></div>
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 flex gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" /><span><strong>ระบุเครื่องมือและอุปกรณ์ความปลอดภัย:</strong> อธิบายเครื่องมือที่ใช้และมาตรการป้องกันอันตราย</span></div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span><strong>แนบภาพถ่ายหน้างาน:</strong> ใช้ภาพจริงที่ชัดเจนและสวมอุปกรณ์ PPE ครบถ้วน</span></div>
            </div>
            <div className="pt-1"><div className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-sky-600" />ข้อควรคำนึงในการถ่ายภาพหลักฐาน (PPE)</div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50"><img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80" alt="ตัวอย่างการสวม PPE" className="w-full h-24 object-cover" /><div className="p-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50">✓ สวมหมวกนิรภัย แว่นตา และถุงมือให้เหมาะกับงาน</div></div>
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50"><img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80" alt="ตัวอย่างการใช้เครื่องมือวัด" className="w-full h-24 object-cover" /><div className="p-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50">✓ ถ่ายภาพให้เห็นงานและเครื่องมือชัดเจน</div></div>
              </div>
            </div>
          </section>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900"><strong>ตรวจสอบก่อนส่ง:</strong> ข้อมูลครบ รูปภาพตรงกับงานจริง และส่งภายในเวลาที่กำหนด</div>
        </ManualPage>}

        {showPage('3') && <ManualPage page={3} zoom={zoom}>
          <PageHeader page={3} subtitle="การตรวจสอบประวัติ ผลนิเทศ และการพิมพ์รายงาน" />
          <section className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-bold text-slate-900 text-sm">ขั้นตอนที่ 5: ตรวจสอบประวัติการส่งและผลการนิเทศ</h2><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">อัปเดตตามข้อมูลในระบบ</span></div>
            <p className="text-xs text-slate-700 leading-relaxed">ตรวจสอบสถานะการส่งรายงาน ผลประเมิน และข้อเสนอแนะจากครูนิเทศก์หรือครูพี่เลี้ยง หากพบข้อมูลคลาดเคลื่อนให้ติดต่อผู้รับผิดชอบ</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200"><div className="font-bold flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" />คะแนนและเกรด</div><p className="text-[10px] text-slate-600 mt-1">ดูผลการประเมินที่บันทึกไว้</p></div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200"><div className="font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" />ความปลอดภัย</div><p className="text-[10px] text-slate-600 mt-1">อ่านข้อสังเกตเรื่อง PPE และความปลอดภัย</p></div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200"><div className="font-bold flex items-center gap-1"><User className="w-3.5 h-3.5 text-sky-600" />ข้อคิดเห็น</div><p className="text-[10px] text-slate-600 mt-1">ทบทวนคำแนะนำจากผู้ประเมิน</p></div>
            </div>
            <Screenshot src={`${ASSET_PATH}pigture2.jpg`} alt="ภาพที่ 2 ประวัติการส่งรายงานและผลนิเทศ" caption="ภาพที่ 2: ประวัติการส่งรายงานและผลการตรวจนิเทศ" />
          </section>
          <section className="p-4 rounded-xl border border-slate-200 bg-white mb-4 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm">ขั้นตอนที่ 6: เรียกดูและพิมพ์เอกสารรายงาน</h2>
            <p className="text-xs text-slate-700 leading-relaxed">เลือกสัปดาห์หรือรายงานที่ต้องการ แล้วใช้ปุ่มเรียกดูหรือพิมพ์เพื่อจัดเก็บเป็นเอกสารหรือ PDF ตรวจสอบข้อมูลก่อนนำส่ง</p>
            <div className="grid grid-cols-2 gap-3 text-xs"><div className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="font-bold text-sky-950 flex items-center gap-1"><FileText className="w-4 h-4 text-sky-600" />บันทึกข้อความทางการ</div><p className="text-[11px] text-slate-600 mt-1">ตรวจสอบรายละเอียดผู้รับและข้อมูลก่อนพิมพ์</p></div><div className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="font-bold text-sky-950 flex items-center gap-1"><FileText className="w-4 h-4 text-emerald-600" />แบบบันทึกปฏิบัติงาน</div><p className="text-[11px] text-slate-600 mt-1">ตรวจสอบตารางงานและภาพถ่ายประกอบให้ครบ</p></div></div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs"><Printer className="w-4 h-4 inline mr-2" /><strong>วิธีบันทึก PDF:</strong> เลือกพิมพ์จากหน้ารายงาน แล้วเลือก “บันทึกเป็น PDF” ในหน้าต่างพิมพ์ของเบราว์เซอร์</div>
          </section>
        </ManualPage>}

        {showPage('4') && <ManualPage page={4} zoom={zoom}>
          <PageHeader page={4} subtitle="การใช้งานผ่านมือถือ เกณฑ์ประเมิน และข้อปฏิบัติความปลอดภัย" />
          <section className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-4 space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-bold text-slate-900 text-sm">ขั้นตอนที่ 7: ใช้งานระบบผ่านสมาร์ตโฟน</h2><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">รองรับอุปกรณ์มือถือ</span></div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-7 text-xs text-slate-700 space-y-2 leading-relaxed"><p>เปิดเว็บไซต์ผ่านโทรศัพท์มือถือเพื่อดูข้อมูลนักศึกษา บันทึกงานประจำสัปดาห์ และตรวจสอบผลนิเทศ</p><ul className="space-y-1.5 text-[11px]"><li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" />ตรวจสอบชั่วโมงสะสมและข้อมูลส่วนตัว</li><li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" />ส่งบันทึกประจำสัปดาห์พร้อมภาพถ่าย</li><li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" />เรียกดูประวัติและรายงาน</li></ul></div>
              <div className="col-span-5"><Screenshot src={`${ASSET_PATH}pigture3.jpg`} alt="ภาพที่ 3 มุมมองระบบบนโทรศัพท์มือถือ" caption="ภาพที่ 3: มุมมองระบบสำหรับนักศึกษาบนมือถือ" fit="object-contain" /></div>
            </div>
          </section>
          <section className="p-4 rounded-xl border border-slate-200 bg-white mb-4 space-y-2.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" />เกณฑ์การประเมินการฝึกงาน</div>
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs"><div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200"><div className="text-[10px] font-bold">ครูพี่เลี้ยงสถานประกอบการ</div><div className="text-lg font-black">50%</div><div className="text-[10px] text-slate-500">วินัย ความรับผิดชอบ และทักษะงาน</div></div><div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200"><div className="text-[10px] font-bold">ครูนิเทศก์</div><div className="text-lg font-black">30%</div><div className="text-[10px] text-slate-500">สมรรถนะและความปลอดภัย</div></div><div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200"><div className="text-[10px] font-bold">สมุดบันทึกและรายงาน</div><div className="text-lg font-black">20%</div><div className="text-[10px] text-slate-500">ความถูกต้องและครบถ้วน</div></div></div>
          </section>
          <section className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-rose-900 text-xs">
            <div className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-600" />ข้อปฏิบัติความปลอดภัยทางไฟฟ้า</div>
            <p className="text-[11px] leading-relaxed">สวมอุปกรณ์ป้องกันส่วนบุคคลตามลักษณะงาน ปฏิบัติตามคำสั่งผู้ควบคุมงาน และห้ามปฏิบัติงานกับระบบไฟฟ้าโดยไม่ได้รับอนุญาต หากเกิดเหตุฉุกเฉินให้แจ้งหัวหน้างานและหน่วยงานที่เกี่ยวข้องทันที</p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold"><div className="p-1.5 rounded bg-white border border-rose-200 text-center">ครูนิเทศก์: ติดต่อผ่านแผนก</div><div className="p-1.5 rounded bg-white border border-rose-200 text-center">แผนกช่างไฟฟ้า</div><div className="p-1.5 rounded bg-white border border-rose-200 text-center text-rose-700">สายด่วน PEA: 1129</div></div>
          </section>
        </ManualPage>}
      </div>
    </div>
  );
};
