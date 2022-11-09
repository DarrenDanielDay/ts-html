/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
 const config = {
  outputDir: './dist/canvas-with-3d',
  // pages: {
  //   index: {
  //     entry: 'src/main.ts',
  //     title: '3D Cube',
  //   }
  // },
  publicPath: (process.env.DEPLOY_BASE_URL || "") + "/"
};
module.exports = config;
