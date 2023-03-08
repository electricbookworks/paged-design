# Book designs for paged.js

Customisable book designs created with [Paged.js](https://pagedjs.org/).

## Project aims

This project is a work in progress. The aim is to make it easy to create and adapt book designs for use with Paged.js. Currently, Paged.js and therefore this tool only works properly in Chrome.

Our default library of Sass partials account for common book features as base styles (e.g. `_bibliography.scss`). These partials have a vanilla, non-opinionated design, and can be styled lightly just by setting Sass variables.

Our default styles follow common book-design fundamentals, such as indented paragraphs, running heads, copyright-page layouts, and start-on-recto pages.

The project already includes a few opinionated designs as themes. You can use or adapt them to suit your books.

## Use a theme in your project

See the [instructions](https://electricbookworks.github.io/paged-design) on the demo site for downloading and customising a theme for your project.

## Develop new themes

### Initial setup

1. Install [Node](https://nodejs.org).
2. Clone this repo.
3. At the command line in this folder, run `npm install`.
4. To run the site locally and build CSS as you make changes, run `npm start` and open Chrome at [http://localhost:5000/index.html](http://localhost:5000/index.html).

### Development

1. In `themes`, make a copy of `themes/template` or another theme you want to adapt. Name your copy of the `template` folder for the name of your new theme, using no spaces, and ideally only lowercase letters.
1. Edit and add to your theme's `_selectors.scss`, `_styles.scss`, and `_variables.scss`. These simply override the `_defaults` when they're imported by the theme's `main.scss` file. See [Selectors, Variables and Styles](#selectors-variables-and-styles) below for more detail.
1. Run `npm start` at the command line. (This will run the site on your machine and rebuild CSS as you make changes to files.)
1. Open Chrome at [http://localhost:5000](http://localhost:5000).
1. To get a PDF for printing, use Ctrl+P (Windows) or Cmd+P (Mac) to save as PDF in Chrome.

In order to demo stylesheets in this project, we load stylesheets and Paged.js a little differently from how you'd load it in your book-production HTML. We use the `js/pager.js` script, which adds the theme-selection dropdown and waits for any MathJax to load on the page before running Paged.js.

In actual book-production, you wouldn't do this. You'd most likely just add links to the Paged.js polyfill and your finished CSS to your HTML `head` like this:

```html
<link rel="stylesheet" type="text/css" href="path/to/main.css">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
```

where `path/to/main.css` is the actual path to your finished CSS file.

#### Selectors, variables and styles

There are three parts to a theme: selectors, variables and styles. For your project, you may have to adapt these for each theme you create or each book you create CSS for.

1. **Selectors**

   Add your book's selectors in `themes/yourtheme/_selectors.scss`.

   A selector is a word or phrase in CSS that identifies a particular kind of element in your book content's HTML. For instance, `p.epigraph` is the selector that defines all paragraphs tagged with `class="epigraph"`. [Here is a good reference for selectors](https://medium.com/design-code-repository/css-selectors-cheatsheet-details-9593bc204e3f).

   Depending how your books' HTML has been built, you may have different selectors for book features. For instance, a chapter in one book might be in `<div class="chapter">`, and `<section id="chapter-1">` in another. The different chapter selectors in each of these cases might be `.chapter` and `[id^=chapter-]` respectively.

1. **Variables**

   Because we use Sass to generate CSS, we can use variables. Variables are how we store things like measurements, colours, and options that we want to reuse throughout our designs. For instance, if we store our text font's name in a `$font-text-main` variable, we can use the variable all over our code, and when we want to change the font we only change the value of the variable in one place.

   We set variables in `themes/yourtheme/_variables.scss`.

   We use a wide range of variables that affect your final CSS. You can see the default variables in `default/_variables.scss`. To override one of those defaults, add it to `themes/yourtheme/_variables.scss` without the `!default` rule. For example, to change the page width, add `$page-width: 152mm;` to `themes/yourtheme/_variables.scss`.

1. **Styles**

   Once you've defined selectors and variables, you can create custom CSS rules that add to or override our `default` styles.

   Add your own style rules to `themes/yourtheme/_styles.scss`.

   This file is for any custom styling. You can write in CSS or `.scss` syntax. To keep your designs aesthetically consistent, it's good to be familiar with the variables in `_defaults/_variables.scss`, and to use them wherever possible.

## The approach

Our aim is to make it quicker and easier to create new book designs, without writing loads of CSS from scratch.

### On features as mixins

We create many book features as Sass mixins, which are then `@include`d in elements and classes.

This makes it easy to give different elements the same design in different contexts. For example, let's say your book's chapters are divided into parts. Your part titles will be `h1`s, and your chapter titles `h2`s. What heading level are your frontmatter headings, like 'Contents' and 'Prologue'? They are `h1`s semantically, but in terms of visual significance they need to *look like* the `h2`s.

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

Some existing roadmap items and issues in Paged.js that are relevant here:

- ~~We can't yet reset a page number to a specific number, e.g. `.page-20 (counter-reset: page 20)}` only resets to 1, not to 20. (See [issue 91](https://gitlab.coko.foundation/pagedjs/pagedjs/-/issues/91).)~~
- We can't yet `float: top` and `float: bottom`. (See [issue 90](https://gitlab.coko.foundation/pagedjs/pagedjs/-/issues/90).)
- Bleed and trim support have recently been added, and need to be implemented in these themes. (See [issue 82](https://gitlab.coko.foundation/pagedjs/pagedjs/-/issues/82).)
- Setting a `leader(" ")` in `a::after` for TOCs is not yet supported. This is [noted on the specs roadmap](https://pagedjs.org/documentation/cheatsheet/).
- ~~We can't use `string-set` yet. (See [issue 44](https://gitlab.coko.foundation/pagedjs/pagedjs/-/issues/44).)~~ [Now available, to be implemented here.](https://pagedjs.org/posts/so-long-@media-screen!/#one-but-not-least)
- Too much specificity in your CSS selectors can break paged.js. Paged.js has to rewrite a lot of your paged-media styles, and can't handle too much class nesting. If your find your classes are not being applied, and you can't even see them in dev tools when previewing your page layout, then they may be too specific.

When writing CSS, also note that the divs that Paged.js introduces (in order to manage pagination) break some CSS child selectors like `>`. This is probably not avoidable, but it does make CSS work more challenging, and is important to keep in mind.

### Fonts

In this project, we link to online web fonts. This is just for demo purposes, and is a *bad idea* for real book production. When you make books for production, you should save and link to the actual font files in each project, and not link to fonts on the web, or to font files shared by different projects. This is because once you've refined your pages, any changes to the font files (e.g. adjustments to glyphs or kerning) could cause your pages to reflow in new and unintended ways.

### MathJax

The paged.design demo site supports Mathjax 3, and not earlier versions of MathJax. That is, `pager.js` will wait for MathJax 3 to do its math layout before applying theme styles and Paged.js layout. If your content HTML loads a Mathjax v2 script, the demo here may not work.

## Support

This project was made possible by funding and encouragement from [Adam Hyde](https://www.adamhyde.net/), the [Paged Media](http://www.pagedmedia.org/) initiative, and the [Shuttleworth Foundation](https://shuttleworthfoundation.org).

The [paged.design](https://paged.design) site is maintained by [Electric Book Works](https://electricbookworks.com) and hosted with Netlify.
