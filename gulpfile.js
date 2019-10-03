const gulp = require('gulp');
const merge = require('merge-stream');
const exec = require('child_process').exec;
const mkdirp = require('mkdirp');
const replace = require('gulp-replace');
const gulpHelper = require('@littleware/little-elements/gulpHelper');
const package = require('./package.json');
const basePath = "src/@littleware/little-apps";

// TODO - automate version assignment
gulpHelper.defineTasks(gulp, { basePath, data: { jsroot: `/modules/${package.version}` } });


gulp.task('makeico', function (cb) {
    return new Promise( function(resolve, reject) {
        const path = "site/resources/img/appIcons"; 
        mkdirp( path, function(err) {
                if (err) {
                    console.log( err );
                    reject( err );
                } else {
                    resolve( path );
                }
        });
    }).then( (folderStr) => {
        const svgList = ['511', 'jwt'];
        const rezList = [ '57', '72', '114', '144', '152', '167', '180'];
        const promiseList = rezList.reduce( 
                (acc, rez) => svgList.reduce(
                    (acc, svgName) => {
                        acc.push(
                            {
                                svgPath: `${basePath}/site/resources/img/${svgName}.svg`,
                                pngPath: `${folderStr}/oo${svgName}.${rez}x${rez}.png`,
                                rez:rez
                            }
                        );
                        return acc;
                    }, acc
                ), []
            ).map(
                (info) => {
                    return new Promise( function(resolve,reject) {
                        const commandStr = `inkscape ${info.svgPath} --export-png ${info.pngPath} -w${info.rez} -h${info.rez}`;
                        console.log( "makeico running command: " + commandStr );
                        exec( commandStr, 
                            function (err, stdout, stderr) {
                                console.log(stdout);
                                console.log(stderr);
                                if ( err ) {
                                    reject( err );
                                } else {
                                    resolve( info.pngPath );
                                }
                            }
                        );
                    });
                }
            );
        return Promise.all( promiseList );
    }).then(
        (pngList) => {
            cb();
        }
    ).catch(
        (err) => {
            console.log( "PNG creation failed", err );
        }
    );
});


gulp.task('compile', gulp.series('little-compile', 'makeico', function(done) {
  // place code for your default task here
  //console.log( "Hello, World!" );
  //gulp.src( "src/**/*" ).pipe( gulp.dest( "build/" ) );
  done();
}));

gulp.task('default', gulp.series('compile', function(done) {
  // place code for your default task here
  //console.log( "Hello, World!" );
  //gulp.src( "src/**/*" ).pipe( gulp.dest( "build/" ) );
  done();
}));


/**
 * Prepare /dist folder for deployment
 */
gulp.task('stage', gulp.series('little-compileclean', function() {
    return merge(
        gulp.src('site/**/*.*'
            //).pipe(replace(`/modules/`, `/modules/${package.version}/`)
            ).pipe(gulp.dest('dist/')),
        gulp.src('node_modules/@littleware/little-elements/web/**/*.*'
            // hack for now - replace /modules/ path in styleHelper and basicShell
            ).pipe(replace(`/modules/`, `/modules/${package.version}/`)
            ).pipe(gulp.dest(`dist/modules/${package.version}/@littleware/little-elements/web/`)
            ),
        gulp.src('node_modules/@webcomponents/webcomponentsjs/**/*.*'
            ).pipe(
                gulp.dest(`dist/modules/${package.version}/@webcomponents/webcomponentsjs/`)
            ),
        //gulp.src('node_modules/@littleware/little-elements/maps/**/*.*').pipe(gulp.dest(`dist/modules/${package.version}/@littleware/little-elements/maps/`)),
        gulp.src('web/**/*.*').pipe(gulp.dest(`dist/modules/${package.version}/@littleware/little-apps/web/`)),
        gulp.src('node_modules/lit-html/lit-html.js').pipe(gulp.dest(`dist/modules/${package.version}/lit-html/`)),
        gulp.src('node_modules/font-awesome/**/*.*').pipe(gulp.dest(`dist/modules/${package.version}/font-awesome/`)),
        gulp.src('node_modules/jasmine-core/lib/jasmine-core/**/*.*').pipe(gulp.dest(`dist/modules/${package.version}/jasmine-core/lib/jasmine-core/`))
    );
}));

/*
Setup ~/.littleware/aws/accessKeys.properties 
with AWS access keys:

$ cat ~/.littleware/aws/accessKeys.properties 
#update form littleware
#Wed Aug 16 19:48:41 CDT 2017
accessKey=XXXXXX
secretKey=XXXXXXX
*/
gulp.task('deploy', gulp.series('stage', function(cb) {
    const pwdPath = process.cwd();
    const imageName = "frickjack/s3cp:1.0.0";
    const home = process.env.HOME || process.env.HOMEPATH || '';
    const commandStr = "yes | docker run --rm --name s3gulp -v " + home + "/.littleware:/root/.littleware -v '" +
        pwdPath + ":/mnt/workspace' " + imageName + " -copy /mnt/workspace/dist/ s3://apps.frickjack.com/";

    console.log('Running: ' + commandStr);

    return exec( commandStr, 
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if ( err ) {
                //reject( err );
            } else {
                cb();
            }
        }
    );
}));
