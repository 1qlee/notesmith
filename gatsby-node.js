// const { ProvidePlugin } = require('webpack')

// exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
//   if (stage === "build-html" || stage === 'develop-html') {
//     actions.setWebpackConfig({
//       plugins: [
//         new ProvidePlugin({
//           window: 'global/window',
//         }),
//       ],
//     })
//   }
// }