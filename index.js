import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from "cors";
const app = express();
dotenv.config();
console.log("comienza brother");
process.stdout.write("comienza brother");

app.use(
  cors({
    origin: `${process.env.URL_FRONTEND}`,
  })
);

app.use(express.json());

conectarDB();

const PORT = process.env.PORT || 4000;

//Routing
//Responde a todos los verbos http
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

app.listen(PORT, (req, res) => {
  // res.json("Desde el servidor");
});
