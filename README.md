Facebook.Canvas.App
===================

Facebook Canvas Application-Test User Experience of Photo Exchange

The project was created using yeoman toolset (http://yeoman.io/).
Tools used:
- bower (dependency manager)
- compass (SASS compiler)
- grunt (build tool)

To build the project run from inside the project folder (see Gruntfile.js for task details):
$ grunt build

To run tests run:
$ grunt test

## NodeJS

For sending Facebook App notifications use nodejs server api.

### To setup nodejs server with apache on the same machine

- install npm package dependencies
- setup proxy on apache:

``` cmd
Enable mod_proxy and mod_proxy_http:
/etc/apache2/mods-enabled/
    proxy.conf -> ../mods-available/proxy.conf
    proxy.load -> ../mods-available/proxy.load
    proxy_http.load -> ../mods-available/proxy_http.load

Add httpd config for app hosting on a subdomain:
/etc/apache2/sites-enabled/proxy_to_nodejs.conf:
    <VirtualHost *:80>
        ServerName nodejs.kooboodle.com
        ProxyRequests off
        <Location />
                ProxyPass http://localhost:1337/
                ProxyPassReverse http://localhost:1337/
        </Location>
    </VirtualHost>

Or in a subfolder of existing apache domain:
/etc/apache2/sites-enabled/proxy_to_nodejs.conf:
    ProxyPass /_fb/canvas_app/ http://localhost:1337/
    ProxyPass /fb_api http://localhost:1337/api
```

- run nodejs:
```
$ node server.js
Web server listening on port 1337
```