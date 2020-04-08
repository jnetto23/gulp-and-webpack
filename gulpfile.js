const { src, dest, watch, parallel, series } = require("gulp");
// helpers
const argv = require("yargs").argv;
const gulpif = require("gulp-if");
const rename = require("gulp-rename");
const del = require("del");
const gzip = require("gulp-gzip");
const sitemap = require("gulp-sitemap");
const sitemapConfig = require("./sitemap.config");
const save = require("gulp-save");
const browserSync = require("browser-sync").create();
// html
const htmlmin = require("gulp-htmlmin");
// js
const webpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");
// css
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");
const sourcemaps = require("gulp-sourcemaps");
// images
const imagemin = require("gulp-imagemin");
const imagewebp = require("gulp-webp");

function clean() {
  return del("./dist");
}

function html() {
  return src("./src/**/*.html")
    .pipe(gulpif(argv.production, htmlmin({ collapseWhitespace: true })))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/"));
}

function js() {
  return src("./src/assets/js/**/*.js")
    .pipe(webpack({ devtool: "source-map", config: webpackConfig }))
    .pipe(gulpif(argv.production, rename({ extname: ".min.js" })))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/assets/js/"));
}

function css() {
  if (argv.production) {
    return src("./src/assets/sass/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(cssnano())
      .pipe(rename({ extname: ".min.css" }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulpif(argv.gzip, gzip()))
      .pipe(dest("./dist/assets/css/"));
  } else {
    return src("./src/assets/sass/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(rename({ extname: ".min.css" }))
      .pipe(dest("./dist/assets/css/"));
  }
}

function images() {
  return src([
    "./src/assets/images/**/*.png",
    "./src/assets/images/**/*.jpg",
    "./src/assets/images/**/*.svg",
  ])
    .pipe(imagemin())
    .pipe(gulpif(argv.gzip, save("before-gzip")))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/assets/images/"))
    .pipe(gulpif(argv.gzip, save.restore("before-gzip")))
    .pipe(imagewebp())
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/assets/images/"));
}

function videos() {
  return src("./src/assets/videos/**/*.*").pipe(dest("./dist/assets/videos/"));
}

//.htaccess, robots.txt
function config() {
  return src(["./src/.htaccess", "./src/robots.txt", "!src/*.html"], {
    dot: true,
  }).pipe(dest("./dist/"));
}

function createSitemap() {
  const { siteUrl, pages } = sitemapConfig;
  let mappings = [];
  for (const page in pages) {
    if (pages.hasOwnProperty(page)) {
      let map = {
        pages: [`${page}`],
        changefreq: `${pages[page].changefreq}`,
        priority: `${pages[page].priority}`,
      };
      mappings = [...mappings, map];
    }
  }

  return src("./dist/**/*.html", {
    read: false,
  })
    .pipe(
      sitemap({
        siteUrl,
        mappings,
        getLoc(siteUrl, loc, entry) {
          return loc.replace(/\.\w+$/, "");
        },
      })
    )
    .pipe(dest("./dist/"));
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      index: "index.html",
    },
  });
  // html
  watch("./src/**/*.html", { ignoreInitial: false }, html).on(
    "change",
    browserSync.reload
  );
  watch("./src/assets/js/**/*.js", { ignoreInitial: false }, js).on(
    "change",
    browserSync.reload
  );
  watch("./src/assets/sass/**/*.scss", { ignoreInitial: false }, css).on(
    "change",
    browserSync.reload
  );
  watch("./src/assets/images/**/*.*", { ignoreInitial: false }, images).on(
    "change",
    browserSync.reload
  );
  watch("./src/assets/videos/**/*.*", { ignoreInitial: false }, videos).on(
    "change",
    browserSync.reload
  );
}

exports.html = html;
exports.clean = clean;
exports.css = css;
exports.js = js;
exports.images = images;
exports.videos = videos;
exports.config = config;
exports.createSitemap = createSitemap;

if (argv.production) {
  exports.default = series(
    clean,
    parallel(html, css, js, images, videos),
    parallel(config, createSitemap),
    server
  );
} else {
  exports.default = series(
    clean,
    parallel(html, css, js, images, videos),
    server
  );
}
