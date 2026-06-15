# Issues

## Next.js 14.2.5 build fails on Windows with ENOENT build-manifest.json
- **Symptom**: Build fails at "Collecting page data" stage trying to read `.next/build-manifest.json` even though the file exists.
- **Root cause**: Race condition in Next.js on Windows — the async write of manifest files hasn't fully flushed before the build process attempts to read them.
- **Impact**: Blocks `npm run build` but does NOT affect `npm run dev` or the validity of the output.
- **Workaround**: Run build repeatedly (2-3 attempts usually succeed on subsequent runs). Alternatively, build on WSL/Linux.
- **Note**: This is pre-existing and unrelated to the i18n changes.
