var Util = {}; // utility
var Node = {}; // Node Modules
var Class = {}; // Classes
var Constant = {}; // Constant
var Settings = {};
var Functions = {
    Debug: {}
};

var Library = {
    Galleria: Galleria,
    QrCode: QRCode,
    Jquery: $
};


/**
 User Configuration
 */

(function(){
    var prefix = './js/node_modules/';
    Util.require = function(x){
        return require(prefix+x);
    };
}());

Util.createSharingServer = Util.require('sharing_server');

(function() {
    var path = require('path');
    path.filename = function(x) {
        var base = path.basename(x),
            ext = path.extname(x);
        return base.slice(0, base.length - ext.length);
    };
}());

(function(){
    Util.getDefaultTheme = function(x){

        // TODO Here

        return {};
    };
    Settings.Theme = Util.getDefaultTheme();
}());

(function(){
    Util.isDefined = function(x){
        if(typeof(x) == 'undefined'){
            return false;
        }else{
            return true;
        }
    };
}());

(function() {

    String.prototype.startsWith = function(str) {
        return this.indexOf(str) === 0;
    };

    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}());

(function() {
    var fs = require('fs'),
        path = require('path');

    Util.removeFile = function(p,cb){
        var file_to_remove;
        cb = cb || function(){};

        if(p instanceof Array)
            file_to_remove = path.join(p);
        else
            file_to_remove = p;
        fs.unlink(file_to_remove,cb);
    };
}());

/*
 * JQuery CSS Rotate property using CSS3 Transformations
 * Copyright (c) 2011 Jakub Jankiewicz  <http://jcubic.pl>
 * licensed under the LGPL Version 3 license.
 * http://www.gnu.org/licenses/lgpl.html
 */
(function($) {
    function getTransformProperty(element) {
        var properties = ['transform', 'WebkitTransform',
                          'MozTransform', 'msTransform',
                          'OTransform'];
        var p;
        while (p = properties.shift()) {
            if (element.style[p] !== undefined) {
                return p;
            }
        }
        return false;
    }
    $.cssHooks.rotate = {
        get: function(elem, computed, extra){
            var property = getTransformProperty(elem);
            if (property) {
                return elem.style[property].replace(/.*rotate\((.*)deg\).*/, '$1');
            } else {
                return '';
            }
        },
        set: function(elem, value){
            var property = getTransformProperty(elem);
            if (property) {
                value = parseInt(value);
                $(elem).data('rotatation', value);
                if (value === 0) {
                    elem.style[property] = '';
                } else {
                    elem.style[property] = 'rotate(' + value%360 + 'deg)';
                }
            } else {
                return '';
            }
            return '';
        }
    };
    $.fx.step.rotate = function(fx){
        $.cssHooks.rotate.set(fx.elem, fx.now);
    };
})($);


(function(){
    Util.rotate = function(query, degree){
        $(query).css('rotate',degree);
        return Util;
    };

}());

Util.storage = window.localStorage;

(function() {
    var os = require('os');
    var wirelessName = ['en1', 'en4', 'wlan0', 'en0'];
    var getWifiIp = function() {
        var ifaces = os.networkInterfaces(),
            ip = undefined;
        wirelessName.forEach(function(name) {
            var wl = ifaces[name];
            if (wl) {
                wl.forEach(function(val) {
                    if (val.family == 'IPv4') {
                        ip = ip || val.address;
                    }
                });
            }
        });
        return ip;
    };
    Object.defineProperty(Util, "wifi_ip", {
        get: getWifiIp
    });
}());

(function(){
    var chokidar = require('chokidar');
    var noop = function(){};
    function DirWatcher(path,cb){
        this.path = path;
        this.addCb = cb;
    }

    DirWatcher.prototype = function(){
        return {
            start:function(){
                this.watcher = chokidar.watch(this.path,{
                    ignored: /[\/\\]\./
                }).on('add', this.addCb);
                return this;
            },
            stop:function(){
                this.watcher && this.watcher.close();
                return;
            }
        };
    }();


    Class.DirWatcher = DirWatcher;
}());

(function(){


    /**
     What Methods it should have please refer to: https://github.com/BenBBear/me310_Table/wiki/Design-of-Classes

     You could use global variable [ Util Node Constant Class Settings].

     It doesn't matter whether those global variables you may use defined before here or not,

      - since you use those vars inside function definition
      - they will be refered when the main calls all the functions here
      - and certainly that time everything is defined already
     */
    var GestureDetector = function(){
        // TODO
    };

    GestureDetector.prototype = function(){
        // TODO
        return {};        //
    }();



    Class.GestureDetector = GestureDetector;
}());

(function(){

    /**
     What Methods it should have please refer to: https://github.com/BenBBear/me310_Table/wiki/Design-of-Classes

     You could use global variable [ Util Node Constant Class Settings].

     It doesn't matter whether those global variables you may use defined before here or not,

      - since you use those vars inside function definition
      - they will be refered when the main calls all the functions here
      - and certainly that time everything is defined already
     */
    var theme_path_a = './lib/other/galleria/themes/',
        theme_path_b = '/galleria.',
        theme_path_c = '.min.js';

    var retry_period = 300;

    var theBear = {
        image: './assets/images/bear.jpg',
        thumb: './assets/images/bear.jpg',
        big: './assets/images/bear.jpg',
        title: 'Bear',
        description: 'A Lovely Bear'
    };

    var makeImage = function(file_path){
        var path = require('path');
        return {
            image:file_path,
            thumb:file_path,
            big:file_path,
            title:path.filename(file_path),
            description:path.basename(file_path)
        };
    };

    var makeVideo = function(){
        // TODO
        var msg = 'makeVideo not implemented';
        alert(msg);
        throw new Error(msg);
    };


    var PhotoGallery = function(opt){
        // TODO
        var me = this;
        this.option = $.extend({}, opt);
        this.option.ready =  this.option.ready || function(){};
        this.option.event  = this.option.event || {};
        this.option.dataSource = this.option.dataSource || [theBear];

        var theme = this.option.theme = this.option.theme || 'azur';
        var theme_path = theme_path_a + theme + theme_path_b + theme + theme_path_c;
        this.element = this.element || '.galleria';
        this.Galleria.loadTheme(theme_path);

        /**
         Set up Gallery Storage
         */

        // me.galleria_instance
        this.dir_watcher = new Class.DirWatcher(this.option.path, function(path, stat){
            // add the image/video into the Gallery
            var elm;
            if(path.endsWith('.json'))
                elm = makeVideo(path);
            else
                elm = makeImage(path);
            me.galleria_instance.push(elm);

        });
        this.sharing_server = Util.createSharingServer(this.option);




        /**
         Begin creating the Gallery
         */
        this.Galleria.run(this.element, this.option);
        me.Galleria.ready(function(){
            me.galleria_instance = this;
            for(var k in me.option.event){
                this.bind(k, me.option.event[k]);
            }
            me.dir_watcher.start();
            me.sharing_server.start();
            me.option.ready(this);
        });

    };


    /**
     The "Static" Method of PhotoGallery
     */
    PhotoGallery.prototype = function(){
        return {
            Galleria: Library.Galleria,
            removeCurrent:function(){
                var me = this;
                if(me.galleria_instance){
                    var idx = me.galleria_instance.getIndex();
                    var data = me.galleria_instance.getData();
                    me.galleria_instance.splice(idx,1);
                    me.galleria_instance.next();
                    if(!data.image.startsWith('.')){
                        // Not Default Image, could delete
                        // Remove the Image from Disk
                        Util.removeFile(data.image);
                    }



                }else{
                    setTimeout(function(){
                        me.removeCurrent();
                    }, retry_period);
                }
                return me;
            }

        };
    }();



    Class.PhotoGallery = PhotoGallery;
}());

(function(){

    /**
     What Methods it should have please refer to: https://github.com/BenBBear/me310_Table/wiki/Design-of-Classes

     You could use global variable [ Util Node Constant Class Settings].

     It doesn't matter whether those global variables you may use defined before here or not,

      - since you use those vars inside function definition
      - they will be refered when the main calls all the functions here
      - and certainly that time everything is defined already
     */
    var Sketch = function(){
        // TODO
    };

    Sketch.prototype = function(){
        // TODO
        return {};        //
    }();



    Class.Sketch = Sketch;
}());

(function(){

    /**
     What Methods it should have please refer to: https://github.com/BenBBear/me310_Table/wiki/Design-of-Classes

     You could use global variable [ Util Node Constant Class Settings].

     It doesn't matter whether those global variables you may use defined before here or not,

      - since you use those vars inside function definition
      - they will be refered when the main calls all the functions here
      - and certainly that time everything is defined already
     */
    var Theme = function(){
        // TODO
    };

    Theme.prototype = function(){
        // TODO
        return {};        //
    }();



    Class.Theme = Theme;
}());

/**
TODO in main:

- Set up Jssor Slider (combined with css tweaks and some html)
- Initialize (for PhotoGallery etc...)
- Hand code Interaction Logic  (combined with css to beautify the web page)
 */

function main() {

    var bear = {
        image: './assets/images/bear.jpg',
        thumb: './assets/images/bear.jpg',
        big: './assets/images/bear.jpg',
        title: 'my first image',
        description: 'Lorem ipsum caption'
    };
    var data = [bear, bear];
    var gallery = new Class.PhotoGallery({
        path:'/Users/xyzhang/Pictures/Pasteasy'
        //this path should be selectable from startup of the program, currently just name it here
    });



    Functions.Debug.delPicture = function() {
        debugger;
        gallery.removeCurrent();
    };


}

if(Util.isDefined('main'))
    main();
else{
    alert('Main Function is not Defined!');
}
