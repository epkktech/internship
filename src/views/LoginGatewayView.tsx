import React, { useState } from 'react';
import { AuthUser } from '../types';
import { 
  FileSpreadsheet, 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  HelpCircle,
  KeyRound,
  BookOpen
} from 'lucide-react';
import { 
  authenticateWithGoogleSheet,
  QUICK_DEMO_CREDENTIALS
} from '../services/sheetAuthService';
import { 
  saveAuthUser, 
  quickLoginAsPreset, 
  signInWithGoogleWorkspace 
} from '../services/authService';

interface LoginGatewayViewProps {
  onSelectRole: (role: 'student' | 'teacher' | 'admin') => void;
  onDirectLogin?: (user: AuthUser) => void;
  onOpenStudentManual?: () => void;
}

export const LoginGatewayView: React.FC<LoginGatewayViewProps> = ({
  onSelectRole,
  onDirectLogin,
  onOpenStudentManual,
}) => {
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInlineLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await authenticateWithGoogleSheet(userInput, passInput);
      if (!result.success || !result.user) {
        setIsLoading(false);
        setErrorMsg(result.error || 'ชื่อผู้ใช้ (user) หรือรหัสผ่าน (pass) ไม่ถูกต้อง');
        return;
      }

      saveAuthUser(result.user);
      setIsLoading(false);
      if (onDirectLogin) {
        onDirectLogin(result.user);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์กับฐานข้อมูล');
    }
  };

  const handleQuickPresetLogin = (role: 'student' | 'teacher' | 'admin') => {
    setErrorMsg(null);
    const user = quickLoginAsPreset(role);
    if (onDirectLogin) {
      onDirectLogin(user);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUserInput(user);
    setPassInput(pass);
    setErrorMsg(null);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogleWorkspace();
      setIsGoogleLoading(false);
      if (onDirectLogin) {
        onDirectLogin(user);
      }
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMsg(err.message || 'ไม่สามารถลงชื่อเข้าใช้ด้วย Google ได้');
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] flex flex-col font-['Prompt',sans-serif] text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="bg-[#0c2340] w-full px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* KKTech Electrical Power Round Emblem */}
            <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
              <img
                src="./assets/aistudio/unnamed_54baf6fc.jpg"
                alt="ตราสัญลักษณ์แผนกวิชาช่างไฟฟ้ากำลัง วท.ขอนแก่น"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Title & Department Subtitle */}
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-base sm:text-lg leading-tight tracking-tight">
                ระบบบันทึกข้อมูลการฝึกงาน
              </h1>
              <p className="text-slate-300 text-xs sm:text-xs font-normal">
                สาขาไฟฟ้ากำลัง วิทยาลัยเทคนิคขอนแก่น
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenStudentManual && (
              <button
                type="button"
                onClick={onOpenStudentManual}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 border border-sky-400/40 text-xs font-semibold transition cursor-pointer"
                title="คู่มือการใช้งานระบบสำหรับนักศึกษา (PDF)"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-300" />
                <span>คู่มือใช้งาน นศ. (.PDF)</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">ระบบออนไลน์ • พร้อมใช้งาน 3 บทบาท</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col justify-center">
        {/* Hero Banner Card */}
        <section className="bg-[#0f2444] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KKTECH ELECTRICAL POWER PORTAL 2/2569</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight">
              เลือกบทบาทของคุณเพื่อเริ่ม<br />
              บันทึกและจัดการข้อมูล
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
              ศูนย์รวมแบบฟอร์มบันทึกการฝึกอาชีพ (ฟ.1, ฟ.2, ฟ.3) รองรับการใช้งานทั้งบนคอมพิวเตอร์และมือถือ
            </p>
          </div>

          {/* Logo KKTech Official Emblem */}
          <div className="shrink-0 flex items-center justify-center sm:pr-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white/10 p-2 sm:p-2.5 border-2 border-white/20 shadow-2xl backdrop-blur-xs flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <img
                src="./assets/aistudio/LogoKKTech.jpg"
                alt="ตราสัญลักษณ์วิทยาลัยเทคนิคขอนแก่น"
                className="w-full h-full object-contain rounded-full shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* 3 Role Selection Cards with Direct One-Click Access */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8">
          {/* 1. นักศึกษา Card */}
          <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-blue-300 transition-all duration-200 p-6 pl-7 flex flex-col justify-between overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#2563eb] rounded-l-2xl group-hover:w-3 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  ปวช. / ปวส.
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                นักศึกษา
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                กรอกข้อมูลสถานประกอบการ (ฟ.1) และส่งรายงานบันทึกประจำสัปดาห์ (ฟ.2)
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('student')}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>เข้าใช้งานทันที</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('student')}
                className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-blue-600 font-medium transition cursor-pointer"
              >
                ระบุรหัสนักศึกษาตนเอง &rarr;
              </button>
              {onOpenStudentManual && (
                <button
                  type="button"
                  onClick={onOpenStudentManual}
                  className="w-full py-1 text-center text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-sky-600" />
                  <span>คู่มือการใช้งานสำหรับนักศึกษา (.PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. ครูนิเทศ Card */}
          <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-amber-300 transition-all duration-200 p-6 pl-7 flex flex-col justify-between overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#f59e0b] rounded-l-2xl group-hover:w-3 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  ครูนิเทศก์
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                ครูนิเทศ
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                บันทึกการนิเทศ (ฟ.3) ประเมินผล ติดตามสถานประกอบการ แผนที่ GPS
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('teacher')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>เข้าใช้งานทันที (ครูนิเทศ)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('teacher')}
                className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-amber-600 font-medium transition cursor-pointer"
              >
                ระบุบัญชีครูตนเอง &rarr;
              </button>
            </div>
          </div>

          {/* 3. ผู้ดูแลระบบ Card */}
          <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-slate-400 transition-all duration-200 p-6 pl-7 flex flex-col justify-between overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#0f2444] rounded-l-2xl group-hover:w-3 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  สิทธิ์สูงสุด (Admin)
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                ผู้ดูแลระบบ
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                จัดการแบบฟอร์ม ข้อมูลชีต login, Looker Studio แดชบอร์ด และสิทธิ์ทั้งหมด
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('admin')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0f2444] hover:bg-slate-900 text-white font-bold text-xs shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>เข้าสู่ระบบผู้ดูแลระบบ (Admin)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('admin')}
                className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-900 font-medium transition cursor-pointer"
              >
                ระบุบัญชี Admin &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Direct Google Sheets User & Pass Login Card */}
        <section className="mt-8 bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  เข้าสู่ระบบด้วย User & Pass จาก Google Sheets
                </h3>
                <p className="text-xs text-slate-500">
                  อ้างอิงข้อมูลบัญชีชีต <strong>login</strong> (113+ รายชื่อนักศึกษาและครู)
                </p>
              </div>
            </div>

            {/* Google Sign-in Alternative Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>เข้าสู่ระบบด้วย Google Workspace</span>
            </button>
          </div>

          {/* Quick-fill badges for instant access */}
          <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-sky-600" />
              <span>คลิกเพื่อกรอกข้อมูลตัวอย่างทันที (Quick Fill):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleQuickFill(cred.user, cred.pass)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs text-slate-700 font-medium shadow-xs transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    cred.role === 'admin' ? 'bg-emerald-500' : cred.role === 'teacher' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <span className="font-semibold text-slate-800">{cred.roleLabel}:</span>
                  <span className="text-slate-500 font-mono text-[11px]">{cred.user}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleInlineLoginSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User (ชื่อผู้ใช้ / รหัสนักศึกษา / อีเมล)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="เช่น 68301040105 หรือ epkktech@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pass (รหัสผ่าน)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    placeholder="รหัสผ่าน เช่น 68301040105 หรือ 12345678"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>รองรับบัญชีแอดมิน: <strong>epkktech@gmail.com</strong> (รหัส 12345678) และนักศึกษาทุกกลุ่ม</span>
              </div>
              <button
                type="submit"
                disabled={isLoading || !userInput.trim() || !passInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจสอบ...</span>
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ (Sign in)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help & Documentation Note */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>โครงสร้างรหัสผ่านเริ่มต้น:</strong> สำหรับนักศึกษาใช้รหัสนักศึกษา 11 หลักเป็นทั้ง User และ Pass (เช่น <code className="bg-slate-100 px-1 rounded">68301040105</code>) / สำหรับครูและผู้ดูแลระบบ ใช้รหัสผ่าน <code className="bg-slate-100 px-1 rounded">12345678</code>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        ระบบบันทึกข้อมูลการฝึกงาน • แผนกวิชาช่างไฟฟ้ากำลัง วิทยาลัยเทคนิคขอนแก่น
      </footer>
    </div>
  );
};
