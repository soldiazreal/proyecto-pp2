import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL];
    if (process.argv[2] === "--api") whitelist.includes(undefined);
    if (whitelist.includes(origin)) {
      callback(null, true);
      console.log(whitelist);
    } else {
      callback(new Error("CORS's Error"));
    }
  },
};
