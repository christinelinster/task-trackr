import express from "express";
import cors from "cors";
import env from "./config/env.js"
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js";
import listRoutes from "./routes/listRoutes.js"; 
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();
const port = env.port; 

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/lists", listRoutes)

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
