module.exports = {
  apps: [
    {
      name: "main-server",
      script: "main-server/dist/main.js",
    },
    {
      name: "micro-app-log",
      script: "micro-app-log/dist/main.js",
    },
    {
      name: "",
      script: "dist/microservice-2/main.js",
    },
  ],
};
