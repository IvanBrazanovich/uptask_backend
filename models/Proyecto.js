import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    cliente: {
      type: String,
      required: true,
      trim: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tarea" }],
    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Proyecto = mongoose.model("Proyecto", proyectosSchema);

export default Proyecto;
