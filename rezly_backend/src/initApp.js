//import authRouter from "./modules/auth/auth.router.js"
import connectDB from "../DB/connection.js";
import cors from 'cors';
import authRouter from "./modules/auth/auth.router.js"
import BookingRouter from "./modules/booking/booking.router.js"

const initApp = (app,express)=>{
    connectDB();
    app.use(cors({
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
        allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
      }));
    app.use(express.json());
    app.use('/auth',authRouter);
app.use('/booking', BookingRouter );


}

    export default initApp;