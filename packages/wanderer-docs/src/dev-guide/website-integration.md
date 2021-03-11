# Website integration
You can integrate the wanderer.ai chat easily to your website. At the moment you can only insert the chat directly into your application using Jsdelivr CDN. Further integrations like NPM or Yarn will follow as soon as possible.

## CDN - Jsdelivr
Just include the JavaScript file to your HTML
```
<script src="https://cdn.jsdelivr.net/gh/wanderer-ai/cdn/chat-webcomponent/wanderer-chat.js"></script>
```

Then include the webcomponent to your HTML. Use the `flow-url` parameter to define the URL of your flow.
```
<wanderer-chat flow-url="https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json" base-path="/"></wanderer-chat>
```

Complete example:

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My new website</title>
  </head>
  <body>

    <!-- Include the chat webcomponent and point to your flow file using the flow-url argument -->
    <wanderer-chat flow-url="https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json" base-path="/"></wanderer-chat>

    <!-- Include the chat JavaScript file -->
    <script src="https://cdn.jsdelivr.net/gh/wanderer-ai/cdn/chat-webcomponent/wanderer-chat.js"></script>

  </body>
</html>
```
