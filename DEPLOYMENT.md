# GPROXY Netlify deployment

This branch contains the official prebuilt **GPROXY v3.0.12** Netlify Edge bundle.

It is pinned intentionally. Netlify should deploy the files in this branch directly; Rust/WASM compilation is disabled because `pkg/` and `public/` are official release artifacts.

Required Netlify environment variables:

- `GPROXY_LIBSQL_URL`
- `GPROXY_LIBSQL_AUTH_TOKEN`

Optional:

- `GPROXY_MASTER_KEY`
- `UPSTASH_URL` and `UPSTASH_TOKEN` (set both or neither)

The previous v2 deployment remains available on the `deploy` branch for rollback.
