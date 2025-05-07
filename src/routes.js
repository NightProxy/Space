import express from 'express';
import path from 'path';
const router = express.Router();

let __dirname = process.cwd();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.get('/&', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/&.html'));
});

router.get('/~', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/~.html'));
});

router.get('/g', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/g.html'));
});

router.get('/a', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/a.html'));
});

router.get('/err', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/err.html'));
});

router.get('/500', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/500.html'));
});

router.get('/a', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/a.html'));
});
router.get('/g', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/g.html'));
});

router.get('/a', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/a.html'));
});

router.get('/password', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/password.html'));
});

router.use((req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, 'public/err.html'));
});

export default router;
