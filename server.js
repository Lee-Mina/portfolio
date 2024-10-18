// 필요한 패키지 가져오기
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

// Express 앱 초기화
const app = express();

// 정적 파일 제공 (HTML, CSS 등)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Multer 설정 (이미지 파일 저장 위치 설정)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일명을 현재 시간으로 설정
    }
});

const upload = multer({ storage: storage });

// POST /login 경로 처리 (로그인 요청 처리)
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 간단한 사용자 인증 로직 (예시)
    if (username === 'admin' && password === 'password') {
        res.send('Login successful!');
    } else {
        res.send('Login failed! Check your credentials.');
    }
});

// POST /upload 경로 처리 (이미지 업로드 처리)
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.send('No file uploaded.');
    }
    res.send(`Image uploaded successfully: ${req.file.filename}`);
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
