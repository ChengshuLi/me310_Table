var Util = {}; // utility
var Node = {}; // Node Modules
var Class = {}; // Classes
var Constant = {}; // Constant
var Settings = {};
var Functions = {
    Debug: {}
};

var Globals = {};

var Library = {
    Galleria: Galleria,
    QrCode:  require('qrcode-npm'),
    Jquery: $,
    DrawingBoard: DrawingBoard
};

(function(){
    var prefix = './js/node_modules/';
    Util.require = function(x){
        return require(prefix+x);
    };
}());

Util.showSearchBar = function(bar, content){
    bar = bar || '.search-bar';
    content = content || '.search-content';

    $(bar).fadeIn(500);
    $(content).fadeIn(500);
    $(content+'-next').fadeIn(500);
    return Util;
};

Util.hideSearchBar = function(bar, content){
    bar = bar || '.search-bar';
    content = content || '.search-content';
    $(bar).fadeOut(500);
    $(content).fadeOut(500);
    $(content+'-next').fadeOut(500);
    return Util;
};

Util.createSharingServer = Util.require('sharing_server');

(function(){
    var http = require('http');
    var https = require('https');
    var fs = require('fs');
    var path = require('path');

    Util.download = function(src,cb){
        var filepath = path.join('/tmp/', path.basename(src));
        var file = fs.createWriteStream(filepath);
        var request = src.startsWith('https') ? https : http;
        var req = request.get(src, function(res) {
            res.pipe(file);
            file.on('finish', function() {
                file.close();
                cb(filepath);
            });
        });
    };
}());

(function() {
    var path = require('path');
    var randomstring = require('randomstring');
    var fs = require('fs');

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }

    Util.decodeBase64Image = decodeBase64Image;

    var ensurePath = function(img, cb) {
        if (path.dirname(img) != '.' && !img.startsWith('data:image')){
            cb(path.resolve(path.join('./','src',img)));
        }
        else if (img.startsWith('data:image')) {
            var imageBuffer = decodeBase64Image(img);
            var randomPath = "/tmp/" + randomstring.generate() + ".png";
            fs.writeFile(randomPath, imageBuffer.data, function(err) {
                cb(randomPath);
            });
        } else if(img.startsWith('http')) {
            Util.download(img, cb);
        } else{
            throw new Error('unrecognized image type');
        }
    };

    Util.fetchImages = function(img1, img2, cb) {
        ensurePath(img1, function(p1) {
            ensurePath(img2, function(p2) {
                cb(p1, p2);
            });
        });
    };
}());

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

(function (){
    //**********//
    var google_images = Util.require('google-images');
    Util.googleImageSearch = google_images.search;

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
    var image_ext_array = [
        '.jpg','.jpeg','.png','.bmp','.gif','.svg'
    ];

    Util.isImage = function(x) {
        var path = require('path'),
            ext = path.extname(x);

        return image_ext_array.indexOf(ext) !== -1;
    };
}());

(function() {
    //**********//
    Util.onLexiconInput = function(query, cb) {
        $(query).on('input propertychange paste',function() {
            cb(this.value);
        });
    };


    Util.addLexiconResultToGallery = function(){};

    Util.addLexiconResult = function(query, opt){
        var parent = $(query);
        parent.empty();
        $('<div class="clearfix" ></div>')
            .prependTo(parent);
        opt = opt || {};
        opt.images.forEach(function(img){
            $('<img/>',{
                src:img.url,
                class:'lexicon-result',
                onclick: opt.onclick || function(){}
            }).prependTo(parent);
        });

    };

}());

(function(){
    Util.choosePasteasyQrCode = function(x,y){
        x = x || '#choose-pasteasy-input';
        y = y || '#qrcode-pasteasy';
        $('#choose-pasteasy-input').change(function(event) {
            var qrpath = this.files[0].path;
            // Util.qrDecode(qrpath, function(err,result){
            //     if(err){
            //         throw new Error(err);
            //     }else{
            //         debugger;
            //         Util.qrcodeToHref (y, result)
            //             .popUp(y);
            //     }
            // });
            $(y).attr('href', qrpath);
            Util.popUp(y);
        });
        $(x).trigger('click');
        return Util;
    };
}());

(function() {

    Util.popUp = function(sel, opt) {
        var __opt = $.extend({
            type: 'image',
            mainClass:'mfp-zoom-in'
        }, opt);
        $(sel).magnificPopup(__opt);
        return Util;
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
    var Datauri = require('datauri'),
        qrcode = require('zxing');



    global.Image = Image;
    global.document = window.document;
    var path = require('path');

    Util.qrDecode = function(pathToImage, cb) {
        qrcode.decode(Datauri(path.resolve(pathToImage)), function(err, result) {
            if(err)
                console.error(err);
            cb(err, result);
        });
    };

}());

(function() {

    Util.qrEncode = function(x) {
        var qr = Library.QrCode.qrcode(8, 'M');
        qr.addData(x);
        qr.make();
        var img = $(qr.createImgTag());
        return $(img).attr('src');
    };
}());

Util.qrcodeToHref = function(sel, text){
    var qrcode = Util.qrEncode(text);
    $(sel).attr('href', qrcode);
    return Util;
};

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

(function() {
    var gm = require('gm');
    var path = require('path');
    var randomstring = require("randomstring");

    Util.showSketchBoard = function(x) {
        x = x || '.sketching';
        $(x).show();
        return Util;
    };

    Util.hideSketchBoard = function(x) {
        x = x || '.sketching';
        $(x).hide();
        return Util;
    };

    Util.hideSketchBoardAndSave = function(sel_sketch, gallery) {
        sel_sketch = sel_sketch || '.sketching';
        gallery = gallery || Globals.gallery;
        var filepath = gallery.option.path;


        if ($(sel_sketch).is(":visible")) {
            var canvas = $(sel_sketch).find('canvas')[0];
            var DataUri = canvas.toDataURL();
            var current = gallery.current;
            gallery.push({
                image: DataUri,
                big: DataUri,
                thumb: DataUri,
                title: 'Noted For ' + current.title,
                description: 'Noted For ' + current.description
            });


            // Util.fetchImages(current.image, DataUri, function(background, note) {
            //     gm(background)
            //         // .resize(gallery.width,gallery.height)
            //         .composite(note)
            //         .write(path.join(filepath, 'Note_' + randomstring.generate(7) + '.png'), function(err) {
            //             if (err)
            //                 throw err;
            //         });
            // });


        }
        return Util.hideSketchBoard(sel_sketch);
    };


}());

Util.storage = window.localStorage;

(function() {
    var chokidar = require('chokidar');
    var noop = function() {};

    function DirWatcher(path, cb) {
        this.path = path;
        this.addCb = cb;
    }

    DirWatcher.prototype = function() {
        return {
            start: function() {
                var me = this;
                this.watcher = chokidar.watch(this.path, {
                    ignored: /[\/\\]\./
                }).on('add', function(path,stat) {
                    setTimeout(function() {
                        me.addCb(path,stat);
                    }, DirWatcher.prototype.WAIT_TIME);
                });
                return this;
            },
            stop: function() {
                this.watcher && this.watcher.close();
                return;
            },
            WAIT_TIME:5000
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

(function() {

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

    var makeImage = function(file_path) {
        var path = require('path');
        return {
            image: file_path,
            thumb: file_path,
            big: file_path,
            title: path.filename(file_path),
            description: path.basename(file_path)
        };
    };

    var makeVideo = function() {
        // TODO
        var msg = 'makeVideo not implemented';
        alert(msg);
        throw new Error(msg);
    };


    var PhotoGallery = function(opt) {
        // TODO
        var me = this;
        this.option = $.extend({}, opt);
        this.option.ready = this.option.ready || function() {};
        this.option.event = this.option.event || {};
        this.option.dataSource = this.option.dataSource || [theBear];

        var theme = this.option.theme = this.option.theme || 'azur';
        var theme_path = theme_path_a + theme + theme_path_b + theme + theme_path_c;
        this.element = this.element || '.galleria';
        this.Galleria.loadTheme(theme_path);
        Object.defineProperty(this, 'width', {
            get: function() {
                return $(this.element).width();
            }
        });
        Object.defineProperty(this, 'height', {
            get: function() {
                return $(this.element).height();
            }
        });

        /**
         Set up Gallery Storage
         */

        // me.galleria_instance
        this.dir_watcher = new Class.DirWatcher(this.option.path, function(path, stat) {
            // add the image/video into the Gallery
            var elm;

            if (path.endsWith('.json'))
                elm = makeVideo(path);
            else if (Util.isImage(path))
                elm = makeImage(path);

            if (elm)
                me.galleria_instance.push(elm);

        });
        this.option.Util = Util;

        this.sharing_server = Util.createSharingServer(this.option);
        this.upload_addr = this.sharing_server.upload_addr;



        /**
         Begin creating the Gallery
         */
        this.Galleria.run(this.element, this.option);
        me.Galleria.ready(function() {
            me.galleria_instance = this;
            for (var k in me.option.event) {
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
    PhotoGallery.prototype = function() {
        return {
            Galleria: Library.Galleria,
            get current() {
                return this.galleria_instance.getData();
            },

            push: function(url) {
                var me = this;
                if (url instanceof String)
                    me.galleria_instance.push(makeImage(url));
                else
                    me.galleria_instance.push(url);
                return me;
            },
            removeCurrent: function() {
                var me = this;
                if (me.galleria_instance) {
                    var idx = me.galleria_instance.getIndex();
                    var data = me.galleria_instance.getData();
                    me.galleria_instance.splice(idx, 1);
                    me.galleria_instance.next();
                    if (!data.image.startsWith('.')) {
                        // Not Default Image, could delete
                        // Remove the Image from Disk
                        Util.removeFile(data.image);
                    }



                } else {
                    setTimeout(function() {
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

    $("#storage_dir_chooser").trigger('click');
    $("#storage_dir_chooser").change(function(event) {
        __main(this.files[0].path);
    });

    /**
     Configuration
     */
    Class.DirWatcher.prototype.WAIT_TIME = 0;



    /**
     The True Main
    */
    function __main(path) {

        var init = function(f) {
            if (f) {
                init.queue.push(f);
            } else {
                init.queue.forEach(function(ifun) {
                    ifun();
                });
            }
            return init;
        };
        init.queue = [];



        var gallery = new Class.PhotoGallery({
            path: path,
            ready: function(instance) {
                init();
            }
        });



        Globals.PATH = path;
        Globals.gallery = gallery;
        Globals.init = init;


        // init for qrcode
        init(function() {
            Util.qrcodeToHref('#qrcode-uploading', gallery.upload_addr)
                .popUp('#qrcode-uploading', {
                    type: 'image'
                });
        }, 'qrcode');


        // init for lexicon
        init(function() {
            Util.onLexiconInput('.search-input', function(value) {
                Util.googleImageSearch(value, function(err, images) {
                    Util.addLexiconResult('.search-content-next', {
                        images: images,
                        // onclick: "Util.downloadAndSave(this.src, Globals.PATH)"
                        onclick: "Globals.gallery.push(this.src)"
                    });
                });
            });
            Util.hideSearchBar();
        }, 'lexicon');


        // init for sketching
        init(function() {
            var defaultBoard = new Library.DrawingBoard.Board('sketching',{
                background:'rgba(255,255,255,0.3)'
            });
            Util.hideSketchBoard();
        }, 'sketching');




    }
}

if(Util.isDefined('main')){
    main();
} else{
    alert('Main Function is not Defined!');
}
