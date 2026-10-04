/**
 * Background worker process (pg-boss entry point) - ARCHITECTURE §4, §15
 */
async function startWorker() {
  console.log("[worker] Starting Stoker background worker process...");
}

if (require.main === module) {
  startWorker().catch((err) => {
    console.error("[worker] Worker failed to start:", err);
    process.exit(1);
  });
}

export { startWorker };
