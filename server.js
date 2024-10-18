const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/portfolioDB', { useNewUrlParser: true, useUnifiedTopology: true });

// 프로젝트 스키마 설정
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String
});

const Project = mongoose.model('Project', projectSchema);

// Express 앱 생성
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// 로그인 관련 설정
const user = { username: 'admin', password: bcrypt.hashSync('password', 10) };

passport.use(new LocalStrategy((username, password, done) => {
    if (username === user.username && bcrypt.compareSync(password, user.password)) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Incorrect credentials.' });
    }
}));

passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => done(null, user));

// Multer 설정 (이미지 업로드)
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
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
}));

// 관리자 페이지 (CRUD 작업)
app.get('/admin', (req, res) => {
    if (req.isAuthenticated()) {
        Project.find({}, (err, projects) => {
            res.render('admin', { projects });
        });
    } else {
        res.redirect('/login');
    }
});

// 새 프로젝트 작성
app.post('/admin/upload', upload.single('image'), (req, res) => {
    if (req.isAuthenticated()) {
        const newProject = new Project({
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename
        });
        newProject.save((err) => {
            if (!err) {
                res.redirect('/admin');
            } else {
                console.log(err);
            }
        });
    } else {
        res.redirect('/login');
    }
});

// 프로젝트 수정 페이지
app.get('/admin/edit/:id', (req, res) => {
    if (req.isAuthenticated()) {
        Project.findById(req.params.id, (err, project) => {
            if (!err) {
                res.render('edit', { project });
            }
        });
    } else {
        res.redirect('/login');
    }
});

// 프로젝트 수정 처리
app.post('/admin/edit/:id', upload.single('image'), (req, res) => {
    if (req.isAuthenticated()) {
        const updatedData = {
            title: req.body.title,
            description: req.body.description
        };
        if (req.file) {
            updatedData.image = req.file.filename;
        }
        Project.findByIdAndUpdate(req.params.id, updatedData, (err) => {
            if (!err) {
                res.redirect('/admin');
            }
        });
    } else {
        res.redirect('/login');
    }
});

// 프로젝트 삭제
app.post('/admin/delete/:id', (req, res) => {
    if (req.isAuthenticated()) {
        Project.findByIdAndRemove(req.params.id, (err) => {
            if (!err) {
                res.redirect('/admin');
            }
        });
    } else {
        res.redirect('/login');
    }
});

// 로그아웃 처리
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

mongoose.connect('mongodb://localhost:27017/portfolioDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));