//import authRouter from "./modules/auth/auth.router.js"
import connectDB from "../DB/connection.js";
import cors from 'cors';
import authRouter from "./modules/auth/auth.router.js"


const initApp = (app,express)=>{
    connectDB();
    app.use(cors({
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
        allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
      }));
    app.use(express.json());
    app.use('/auth',authRouter);

}

    export default initApp;