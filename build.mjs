import * as esbuild from "esbuild";
import packageJSON from "./package.json" with { type: "json" };

/** @type {esbuild.BuildOptions} */
const config = {
    bundle: true,
    sourcemap: true,
    minify: true,
    metafile: true,
    platform: "browser",
    charset: "utf8",
    loader: {
        ".png": "dataurl",
        ".woff": "dataurl"
    },
    entryPoints: [packageJSON.main],
    format: "esm",
    target: "esnext",
    treeShaking: true,
    outfile: "docs/build/ramu.js",
};

if (process.argv.includes("-w")) {
    config.plugins = [{
        name: "logger",
        setup(build) {
            build.onEnd(result => {
                if (result.errors.length == 0)
                    console.error(`[${new Date().toISOString()}] rebuilt ${config.outfile} success!`);
                else
                    console.error(`[${new Date().toISOString()}] failed to build ${config.outfile}!`)
            });
        },
    }];
    await esbuild.context(config).then(ctx => ctx.watch());
}
else await esbuild.build(config);
