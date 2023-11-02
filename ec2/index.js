import express from "express";

const app = express();

app.listen(5000, () => console.log("app listening on 5000"));

app.get("/", (req,res) => res.json("my API is running"));


