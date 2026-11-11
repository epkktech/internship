import { DailyLog, PhotoEvidence, WeeklySubmission } from '../types';

export interface WeekMeta {
  weekNumber: number;
  dateRange: string;
  title: string;
  defaultTask: string;
  tools: string;
  samplePhotos: PhotoEvidence[];
}

export const INTERNSHIP_START_DATE = '19 ต.ค. 2569';
export const ACADEMIC_TERM = 'ภาคเรียนที่ 2 ปีการศึกษา 2569';

export const WEEKS_1_TO_15: WeekMeta[] = [
  {
    weekNumber: 1,
    dateRange: '19 ต.ค. 2569 - 23 ต.ค. 2569',
    title: 'ปฐมนิเทศความปลอดภัย & กฎระเบียบโรงงาน',
    defaultTask: 'ปฐมนิเทศความปลอดภัยโรงงาน เรียนรู้ขั้นตอน Lockout/Tagout (LOTO) และการใช้อุปกรณ์ PPE',
    tools: 'หมวกนิรภัย, แว่นตานิรภัย, รองเท้าเซฟตี้, ชุดกุญแจ LOTO',
    samplePhotos: [
      {
        id: 'p-w1-1',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: การปฐมนิเทศความปลอดภัย',
        caption: 'รับฟังการอบรมความปลอดภัยทางวิศวกรรมร่วมกับหัวหน้าฝ่ายความปลอดภัย'
      },
      {
        id: 'p-w1-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ตรวจเช็กอุปกรณ์ป้องกันภัย PPE',
        caption: 'ตรวจสอบความพร้อมของหมวก รองเท้าเซฟตี้ และถุงมือกันกระแสไฟฟ้า'
      },
      {
        id: 'p-w1-3',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: สาธิตขั้นตอน LOTO',
        caption: 'ฝึกการล็อกและแขวนป้ายเตือนระบบไฟฟ้ากำลัง'
      }
    ]
  },
  {
    weekNumber: 2,
    dateRange: '26 ต.ค. 2569 - 30 ต.ค. 2569',
    title: 'งานตรวจเช็กเครื่องมือวัดทางไฟฟ้า',
    defaultTask: 'ตรวจสอบและสอบเทียบเครื่องมือวัดไฟฟ้า มัลติมิเตอร์ แคลมป์มิเตอร์ และเครื่องวัดความเป็นฉนวน',
    tools: 'Digital Multimeter, Clamp Meter, Insulation Tester',
    samplePhotos: [
      {
        id: 'p-w2-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจสอบความถูกต้องเครื่องวัด',
        caption: 'เทียบค่าแรงดันไฟฟ้ากับแหล่งจ่ายอ้างอิงมาตรฐาน'
      },
      {
        id: 'p-w2-2',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ใช้แคลมป์มิเตอร์วัดกระแส',
        caption: 'วัดกระแสโหลดของมอเตอร์ปั๊มน้ำในกระบวนการผลิต'
      },
      {
        id: 'p-w2-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: บันทึกผลการสอบเทียบ',
        caption: 'ลงบันทึกในแบบฟอร์มตรวจสอบเครื่องมือประจำเดือน'
      }
    ]
  },
  {
    weekNumber: 3,
    dateRange: '2 พ.ย. 2569 - 6 พ.ย. 2569',
    title: 'งานเดินท่อร้อยสายไฟฟ้า EMT และดัดท่อ',
    defaultTask: 'ดัดท่อร้อยสายไฟฟ้า EMT ขนาด 1/2" และ 3/4" ด้วย Hickey Bender ร้อยสายไฟ THW สำหรับแสงสว่าง',
    tools: 'Hickey Bender, Fish Tape, คีมตัดสาย, ระดับน้ำ',
    samplePhotos: [
      {
        id: 'p-w3-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ดัดท่อ EMT โค้ง 90 องศา',
        caption: 'คำนวณและดัดท่อตามแบบแปลนระบบไฟฟ้าโรงงาน'
      },
      {
        id: 'p-w3-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ยึดแคลมป์ท่อกับผนังคอนกรีต',
        caption: 'ติดตั้งแคลมป์ประกับจับท่อตามมาตรฐานระยะยึดไม่เกิน 1 เมตร'
      },
      {
        id: 'p-w3-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ดึงสาย THW เข้าท่อ',
        caption: 'ใช้ฟิชเทปร้อยสายไฟ 3 เส้นเข้าท่ออย่างเรียบร้อย'
      }
    ]
  },
  {
    weekNumber: 4,
    dateRange: '9 พ.ย. 2569 - 13 พ.ย. 2569',
    title: 'งานติดตั้งโคมไฟ LED High Bay & วงจรสวิตช์',
    defaultTask: 'ติดตั้งโคมไฟ LED High Bay 150W บนโครงหลังคาโรงงาน พร้อมเดินสายต่อวงจรสวิตช์ควบคุม',
    tools: 'สว่านไร้สาย, บันไดทรง A, ไขควงลองไฟ, ไขควงหุ้มฉนวน',
    samplePhotos: [
      {
        id: 'p-w4-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ประกอบชุดแขวนโคมไฟ',
        caption: 'ยึดสายสลิงและขั้วต่อกันน้ำ IP65'
      },
      {
        id: 'p-w4-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ต่อสายเข้ากล่อง Junction Box',
        caption: 'ต่อสายไฟด้วย Wire Nut และพันเทปละลายกันความชื้น'
      },
      {
        id: 'p-w4-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ทดสอบเปิดใช้งานวงจร',
        caption: 'ตรวจวัดความสว่างตามเกณฑ์มาตรฐานความปลอดภัย'
      }
    ]
  },
  {
    weekNumber: 5,
    dateRange: '16 พ.ย. 2569 - 20 พ.ย. 2569',
    title: 'งานประกอบและไวร์ริ่งตู้ Consumer Unit',
    defaultTask: 'ติดตั้งเมนเบรกเกอร์ 2P และลูกย่อย RCBO สำหรับวงจรเต้ารับและเครื่องปรับอากาศ',
    tools: 'ไขควงฉนวน VDE, คีมปอกสายไฟ, คีมย้ำหางปลา',
    samplePhotos: [
      {
        id: 'p-w5-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: จัดเรียงลูกย่อยเบรกเกอร์',
        caption: 'แบ่งบาลานซ์โหลดแต่ละเฟสอย่างเหมาะสม'
      },
      {
        id: 'p-w5-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ย้ำหางปลาขั้วต่อสาย',
        caption: 'เข้าสายดิน (PE) และสายนิวทรัล (N) แน่นหนา'
      },
      {
        id: 'p-w5-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ตรวจสอบป้ายชื่อวงจร (Directory)',
        caption: 'ติดป้ายบอกหน้าที่ของลูกย่อยเบรกเกอร์แต่ละตัว'
      }
    ]
  },
  {
    weekNumber: 6,
    dateRange: '23 พ.ย. 2569 - 27 พ.ย. 2569',
    title: 'งานทดสอบความเป็นฉนวน (Insulation Test)',
    defaultTask: 'ใช้เครื่องวัดฉนวน Megger 1000V ทดสอบความต้านทานฉนวนระหว่างเฟสและระหว่างเฟสกับกราวด์',
    tools: 'Insulation Resistance Tester 1000V, ถุงมือยางกันไฟฟ้า',
    samplePhotos: [
      {
        id: 'p-w6-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ต่อสายทดสอบของเมกเกอร์',
        caption: 'คีบสายวัดเข้ากับขั้วบัสบาร์ของตู้สวิตช์บอร์ด'
      },
      {
        id: 'p-w6-2',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: อ่านค่าความต้านทานฉนวน',
        caption: 'ได้ค่ามากกว่า 50 Mega-ohms ตามมาตรฐาน วสท.'
      },
      {
        id: 'p-w6-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: บันทึกรายงานการทดสอบฉนวน',
        caption: 'ลงลายมือชื่อร่วมกับวิศวกรผู้ควบคุม'
      }
    ]
  },
  {
    weekNumber: 7,
    dateRange: '30 พ.ย. 2569 - 4 ธ.ค. 2569',
    title: 'งานทดสอบความต้านทานดินระบบ Grounding',
    defaultTask: 'ตอกหมุดวัดค่าความต้านทานหลักดินด้วย Earth Tester ตรวจสอบค่าความต้านทานหม้อแปลง',
    tools: 'Earth Resistance Tester, หมุดเสริม P และ C, ค้อนตอกหมุด',
    samplePhotos: [
      {
        id: 'p-w7-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตอกหมุดหลักดินเสริมระยะ 5m และ 10m',
        caption: 'ตั้งหมุดแนวเส้นตรงตามหลักการ Fall-of-Potential'
      },
      {
        id: 'p-w7-2',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: วัดค่าความต้านทานดินได้ 3.84 โอห์ม',
        caption: 'ผ่านเกณฑ์มาตรฐานการไฟฟ้า (ไม่เกิน 5 โอห์ม)'
      },
      {
        id: 'p-w7-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ตรวจขันจุดเชื่อมต่อสายดินหม้อแปลง',
        caption: 'ทาน้ำยาป้องกันการกัดกร่อนจุดต่อแท่งกราวด์'
      }
    ]
  },
  {
    weekNumber: 8,
    dateRange: '7 ธ.ค. 2569 - 11 ธ.ค. 2569',
    title: 'งานติดตั้งตู้ Distribution Board (MDB)',
    defaultTask: 'งานติดตั้งตู้ Distribution Board (MDB) & Wiring Control สายวงจรไฟฟ้าโรงงาน ขันแน่นบัสบาร์ 400A',
    tools: 'ประแจปอนด์, เครื่องเป่าลม, โคมไฟส่องตรวจ, Megger Test',
    samplePhotos: [
      {
        id: 'p-w8-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจสอบและขันแน่น Busbar MDB',
        caption: 'งานบำรุงรักษาเชิงป้องกันตู้ไฟฟ้าหลัก'
      },
      {
        id: 'p-w8-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ตรวจวัดค่าความต้านทานดิน',
        caption: 'Earth Resistance Testing ได้ผล 3.84 Ω'
      },
      {
        id: 'p-w8-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: รับมอบหมายงานและทบทวน LOTO',
        caption: 'ร่วมกับนายชาญชัย มงคลศรี พี่เลี้ยงประจำสถานประกอบการ'
      }
    ]
  },
  {
    weekNumber: 9,
    dateRange: '14 ธ.ค. 2569 - 18 ธ.ค. 2569',
    title: 'งานต่อวงจรควบคุมมอเตอร์ Star-Delta',
    defaultTask: 'ต่อสายวงจรควบคุม Magnetic Contactor 3 ตัว สำหรับการสตาร์ทมอเตอร์ 3 เฟสแบบลดกระแส',
    tools: 'ไขควงวัดไฟ, คีมย้ำหางปลา, มัลติมิเตอร์, Timer Relay',
    samplePhotos: [
      {
        id: 'p-w9-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ต่อสายวงจรกำลัง Main-Star-Delta',
        caption: 'เดินสายไฟขนาด 16 sq.mm เข้าแมกเนติกคอนแทกเตอร์'
      },
      {
        id: 'p-w9-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ตั้งเวลาทรานซิชัน Timer Relay',
        caption: 'กำหนดเวลาสลับจาก Star เป็น Delta 5 วินาที'
      },
      {
        id: 'p-w9-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ทดสอบการหมุนของมอเตอร์',
        caption: 'ตรวจสอบทิศทางการหมุนตามลูกศรกำหนด'
      }
    ]
  },
  {
    weekNumber: 10,
    dateRange: '21 ธ.ค. 2569 - 25 ธ.ค. 2569',
    title: 'งานติดตั้ง Magnetic & Overload Relay',
    defaultTask: 'คำนวณและตั้งค่ากระแสตัดวงจรของ Thermal Overload Relay ป้องกันมอเตอร์ไหม้',
    tools: 'ประแจขัน, ไขควงปรับสเกล, แคลมป์มิเตอร์',
    samplePhotos: [
      {
        id: 'p-w10-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตั้งค่ากระแสพิกัดโอเวอร์โหลด',
        caption: 'ตั้งค่าที่ 1.15 เท่าของกระแสพิกัด Full Load'
      },
      {
        id: 'p-w10-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ทดสอบการทริปจำลอง (Trip Test)',
        caption: 'กดปุ่ม Test เพื่อทดสอบกลไกตัดวงจรหน้าสัมผัส NC'
      },
      {
        id: 'p-w10-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ตรวจสอบหลอดไฟแสดงสถานะ Overload',
        caption: 'ไฟสีเหลืองแสดงสถานะทำงานถูกต้อง'
      }
    ]
  },
  {
    weekNumber: 11,
    dateRange: '28 ธ.ค. 2569 - 1 ม.ค. 2570',
    title: 'งานเขียนโปรแกรมควบคุม PLC สายพานลำเลียง',
    defaultTask: 'เขียนบันไดลอจิก (Ladder Logic) เชื่อมต่อ Input/Output เข้ากับบอร์ด PLC และทดสอบการทำงาน',
    tools: 'โน้ตบุ๊กเขียนโปรแกรม PLC, สาย USB-RS485, ดิจิทัลมัลติมิเตอร์',
    samplePhotos: [
      {
        id: 'p-w11-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ออนไลน์ดาวน์โหลดโปรแกรมลง PLC',
        caption: 'ต่อสายสื่อสารส่งโค้ดคำสั่งเข้าหน่วยประมวลผล'
      },
      {
        id: 'p-w11-2',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ตรวจสัญญาณดิจิทัล Input/Output',
        caption: 'ทดสอบเซ็นเซอร์จับชิ้นงานบนสายพาน'
      },
      {
        id: 'p-w11-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ซิวมูเลชันการทำงานจริง',
        caption: 'จำลองสภาวะขัดข้องและตรวจสอบระบบหยุดฉุกเฉิน E-Stop'
      }
    ]
  },
  {
    weekNumber: 12,
    dateRange: '4 ม.ค. 2570 - 8 ม.ค. 2570',
    title: 'งานติดตั้งเซ็นเซอร์อุตสาหกรรม (Sensors)',
    defaultTask: 'ติดตั้งเซ็นเซอร์ตรวจจับแบบ Photoelectric และ Inductive Proximity พร้อมตั้งระยะตรวจจับ',
    tools: 'ประแจปากตาย, ไขควงปรับ Potentiometer, แหล่งจ่าย 24VDC',
    samplePhotos: [
      {
        id: 'p-w12-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ยึดขาจับเซ็นเซอร์ Proximity',
        caption: 'ตั้งระยะห่างจากชิ้นงานโลหะ 8 มิลลิเมตร'
      },
      {
        id: 'p-w12-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ต่อสายไฟเลี้ยงเซ็นเซอร์ 3 สาย',
        caption: 'เชื่อมต่อสาย Brown (+), Blue (-), และ Black (Signal)'
      },
      {
        id: 'p-w12-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ปรับแต่งความไวในการตรวจจับ',
        caption: 'ทดสอบกับชิ้นงานจริงความเร็วรอบปกติ'
      }
    ]
  },
  {
    weekNumber: 13,
    dateRange: '11 ม.ค. 2570 - 15 ม.ค. 2570',
    title: 'งานตรวจเช็ก Capacitor Bank & Power Factor',
    defaultTask: 'ตรวจเช็กชุดคาปาซิเตอร์แบงก์ วัดค่ากระแสแต่ละเฟส และตรวจสอบการทำงานของคอนโทรลเลอร์ PF',
    tools: 'True RMS Clamp Meter, Infrared Thermometer, คีมด้ามฉนวน',
    samplePhotos: [
      {
        id: 'p-w13-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจความร้อนสะสมด้วยกล้องอินฟราเรด',
        caption: 'ไม่พบจุด Overheating ที่ขั้วต่อสายคาปาซิเตอร์'
      },
      {
        id: 'p-w13-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: วัดกระแสไหลผ่านแต่ละสเต็ป',
        caption: 'ตรวจสอบค่ากระแสว่าสมดุลทั้ง 3 เฟส'
      },
      {
        id: 'p-w13-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: อ่านค่า Power Factor รวม',
        caption: 'ได้ค่า 0.96 อยู่ในเกณฑ์มาตรฐานไม่เสียค่าปรับ กฟภ.'
      }
    ]
  },
  {
    weekNumber: 14,
    dateRange: '18 ม.ค. 2570 - 22 ม.ค. 2570',
    title: 'งานติดตั้งระบบ Solar Rooftop & อินเวอร์เตอร์',
    defaultTask: 'ตรวจสอบแผงโซลาร์เซลล์ วัดแรงดัน Voc และ Isc เข้าตู้ Combiner Box และอินเวอร์เตอร์ 3 เฟส',
    tools: 'PV Multimeter, คีมย้ำหัว MC4, ประแจปอนด์ยึดแคลมป์',
    samplePhotos: [
      {
        id: 'p-w14-1',
        url: 'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจสอบหัวต่อสาย MC4 Connector',
        caption: 'ย้ำขั้วสายและตรวจสอบการกันน้ำระดับ IP67'
      },
      {
        id: 'p-w14-2',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: วัดแรงดันเปิดวงจร Voc แต่ละสตริง',
        caption: 'วัดแรงดันได้ 680VDC สม่ำเสมอทุกสตริง'
      },
      {
        id: 'p-w14-3',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: สตาร์ทเครื่องอินเวอร์เตอร์ Grid-Tied',
        caption: 'ตรวจสอบสถานะการขนานไฟเข้าสู่ระบบโรงงาน'
      }
    ]
  },
  {
    weekNumber: 15,
    dateRange: '25 ม.ค. 2570 - 29 ม.ค. 2570',
    title: 'งานทดสอบระบบไฟฟ้าทั้งระบบ (Commissioning)',
    defaultTask: 'ทดสอบการทำงานของระบบไฟฟ้าทั้งหมด สรุปบันทึกเวลาฝึกงานครบ 600 ชม. และจัดทำเอกสารส่งมอบ',
    tools: 'ชุดเครื่องมือวิศวกรรมไฟฟ้าครบชุด, แฟ้มสรุปผลงาน',
    samplePhotos: [
      {
        id: 'p-w15-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจสอบความเรียบร้อยของตู้ควบคุม',
        caption: 'ตรวจเช็กจุดต่อสายทุกจุดและทำความสะอาดครั้งสุดท้าย'
      },
      {
        id: 'p-w15-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: สรุปผลการประเมินกับพี่เลี้ยง',
        caption: 'รับฟังคำแนะนำและข้อเสนอแนะในการปฏิบัติงานวิชาชีพ'
      },
      {
        id: 'p-w15-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ถ่ายภาพความสำเร็จร่วมกับทีมวิศวกร',
        caption: 'เสร็จสิ้นการฝึกประสบการณ์วิชาชีพช่างไฟฟ้ากำลัง แผนกวิชาช่างไฟฟ้ากำลัง'
      }
    ]
  },
  {
    weekNumber: 16,
    dateRange: '1 ก.พ. 2570 - 5 ก.พ. 2570',
    title: 'งานตรวจบำรุงรักษาหม้อแปลงไฟฟ้าจำหน่าย & ทดสอบน้ำมันฉนวน',
    defaultTask: 'ตรวจสอบหม้อแปลงไฟฟ้าจำหน่าย 22kV สุ่มเก็บตัวอย่างน้ำมันหม้อแปลงทดสอบค่าความคงทนไดอิเล็กทริก (Breakdown Voltage) และตรวจวัดอุณหภูมิขดลวด',
    tools: 'Oil Breakdown Voltage Tester, Torque Wrench, อินฟราเรดเทอร์โมมิเตอร์, ถุงมือฉนวนแรงสูง',
    samplePhotos: [
      {
        id: 'p-w16-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจเช็กระดับน้ำมันและสารดูดความชื้น Silica Gel',
        caption: 'ตรวจสอบสีของซิลิกาเจลและระดับน้ำมันในถังพักหม้อแปลง 22kV'
      },
      {
        id: 'p-w16-2',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: สุ่มเก็บน้ำมันทดสอบ Breakdown Voltage',
        caption: 'ทดสอบค่าความเป็นฉนวนของน้ำมันหม้อแปลงได้ 35 kV/2.5mm ผ่านเกณฑ์'
      },
      {
        id: 'p-w16-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ขันแน่นขั้ว Bushing แรงสูงและแรงต่ำ',
        caption: 'ใช้ประแจปอนด์กวดขันขั้วต่อสายเคเบิลตามค่าแรงบิดมาตรฐาน วสท.'
      }
    ]
  },
  {
    weekNumber: 17,
    dateRange: '8 ก.พ. 2570 - 12 ก.พ. 2570',
    title: 'งานระบบควบคุมอัตโนมัติ SCADA & IoT Energy Monitoring',
    defaultTask: 'ติดตั้งและคอนฟิก Digital Power Meter เชื่อมต่อระบบสื่อสาร Modbus RTU ผ่านเครือข่าย Industrial IoT รายงานค่า kW, kWh, Power Factor ขึ้นจอแดชบอร์ด SCADA',
    tools: 'Digital Power Meter, RS-485 to Ethernet Converter, คอมพิวเตอร์ตั้งค่าโปรแกรม SCADA, ไขควงหุ้มฉนวน',
    samplePhotos: [
      {
        id: 'p-w17-1',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ไวร์ริ่งสายสัญญาณสื่อสาร RS-485 Modbus',
        caption: 'ต่อสายชีลด์คู่บิดเกลียว (STP) จากมิเตอร์เข้าตู้เกตเวย์ IoT'
      },
      {
        id: 'p-w17-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: ตั้งค่า Baud Rate และ Slave ID มิเตอร์',
        caption: 'กำหนดค่าพารามิเตอร์การสื่อสาร 9600 bps, Parity None ให้ตรงกับระบบ'
      },
      {
        id: 'p-w17-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ทดสอบการแสดงผล Real-time บนระบบ SCADA',
        caption: 'ตรวจสอบค่ากระแส แรงดัน และพลังงานไฟฟ้าที่บันทึกขึ้นฐานข้อมูลคลาวด์'
      }
    ]
  },
  {
    weekNumber: 18,
    dateRange: '15 ก.พ. 2570 - 19 ก.พ. 2570',
    title: 'งานสรุปประเมินผลการฝึกอาชีพ จัดทำแฟ้มรายงานวิชาชีพ & นำเสนอผลงาน',
    defaultTask: 'รวบรวมเวลาฝึกงานครบ 720 ชั่วโมง จัดทำแฟ้มสะสมผลงาน (Portfolio) ฉบับสมบูรณ์ ส่งมอบแบบประเมิน ฟ.1-ฟ.3 ต่อพี่เลี้ยงและครูนิเทศก์ พร้อมนำเสนอผลงานวิชาชีพ',
    tools: 'แฟ้มเอกสารบันทึกการฝึกอาชีพ ฟ.1, ฟ.2, ฟ.3, รายงานสรุปเล่มสมบูรณ์, สไลด์นำเสนอ',
    samplePhotos: [
      {
        id: 'p-w18-1',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 1: ตรวจสอบความถูกต้องของแบบบันทึก ฟ.1-ฟ.3',
        caption: 'รวบรวมลายมือชื่อพี่เลี้ยงประจำสถานประกอบการและครูนิเทศก์ครบถ้วน'
      },
      {
        id: 'p-w18-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 2: นำเสนอสรุปโครงงานวิชาชีพและผลการฝึกงาน',
        caption: 'นำเสนอทักษะการปฏิบัติงานจริงและปัญหาที่ได้แก้ไขตลอด 18 สัปดาห์'
      },
      {
        id: 'p-w18-3',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        title: 'ภาพที่ 3: ถ่ายภาพความสำเร็จและรับฟังการประเมินจากผู้บริหาร',
        caption: 'เสร็จสิ้นการฝึกประสบการณ์วิชาชีพ สาขาวิชาช่างไฟฟ้ากำลัง ครบ 18 สัปดาห์ (720 ชม.) สมบูรณ์'
      }
    ]
  }
];

export const WEEKS_1_TO_18: WeekMeta[] = WEEKS_1_TO_15;

/**
 * Computes exact daily dates for each day of the week (Monday - Friday)
 * based on internship start date: 19 ต.ค. 2569 (Monday, October 19, 2026)
 */
export function getWeekDates(weekNum: number): { day: string; dateStr: string; fullDate: string }[] {
  // Start date: Monday, October 19, 2026 (Month index 9 is October)
  const baseStart = new Date(2026, 9, 19);
  const weekStart = new Date(baseStart.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
  
  const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

  return days.map((day, idx) => {
    const d = new Date(weekStart.getTime() + idx * 24 * 60 * 60 * 1000);
    const dayNum = d.getDate();
    const monthStr = thaiMonthsShort[d.getMonth()];
    const yearBE = d.getFullYear() + 543;
    const yearShort = (yearBE % 100).toString().padStart(2, '0');
    return {
      day,
      dateStr: `${dayNum} ${monthStr} ${yearShort}`,
      fullDate: `${dayNum} ${monthStr} ${yearBE}`
    };
  });
}

const WEEKLY_DAILY_BREAKDOWNS: Record<number, string[]> = {
  1: [
    'ปฐมนิเทศความปลอดภัยโรงงาน รับฟังการอบรมขั้นตอนปฏิบัติงานในพื้นที่อันตรายร่วมกับ จป.วิชาชีพ',
    'ตรวจเช็กและทดสอบอุปกรณ์คุ้มครองความปลอดภัยส่วนบุคคล PPE (หมวกนิรภัย, แว่นตา, ถุงมือฉนวน, รองเท้าเซฟตี้)',
    'ฝึกอบรมขั้นตอนการตัดแยกแหล่งจ่ายพลังงานและแขวนป้ายเตือน Lockout/Tagout (LOTO) ระบบไฟฟ้า',
    'สำรวจผังระบบไฟฟ้า แปลนโรงงาน และจุดติดตั้งตู้สวิตช์บอร์ด MDB, DB ภายในสถานประกอบการ',
    'สรุปผลการปฐมนิเทศ ซักซ้อมแผนระงับเหตุฉุกเฉินอัคคีภัยและการปฐมพยาบาลเบื้องต้น CPR'
  ],
  2: [
    'ตรวจสอบและสอบเทียบความเที่ยงตรงของมัลติมิเตอร์ดิจิทัล (Digital Multimeter) กับแหล่งจ่ายไฟมาตรฐาน',
    'ใช้แคลมป์มิเตอร์ (Clamp Meter) ตรวจวัดกระแสไฟฟ้าขณะทำงานของมอเตอร์สายการผลิต',
    'ตรวจสอบเครื่องวัดความเป็นฉนวน (Insulation Tester Megger) ทดสอบการทำงานของสายวัดและแบตเตอรี่',
    'ใช้งานเครื่องวัดลำดับเฟส (Phase Sequence Indicator) ตรวจสอบความถูกต้องของลำดับเฟสระบบ 3 เฟส',
    'จัดทำทะเบียนประวัติและบันทึกผลการบำรุงรักษาเครื่องมือวัดทางไฟฟ้าประจำเดือน'
  ],
  3: [
    'ศึกษาแบบแปลนไฟฟ้าและคำนวณระยะการตัด-ดัดท่อร้อยสายไฟฟ้า EMT ขนาด 1/2" และ 3/4"',
    'ฝึกปฏิบัติการดัดท่อ EMT โค้ง 90 องศา และดัดท่อแบบเยื้อง (Offset Bend) ด้วย Hickey Bender',
    'ติดตั้งรางและแคลมป์ยึดท่อร้อยสายไฟเข้ากับโครงสร้างผนังอาคารตามระยะมาตรฐานความปลอดภัย',
    'ประกอบข้อต่อท่อ EMT และกล่องต่อสายสี่เหลี่ยม (Handy Box / Square Box) ขันแน่นหนา',
    'ใช้ฟิชเทป (Fish Tape) ร้อยสายไฟ THW ขนาด 2.5 sq.mm เข้าท่อและทำความสะอาดพื้นที่'
  ],
  4: [
    'สำรวจตำแหน่งและติดตั้งโครงสร้างยึดโคมไฟ LED High Bay 150W บนโครงหลังคาโรงงาน',
    'เดินสายไฟ THW ขนาด 2.5 sq.mm ผ่านท่อร้อยสายเข้ากล่อง Junction Box โคมไฟ',
    'ประกอบชุดต่อสายขั้วต่อกันน้ำ IP65 และต่อสายดินเข้ากับโครงโคมไฟ LED',
    'เดินสายวงจรสวิตช์ควบคุมแสงสว่าง 2 ทาง และทดสอบระบบการสั่งการเปิด-ปิด',
    'ตรวจวัดค่าความสว่าง (Lux) ในพื้นที่ทำงานด้วย Lux Meter และส่งมอบงาน'
  ],
  5: [
    'จัดเตรียมตู้ Consumer Unit 1 เฟส และ 3 เฟส ตรวจสอบบัสบาร์และจุดต่อสายกราวด์',
    'ติดตั้งเมนเซอร์กิตเบรกเกอร์ (MCCB/MCB) ขนาด 50A และลูกย่อย RCBO สำหรับวงจรเต้ารับ',
    'จัดเรียงสายไฟฟ้าเข้าตู้ให้เป็นระเบียบ แบ่งบาลานซ์โหลดแต่ละเฟส L1, L2, L3 อย่างสมดุล',
    'ย้ำหางปลาและขันแน่นขั้วต่อสายด้วยไขควงฉนวน VDE ตามค่าแรงบิดที่กำหนด',
    'ติดป้ายสติกเกอร์ระบุชื่อวงจรย่อย (Directory Sheet) และทดสอบฟังก์ชันตัดไฟรั่ว'
  ],
  6: [
    'ตัดแยกวงจรไฟฟ้าและทำขั้นตอน Lockout/Tagout ตรวจสอบยืนยันสภาพไร้แรงดันด้วยไขควงลองไฟ',
    'ใช้เครื่องวัดความต้านทานฉนวน Megger 500V/1000V ทดสอบระหว่างตัวนำเฟสกับสายนิวทรัล',
    'ทดสอบความต้านทานฉนวนระหว่างตัวนำเฟสกับสายดิน (Phase to Ground Test)',
    'ทดสอบฉนวนของขดลวดมอเตอร์ 3 เฟสในกระบวนการผลิต ได้ค่ามากกว่า 100 Mega-ohms',
    'บันทึกผลการทดสอบลงในแบบรายงาน Insulation Resistance Test และส่งวิศวกรผู้ควบคุม'
  ],
  7: [
    'สำรวจตำแหน่งบ่อพักหลักดิน (Ground Pit) และตรวจสอบสภาพแท่งหลักดิน Copper Clad Steel',
    'ติดตั้งสายวัดและตอกหมุดทดสอบเสริม P และ C ที่ระยะ 5 เมตร และ 10 เมตร เป็นแนวเส้นตรง',
    'วัดค่าความต้านทานดินด้วย Earth Resistance Tester ด้วยวิธี Fall-of-Potential',
    'อ่านค่าความต้านทานดินได้ 3.84 โอห์ม (เกณฑ์มาตรฐาน วสท. กำหนดไม่เกิน 5 โอห์ม)',
    'ทำความสะอาดขั้วต่อสายดิน ทาน้ำยาป้องกันการกัดกร่อน และปิดฝาบ่อพักเรียบร้อย'
  ],
  8: [
    'ตรวจสอบและซ่อมบำรุงตู้ MDB และ Main Circuit Breaker ตรวจขันจุดต่อสาย Busbar 400A ขันแน่นหนา',
    'เดินท่อร้อยสายไฟ EMT และดึงสาย THW สำหรับระบบส่องสว่าง ดัดท่อ EMT ขนาด 3/4" โค้ง 90 องศา',
    'ทดสอบค่าความต้านทานดินระบบ Grounding (Ground Resistance Test) วัดค่าแท่งกราวด์ร็อดหม้อแปลง',
    'ติดตั้งและตั้งค่าโปรแกรมวงจรควบคุมมอเตอร์ 3 เฟส ด้วย PLC ต่อวงจร Magnetic Contactor',
    'สรุปงานประจำสัปดาห์และการปฏิบัติการความปลอดภัย (LOTO) ปลดสับระบบหม้อแปลงอย่างปลอดภัย'
  ],
  9: [
    'เขียนแบบวงจรกำลังและวงจรควบคุมการสตาร์ทมอเตอร์ 3 เฟส แบบ Star-Delta',
    'ประกอบอุปกรณ์ Magnetic Contactor 3 ตัว (Main, Delta, Star) ลงบนรางปีกนก (DIN Rail)',
    'ไวร์ริ่งสายไฟวงจรควบคุมเชื่อมต่อหน้าสัมผัสช่วย NC/NO เข้ากับ Timer Relay และปุ่มกด Push Button',
    'ต่อสายไฟกำลังขนาด 16 sq.mm จากตู้ควบคุมเข้าขั้วต่อ U1, V1, W1 และ U2, V2, W2 ของมอเตอร์',
    'ทดสอบการสตาร์ทมอเตอร์ ตรวจวัดกระแสช่วง Star และ Delta และวัดรอบการหมุน'
  ],
  10: [
    'อ่านค่าพิกัดกระแสโหลดเต็มที่ (Full Load Current) บน Nameplate ของมอเตอร์ไฟฟ้า',
    'คำนวณและตั้งค่ากระแสตัดวงจรของ Thermal Overload Relay ที่ 1.15 เท่าของกระแสพิกัด',
    'ทดสอบการทริปจำลอง (Trip Test) ของรีเลย์โอเวอร์โหลด ตรวจการตัดวงจรหน้าสัมผัสช่วย 95-96',
    'ต่อวงจรไฟสัญญาณเตือนสถานะ Overload (Pilot Lamp สีเหลือง) และปุ่ม Reset',
    'ทดลองรันมอเตอร์ต่อเนื่อง 2 ชั่วโมง และใช้ปืนวัดอุณหภูมิอินฟราเรดตรวจความร้อนตัวรีเลย์'
  ],
  11: [
    'ศึกษาโฟลว์ชาร์ตและกำหนด Address อินพุต/เอาต์พุต (I/O Mapping) ของระบบสายพานลำเลียง',
    'เขียนโปรแกรมบันไดลอจิก (Ladder Logic Diagram) ด้วยซอฟต์แวร์บนคอมพิวเตอร์',
    'ดาวน์โหลดโปรแกรมลง CPU ของ PLC ผ่านสายสื่อสาร USB/RS-485',
    'ทดสอบสถานะ Input จากเซ็นเซอร์และปุ่มกด Emergency Stop สังเกตไฟ LED บนโมดูล',
    'ทดสอบการควบคุมการทำงานของสายพานตามเงื่อนไขอัตโนมัติและแก้จุดบกพร่อง (Debugging)'
  ],
  12: [
    'เลือกใช้เซ็นเซอร์ตรวจจับแบบ Photoelectric และ Inductive Proximity ตามคุณสมบัติชิ้นงาน',
    'ติดตั้งขายึดเซ็นเซอร์ Proximity บนโครงสายพาน ตั้งระยะห่างการตรวจจับ 8 มม.',
    'ไวร์ริ่งสายไฟเลี้ยง 24VDC (น้ำตาล +, น้ำเงิน -) และสายสัญญาณ (ดำ) เข้าขั้วต่อของ PLC',
    'ปรับแต่งความไว (Sensitivity) ของ Photoelectric Sensor ให้ตรวจจับวัตถุได้อย่างแม่นยำ',
    'ทดสอบการตัดวงจรเมื่อวัตถุเคลื่อนผ่าน และตรวจสอบความเสถียรของสัญญาณดิจิทัล'
  ],
  13: [
    'เปิดตู้ Capacitor Bank เพื่อตรวจเช็กการทำงานของชุด Step Controller และฟิวส์ป้องกัน',
    'ใช้กล้องถ่ายภาพความร้อนอินฟราเรด (Thermal Imager) สแกนจุดต่อสายและตัวเก็บประจุ',
    'ใช้แคลมป์มิเตอร์ True RMS วัดกระแสไฟฟ้าที่ไหลผ่านแต่ละสเต็ป คาปาซิเตอร์ทั้ง 3 เฟส',
    'ตรวจสอบค่าเพาเวอร์แฟกเตอร์ (Power Factor) บนมิเตอร์วัดค่าพลังงานรวมของโรงงาน',
    'ปรับตั้งค่า Target Cos Phi บนคอนโทรลเลอร์ให้รักษาระดับไม่ต่ำกว่า 0.95 เพื่อลดค่าปรับ กฟภ.'
  ],
  14: [
    'ตรวจสอบสภาพแผงโซลาร์เซลล์ Monocrystalline บนหลังคา และตรวจวัดค่าแรงดันเปิดวงจร Voc',
    'เข้าหัวต่อสาย MC4 Connector สำหรับสายไฟ Solar Cable ขนาด 4 sq.mm ขันแน่นกันน้ำ IP68',
    'เดินสาย DC Cable ลงท่อร้อยสายโลหะเข้าตู้ DC Combiner Box และติดตั้งอุปกรณ์ Surge Protection',
    'เชื่อมต่อสาย DC เข้ากับอินเวอร์เตอร์แบบเชื่อมต่อสายส่ง (On-Grid Inverter) 3 เฟส',
    'ทดสอบการทำงานของอินเวอร์เตอร์ ขนานกระแสไฟฟ้าเข้าสู่ระบบและมอนิเตอร์ผ่านแอปพลิเคชัน'
  ],
  15: [
    'ตรวจสอบระบบไฟฟ้าทั้งโรงงาน ตรวจสอบความถูกต้องของการต่อลงดินและฉนวนสายไฟฟ้า',
    'ทดสอบการทำงานของระบบตัดไฟฉุกเฉิน (Emergency Stop) ทั่วทั้งสายการผลิต',
    'ทดสอบการทำงานของเครื่องกำเนิดไฟฟ้าสำรอง (Generator) และสวิตช์โอนย้ายแหล่งจ่ายอัตโนมัติ (ATS)',
    'ร่วมประชุมสรุปผลการทดสอบระบบร่วมกับทีมวิศวกรโรงงานและหัวหน้าฝ่ายบำรุงรักษา',
    'จัดทำเอกสารและลงลายมือชื่อตรวจรับรองการทดสอบระบบไฟฟ้าทั้งระบบ (Commissioning Report)'
  ],
  16: [
    'ตรวจเช็กระดับน้ำมันหม้อแปลงไฟฟ้าจำหน่าย 22kV ในถังพัก และตรวจสีของสารดูดความชื้น Silica Gel',
    'ใช้เครื่องวัดอุณหภูมิอินฟราเรดสแกนขั้วต่อ Bushing แรงสูงและแรงต่ำขณะจ่ายโหลด',
    'สุ่มเก็บตัวอย่างน้ำมันหม้อแปลงใส่ขวดทดสอบที่สะอาด เพื่อนำไปตรวจวัดค่า Breakdown Voltage',
    'ทดสอบค่าความคงทนไดอิเล็กทริกของน้ำมันด้วยเครื่อง Oil Breakdown Tester ได้ค่า 35 kV/2.5mm ผ่านเกณฑ์',
    'ใช้ประแจปอนด์กวดขันจุดต่อสายเคเบิลเข้าขั้ว Bushing ตามค่าแรงบิดมาตรฐาน วสท.'
  ],
  17: [
    'ติดตั้งชุดมิเตอร์วัดพลังงานดิจิทัล (Digital Power Meter) บนหน้าตู้สวิตช์บอร์ด MDB',
    'ไวร์ริ่งสายสัญญาณสื่อสารคู่บิดเกลียวชีลด์ (STP) RS-485 เชื่อมต่อโปรโตคอล Modbus RTU',
    'กำหนดค่า Address, Baud Rate 9600 bps, Parity และตั้งค่าอัตราทดของ Current Transformer (CT Ratio)',
    'ต่อสายสัญญาณเข้ากับ Industrial IoT Gateway เพื่อส่งข้อมูลขึ้นสู่คลาวด์เซิร์ฟเวอร์',
    'ทดสอบการแสดงผลแดชบอร์ด SCADA ค่า kW, kWh, แรงดัน กระแส และ PF แบบ Real-time บนคอมพิวเตอร์'
  ],
  18: [
    'รวบรวมและตรวจสอบความครบถ้วนของบันทึกเวลาปฏิบัติงานครบ 18 สัปดาห์ (720 ชั่วโมง)',
    'รวบรวมแบบประเมินผลการฝึกอาชีพ ฟ.1, ฟ.2, ฟ.3 พร้อมภาพถ่ายหลักฐานการทำงาน 54 รายการ',
    'จัดทำแฟ้มสะสมผลงานวิชาชีพช่างไฟฟ้ากำลัง (Vocational Internship Portfolio) ฉบับสมบูรณ์',
    'นำเสนอผลการฝึกประสบการณ์วิชาชีพ โครงงานที่รับผิดชอบ และองค์ความรู้ที่ได้รับต่อคณะกรรมการ',
    'รับฟังผลการประเมินและคำแนะนำจากพี่เลี้ยงสถานประกอบการ และส่งมอบพื้นที่ปฏิบัติงานเรียบร้อย'
  ]
};

export function getDefaultDailyLogsForWeek(weekNum: number): DailyLog[] {
  const meta = WEEKS_1_TO_18.find(w => w.weekNumber === weekNum) || WEEKS_1_TO_18[0];
  const dates = getWeekDates(weekNum);
  const breakdowns = WEEKLY_DAILY_BREAKDOWNS[weekNum] || [
    `${meta.defaultTask} (ช่วงเช้า: ตรวจสอบอุปกรณ์และเตรียมความพร้อม)`,
    `${meta.defaultTask} (ช่วงปฏิบัติการ: ดำเนินงานตามขั้นตอนมาตรฐานความปลอดภัย)`,
    `${meta.defaultTask} (ช่วงตรวจวัด: ใช้เครื่องมือวัดทางไฟฟ้าตรวจสอบความถูกต้อง)`,
    `${meta.defaultTask} (ช่วงปรับแต่ง: ทดสอบการทำงานร่วมกับระบบย่อย)`,
    `${meta.defaultTask} (ช่วงสรุปผล: บันทึกข้อมูลและทำความสะอาด 5ส.)`
  ];

  return dates.map((d, idx) => ({
    id: `log-w${weekNum}-${idx + 1}`,
    day: d.day,
    date: d.dateStr,
    taskDescription: breakdowns[idx] || `${meta.defaultTask} (วันที่ ${idx + 1})`,
    toolsUsed: meta.tools,
    hours: 8.0,
    evaluation: 'ผ่าน (ดีเยี่ยม)'
  }));
}

/**
 * Generate full, realistic 18 weekly submissions (Weeks 1 to 18) for any student
 */
export function generateAll18WeeklySubmissions(
  studentId: string,
  studentName = 'นายเจษฎาภรณ์ พลเรือง',
  companyName = 'การไฟฟ้าส่วนภูมิภาค สาขาขอนแก่น (PEA Khon Kaen)'
): WeeklySubmission[] {
  const currentWeek = getCurrentWeekInfo().weekNumber;

  return WEEKS_1_TO_18.map((meta) => {
    const wNum = meta.weekNumber;
    const isCompleted = wNum <= Math.max(8, currentWeek);
    const dates = getWeekDates(wNum);
    const startStr = dates[0].dateStr;
    const endStr = dates[4].dateStr;

    // Realistic teacher evaluations
    const scores = [19.5, 19.0, 18.5, 19.5, 18.5, 19.0, 19.5, 19.5, 19.0, 19.0, 19.5, 19.0, 19.0, 19.5, 19.5, 19.0, 19.5, 20.0];
    const score = scores[wNum - 1] || 19.0;
    const grade = score >= 19.5 ? 'ดีเยี่ยม (A)' : score >= 18.5 ? 'ดีมาก (B+)' : 'ดี (B)';

    return {
      id: `sub-${studentId}-w${wNum}`,
      studentId: studentId,
      weekNumber: wNum,
      dateRange: `${startStr} - ${endStr}`,
      submittedAt: `${endStr} (17:30 น.)`,
      status: isCompleted ? ('graded' as const) : ('pending' as const),
      taskTitle: meta.title,
      totalHours: 40.0,
      mentorRating: 5.0,
      mentorComment: `นักศึกษาปฏิบัติงานได้ดีเยี่ยม มีความปลอดภัยตามมาตรฐาน ${companyName} ตรงต่อเวลาและมีความรับผิดชอบสูง`,
      mentorName: 'นายชาญชัย มงคลศรี',
      mentorPosition: 'วิศวกรไฟฟ้า / พี่เลี้ยงประจำสถานประกอบการ',
      teacherScore: score,
      teacherGrade: grade,
      teacherComment: `บันทึกข้อมูลและแนบภาพถ่ายหน้างานสัปดาห์ที่ ${wNum} ชัดเจน มีความรู้ความเข้าใจทักษะวิชาชีพช่างไฟฟ้ากำลังอย่างแท้จริง`,
      teacherName: 'นายทักษิณ โสภาปิยะ',
      studentSignature: studentName,
      mentorSignature: 'ชาญชัย มงคลศรี',
      teacherSignature: 'ทักษิณ โสภาปิยะ',
      verifiedHash: `KKTECH-2569-W${wNum.toString().padStart(2, '0')}-VERIFIED`,
      safetyChecklist: {
        hardHat: true,
        highVoltageGloves: true,
        safetyShoes: true,
        lotoProcedure: true
      },
      dailyLogs: getDefaultDailyLogsForWeek(wNum),
      photos: meta.samplePhotos
    };
  });
}

/**
 * คำนวณสัปดาห์ฝึกงานปัจจุบัน (1 - 18) อ้างอิงจากสัปดาห์ของเวลาปัจจุบัน (Real-time Date)
 */
export function getCurrentWeekInfo(currentDate: Date = new Date()) {
  const now = new Date(currentDate);
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth(); // 0 = Jan, 9 = Oct

  // กำหนดวันเริ่มต้นของภาคเรียน (เทอม 1 หรือ เทอม 2)
  let baseTermStart: Date;
  let termLabel = '';

  if (nowMonth >= 4 && nowMonth <= 8) {
    // ภาคเรียนที่ 1 (พฤษภาคม - กันยายน)
    baseTermStart = new Date(nowYear, 4, 18);
    const day = baseTermStart.getDay();
    const diff = baseTermStart.getDate() - day + (day === 0 ? -6 : 1);
    baseTermStart.setDate(diff);
    baseTermStart.setHours(0, 0, 0, 0);
    termLabel = `ภาคเรียนที่ 1/${nowYear + 543}`;
  } else {
    // ภาคเรียนที่ 2 (ตุลาคม - มีนาคม)
    const termYear = nowMonth <= 3 ? nowYear - 1 : nowYear;
    baseTermStart = new Date(termYear, 9, 19); // 19 ต.ค. (วันจันทร์)
    const day = baseTermStart.getDay();
    const diff = baseTermStart.getDate() - day + (day === 0 ? -6 : 1);
    baseTermStart.setDate(diff);
    baseTermStart.setHours(0, 0, 0, 0);
    termLabel = `ภาคเรียนที่ 2/${termYear + 543}`;
  }

  // คำนวณจำนวนสัปดาห์ที่ผ่านไปจากวันเริ่มต้น
  const diffMs = now.getTime() - baseTermStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  let calculatedWeek = Math.floor(diffDays / 7) + 1;

  // จำกัดขอบเขตให้อยู่ในช่วง 1 - 18 สัปดาห์
  if (calculatedWeek < 1) calculatedWeek = 1;
  if (calculatedWeek > 18) calculatedWeek = 18;

  // คำนวณวันที่เริ่มต้นและสิ้นสุดของสัปดาห์นี้
  const weekStart = new Date(baseTermStart.getTime() + (calculatedWeek - 1) * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000); // วันศุกร์

  const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const startDay = weekStart.getDate();
  const startMonth = thaiMonthsShort[weekStart.getMonth()];
  const endDay = weekEnd.getDate();
  const endMonth = thaiMonthsShort[weekEnd.getMonth()];
  const yearBE = weekEnd.getFullYear() + 543;

  const dateRangeStr = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${yearBE}`;
  const progressPercent = Math.min(100, Math.round((calculatedWeek / 18) * 100));

  return {
    weekNumber: calculatedWeek,
    totalWeeks: 18,
    dateRange: dateRangeStr,
    termLabel,
    progressPercent,
  };
}

