import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./prisma/client.js";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}


const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to Supabase");
  } catch (err) {
    console.error("❌ Prisma connection failed:", err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
