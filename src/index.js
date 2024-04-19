const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

// Middleware
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://saiyamvaid:P4AVpFftM9S3lj88@cluster0.w6lc79s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    // Mount authentication routes
    app.use("/auth", authRoutes);

    app.use("/api", categoryRoutes);

    app.use("/api", productRoutes);
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
