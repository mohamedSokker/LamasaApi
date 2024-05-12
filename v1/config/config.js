require("dotenv").config();

const config = {
  user: process.env.CONFIG_USER,
  password: process.env.CONFIG_PASSWORD,
  server: process.env.CONFIG_SERVER,
  port: process.env.CONFIG_PORT,
  database: process.env.CONFIG_DATABASE,
  port: Number(process.env.CONFIG_PORT),
  synchronize: true,
  trustServerCertificate: true,
};

module.exports = config;
