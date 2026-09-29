import { readFile, writeFile } from "node:fs/promises";

const path = "edge-functions/_lib/gproxy.js";
const source = await readFile(path, "utf8");
const marker = "[gproxy-netlify] extending upstream fetch timeout";

if (source.includes(marker)) {
  console.log("GPROXY 60s timeout patch already present.");
  process.exit(0);
}

const target = `        __wbg_timeout_e42525a949868363: function(arg0) {
            const ret = AbortSignal.timeout(arg0);
            return addHeapObject(ret);
        },`;

const matches = source.split(target).length - 1;
if (matches !== 1) {
  throw new Error(`Expected exactly one AbortSignal timeout glue block, found ${matches}. Upstream bundle layout may have changed.`);
}

const replacement = `        __wbg_timeout_e42525a949868363: function(arg0) {
            // Local Netlify compatibility patch: GPROXY v2.9.x can pass a
            // 60,000 ms upstream total timeout. Grok Responses may stream
            // longer than one minute, so extend only that exact timeout.
            const effectiveTimeout = arg0 === 60000 ? 300000 : arg0;
            if (effectiveTimeout !== arg0) {
                console.warn("[gproxy-netlify] extending upstream fetch timeout", {
                    requestedMs: arg0,
                    effectiveMs: effectiveTimeout,
                });
            }
            const ret = AbortSignal.timeout(effectiveTimeout);
            return addHeapObject(ret);
        },`;

await writeFile(path, source.replace(target, replacement), "utf8");
console.log("Applied GPROXY 60s -> 300s upstream fetch timeout patch.");
