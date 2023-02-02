importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute(
    '/',
    new workbox.strategies.NetworkFirst()
)

workbox.routing.registerRoute(
    new RegExp(/(.*\.js|.*\.css|.*\.jpg|.*\.png|.*\.ico)/),
    new workbox.strategies.StaleWhileRevalidate()
)