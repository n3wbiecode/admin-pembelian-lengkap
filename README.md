# Panduan Lengkap: Admin Pembelian

Website ini adalah sistem manajemen pembelian (purchasing management) yang dibangun dengan Node.js, Express, dan MySQL. Panduan ini akan membantu Anda menginstal, mengkonfigurasi, dan menjalankan aplikasi.

## 📋 Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Instalasi](#instalasi)
3. [Konfigurasi Database](#konfigurasi-database)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Cara Penggunaan](#cara-penggunaan)
6. [Struktur Folder](#struktur-folder)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prasyarat

Sebelum menginstal, pastikan Anda sudah memiliki:

1. **Node.js** (versi 14 atau lebih tinggi)
   - Download: https://nodejs.org/
   - Verifikasi instalasi:
     ```powershell
     node --version
     npm --version
     ```

2. **XAMPP** (atau MySQL Server standalone)
   - Download: https://www.apachefriends.org/
   - Gunakan MySQL yang disediakan XAMPP atau install MySQL terpisah

3. **Text Editor / IDE** (opsional, tapi recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - Sublime Text atau editor favorit Anda

4. **Git** (opsional, untuk version control)
   - Download: https://git-scm.com/

---

## 📦 Instalasi

### Langkah 1: Pastikan XAMPP Sudah Running

1. Buka XAMPP Control Panel
2. Klik tombol **Start** untuk Apache dan MySQL
3. Pastikan keduanya berjalan dengan baik (tulisan "Running" berwarna hijau)

### Langkah 2: Navigasi ke Folder Project

```powershell
cd C:\xampp\htdocs\admin-pembelian-lengkap
```

### Langkah 3: Install Dependencies

Instal semua package yang diperlukan menggunakan npm:

```powershell
npm install
```

Tunggu sampai proses selesai. Anda akan melihat folder `node_modules` tercipta.

**Dependencies yang akan diinstal:**
- `express` - Web framework
- `ejs` - Template engine untuk HTML dinamis
- `express-ejs-layouts` - Layout support untuk EJS
- `mysql2` - MySQL database driver
- `bcrypt` - Password encryption
- `body-parser` - Parse request body
- `express-session` - Session management

---

## 🗄️ Konfigurasi Database

### Langkah 1: Buka phpMyAdmin

1. Buka browser dan akses: `http://localhost/phpmyadmin`
2. Login dengan username `root` (password kosong, jika default XAMPP)

### Langkah 2: Buat Database

```sql
CREATE DATABASE toko_db;
USE toko_db;
```

### Langkah 3: Buat Tabel

Jalankan query SQL berikut untuk membuat struktur tabel:

```sql
-- Tabel Admin/Users
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Products
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Purchases
CREATE TABLE purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Buat user admin default (password: admin123)
INSERT INTO admins (username, password, email) 
VALUES ('admin', 'admin123', 'admin@toko.com');
```

**Catatan:** Untuk kemudahan pengujian, password admin disimpan dalam bentuk plain text. Untuk produksi, sangat disarankan menggunakan hash bcrypt untuk keamanan.

### Langkah 4: Verifikasi Koneksi Database

Pastikan file `config/db.js` sudah sesuai dengan konfigurasi MySQL Anda:

```javascript
const mysql = require('mysql2');
module.exports = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',          // Sesuaikan dengan password MySQL Anda
  database: 'toko_db'
});
```

---

## 🚀 Menjalankan Aplikasi

### Cara 1: Menggunakan NPM (Recommended)

```powershell
npm start
```

Server akan berjalan di `http://localhost:3000`

### Cara 2: Menjalankan Langsung dengan Node

```powershell
node app.js
```

### Verifikasi Server Berjalan

Buka browser dan akses:
```
http://localhost:3000
```

Anda harus melihat halaman login atau dashboard admin.

### Menghentikan Server

Tekan kombinasi tombol: **Ctrl + C** di terminal

---

## 💼 Cara Penggunaan

### 1. Halaman Login

**URL:** `http://localhost:3000/login` (jika belum login)

- Masukkan username dan password
- Username default: `admin`
- Password default: `admin123` (sesuaikan sesuai data Anda di database)
- Klik tombol "Login"

### 2. Dashboard Admin

**URL:** `http://localhost:3000/admin/dashboard`

Setelah login, Anda akan melihat dashboard berisi:
- Statistik penjualan
- Total produk
- Pesanan terbaru
- Quick actions

### 3. Manajemen Produk

Fitur untuk menambah, mengubah, dan menghapus produk:

- **Lihat Produk:** Klik menu "Products" atau "Produk"
- **Tambah Produk:** Klik tombol "Add Product" / "Tambah Produk"
- **Edit Produk:** Klik icon "Edit" pada baris produk
- **Hapus Produk:** Klik icon "Delete" pada baris produk

### 4. Manajemen Pembelian (Purchases)

Kelola pesanan pembelian:

- **Lihat Pesanan:** Klik menu "Purchases" atau "Pembelian"
- **Tambah Pesanan:** Klik tombol "New Purchase" / "Pesanan Baru"
- **Update Status:** Ubah status pesanan (Pending → Completed → Cancelled)
- **Filter/Cari:** Gunakan fitur search untuk menemukan pesanan tertentu

### 5. Logout

Klik tombol "Logout" di header untuk keluar dari aplikasi.

---

## 📁 Struktur Folder

```
admin-pembelian-lengkap/
├── app.js                      # File utama aplikasi Express
├── package.json               # Konfigurasi NPM dan dependencies
├── README.md                  # Dokumentasi ini
│
├── config/
│   └── db.js                 # Konfigurasi koneksi MySQL
│
├── controllers/
│   ├── authController.js     # Logic login/logout
│   └── adminController.js    # Logic dashboard, produk, pembelian
│
├── models/
│   ├── Admin.js              # Model untuk users/admin
│   ├── Product.js            # Model untuk produk
│   └── Purchase.js           # Model untuk pembelian
│
├── routes/
│   └── adminRoutes.js        # Definisi semua route/URL
│
├── views/
│   ├── admin/
│   │   ├── login.ejs         # Halaman login
│   │   ├── dashboard.ejs     # Halaman dashboard
│   │   └── purchases.ejs     # Halaman kelola pembelian
│   └── layouts/
│       └── main.ejs          # Template layout utama (header, navbar, footer)
│
├── public/
│   └── css/
│       └── style.css         # Styling CSS aplikasi
│
└── node_modules/             # Folder dependencies (otomatis dari npm install)
```

---

## 🔍 Struktur Database

### Tabel: admins
```
id (int)          - Primary Key
username (text)   - Username unik
password (text)   - Password terenkripsi bcrypt
email (text)      - Email admin
created_at        - Timestamp pembuatan
```

### Tabel: products
```
id (int)          - Primary Key
product_name      - Nama produk
price (decimal)   - Harga produk
stock (int)       - Jumlah stok
description       - Deskripsi produk
created_at        - Timestamp pembuatan
```

### Tabel: purchases
```
id (int)          - Primary Key
product_id (int)  - Foreign Key ke products
quantity (int)    - Jumlah pembelian
total_price       - Total harga
purchase_date     - Tanggal pembelian
status (enum)     - Status: pending, completed, cancelled
```

---

## 🆘 Troubleshooting

### Masalah: "Cannot find module 'express'"

**Solusi:**
```powershell
npm install
```
Pastikan Anda sudah menjalankan command ini di folder project.

---

### Masalah: "ECONNREFUSED - MySQL Connection Failed"

**Penyebab:** MySQL belum running atau konfigurasi salah

**Solusi:**
1. Pastikan XAMPP MySQL sudah di-start
2. Verifikasi konfigurasi di `config/db.js`:
   - Host: `localhost`
   - User: `root`
   - Password: (sesuai dengan XAMPP Anda)
   - Database: `toko_db`

---

### Masalah: "Database toko_db doesn't exist"

**Solusi:**
1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Buat database baru dengan nama `toko_db`
3. Jalankan SQL queries untuk membuat tabel (lihat bagian Konfigurasi Database)

---

### Masalah: "Listen EADDRINUSE :::3000"

**Penyebab:** Port 3000 sudah digunakan oleh aplikasi lain

**Solusi Option 1:** Ubah port di `app.js`
```javascript
app.listen(8000, () => {  // Ganti 3000 dengan port lain seperti 8000
  console.log('Server running on http://localhost:8000');
});
```

**Solusi Option 2:** Hentikan proses yang menggunakan port 3000
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

### Masalah: Login gagal / Password salah

**Solusi:**
1. Periksa tabel `admins` di database
2. Reset password admin di phpMyAdmin dengan nilai hash bcrypt yang benar
3. Atau buat script Node.js untuk generate password hash:

```javascript
const bcrypt = require('bcrypt');

const password = 'admin123';
bcrypt.hash(password, 10, (err, hash) => {
  console.log('Hashed password:', hash);
});
```

---

### Masalah: Halaman CSS tidak tampil (style tidak terlihat)

**Solusi:**
1. Pastikan folder `public` sudah ada
2. Pastikan folder `public/css` dan `style.css` ada
3. Restart server
4. Clear browser cache: **Ctrl + Shift + Delete**

---

## 📝 Contoh Curl Request (untuk testing API)

Jika aplikasi memiliki API, Anda bisa test dengan curl:

```powershell
# Login
curl -X POST http://localhost:3000/login -H "Content-Type: application/x-www-form-urlencoded" -d "username=admin&password=admin123"

# Get Products
curl http://localhost:3000/api/products

# Create Purchase
curl -X POST http://localhost:3000/api/purchases -H "Content-Type: application/json" -d '{"product_id":1,"quantity":5}'
```

---

## 🔐 Keamanan

Untuk production, lakukan hal berikut:

1. **Ubah Session Secret:**
   Di `app.js`, ganti:
   ```javascript
   secret: 'adminsecret'  // Ganti dengan string random yang kuat
   ```

2. **Gunakan Environment Variables:**
   Instal `dotenv`:
   ```powershell
   npm install dotenv
   ```
   Buat file `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=toko_db
   SESSION_SECRET=your_secret_key
   ```

3. **Validasi Input:**
   Pastikan semua input user di-validate dan di-sanitize

4. **HTTPS:**
   Gunakan HTTPS di production (bukan HTTP)

---

## 📞 Konttak & Support

Jika ada pertanyaan atau masalah:
1. Cek bagian Troubleshooting di atas
2. Baca dokumentasi Express: https://expressjs.com/
3. Baca dokumentasi MySQL: https://dev.mysql.com/doc/

---

## 📄 License

Project ini bebas untuk digunakan dan dimodifikasi.

---

**Last Updated:** January 2, 2026

---

Semoga panduan ini membantu! 🚀
