module.exports = function (grunt) {
    grunt.registerMultiTask("findatagLocale", "Task to generate locale properties.", function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var finder = require("grunt-cellarise-findatag"),
            done = this.async(),
            self = this;
        // Iterate over all src-dest file pairs.
        this.files.forEach(function (f, idx) {
            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                var result = [];
                // Read file source.
                //var src = grunt.file.read(filepath);
                // Process file
                finder.parse(filepath, {
                    tags: ['i'],
                    onTag: function (def, callback) {
                        var attr = def.attributes;
                        if(attr.v === undefined) {
                            result.push("");
                            callback(null, "");
                        } else {
                            result.push(attr.n + "=" + attr.v);
                            callback(null, attr.n + "=" + attr.v);
                        }
                    }
                }, function () {
                    // result is the full processed file
                    // Write the destination file.
                    grunt.file.write(f.dest, result.join("\n"));

                    // Print a success message.
                    grunt.log.writeln(f.dest + ' file created.');
                    if(idx+1 === self.files.length){
                        done();
                    }
                });


                //return src;
            });

        });
    });

};

