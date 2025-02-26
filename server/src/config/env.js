import dotenv from "dotenv"; 

dotenv.config(); 

export default {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  };