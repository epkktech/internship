import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { AuthUser } from '../../types';
import { 
  authenticateWithGoogleSheet,
  QUICK_DEMO_CREDENTIALS
} from '../../services/sheetAuthService';
import { 
  saveAuthUser, 
  quickLoginAsPreset, 
  signInWithGoogleWorkspace 
} from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: 'student' | 'teacher' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialRole = 'student',
}) => {
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessUser(null);
      setUserInput('');
      setPassInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle User & Pass authentication against Google Sheet login tab
  const handleSheetLoginSubmit = async (e: React.FormEvent) => {
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

      const user = result.user;
      saveAuthUser(user);
      setSuccessUser(user);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์');
    }
  };

  const handleQuickPresetLogin = (role: 'student' | 'teacher' | 'admin') => {
    const user = quickLoginAsPreset(role);
    setSuccessUser(user);
    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogleWorkspace();
      setIsGoogleLoading(false);
      setSuccessUser(user);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 400);
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMsg(err.message || 'ไม่สามารถลงชื่อเข้าใช้ด้วย Google ได้');
    }
  };

  const roleInfo = {
    student: {
      label: 'นักศึกษาฝึกงาน',
      color: 'bg-blue-500/25 text-blue-300 border-blue-400/40',
      sample: '68301040105',
      samplePass: '68301040105',
      name: 'นายเจษฎาภรณ์ พลเรือง (ปวส.2/1)'
    },
    teacher: {
      label: 'ครูนิเทศก์',
      color: 'bg-amber-500/25 text-amber-300 border-amber-400/40',
      sample: 'thaksinso@kktech.ac.th',
      samplePass: '12345678',
      name: 'นายทักษิณ โสภาปิยะ'
    },
    admin: {
      label: 'ผู้ดูแลระบบ',
      color: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
      sample: 'epkktech@gmail.com',
      samplePass: '12345678',
      name: 'นายทักษิณ โสภาปิยะ (Admin)'
    },
  }[initialRole || 'student'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
              <img
                src="./assets/aistudio/unnamed_54baf6fc.jpg"
                alt="KKTECH Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>เข้าสู่ระบบ</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                สาขาไฟฟ้ากำลัง วิทยาลัยเทคนิคขอนแก่น
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Current Logged-in Banner if exists */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.initials}
                </span>
                <div>
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-700 font-medium">เข้าใช้งานอยู่: {currentUser.email} ({currentUser.role})</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800">
                สถานะเชื่อมต่อ
              </span>
            </div>
          )}

          {/* Quick One-Click Entry Button */}
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>เข้าใช้งานทันที (One-Click Login)</span>
              </span>
              <span className="text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md font-medium">
                {roleInfo.label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickPresetLogin(initialRole || 'student')}
              className="w-full py-2.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>เข้าใช้งานทันทีในบทบาท {roleInfo.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Success Banner */}
          {successUser && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">เข้าสู่ระบบสำเร็จ!</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  ยินดีต้อนรับ {successUser.name} • สถานะ: <strong className="text-emerald-700">{successUser.role}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Form for user and pass from Google Sheet */}
          <form onSubmit={handleSheetLoginSubmit} className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700">
                User (ชื่อผู้ใช้ / รหัสนักศึกษา / อีเมล)
              </label>
              <button
                type="button"
                onClick={() => {
                  setUserInput(roleInfo.sample);
                  setPassInput(roleInfo.samplePass);
                  setErrorMsg(null);
                }}
                className="text-[11px] text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                <span>เติมค่าตัวอย่าง</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`เช่น ${roleInfo.sample}`}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pass (รหัสผ่าน)
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder={`เช่น ${roleInfo.samplePass}`}
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !userInput.trim() || !passInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบด้วยรหัสผ่าน</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign-in button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
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
              <span>เข้าสู่ระบบด้วย Google (@kktech.ac.th / epkktech@gmail.com)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
