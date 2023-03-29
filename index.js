import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
dotenv.config();

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

const servidor = app.listen(PORT, (req, res) => {
  // res.json("Desde el servidor");
});

// SOCKET create server
const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.URL_FRONTEND,
  },
});

io.on("connection", (socket) => {
  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("agregar tarea", (tarea) => {
    const { proyecto } = tarea;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });

  socket.on("cambiar estado", (tarea) => {
    const { proyecto } = tarea;
    socket.to(proyecto).emit("estado cambiado", tarea);
  });

  socket.on("editar tarea", (tarea) => {
    const { proyecto } = tarea;
    socket.to(proyecto._id).emit("tarea editada", tarea);
  });

  socket.on("eliminar tarea", (tarea) => {
    const { proyecto } = tarea;

    socket.to(proyecto._id).emit("tarea eliminada", tarea);
  });
});
