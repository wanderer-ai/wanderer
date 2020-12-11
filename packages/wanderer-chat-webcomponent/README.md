
This is a try to create a seperate Web component package
This does not work :-( I have problems with tailwind. The wc will be generated but the @apply statements inside the CSS of node_module packages like wanderer-chat will not be executed. So my CSS is broken. I also tryed to install postcss-import but I couldnt find out how to configure this correctly.

Maybe I have to import tailwind in every package?

I now using the nuxt-custom-elements.

So I will delete the postcss.config.js files from the packages.

Maybe I can use this code later? 

# How was this package created?

1. Create a new vue JS App: https://cli.vuejs.org/guide/creating-a-project.html
* Disable linters and this stuff while creating this new package

2. Clean up the ./src dir. Only leave the App.vue and main.js files

3. The Webcomponent requires a Vue-File as entry point. This is out App.Vue. It will all wanderer Plugins.

4. Install Tailwind: https://dev.to/vonagedev/using-tailwind-css-with-vue-js-b1b
* But lets import the Style in the Vue file directly

## Fehler:

### Tailwind: No PostCSS Config found in
* Scheinbar wird in allen UNterordnern dieses File gesucht???
* Obwohl es aber im Folder liegt
* Nachdem ich in das Chat- und in das Browser Plugin eine leere postcss.config.js gelegt habe geht es nun

### Tailwind: PostCSS plugin tailwindcss requires PostCSS 8.
* Die Lösung ist hier beschrieben: https://tailwindcss.com/docs/installation#post-css-7-compatibility-build
* Achtung! Ich kann npm uninstall wegen lerna nicht nutzen! Der meckert dann wegen fehlender wanderer-packs rum.
* Daher habe ich neuen ordner mit leerem npm packet erstellt und darin die dependencys installiert.
* Dann habe ich mir den Krempel aus dieser package.json in meine kopiert.
* Vorher muss node_modules aus dem webcomponent pack gelöscht werden, weil ich nicht ordentlich uninstallen kann!
-> Kann scheinbar bald wieder entfernt werden nach den Docs.

### Tailwind: Das CSS aus dem Components wird nicht mit generiert :-(
