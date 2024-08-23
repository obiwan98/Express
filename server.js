const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const userRoutes = require("./routes/user");
const roleRoutes = require("./routes/role");
const groupRoutes = require("./routes/group");
const bookRoutes = require("./routes/book");
const approvalRoutes = require("./routes/approval");
const externalApiRoutes = require("./routes/externalApi");
const mailSenderRoutes = require("./routes/mailSender");

const swaggerFile = require("./swagger/swagger-output.json");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { MONGODB_URI, PORT } = process.env;

mongoose
  .connect(MONGODB_URI, {
    ssl: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  
//const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/external", externalApiRoutes);
app.use("/api", mailSenderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
