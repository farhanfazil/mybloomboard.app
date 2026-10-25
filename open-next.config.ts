import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Cloudflare build of the website (OpenNext). No incremental cache needed: pages are built ahead,
// and the few server routes (checkout, demo counters) run on every request.
export default defineCloudflareConfig();
