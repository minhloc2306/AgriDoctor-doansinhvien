require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const { trackVisit } = require('./controllers/statsController'); // Middleware thống kê truy cập

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json({ extended: false }));

app.use(trackVisit); // Ghi nhận mỗi lượt truy cập (trước khi vào bất kỳ route nào)

// Define Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/diseases', require('./routes/diseases'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/feedback', require('./routes/feedback'));

app.use('/api/stats', require('./routes/stats')); // API lấy thống kê truy cập

// Serve static assets (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 