import express from 'express';
import connectDB from './DB/connection.js'; // استدعاء ملف الاتصال
import Booking from './src/routers/bookingRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;
import initApp from './src/initApp.js';
import 'dotenv/config';

connectDB(); // الاتصال بالداتا بيس

initApp(app,express);
app.use(express.json());
app.use('/booking', Booking );
app.get('/', (req, res) => {
  res.send('Hello world! Server is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
