/**
 * Server Services Index
 * 
 * Centralized exports for all service modules.
 * This file provides a single point of reference for available services.
 */

// Course registration and access verification
export {
  generateAccessKey,
  registerForCourse,
  verifyAccessKey,
} from "./courseService";

// Email sending with SMTP integration
export {
  isEmailServiceConfigured,
  sendCourseAccessEmail,
  sendEmail,
} from "./emailService";

// In-memory registration cache (fallback when DB offline)
export {
  registrationCache,
  logRegistrationCache,
} from "./registrationCache";
