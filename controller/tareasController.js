import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";

const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  //Checkear si la persona que accede al proyecto es la creadora

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos necesarios");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};

//Add task
const agregarTarea = async (req, res) => {
  //Checkear si existe el proyecto
  const proyecto = await Proyecto.findById(req.body.proyecto);

  if (!proyecto) {
    const error = new Error("Tarea no encontrada");

    return res.status(404).json({ msg: error.message });
  }

  //Checkear si la persona que accede al proyecto es la creadora
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos para añadir tareas");
    return res.status(403).json({ msg: error.message });
  }

  //Try catch agregar tarea
  try {
    const tareaAlmacenada = await Tarea.create(req.body);

    proyecto.tareas.push(tareaAlmacenada);

    proyecto.save();
    res.json({ tareaAlmacenada });
  } catch (err) {
    console.log(err);
  }
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  //Checkear si la persona que accede al proyecto es la creadora

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos necesarios");
    return res.status(403).json({ msg: error.message });
  }

  //Editar tarea
  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.estado = req.body.estado || tarea.estado;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaEditada = await tarea.save();

    res.json(tareaEditada);
  } catch (err) {
    console.log(err);
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  //Checkear si la persona que accede al proyecto es la creadora

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos necesarios");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);

    await tarea.deleteOne();
    proyecto.tareas.pull(tarea._id);

    await Promise.all([await proyecto.save(), await tarea.deleteOne()]);

    res.json({ msg: "Tarea eliminada" });
  } catch (err) {
    console.log(err);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;

  await tarea.save();
  res.json(tarea);
};

export {
  obtenerTarea,
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
