let fs = require("fs");
let _ = require("lodash");

class HtmlTemplatePlugin {
    apply(compiler) {
        compiler.hooks.done.tap(
            'Create index',
            function () {
                console.log('Create index file ...');

                let entrypoints = require('./../public/entrypoints.json');

                fs.readFile('./html/index.html', function (err, data) {
                    if (err) {
                        return console.error(err);
                    }

                    let compiled = _.template(data.toString());
                    let html = compiled({
                        'jsFiles': entrypoints.entrypoints.app.js,
                        'cssFiles':entrypoints.entrypoints.app.css
                    });

                    fs.writeFile('./public/index.html', html, function(err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                });
            }
        );
    }
}

module.exports = HtmlTemplatePlugin;
