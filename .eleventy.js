// Configuration Eleventy — Les Gones du Market'
// Le contenu vit dans src/_data/*.json (éditable via Pages CMS).
// Les pages HTML de src/ sont utilisées telles quelles comme gabarits Nunjucks :
// le design ne change pas, seules les parties répétées deviennent des boucles.

module.exports = function (eleventyConfig) {
  // Recopier tels quels les fichiers non-gabarits
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/site.js");
  eleventyConfig.addPassthroughCopy("src/beta-widget.js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");

  return {
    dir: { input: "src", output: "_site", data: "_data" },
    htmlTemplateEngine: "njk", // les .html sont rendus avec Nunjucks
    templateFormats: ["html"],
  };
};
