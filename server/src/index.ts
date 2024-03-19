import express, { Express } from "express";
import { load, save, list, saveScore, listScores } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/load", load);  
app.get("/api/list", list); 
app.get("/api/listScore", listScores); 
app.post("/api/save", save); 
app.post("/api/saveScore", saveScore); 
app.listen(port, () => console.log(`Server listening on ${port}`));
