const app = require("./src/config/express.config");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    app.listen(PORT , () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Failed to start:", e);
    process.exit(1);
  }
})();

