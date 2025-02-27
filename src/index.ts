import express from "express";
const app = express();


app.use(() => {
    console.log("hit!");
})
app.listen(3000, () => {
    console.log("server running!");
})