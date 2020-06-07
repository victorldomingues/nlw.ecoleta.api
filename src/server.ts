
import express from "express";
import routes from "./routes";
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';
const port = 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);
app.use(errors());

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});