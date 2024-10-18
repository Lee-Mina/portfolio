const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');

// Express 앱 생성
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // 정적 파일을 public 폴더에서 제공
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));

// Passport 초기화 및 세션 연결
app.use(passport.initialize());
app.use(passport.session());

// 기본 사용자 설정 (추후 DB에서 사용자 정보를 가져오는 방식으로 변경 가능)
const user = { username: 'admin', password: bcrypt.hashSync('password', 10) };

// Passport 전략 설정 (로컬 로그인)
passport.use(new LocalStrategy((username, password, done) => {
    if (username === user.username && bcrypt.compareSync(password, user.password)) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Invalid credentials' });
    }
}));

passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => {
    if (username === user.username) {
        done(null, user);
    } else {
        done('No user found');
    }
});

// Multer 설정 (이미지 업로드 처리)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// 로그인 페이지
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 로그인 처리
app.post('/login', passport.authenticate('local', {
    successRedirect: '/upload',
    failureRedirect: '/login'
}));

// 업로드 페이지 (인증된 사용자만 접근 가능)
app.get('/upload', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'public', 'upload.html'));
    } else {
        res.redirect('/login');
    }
});

// 이미지 업로드 처리
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Image uploaded successfully: <a href="/uploads/${req.file.filename}">${req.file.filename}</a>`);
    } else {
        res.status(403).send('Unauthorized');
    }
});

// 로그아웃 처리
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
