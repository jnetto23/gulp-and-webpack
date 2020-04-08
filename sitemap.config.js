/**
 * Changefreq
 * Valid Values: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
 *
 * Priority
 * Valid Values: 0.0 to 1.0
 *
 * For more information check the 'gulp-sitemap' plugin documentation (https://www.npmjs.com/package/gulp-sitemap)
 */

module.exports = {
  siteUrl: "https://mydomain.com",
  pages: {
    "index.html": {
      changefreq: "day",
      priority: 1,
    },
    "about.html": {
      changefreq: "weekly",
      priority: 0.9,
    },
    "services.html": {
      changefreq: "weekly",
      priority: 0.9,
    },
    "etc.html": {
      changefreq: "weekly",
      priority: 0.9,
    },
  },
};
