import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mapsys2007:phut5lE2TWOCoru7@cluster0.jammggy.mongodb.net/tienda?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};