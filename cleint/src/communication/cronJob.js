import { CronJob } from "cron";
import API from "./api";

const pingServer = async () => {
  try {
    const response = await API.get("/products");
    if (response.ok) {
      console.log("Server is up and running:", await response.json());
    } else {
      console.error("Failed to ping the server:", response.status);
    }
  } catch (error) {
    console.error("Error pinging server:", error);
  }
};

const job = new CronJob("*/1 * * * *", () => {
  console.log("Pinging the server...");
  pingServer();
});

export const startCronJob = () => {
  job.start();
};
