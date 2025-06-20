const express = require("express");
const cors = require("cors");
const ImageKit = require("imagekit");

const app = express();
app.use(cors());
app.use(express.json());

const imagekit = new ImageKit({
  publicKey: "public_qBAXvZWM1g8zJL/Oq7vTJ3iPaes=",
  privateKey: "private_j5v7nsRfFG6PikPESZQUGLN2GHE=", // reemplaza con tu private key real
  urlEndpoint: "https://ik.imagekit.io/rbsbv0586",
});

app.get("/auth", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
