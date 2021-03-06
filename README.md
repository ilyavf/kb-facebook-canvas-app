Facebook.Canvas.App
===================

Facebook Canvas Application-Test User Experience of Photo Exchange

The project was created using yeoman toolset (http://yeoman.io/).
Tools used:
- bower (dependency manager)
- compass (SASS compiler)
- grunt (build tool)

To build the project run from inside the project folder (see Gruntfile.js for task details):
- $ grunt build


## NodeJS

The app itself is all static HTML/CSS/javascript. Could be hosted on any webserver.
For sending Facebook App notifications we use NodeJS server api.

### To run node webserver
Run with environment parameter:
- $ NODE_ENV=production node server.js
- $ NODE_ENV=development node server.js

This will serve the root url '/' for AngularJS app, and '/api' or '/canvas_app/api' for NodeJS api.
Both app and api are running on the same port.

For production environment predefined port is 1337. For dev it is 1347.

To specify port directly run NodeJS server with the PORT and PORT_SSL parameters:
- $ NODE_ENV=production, PORT=1234, PORT_SSL=1235 node server.js


### SSL

NodeJS will expect ssl certificate and key to be stored in "../ssl" folder

```cmd
$ cd ../ssl
$ ln -s /etc/apache2/ssl/kooboodle.crt
$ ln -s /etc/apache2/ssl/kooboodle.key
```

### Upstart on Ubuntu

Copy 'nodejs-facebook-canvas-app.conf' to folder /etc/init/.
```cmd
/etc/init/nodejs-facebook-canvas-app.conf:
...
    exec sudo node /var/www/apps.kooboodle.com/fb_canvas_dev/server.js >> /var/log/node.log 2>&1
...

Try and check logs:

$ sudo start nodejs-facebook-canvas-app

$ tail /var/log/node.log
DEVELOPMENT. Client app folder: /var/www/apps.kooboodle.com/fb_canvas_dev/app
HTTP:  on port 1337
HTTPS:  on port 1338

```

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
    ProxyPass /canvas_app/api http://localhost:1337/api
```

- run nodejs:
```
$ node server.js
Web server listening on port 1337
```