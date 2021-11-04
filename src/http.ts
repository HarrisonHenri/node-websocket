import "reflect-metadata";
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);
const io = new Server(server);

mongoose.connect("mongodb://localhost/rocketsocket")

app.use(express.static(path.join(__dirname, "..", "public")));

export { server, io }
