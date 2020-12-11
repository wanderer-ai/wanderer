#!/bin/bash

# https://github.com/karol-f/vue-custom-element
# Requires sudo npm i -g @vue/cli-service-global
# vue build --target lib --name example-component main.js



sudo vue build --target wc --name my-element ./src/App.vue
