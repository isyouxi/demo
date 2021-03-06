var gulp = require('gulp');
var spriter = require('gulp-css-spriter');

gulp.task('default', function () {
    return gulp.src('./main.css')
        .pipe(spriter({
            'spriteSheet': './publish/images/sprite.png', // 这是雪碧图自动合成的图
            'pathToSpriteSheetFromCSS': './images/sprite.png' // 这是在css引用的图片路径
        }))
        .pipe(gulp.dest('./publish'))
})