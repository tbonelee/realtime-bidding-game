import { workerData } from "worker_threads";
import { WorkerData } from "../lib/type/worker-data";

const { roomId } = workerData as WorkerData;

console.log(`worker for ${roomId} started`);
