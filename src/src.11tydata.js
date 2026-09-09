// Données de répertoire : s'applique à toutes les pages de src/
// Garde des URLs plates identiques à l'existant : membres.html (et non /membres/).
// filePathStem vaut "/index", "/index-v2", "/membres" -> on ajoute ".html".
module.exports = {
  eleventyComputed: {
    permalink: (data) => `${data.page.filePathStem}.html`,
  },
};
