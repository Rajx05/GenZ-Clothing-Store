import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

// Render (and most PaaS hosts) inject a PORT env var — don't hardcode it.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
