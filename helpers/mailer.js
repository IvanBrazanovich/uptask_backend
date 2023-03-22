import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  //extract data information of user
  const { nombre, token, email } = datos;

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5e3e77bdabe6a5",
      pass: "c20d98d3c30a11",
    },
  });

  const info = await transport.sendMail({
    from: ` "UpTask - Administrador de Proyectos" <cuentas@uptask.com>`,
    to: email,
    subject: "UpTask - Comprueba tu Cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: ` <p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
     <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>


     <a href="${process.env.URL_FRONTEND}/confirmar/${token}">Comprobar Cuenta</a>

     <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};

const emailOlvidePassword = async (datos) => {
  //extract data information of user
  const { nombre, token, email } = datos;

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5e3e77bdabe6a5",
      pass: "c20d98d3c30a11",
    },
  });

  const info = await transport.sendMail({
    from: ` "UpTask - Administrador de Proyectos" <cuentas@uptask.com>`,
    to: email,
    subject: "UpTask - Olvidé mi password",
    text: "Cambiar mi password",
    html: ` <p>Hola: ${nombre} cambia tu cuenta en UpTask</p>
     <p> Para cambiar tu contraseña debes entrar al siguient enlace : </p>


     <a href="${process.env.URL_FRONTEND}/olvide-password/${token}">Comprobar Cuenta</a>

     <p>Si tu no olvidaste el password de esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
