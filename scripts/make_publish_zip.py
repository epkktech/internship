import os
import zipfile
import shutil
import datetime

def build_zip():
    dist_dir = 'dist'
    zip_path = 'public/appserv_publish.zip'

    # Ensure dist exists
    if not os.path.exists(dist_dir):
        print("dist directory does not exist yet. Please run build first.")
        return

    # 1. Ensure .htaccess in dist (Supports BOTH root domain and any subfolder like /internship/)
    htaccess_content = """# Apache configuration for KKTECH Power Internship Portal
# Supports both Root directory and any Subfolder deployment (AppServ / XAMPP / Apache)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
</IfModule>

# MIME type headers for modern web assets
<IfModule mod_mime.c>
  AddType application/javascript .js .mjs
  AddType text/css .css
  AddType application/json .json
  AddType image/svg+xml .svg
  AddType image/webp .webp
  AddType font/woff .woff
  AddType font/woff2 .woff2
</IfModule>

# Caching rules for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
"""
    with open(os.path.join(dist_dir, '.htaccess'), 'w', encoding='utf-8') as f:
        f.write(htaccess_content)

    # 2. IIS web.config for Windows Server
    web_config_content = """<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".webp" />
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="font/woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
  </system.webServer>
</configuration>
"""
    with open(os.path.join(dist_dir, 'web.config'), 'w', encoding='utf-8') as f:
        f.write(web_config_content)

    # 3. Nginx configuration sample for Linux
    nginx_sample_content = """# Nginx Server Block Configuration Sample
# Place this in /etc/nginx/sites-available/kktech-internship and symlink to /etc/nginx/sites-enabled/

server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;

    # SPA routing fallback: send all non-file routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
"""
    with open(os.path.join(dist_dir, 'nginx_sample.conf'), 'w', encoding='utf-8') as f:
        f.write(nginx_sample_content)

    # 4. Zero-dependency Standalone Node.js Server
    server_cjs_content = """/**
 * Standalone Web Server for KKTECH Internship Portal
 * Zero external dependencies (uses Node.js built-in http, fs, path, url)
 * Run with: node server.cjs
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '80', 10);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === '/') pathname = '/index.html';

  let filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const ext = path.extname(pathname);
      if (!ext || ext === '.html') {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (indexErr, content) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          res.end(content);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isStaticAsset = pathname.startsWith('/assets/');
    const cacheControl = isStaticAsset 
      ? 'public, max-age=31536000, immutable' 
      : 'no-cache, no-store, must-revalidate';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log('  KKTECH Power Internship Web Server Running!');
  console.log(`  Local URL:   http://localhost${PORT === 80 ? '' : ':' + PORT}/`);
  console.log(`  Port:        ${PORT}`);
  console.log('  Press Ctrl+C to stop the server');
  console.log('================================================================');
});
"""
    with open(os.path.join(dist_dir, 'server.cjs'), 'w', encoding='utf-8') as f:
        f.write(server_cjs_content)

    # 5. Windows 1-Click Launchers (start_server.bat)
    bat_content = """@echo off
chcp 65001 >nul
title KKTECH Internship Web Server Launcher
echo ========================================================
echo   KKTECH Power Internship Web Portal
echo   ระบบสารสนเทศการฝึกงานและนิเทศ แผนกวิชาช่างไฟฟ้ากำลัง
echo ========================================================
echo.
echo กำลังเริ่มต้น Web Server ภายในเครื่องของคุณ...
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] ตรวจพบ Node.js - เริ่มรัน server.cjs บนพอร์ต 80 หรือ 3000
    node server.cjs
    goto end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] ตรวจพบ Python - เริ่มรัน HTTP Server บนพอร์ต 80
    python -m http.server 80 2>nul || python -m http.server 8080
    goto end
)

echo [คำแนะนำ] กรุณาวางโฟลเดอร์นี้ใน C:\\AppServ\\www\\ หรือ C:\\xampp\\htdocs\\ เพื่อเปิดใช้งาน
pause

:end
"""
    with open(os.path.join(dist_dir, 'start_server.bat'), 'w', encoding='utf-8') as f:
        f.write(bat_content)

    # 6. Copy latest data files to dist/data
    data_dir = 'src/data'
    dist_data_dir = os.path.join(dist_dir, 'data')
    if os.path.exists(data_dir):
        os.makedirs(dist_data_dir, exist_ok=True)
        for df in os.listdir(data_dir):
            if df.endswith('.json'):
                shutil.copy2(os.path.join(data_dir, df), os.path.join(dist_data_dir, df))

    # 7. Thai Installation Guide (คู่มือติดตั้ง_WEB_SERVER_จริง.txt)
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    manual_content = f"""======================================================================
คู่มือการติดตั้งระบบบันทึกข้อมูลการฝึกงาน แผนกวิชาช่างไฟฟ้ากำลัง วท.ขอนแก่น
สำหรับนำไปติดตั้งและรันบน Web Server จริง (Production Web Server)
อัปเดตข้อมูลล่าสุด: {now_str} | สัปดาห์ที่ 1 - 18
GitHub Repository: https://github.com/epkktech
======================================================================

ไฟล์ในแพ็กเกจนี้ได้รับการ Build และรวบรวมข้อมูลล่าสุดจากฐานข้อมูล Google Cloud
Firebase Firestore (internship2-2569) และ Google Sheets เรียบร้อยแล้ว

----------------------------------------------------------------------
วิธีที่ 1: ติดตั้งบน AppServ (Windows PC / Windows Server) - แนะนำมากที่สุด
----------------------------------------------------------------------
1. คัดลอกไฟล์และโฟลเดอร์ทั้งหมดใน zip นี้ ไปวางในโฟลเดอร์ www ของ AppServ
   - แบบวางที่ Root: C:\\AppServ\\www\\
     (ให้ไฟล์ index.html อยู่ที่ C:\\AppServ\\www\\index.html)
   - แบบวางในโฟลเดอร์ย่อย: C:\\AppServ\\www\\internship\\
2. เปิดโปรแกรม AppServ หรือตรวจสอบว่า Apache Service กำลังทำงาน (Running)
3. เปิดเว็บบราวเซอร์ (Chrome, Edge) แล้วพิมพ์ URL:
   - กรณีวางที่ Root: http://localhost/ หรือ http://[IP_เครื่อง_Server]/
   - กรณีวางในโฟลเดอร์ย่อย: http://localhost/internship/
4. ระบบมีไฟล์ .htaccess บรรจุมาเรียบร้อย รองรับการ Refresh หน้าเว็บได้ทุกหน้า

----------------------------------------------------------------------
วิธีที่ 2: ติดตั้งบน XAMPP (Windows PC / Windows Server)
----------------------------------------------------------------------
1. คัดลอกไฟล์และโฟลเดอร์ทั้งหมดไปวางที่:
   - C:\\xampp\\htdocs\\ (Root)
   - หรือ C:\\xampp\\htdocs\\internship\\ (โฟลเดอร์ย่อย)
2. เปิด XAMPP Control Panel แล้วกด Start ที่โมดูล Apache
3. เปิดบราวเซอร์เข้าสู่ http://localhost/ หรือ http://localhost/internship/

----------------------------------------------------------------------
วิธีที่ 3: ติดตั้งบน Linux Server (Ubuntu / Debian / CentOS / Rocky Linux)
----------------------------------------------------------------------
[กรณีใช้ Apache]:
1. นำไฟล์ทั้งหมดไปวางใน: /var/www/html/
2. เปิดใช้งาน mod_rewrite:
   sudo a2enmod rewrite
   sudo systemctl restart apache2

[กรณีใช้ Nginx]:
1. นำไฟล์ทั้งหมดไปวางใน: /var/www/html/ (หรือ /usr/share/nginx/html/)
2. นำการตั้งค่าจากไฟล์ nginx_sample.conf ไปใส่ใน Server Block
3. รันคำสั่งตรวจสอบและรีโหลด Nginx:
   sudo nginx -t && sudo systemctl reload nginx

----------------------------------------------------------------------
วิธีที่ 4: รันแบบ Standalone ด้วย Node.js (ไม่ต้องติดตั้ง Apache/PHP)
----------------------------------------------------------------------
1. ดับเบิลคลิกไฟล์ start_server.bat (บน Windows)
2. หรือเปิด Command Prompt / Terminal ในโฟลเดอร์นี้ แล้วพิมพ์:
   node server.cjs
3. หน้าเว็บจะเปิดทำงานบนพอร์ต 80 (http://localhost/) ทันที

----------------------------------------------------------------------
วิธีที่ 5: ติดตั้งบน Microsoft IIS (Windows Server)
----------------------------------------------------------------------
1. นำไฟล์ทั้งหมดไปวางใน C:\\inetpub\\wwwroot\\
2. ระบบมีไฟล์ web.config บรรจุมาพร้อมแล้ว รองรับ URL Rewrite ทันที

======================================================================
ระบบเชื่อมโยงฐานข้อมูล:
- Google Cloud Firebase Firestore: internship2-2569 (ซิงค์เรียลไทม์)
- Google Sheets กลาง: 1wQWPpmbFof8HFZjofYz9DKWAYWpe9NngeUUCFdVVt28
- แผนกวิชาช่างไฟฟ้ากำลัง อาคาร 8 ชั้น 3 วิทยาลัยเทคนิคขอนแก่น
- โทร: 043-221290 ต่อ 8002 | Email: electric@kktech.ac.th
======================================================================
"""
    with open(os.path.join(dist_dir, 'คู่มือติดตั้ง_WEB_SERVER_จริง.txt'), 'w', encoding='utf-8') as f:
        f.write(manual_content)

    with open(os.path.join(dist_dir, 'README_INSTALL.txt'), 'w', encoding='utf-8') as f:
        f.write(manual_content)

    # 8. Build info
    with open(os.path.join(dist_dir, 'build_info.txt'), 'w', encoding='utf-8') as f:
        f.write(f"KKTECH Internship Web Server Production Package\nUpdated: {now_str}\nWeeks: 1 - 18\nSystem: Vocational Internship Management Portal\nGitHub: https://github.com/epkktech\n")

    # 9. Also put config files into docs directory for GitHub Pages
    if os.path.exists('docs'):
        with open(os.path.join('docs', '.htaccess'), 'w', encoding='utf-8') as f:
            f.write(htaccess_content)
        with open(os.path.join('docs', 'web.config'), 'w', encoding='utf-8') as f:
            f.write(web_config_content)
        with open(os.path.join('docs', 'README_INSTALL.txt'), 'w', encoding='utf-8') as f:
            f.write(manual_content)
        with open(os.path.join('docs', 'คู่มือติดตั้ง_WEB_SERVER_จริง.txt'), 'w', encoding='utf-8') as f:
            f.write(manual_content)

    # 10. Write zip file
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz'):
                    continue
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, dist_dir)
                zipf.write(full_path, arcname)

    size = os.path.getsize(zip_path)
    print(f"Zip created successfully: {zip_path} ({size:,} bytes)")

    # Also copy zip to docs for GitHub Pages hosting
    if os.path.exists('docs'):
        shutil.copy2(zip_path, 'docs/appserv_publish.zip')
        print("Copied zip to docs/appserv_publish.zip")
    
    # Also copy to root appserv_publish.zip
    shutil.copy2(zip_path, 'appserv_publish.zip')
    print("Copied zip to root appserv_publish.zip")

    # Also create webserver_production.zip as an alias
    shutil.copy2(zip_path, 'public/webserver_production.zip')
    shutil.copy2(zip_path, 'webserver_production.zip')
    if os.path.exists('docs'):
        shutil.copy2(zip_path, 'docs/webserver_production.zip')
    print("Created webserver_production.zip aliases")

if __name__ == '__main__':
    build_zip()
