# Book designs for paged.js

Customisable designs for books created with [`paged.js`](https://gitlab.pagedmedia.org/tools/pagedjs).

## Project aims

This project is a work in progress. The aim is to make it easy to create and adapt book designs for use with `paged.js`.

Our default library of Sass partials account for common book features as base styles (e.g. `_bibliography.scss`). These partials have a vanilla, non-opinionated design, and can be styled lightly just by setting Sass variables.

Our default styles follow common book-design fundamentals, such as indented paragraphs, running heads, copyright-page layouts, and start-on-recto pages.

The project already includes a few opinionated designs as themes. You can use or adapt them to suit your books.

## Usage

### Use an existing stylesheet

If your HTML happens to use the same structure and selectors as our defaults, you can use one of our CSS stylesheets as is.

1. Copy a CSS file from one of the theme folders in `css/themes/`, and link to it in your book's HTML files.
2. Link to the `paged.js` script.

So, this means your HTML `head` will include these two tags:

```html
<link rel="stylesheet" type="text/css" href="path/to/main.css">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
```

### Create your own stylesheet

You'll need to have Ruby and Sass installed first.

1. Clone this repo.
1. In `themes`, make a copy of `themes/template` or another theme you want to adapt.
1. Edit and add to your theme's `_selectors.scss`, `_styles.scss`, and `_variables.scss`. These simply override the defaults when they're imported by the theme's `main.scss` file. See [Creating new styles](#creating-new-styles) below for more detail.
1. Add your theme to the `run-` scripts' `sass` commands, and to the `pagerThemes` object in `js/pager.js`.
1. Run `./run.sh` on Mac and Linux or `run.bat` on Windows. (The first time you run this on Mac or Linux, you must give the script permission to run with `chmod +x run.sh`.)

   This builds and watches for Sass changes, and serves `index.html` in Chrome so that the page can fetch `paged.js` over HTTP.

Note that in order to demo stylesheets in this project, we load stylesheets and `paged.js` with `js/pager.js`. Our `pager.js` script adds the theme selector and waits for any MathJax to load on the page. In your finished books, you wouldn't do this. You'd most likely just add this to your HTML `head`:

```html
<link rel="stylesheet" type="text/css" href="path/to/main.css">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
```

## Repo structure

This repo contains:

- `content/`: sample books and book parts that use `paged.js`.
- `default/`: the base styles that all stylesheets share.
    - `default/partials/`: a set of Sass partials. Default styles all start here.
    - `default/main.scss`: the file that imports variables and partials.
    - `default/_selectors.scss`: defines which HTML elements you use for common book features.
    - `default/_styles.scss`: defines (or imports) styles that apply to those elements.
    - `default/_variables.scss`: defines a wide range of variables that affect your book design.
- `themes/`: opinionated variations on the `default` styles, where you can create custom themes by defining your own selectors, variables and styles. Each theme subfolder follows the same structure as `default/`.
- `css/`: the output folder, where finished CSS lands.
- `run.sh`: run this on Mac and Linux to build your ready-to-use CSS and serve the book content in Chrome.
- `run.bat`: run this on Windows to build your ready-to-use CSS and serve the book content in Chrome.
- `LICENSE`: an MIT license.
- `README.md`: this guidance.
- `index.html`: a landing page for the sample content in this repo.

## The approach

Our aim is to make it quicker and easier to create new book designs, without writing loads of CSS from scratch.

### Creating new styles

There are three optional steps to creating a new theme:

1. Add your book's selectors in `themes/yourtheme/_selectors.scss`.

   Depending how your books' HTML has been built, you may have different selectors for book features. For instance, a chapter in one book might be in `<div class="chapter">`, and `<section id="chapter-1">` in another. The different chapter selectors in each of these cases might be `.chapter` and `[id^=chapter-]` respectively.

1. Set variables in `themes/yourtheme/_variables.scss`.

   We use a bunch of variables that affect your final CSS. You can see the defaults in `default/_variables.scss`. To override one of those, add it to `themes/yourtheme/_variables.scss` without the `!default` rule. For example, to change the page width, add `$page-width: 152mm;` to `themes/yourtheme/_variables.scss`.

1. Add your own style rules to `themes/yourtheme/_styles.scss`.

   This file is for any styling. You can write in CSS or `.scss` syntax. To keep your designs aesthetically consistent, it's good to be familiar with the variables we design with in `default/_variables.scss`, and to use them wherever possible.

### On features as mixins

We create many book features as Sass mixins, which are then `@include`d in elements and classes.

This makes it easy to give different elements the same design in different contexts. For example, let's say your book's chapters are divided into parts. Your part titles will be `h1`s, and your chapter titles `h2`s. What heading level are your frontmatter headings, like 'Contents' and 'Prologue'? They are `h1`s sementically, but in terms of visual significance they need to *look like* the `h2`s.

So if, visually speaking, you have a big `heading-1` and a smaller `heading-2`, your part titles need to be `h1.heading-1`, your frontmatter titles `h1.heading-2`, and your chapter titles `h2.heading-2`. This will ensure you have both semantically accurate HTML and visually sensible styles.

For that reason, we've created styles as mixins, which can then be applied to any given element or class in your custom CSS. For example, if you want a `p.subheadline` paragraph to *look* like an `h2`, but remain a paragraph in HTML, you'd add this to your custom CSS:

```
.subheadline {
    @include heading-2();
}
```

And if you want your dedications to look like epigraphs:

```
.dedication {
    @include epigraph();
}
```

## Tips and troubleshooting

### Paged.js feature support

Some existing roadmap items and issues in `paged.js` that are relevant here:

- We can't yet reset a page number to a specific number, e.g. `.page-20 (counter-reset: page 20)}` only resets to 1, not to 20. (See [issue 91](https://gitlab.pagedmedia.org/tools/pagedjs/issues/91).)
- We can't yet `float: top` and `float: bottom`. (See [issue 90](https://gitlab.pagedmedia.org/tools/pagedjs/issues/90).)
- Bleed and trim are not yet supported. (See [issue 82](https://gitlab.pagedmedia.org/tools/pagedjs/issues/82).)
- Setting a `leader(" ")` in `a::after` for TOCs is not yet supported. This is [noted on the specs roadmap](https://gitlab.pagedmedia.org/tools/pagedjs/wikis/Support-of-specifications).
- We can't use `string-set` yet. (See [issue 44](https://gitlab.pagedmedia.org/tools/pagedjs/issues/44).)

When writing CSS, also note that the divs that `paged.js` introduces (in order to manage pagination) break some CSS child selectors like `>`. This is probably not avoidable, but it does make design work more challenging, and is important to keep in mind.

### Fonts

In this project, we link to online web fonts. This is just for demo purposes, and is a *bad idea* for real book production. When you make books for production, you should save and link to the actual font files in each project, and not link to fonts on the web, or to font files shared by different projects. This is because once you've refined your pages, any changes to the font files (e.g. adjustments to glyphs or kerning) could cause your pages to reflow in new and unintended ways.
