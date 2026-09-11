import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const wasmPath = resolve("pkg/gproxy_host_edge_bg.wasm")
const outputPath = resolve("edge-functions/gproxy_wasm_inline.ts")
const wasm = readFileSync(wasmPath)
const base64 = wasm.toString("base64")

writeFileSync(
  outputPath,
  `// AUTO-GENERATED during Netlify build. Do not commit.\nexport const wasmBase64 = ${JSON.stringify(base64)}\n`,
)

console.log(`Prepared self-contained Netlify WASM module (${wasm.length} bytes)`)
