exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html" || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@svgedit/,
            use: loaders.null(),
          },
          {
            test: /use-shopping-cart/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}