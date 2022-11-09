/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
 const config = {
  outputDir: './dist/canvas-with-3d',
  publicPath: (process.env.DEPLOY_BASE_URL || "") + "/"
};
module.exports = config;
