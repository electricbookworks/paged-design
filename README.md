# Book designs for Paged.js

Customisable, ready-to-use designs for simple books laid out with Paged.js.

## Project aims

This project is a work in progress. We're aiming to:

1. Create a library of Sass partials that account for common book features as base styles (e.g. `_bibliography.scss`). These can be styled lightly with Sass variables. These partials will have a vanilla, non-opinionated design. They will typeset pages according to common book-design fundamentals (e.g. indented paras, running heads, copyright-page layout, start-on-recto pages).
2. Create add-on Sass partials that import the base styles and add opinionated book styles, as a theme (e.g. `_bibliography-ivorytower.scss`, `_bibliography-scifi.scss`)

## Usage

1. Edit the files in `custom`, if you like.
1. Run `./run.sh` on Mac and Linux or `run.bat` on Windows. (This builds and watches for Sass changes, and serves index.html so that the page can fetch paged.js.)
1. Use `css/main.css` in your book.

More on [our approach](#the-approach) below.

## Repo structure

This repo contains (or will contain):

- `content/`: sample books and book parts that use Paged.js
- `partials/`: our library of Sass partials.
- `custom/`: add your own custom selectors, variables and styles here.
- `main.scss`: the file that imports variables and partials.
- `css/`: the output folder, where finished CSS lands.
- `run.sh`: run this on Mac and Linux to build your ready-to-use CSS and serve the book content in your browser.
- `run.bat`: run this on Windows to build your ready-to-use CSS and serve the book content in your browser.
- `LICENSE`: an MIT license.
- `README.md`: this guidance.

## The approach

The aim here is to make it relatively quick and easy to create new book designs, without writing loads of CSS.

### Creating new styles

There are three optional steps:

1. Add your book's selectors in `custom/_selectors.scss`.

   Depending how your books' HTML has been built, you may have different selectors for their features. For instance, a chapter in one book might be in `<div class="chapter">`, and `<section id="chapter-1">` in another. The different chapter selectors in each of these cases might be `.chapter` and `[id^=chapter-]` respectively.

1. Set variables in `custom/_variables.scss`.

   We use a bunch of variables that determine your final CSS. You can see the defaults in `default/_variables.scss`. To override one of those, add it to `custom/_variables.scss`. For example, to change the page width, add `$page-width: 152mm;` to `custom/_variables.scss`.

1. Add your own custom style rules to `custom/_styles.scss`.

   This file is for any custom styling. You can write in CSS or .scss syntax. To keep your designs aesthetically consistent, it's good to be familiar with the variables we design with in `default/_variables.scss`, and to use them wherever possible.

### Features as mixins

We create all book-design features as Sass mixins, which are then included in elements and classes.

This makes is easy to give different elements the same design in certain contexts. For example, let's say your book's chapters are divided into parts. Your part titles will be `h1`s, and your chapter titles `h2`s. What heading level are your frontmatter headings, like 'Contents' and 'Prologue'? They are `h1`s sementically, but in terms of visual significance they need to *look like* the `h2`s.

So if, visually speaking, you have a big `heading-1` and a smaller `heading-2`, your part titles need to be `h1.heading-1`, your frontmatter titles `h1.heading-2`, and your chapter titles `h2.heading-2`. This will ensure you have semantically accurate HTML and visually sensible styles.

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

## Troubleshooting

Some existing roadmap items and issues in `paged.js` that are relevant here:

- We can't yet reset a page number to a specific number, e.g. `.page-20 (counter-reset: page 20)}` only resets to 1, not to 20. (See [issue 91](https://gitlab.pagedmedia.org/tools/pagedjs/issues/91).)
- We can't yet `float: top` and `float: bottom`. (See [issue 90](https://gitlab.pagedmedia.org/tools/pagedjs/issues/90).)
- Bleed and trim are not yet supported. (See [issue 82](https://gitlab.pagedmedia.org/tools/pagedjs/issues/82).)
- Setting a `leader(" ")` in `a::after` for TOCs is not yet supported. This is [noted on the specs roadmap](https://gitlab.pagedmedia.org/tools/pagedjs/wikis/Support-of-specifications).
- We can't use `string-set` yet. (See [issue 44](https://gitlab.pagedmedia.org/tools/pagedjs/issues/44).)

When writing CSS, also note that the divs that `paged.js` introduces (in order to manage pagination) break some CSS child selectors like `>`. This is probably not avoidable, but it does make design work more challenging, and is important to keep in mind.
