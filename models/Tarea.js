import mongoose from "mongoose";

const tareSchema = mongoose.Schema(
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
    estado: {
      type: Boolean,
      default: false,
      trim: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
    },
  },
  {
    timestamps: true,
  }
);

const Tarea = mongoose.model("Tarea", tareSchema);

export default Tarea;
