# Book designs for paged.js

Customisable, ready-to-use designs for simple books laid out with [`paged.js`](https://gitlab.pagedmedia.org/tools/pagedjs).

## Project aims

This project is a work in progress. The aim is to make it easy to copy and adapt book designs for use with `paged.js`.

So far, we've created a library of Sass partials that account for common book features as base styles (e.g. `_bibliography.scss`). These can be styled lightly with Sass variables. These partials have a vanilla, non-opinionated design. They typeset pages according to common book-design fundamentals (e.g. indented paras, running heads, copyright-page layout, start-on-recto pages).

Next, we're working on add-on styles that add opinionated styles to the defaults to create themes.

## Usage

### Use an existing stylesheet

1. Copy a CSS file from one of the theme folders in `css/themes/`, and link to it in your book's HTML files.
2. Link to the `paged.js` script.

So your HTML `head` will include these two tags:

```html
<link rel="stylesheet" type="text/css" href="path/to/main.css">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
```

### Create your own stylesheet

1. Clone this repo.
1. In `themes`, make a copy of `themes/template` or another theme you want to adapt.
1. Edit and add to its `_selectors.scss`, `_styles.scss`, and `_variables.scss`, which add to and override the defaults when they're imported by the theme's `main.scss` file. See [Creating new styles](#creating-new-styles) below for more detail.
1. Run `./run.sh` on Mac and Linux or `run.bat` on Windows.

   This builds and watches for Sass changes, and serves `index.html` so that the page can fetch `paged.js` over HTTP.

1. Add your theme to the `run` script's `sass` command, and to the `pagerThemes` object in `js/pager.js`.

Note that in order to demo stylesheets in this project, we load stylesheets and `paged.js` with `js/pager.js`. For your content, you'll probably use the finished CSS as described in 'Use an existing stylesheet' above.

## Repo structure

This repo contains:

- `content/`: sample books and book parts that use `paged.js`.
- `default/`: the base styles that all our stylesheets will share.
    - `default/partials/`: a set of Sass partials. Default styles all start here.
    - `default/main.scss`: the file that imports variables and partials.
    - `default/_selectors.scss`: defines which HTML elements you use for common book features.
    - `default/_styles.scss`: defines (or imports) styles that apply to those elements.
    - `default/_variables.scss`: defines a wide range of variables that affect your book design.
- `themes/`: opinionated variations on the `default` styles, where you can create custom themes by defining your own selectors, variables and styles. Each theme subfolder follows the same structure as `default/`.
- `css/`: the output folder, where finished CSS lands.
- `run.sh`: run this on Mac and Linux to build your ready-to-use CSS and serve the book content in your browser.
- `run.bat`: run this on Windows to build your ready-to-use CSS and serve the book content in your browser.
- `LICENSE`: an MIT license.
- `README.md`: this guidance.
- `index.html`: a landing page for the sample content in this repo.

## The approach

The aim here is to make it quicker and easier to create new book designs, without writing loads of CSS from scratch.

### Creating new styles

There are three optional steps to creating a new theme:

1. Add your book's selectors in `themes/yourtheme/_selectors.scss`.

   Depending how your books' HTML has been built, you may have different selectors for their features. For instance, a chapter in one book might be in `<div class="chapter">`, and `<section id="chapter-1">` in another. The different chapter selectors in each of these cases might be `.chapter` and `[id^=chapter-]` respectively.

1. Set variables in `themes/yourtheme/_variables.scss`.

   We use a bunch of variables that determine your final CSS. You can see the defaults in `default/_variables.scss`. To override one of those, add it to `themes/yourtheme/_variables.scss`. For example, to change the page width, add `$page-width: 152mm;` to `themes/yourtheme/_variables.scss`.

1. Add your own style rules to `themes/yourtheme/_styles.scss`.

   This file is for any styling. You can write in CSS or `.scss` syntax. To keep your designs aesthetically consistent, it's good to be familiar with the variables we design with in `default/_variables.scss`, and to use them wherever possible.

### Features as mixins

We create book features as Sass mixins, which are then `@include`d in elements and classes.

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

### Paged.js support

Some existing roadmap items and issues in `paged.js` that are relevant here:

- We can't yet reset a page number to a specific number, e.g. `.page-20 (counter-reset: page 20)}` only resets to 1, not to 20. (See [issue 91](https://gitlab.pagedmedia.org/tools/pagedjs/issues/91).)
- We can't yet `float: top` and `float: bottom`. (See [issue 90](https://gitlab.pagedmedia.org/tools/pagedjs/issues/90).)
- Bleed and trim are not yet supported. (See [issue 82](https://gitlab.pagedmedia.org/tools/pagedjs/issues/82).)
- Setting a `leader(" ")` in `a::after` for TOCs is not yet supported. This is [noted on the specs roadmap](https://gitlab.pagedmedia.org/tools/pagedjs/wikis/Support-of-specifications).
- We can't use `string-set` yet. (See [issue 44](https://gitlab.pagedmedia.org/tools/pagedjs/issues/44).)

When writing CSS, also note that the divs that `paged.js` introduces (in order to manage pagination) break some CSS child selectors like `>`. This is probably not avoidable, but it does make design work more challenging, and is important to keep in mind.

### Fonts

In this project, we link to online fonts. This is just for demo purposes, and is a bad idea for real book production. When you make books for production, you should save a copy of the actual font files with each project, and not link to fonts on the web, or to font files shared by different projects. This is because once you've refined your pages, any changes to the font files (e.g. adjustments to glyphs or kerning) could cause your pages to reflow in new and unintended ways.
