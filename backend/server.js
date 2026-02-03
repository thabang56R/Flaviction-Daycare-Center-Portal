// backend/server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import announcementsRoutes from "./src/routes/announcements.js";
import menuRoutes from "./src/routes/menu.js";
import reportCardRoutes from "./src/routes/reportcards.js";




import payfast from "./src/routes/payfast.js";
import authRoutes from "./src/routes/auth.js";
import childRoutes from "./src/routes/child.js";
import adminRoutes from "./src/routes/admin.js";
import inviteRoutes from "./src/routes/invite.js";
import videoRoutes from "./src/routes/videos.js";

const app = express();

// ────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────


const allowedOrigins = [
  process.env.APP_BASE_URL, 
  "http://localhost:5173",
  "https://flaviction-daycare-center-portal-1k6atl444.vercel.app/",  
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("/", cors());


app.use(express.json());
app.use(morgan("dev"));


app.set("etag", false);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});


// ────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────
app.use("/api/payfast", payfast);


app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/child", childRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reportcards", reportCardRoutes);

// Root test
app.get("/", (req, res) => {
  res.json({
    message: "Flaviction Daycare API is live 🚀",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// ────────────────────────────────────────────────
// MongoDB Connection
// ────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// ────────────────────────────────────────────────
// Start Server
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
