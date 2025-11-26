import express from "express";
import {
  getCourseRegistrationByAccessKey,
  updateCourseRegistrationAccessed,
} from "../db";

const router = express.Router();

// Email open tracking endpoint
// Usage: GET /api/email/open?key=<accessKey>&email=<email>
// Marks the registration as accessed (accessedAt) and returns a 1x1 GIF pixel.
router.get("/open", async (req, res) => {
  try {
    const { key, email } = req.query as { key?: string; email?: string };
    if (!key || !email) {
      // Return pixel anyway to avoid breaking email clients
      res.setHeader("Content-Type", "image/gif");
      return res.send(
        Buffer.from(
          "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
          "base64"
        )
      );
    }

    // Try to find registration and update accessedAt
    try {
      const reg = await getCourseRegistrationByAccessKey(String(key));
      if (
        reg &&
        reg.email &&
        reg.email.toLowerCase() === String(email).toLowerCase()
      ) {
        await updateCourseRegistrationAccessed(String(key));
        console.log(`[Email/Open] Marked accessed for ${email} (${key})`);
      } else {
        console.log(
          `[Email/Open] No matching registration for ${email} (${key})`
        );
      }
    } catch (dbErr) {
      console.warn("[Email/Open] DB error:", dbErr);
    }

    // Return transparent 1x1 GIF
    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.send(
      Buffer.from(
        "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
        "base64"
      )
    );
  } catch (err) {
    console.error("/api/email/open error:", err);
    res.setHeader("Content-Type", "image/gif");
    return res.send(
      Buffer.from(
        "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
        "base64"
      )
    );
  }
});

export default router;
