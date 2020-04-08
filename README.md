# Gulp and Webpack

> Powerful standard framework for front-end web development with gulp and webpack

## Usage example

Create all your code inside the src folder

To use the tasks already created for gulp, we recommend that you use the folder/file structure below:

```plaintext
src/
 ├─ assets/
 │  	├── images/
 │  	├── js/
 │  	├── sass/
 │  	└── videos/
 ├─ robots.txt
 ├─ .htaccess
 ├─ index.html
 └── ...
```

### Development mode

When in development, use the 'dev' script configured in packge.json to activate browserSync and handle updates in real time.

```cmd
> yarn dev
```

### Production mode

**Attention!** Before generating the package for production, edit the 'sitemap.config.js' file at the root of the directory to generate a suitable sitemap.xml, and only then use the 'build' script configured in packge.json

```cmd
> yarn build
```
