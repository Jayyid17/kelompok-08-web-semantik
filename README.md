# 1. Desain Endpoint Users yang RESTful

Endpoint seperti `/api/createUser` dan `/api/deleteUser` kurang RESTful karena URL berisi kata kerja atau aksi. Dalam konsep REST, URL sebaiknya menunjukkan resource atau data yang dikelola, sedangkan aksinya ditentukan oleh HTTP method.

Resource pada soal ini adalah `users`, maka path yang lebih benar adalah `/api/users`. Untuk membuat user digunakan method `POST`, sedangkan untuk menghapus user digunakan method `DELETE`. Jadi aksi tidak perlu ditulis lagi di path karena sudah diwakili oleh method.

Desain endpoint users yang benar:

| Method | Path | Fungsi | Status Code Sukses |
| --- | --- | --- | --- |
| GET | `/api/users` | Mengambil semua user beserta data tasks miliknya | 200 OK |
| GET | `/api/users/:id` | Mengambil detail user berdasarkan id | 200 OK |
| POST | `/api/users` | Membuat user baru | 201 Created |
| PATCH | `/api/users/:id` | Mengubah data user berdasarkan id | 200 OK |
| DELETE | `/api/users/:id` | Menghapus user berdasarkan id | 204 No Content |

Implementasi endpoint users ada di:

- `app.js`: memasang prefix `/api/users`
- `routes/userRoutes.js`: mendefinisikan method dan path endpoint users
- `controllers/userController.js`: mengatur validasi request dan response
- `services/userService.js`: mengatur proses data users

Contoh request membuat user:

```http
POST /api/users
Content-Type: application/json
```

```json
{
  "name": "Budi",
  "email": "budi@example.com"
}
```

## 2. Update GET /api/users agar Menampilkan Tasks dan Age

Endpoint `GET /api/users` sudah diupdate agar setiap user menampilkan data tasks miliknya. Pada data task, field `age` juga ikut ditampilkan.

Contoh response:

```json
{
  "data": [
    {
      "id": "user-id",
      "name": "Budi",
      "email": "budi@example.com",
      "createdAt": "2026-04-29T03:00:00.000Z",
      "updatedAt": "2026-04-29T03:00:00.000Z",
      "tasks": [
        {
          "id": "task-id",
          "title": "Belajar API",
          "done": false,
          "userId": "user-id",
          "age": 20,
          "createdAt": "2026-04-29T03:05:00.000Z",
          "updatedAt": "2026-04-29T03:05:00.000Z"
        }
      ]
    }
  ]
}
```

Implementasi update ini ada di `controllers/userController.js`, pada fungsi `list`. Controller mengambil semua user, lalu menambahkan data tasks dari `taskService.findByUserId(user.id)`.

## 3. Keuntungan app.js dan server.js Dipisah

1. Struktur kode lebih rapi karena `app.js` fokus mengatur isi aplikasi seperti route, middleware, CORS, dan error handler, sedangkan `server.js` fokus menjalankan server dengan `app.listen()`.

2. Aplikasi lebih mudah dites karena `app.js` bisa di-import tanpa langsung menyalakan server atau membuka port.

3. Project lebih mudah dikembangkan karena saat aplikasi makin besar, bagian konfigurasi aplikasi dan bagian menjalankan server tidak tercampur dalam satu file.

## 4. Fungsi CORS dalam Development

CORS digunakan agar frontend dan backend yang berjalan di origin berbeda tetap bisa saling berkomunikasi. Contohnya, Vue berjalan di `http://localhost:5173`, sedangkan API berjalan di `http://localhost:4000`. Walaupun sama-sama localhost, port yang berbeda dianggap origin yang berbeda oleh browser.

Tanpa konfigurasi CORS, browser bisa memblokir request dari Vue ke API. Di project ini CORS diaktifkan di `app.js` dengan kode:

```js
const cors = require("cors");
app.use(cors());
```

Error yang biasanya muncul jika CORS tidak benar adalah seperti ini:

```txt
Access to fetch at 'http://localhost:4000/api/users' from origin 'http://localhost:5173' has been blocked by CORS policy.
```

Artinya browser menolak request karena backend belum mengizinkan akses dari origin frontend.

## Cara Menjalankan Project

Install dependency:

```bash
npm install
```

Jalankan server:

```bash
node server.js
```

API berjalan di:

```txt
http://localhost:4000
```
