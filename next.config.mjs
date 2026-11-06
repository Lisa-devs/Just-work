const repo = process.env.GITHUB_ACTIONS ? "/Just-work" : "";

export default {
  reactStrictMode: true,
  output: "export",
  basePath: repo
};
