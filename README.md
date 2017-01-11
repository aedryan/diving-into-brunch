# Diving into Brunch

[Enter Brunch](http://brunch.io/).


* To start with, [the getting started
guide](http://brunch.io/docs/getting-started) on Brunch’s official page is a
fine way to learn the basics.
* The former guide ends with [a link to a more advanced
guide](https://github.com/brunch/brunch-guide) that will hopefully answer most
of the questions you’ll have about how to configure and extend it.
* I spent a lot of time looking over [the config
page](http://brunch.io/docs/config) and you probably will too.

Start off in whatever directory you use to manage your projects, by the time I
started following along with Brunch’s guide I had already initialized a
package.json file in a project directory. So following along with the guide and
running the new project command gave me a project directory inside of a project
directory. Woops! I recommend you read over the getting started guide without
actually following along on your own. It’ll have you create a new project with a
skeleton (which the advanced guide recommends you hold off on), and show you how
to build and then integrate new dependencies into your project. Read it, skim
it, or follow along if you want; enjoy all of the fine wordplay, and then move
on to the advanced guide.

The advanced guide starts getting good in [Chapter
4](https://github.com/brunch/brunch-guide/blob/master/content/en/chapter04-starting-from-scratch.md),
where you start building your app. In order for Brunch to find and bundle the
files in your app, you’ll need to decide which of the *mandatory* plugins to
use. Under the **Compilers** heading of their [plugins
page](http://brunch.io/plugins) you’ll find a list popular plugins. Needless to
say, [javascript-brunch](https://github.com/brunch/javascript-brunch) is
mandatory for VanillaJS**™**. You’ll also need a style plugin, I’m using
[sass-brunch](https://github.com/brunch/sass-brunch) in my example because
reasons. Templates are an embarrassingly new thing for me and I decided that
[Handlebars](http://handlebarsjs.com/) was the way to go so I installed
[handlebars-brunch](https://github.com/brunch/handlebars-brunch).

Once you start working with your **brunch-config.js** file, you’ll discover that
at the heart of Brunch’s configuration is the **files** key. In it you have 3
keys: **javascripts**, **stylesheets**, and **templates**, to specify how
each of the 3 file types are bundled. The simplest way is to use a **joinTo**
object where each of it’s keys is the output filename and each value is a
pattern of files to look for and bundle. In my example I have my own modules
named as **name.module.js** and bundled into an **app.js** file. My tests are
named **name.test.js**, and are bundled into a **test.js** file. Finally the
outside dependencies my app relies on are found by looking for **javascripts**
in any directory other than the app folder and are bundled into **libraries.js.
**There’s no need to name your files the same, I just like highly verbose and
organized file systems.

    files: {
      javascripts: {
        joinTo: {
          'app.js': /app\/.+\.module/,
          'test.js': /app\/.+\.test/,
          'libraries.js': /^(?!app\/)/
        }
      },
      stylesheets: {
        joinTo: {
          'app.css': /app\/.+\.scss/
        }
      },
      templates: { 
        joinTo: {
          'app.js': /app\/.+\.hbs/
        }
      }
    }

Whether for good or ill, parts of Brunch *just work*. It seems like when looking
for **javascripts** in the **app** directory, it finds the first file it can and
builds a dependency graph from that. However when looking for packages outside
of the **app** directory that your app depends on, it only grabs the
dependencies that your app **require**s or alternatively that are included as
**globals** in your Brunch **npm** configuration.

    npm: {
      globals: {
        $: 'jquery'
      }
    }

As you follow along with the advanced guide you’ll find that a lot of what makes
Brunch special is how opinionated and automagical it is. It assumes a certain
amount of file organization (which is usually configurable) and comes with the
most desirable build functions out of the box. Sourcemaps are built in. It comes
with a watcher, that will watch for changes in your bundled files and rebundle
on change. It also comes with a handy dev server by adding the server option to
the watch command.

    brunch watch --server

Simple additions are also very easy to add. Many work simply by installing them
without any configuration necessary.

* Want to minify your JS? Install the
[uglify-js-brunch](https://github.com/brunch/uglify-js-brunch) package.
* Howabout auto-reload? Install
[auto-reload-brunch](https://github.com/brunch/auto-reload-brunch).

A little configuration can go a long way though. After incorporating the
[babel-brunch](https://github.com/babel/babel-brunch) plugin I started having
some build problems. It turns out that the babel plugin was trying to transpile
all of the outside libraries I had added and ran into some problems. Adding the
following plugin configuration solved my problems.

    babel: {
      ignore: [/node_modules/]
    }

*****

Since I’m new to templates and [Handlebars](http://handlebarsjs.com/), this
might not even be a thing. When you use
[handlebars-brunch](https://github.com/brunch/handlebars-brunch) you can require
your templates into your modules as you would expect. However the
**Handlebars.compile** method is not necessary as each instance of your template
will exist in a wrapper that allows it to be used as a function.

    var tmpl = require("main.template"),
      cxt = {title: "main title", body: "main body"},
      html = tmpl(cxt);

Again, this could just be my lack of knowledge but it wasn’t clear that this was
going to work from some light reading of the Handlebars and handlebars-brunch
documentation.

*****

Incorporating automated testing into Brunch was the biggest challenge. Testing
is another aspect of programming that I’m shamefully new to. In the past I’ve
gotten [Karma](https://karma-runner.github.io/1.0/index.html),
[Jasmine](https://jasmine.github.io/), and [PhantomJS](http://phantomjs.org/) up
and running for smaller projects so I decided to try that with Brunch. I found
the [karma-brunch](https://www.npmjs.com/package/karma-brunch) plugin and was
off to the races.

As I stated before I like high verbosity organization, to that end I try to keep
javascript, styles, templates, and tests specific to a single module in the same
folder. So following the karma-brunch example configuration I created a
**javascripts** **joinTo** to concatenate my tests together.

    'test.js': /app\/.+\.test/,

The karma-brunch example plugin configuration was a good start but I had some
problems when I forgot to include my libraries and app files into the testing
files array. Clearing that up and remembering that I needed to include
frameworks, plugins, and browsers, I ended up with a suitable Karma
configuration.

    karma: {
      frameworks: [
          'jasmine'
      ],
      files: [
          "public/libraries.js",
          "public/app.js",
          "public/test.js"
      ],
      plugins: [
          'karma-jasmine',
          'karma-phantomjs-launcher'
      ],
      browsers: [
        'PhantomJS'
      ]
    }

I felt like I had all of the pieces put together but I couldn’t get any of my
tests to run. My **test.js** file was included in the Karma config but since
each test was encapsulated in a **require.register** call they weren’t actually
be run. Looking back at the karma-brunch example configuration I noticed it’s
use of the **autoRequire** option, this lead me to investigate how it worked.

Each key of the **autoRequire** object designates an output file and it’s value
is an array of strings that are **require**d at the end of that file. I added a
**test.js** key to the **autoRequire** object and set it’s value to an array of
test module name strings and my tests started running. At first it ended up
looking something like this:

    autoRequire: {
      "test.js": ['app.test','main.test','page.test']
    }

I knew this wasn’t a tenable solution in the long run so after a bit of research
into how some Node packages traverse the file system I found
[fs-readdir-recursive](https://www.npmjs.com/package/fs-readdir-recursive). I
ended up using it to recursively find all files in the app directory containing
the string **test** and slice them the same way I was already doing in the
**modules** **nameCleaner.**

    const cleanPath = (path) => {
      return path.slice(
        path.lastIndexOf("/") + 1,
        path.lastIndexOf(".")
      );
    }

    ...

    autoRequire: {
      "test.js": read("app")
        .filter(item => item.indexOf("test") > -1)
        .map(cleanPath)
    }

Now all of my tests were running, and succeeding to boot!

*****

There were a couple of things I didn’t incorporate into my brunch builds yet. I
made a couple of weak attempts to get
[sprite-brunch](https://github.com/mllrsohn/sprite-brunch) working to no avail
and completely forgot about the joy of autoprefixing, however there seems to be
a simple enough solution
[postcss-brunch](https://github.com/brunch/postcss-brunch).