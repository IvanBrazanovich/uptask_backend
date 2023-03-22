import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";
import Tarea from "../models/Tarea.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select("-tareas");

  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  //Instanciar nuevo proyecto
  const proyecto = new Proyecto(req.body);

  //Añadir el usuario
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();

    res.json(proyectoAlmacenado);
  } catch (err) {
    console.log(err);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id)
    .populate("tareas")
    .populate("colaboradores", "email nombre");

  if (!proyecto) {
    const error = new Error("Hubo un problema ");
    return res.status(404).json({ msg: error.message });
  }

  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("No tienes permisos ");
    return res.status(403).json({ msg: error.message });
  }

  res.json({ proyecto });
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("Hubo un problema ");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos ");
    return res.status(403).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.colaboradores = req.body.colaboradores || proyecto.colaboradores;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoEditado = await proyecto.save();

    res.json({ proyectoEditado });
  } catch (err) {
    console.log(err);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("Hubo un problema ");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos ");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();

    res.json({ msg: "Proyecto Eliminado" });
  } catch (err) {
    console.log(err);
  }
};

const buscarColaborador = async (req, res) => {
  const user = await Usuario.findOne()
    .where("email")
    .equals(req.body.email)
    .select("-confirmado -createdAt -password -token -updatedAt -__v");

  if (!user) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};
const agregarColaborador = async (req, res) => {
  //Check project exists
  const params = req.params;

  const proyecto = await Proyecto.findById(params.id);

  if (!proyecto) {
    const error = new Error("Proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  //Check that the creator is the same
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(403).json({ msg: error.message });
  }
  //Check that collaborator is not the creator

  if (proyecto.creador.toString() === req.body.id) {
    const error = new Error(
      "Eres creador del proyecto, no puedes ser colaborador"
    );
    return res.status(403).json({ msg: error.message });
  }

  //Check that collaborator is not already in the array
  const inProyect = proyecto.colaboradores.find(
    (item) => item._id.toString() === req.body.id
  );

  if (inProyect) {
    const error = new Error("El usuario ya es colaborador");
    return res.status(403).json({ msg: error.message });
  }

  //Add to array
  proyecto.colaboradores.push(req.body.id);

  await proyecto.save();

  res.json("Añadido Correctamente");
};

const eliminarColaborador = async (req, res) => {
  //Check project exists
  const params = req.params;

  const proyecto = await Proyecto.findById(params.id);

  if (!proyecto) {
    const error = new Error("Proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  //Check that the creator is the same
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(403).json({ msg: error.message });
  }

  //Delete collaborator
  const nuevosColaboradores = proyecto.colaboradores.filter(
    (colaborador) => colaborador._id.toString() !== req.body.id
  );

  proyecto.colaboradores = nuevosColaboradores;

  await proyecto.save();

  res.json({ msg: "Eliminado Correctamente" });
};

export {
  buscarColaborador,
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
};
