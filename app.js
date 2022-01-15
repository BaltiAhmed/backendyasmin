const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const httperror = require("./models/error");

const mongoose = require("mongoose");

const path = require('path');

const utilisateurRoutes = require("./routes/utilisateur");
const projetRoutes = require("./routes/projet");
const equipementRoutes = require("./routes/equipement");
const productionRoutes = require("./routes/production");
const marketingRoutes = require("./routes/marketing");
const adminRoutes = require("./routes/admin");
const formationRoutes = require("./routes/formation");
const financiereRoutes = require("./routes/financiere");
const messageRoute = require("./routes/message");

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/utilisateur", utilisateurRoutes);
app.use("/api/projet", projetRoutes);
app.use("/api/equipement", equipementRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/formation", formationRoutes);
app.use("/api/financiere", financiereRoutes);
app.use("/api/message", messageRoute);


app.use((req, res, next) => {
  const error = new httperror("could not find that page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred " });
});

mongoose
  .connect(
    "mongodb+srv://yasmine:admin2021@cluster0.i1bxb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
