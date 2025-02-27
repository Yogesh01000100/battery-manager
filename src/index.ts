import express from "express";
import routes from "./routes/routes";
const app = express();

app.use(express.json());

app.use('/api/battery', routes);

app.listen(3000, () => {
    console.log("server running!");
})