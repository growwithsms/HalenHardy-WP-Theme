# HalenHardy's WordPress Theme!

With comments!

## What's here?

`assets/` contains static front-end files and images. In other words, your Sass files, JS files, SVGs, or any PNGs would live here.

`acf-json/` contains JSON files for tracking Advanced Custom Fields. This is incredibly useful for version control. After cloning this repository, you can go into Custom Fields from the Dashboard and select "Sync" to import these custom fields into your theme.

`lib/` contains files for custom post type arguments and taxonomies. These are added to WordPress inside functions.php and could be included there, but are separated into other files to keep functions.php a bit cleaner.

`views/` contains all of your Twig templates. These correspond 1 to 1 with the PHP files that make the data available to the Twig templates.
