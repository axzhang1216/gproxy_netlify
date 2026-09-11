import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const pkgDir = resolve("pkg")
const wasmPath = resolve(pkgDir, "gproxy_host_edge_bg.wasm")
const libDir = resolve("edge-functions/_lib")
const outputPath = resolve(libDir, "gproxy_wasm_inline.ts")

const wasm = readFileSync(wasmPath)
const base64 = wasm.toString("base64")

rmSync(libDir, { recursive: true, force: true })
mkdirSync(libDir, { recursive: true })
cpSync(pkgDir, libDir, { recursive: true })

// The runtime is initialized from the inline bytes below. Keeping the copied
// .wasm would make Netlify treat it as a runtime file dependency again.
rmSync(resolve(libDir, "gproxy_host_edge_bg.wasm"), { force: true })
rmSync(resolve(libDir, "gproxy_host_edge_bg.wasm.d.ts"), { force: true })

writeFileSync(
  outputPath,
  `// AUTO-GENERATED during Netlify build. Do not commit.\nexport const wasmBase64 = ${JSON.stringify(base64)}\n`,
)

console.log(`Prepared self-contained Netlify Edge runtime (${wasm.length} WASM bytes)`)
