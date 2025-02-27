import express from 'express';
import path from 'path';
import routes from './routes/routes';
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/battery', routes);

app.listen(port, () => {
    console.log(`Server listening at :${port}`);
});
