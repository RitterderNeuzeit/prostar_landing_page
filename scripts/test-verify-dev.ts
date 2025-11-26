process.env.NODE_ENV = "development";
import { verifyAccessKey } from "../server/services/courseService";
(async () => {
  const result = await verifyAccessKey(
    "info.prostar@gmx.de",
    "infopros_1234567890abcdef"
  );
  console.log(result);
})();
