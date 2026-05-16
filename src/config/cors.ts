import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL];
    console.log("origin recibido:", origin);
    console.log(process.argv);
    {
      console.log("whitelist:", whitelist);
      if (process.argv[2] === "--api") whitelist.push(undefined);
    }
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS's Error"));
    }
  },
};
