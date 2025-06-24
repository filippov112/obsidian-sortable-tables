const esbuild = require("esbuild");

async function build(watch = false) {
  const ctx = await esbuild.context({
    entryPoints: ["main.ts"],
    bundle: true,
    outfile: "main.js",
    format: "cjs",
    target: ["chrome58", "firefox57", "safari11"],
    platform: "browser",
    external: ["obsidian"],
  });

  if (watch) {
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("Build complete.");
  }
}

const isWatchMode = process.argv.includes("--watch");
build(isWatchMode).catch((e) => {
  console.error(e);
  process.exit(1);
});
