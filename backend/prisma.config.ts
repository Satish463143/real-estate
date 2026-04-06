require("dotenv").config();
const { defineConfig } = require("prisma/config");

 defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

module.exports = {
    defineConfig
}
