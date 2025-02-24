import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
const router = express.Router();

let __dirname = process.cwd();

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// apply rate limiter to all requests
router.use(limiter);

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
