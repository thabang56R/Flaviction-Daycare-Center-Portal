const allowedOrigins = [
  process.env.APP_BASE_URL, 
  "http://localhost:5173",
  "https://flaviction-daycare-center-portal.vercel.app",
  "https://flaviction-daycare-center-portal-omz525vup.vercel.app",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    // allow vercel preview deployments too (optional but recommended)
    const isVercelPreview =
      cleanOrigin.endsWith(".vercel.app") &&
      cleanOrigin.startsWith("https://flaviction-daycare-center-portal-");

    if (allowedOrigins.includes(cleanOrigin) || isVercelPreview) {
      return cb(null, true);
    }

    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.options("/", cors());
