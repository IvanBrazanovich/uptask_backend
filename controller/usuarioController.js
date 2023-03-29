import mongoose from "mongoose";
import generarId from "../helpers/generarId.js";
import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/mailer.js";

const registrar = async (req, res) => {
  const { email } = req.body;
  const emailUsed = await Usuario.findOne({ email });
  if (emailUsed) {
    const error = new Error("Ese email ya fue utilizado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();

    usuarioAlmacenado.confirmado = true;
    usuarioAlmacenado.token = "";
    usuarioAlmacenado.save();

    // emailRegistro({
    //   email: usuarioAlmacenado.email,
    //   token: usuarioAlmacenado.token,
    //   nombre: usuarioAlmacenado.nombre,
    // });

    res.json({
      msg: "Usuario creado correctamente",
    });
  } catch (err) {}
};

const autenticar = async (req, res) => {
  // console.log(req);
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    //Ver si el usuario existe
    if (!usuario) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }

    //Ver si el usuario está confirmado
    if (!usuario.confirmado) {
      const error = new Error("El usuario no está confirmado");
      return res.status(403).json({ msg: error.message });
    }

    //Comprobar su password
    if (await usuario.comprobarPassword(password)) {
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario._id),
      });
    } else {
      const error = new Error("La contraseña no es correcta");
      return res.status(404).json({ msg: error.message });
    }
  } catch (err) {}
};

const confirmar = async (req, res) => {
  const token = req.params.token;

  const usuarioConfirmado = await Usuario.findOne({ token });

  if (!usuarioConfirmado) {
    const error = new Error("El token no es válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmado.token = "";
    usuarioConfirmado.confirmado = true;
    await usuarioConfirmado.save();

    res.json({ msg: "El usuario fue Confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email });

  //Ver si el usuario existe
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();

    await usuario.save();

    emailOlvidePassword({
      email: usuario.email,
      token: usuario.token,
      nombre: usuario.nombre,
    });

    res.json({ msg: "Hemos enviado un mail con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  try {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
      const error = new Error("El token no es válido");
      return res.status(404).json({ msg: error.message });
    }

    res.json({ msg: "Token correcto" });
  } catch (err) {
    console.log(err);
  }
};

const nuevoPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  const usuario = await Usuario.findOne({ token });

  if (!usuario) {
    const error = new Error("El token no es válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = "";
    usuario.password = password;
    await usuario.save();

    res.json({ msg: "Se ha cambiado la contraseña" });
  } catch (err) {
    console.log(err);
  }
};

const perfil = async (req, res) => {
  const usuario = req.usuario;

  res.json(usuario);
};

export {
  olvidePassword,
  registrar,
  autenticar,
  confirmar,
  comprobarToken,
  nuevoPassword,
  perfil,
};
