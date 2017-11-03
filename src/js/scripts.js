/*
 * jQuery css bezier animation support -- Jonah Fox
 * version 0.0.1
 * Released under the MIT license.
 */
/*
 var path = $.path.bezier({
 start: {x:10, y:10, angle: 20, length: 0.3},
 end:   {x:20, y:30, angle: -20, length: 0.2}
 })
 $("myobj").animate({path: path}, duration)

 */

;(function($){

    $.path = {};

    var V = {
        rotate: function(p, degrees) {
            var radians = degrees * Math.PI / 180,
                c = Math.cos(radians),
                s = Math.sin(radians);
            return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
        },
        scale: function(p, n) {
            return [n*p[0], n*p[1]];
        },
        add: function(a, b) {
            return [a[0]+b[0], a[1]+b[1]];
        },
        minus: function(a, b) {
            return [a[0]-b[0], a[1]-b[1]];
        }
    };

    $.path.bezier = function( params, rotate ) {
        params.start = $.extend( {angle: 0, length: 0.3333}, params.start );
        params.end = $.extend( {angle: 0, length: 0.3333}, params.end );

        this.p1 = [params.start.x, params.start.y];
        this.p4 = [params.end.x, params.end.y];

        var v14 = V.minus( this.p4, this.p1 ),
            v12 = V.scale( v14, params.start.length ),
            v41 = V.scale( v14, -1 ),
            v43 = V.scale( v41, params.end.length );

        v12 = V.rotate( v12, params.start.angle );
        this.p2 = V.add( this.p1, v12 );

        v43 = V.rotate(v43, params.end.angle );
        this.p3 = V.add( this.p4, v43 );

        this.f1 = function(t) { return (t*t*t); };
        this.f2 = function(t) { return (3*t*t*(1-t)); };
        this.f3 = function(t) { return (3*t*(1-t)*(1-t)); };
        this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); };

        /* p from 0 to 1 */
        this.css = function(p) {
            var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p), css = {};
            if (rotate) {
                css.prevX = this.x;
                css.prevY = this.y;
            }
            css.x = this.x = ( this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4 +.5 )|0;
            css.y = this.y = ( this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4 +.5 )|0;
            css.left = css.x + "px";
            css.top = css.y + "px";
            return css;
        };
    };

    $.path.arc = function(params, rotate) {
        for ( var i in params ) {
            this[i] = params[i];
        }

        this.dir = this.dir || 1;

        while ( this.start > this.end && this.dir > 0 ) {
            this.start -= 360;
        }

        while ( this.start < this.end && this.dir < 0 ) {
            this.start += 360;
        }

        this.css = function(p) {
            var a = ( this.start * (p ) + this.end * (1-(p )) ) * Math.PI / 180,
                css = {};

            if (rotate) {
                css.prevX = this.x;
                css.prevY = this.y;
            }
            css.x = this.x = ( Math.sin(a) * this.radius + this.center[0] +.5 )|0;
            css.y = this.y = ( Math.cos(a) * this.radius + this.center[1] +.5 )|0;
            css.left = css.x + "px";
            css.top = css.y + "px";
            return css;
        };
    };

    $.fx.step.path = function(fx) {
        var css = fx.end.css( 1 - fx.pos );
        if ( css.prevX != null ) {
            $.cssHooks.transform.set( fx.elem, "rotate(" + Math.atan2(css.prevY - css.y, css.prevX - css.x) + ")" );
        }
        fx.elem.style.top = css.top;
        fx.elem.style.left = css.left;
    };

})(jQuery);


$('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());

var app = $('.app'),
    start = $('.start-button'),
    intro = $('.intro');

var results = [];

$('html').append(
    "<div class='version'>α0.16</div>"
);


function introRender() {
    app.append(
        "<div class='intro'>" +
            "<div class='intro__img absolute-img animate animate-left'><img src='images/intro.jpg' alt=''></div>" +

            "<div class='intro__text animate animate-right'>" +
                "<p>Вступительное описание к игре</p>" +
                "<div class='start'><button class='start-button'>Начать игру</button></div>" +
            "</div>" +
        "</div>"
    );
}

function firstRender() {
    app.append(
        "<div class='select-gun animate animate-up animate-up--active'>" +
            "<div class='gun absolute-img'>" +
                "<img class='gun-img' src='images/gun.jpg'>" +
                "<div id='test' class='gun-settings__angle gun-settings__choose__angle animate animate-right animate-right--active'>" +
                    "<button class='angle' data-angle='0'>Выше</button>" +
                    "<button class='angle' data-angle='1'>Прямо</button>" +
                    "<button class='angle' data-angle='2'>Ниже</button>" +
                "</div>" +
            "</div>" +
            "<div class='gun-settings'>" +
                "<div class='gun-settings__bullet hidden'>" +
                    "<p>Выберите пулю</p>" +
                    "<div class='gun-settings__choose'>" +
                        SmallBullet + MediumBullet + BigBullet +
                    "</div>" +
                "</div>" +
                "<div class='gun-settings__gunpowder'>" +
                    "<p>Засыпьте порох</p>" +
                    "<div class='gun-settings__choose gun-settings__gunpowder__choose'>" +
                        SmallGunpowder + MediumGunpowder + BigGunpowder +
                    "</div>" +
                "</div>" +
                "<div class='gun-settings__angle hidden'>" +
                    "<p>Выберите наклон оружия</p>" +
                "</div>" +
                "<div class='fire hidden'>" +
                    "<button class='fire-btn'>Пли!</button>" +
                "</div>" +
                "<div class='tooBig hidden'>" +
                    "<p>Пуля слишком широкая, начни сначала</p>" +
                "</div>" +
            "</div>" +
        "</div>"
    );
}

var SmallGunpowder = "<div class='gunpowder gunpowder--small' data-gunpowder='0'>" +
                        "<div></div><div></div><div></div>" +
                     "</div>",
    MediumGunpowder = "<div class='gunpowder gunpowder--medium' data-gunpowder='1'>" +
                         "<div></div><div></div><div></div><div></div><div></div><div></div>" +
                        "</div>",
    BigGunpowder = "<div class='gunpowder gunpowder--big' data-gunpowder='2'>" +
                         "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>" +
                        "</div>",


    SmallBullet = "<div class='bullet bullet--small' data-bullet='0'></div>",
    MediumBullet = "<div class='bullet bullet--medium' data-bullet='1'></div>",
    BigBullet = "<div class='bullet bullet--big' data-bullet='2'></div>";



// var duration = 2;
introRender();
firstRender();
// $('.select-gun.animate').css('transition', 'all '+ duration/1.4 +'s ease').removeClass('animate-up--active');
$(document).on('click', '.start-button', function () {
    var duration = 2;
    $('.intro .animate').css('transition', 'all '+ duration +'s ease');
    $('.intro .animate-left').addClass('animate-left--active');
    $('.intro .animate-right').addClass('animate-right--active');


    $('.select-gun.animate').css('transition', 'all '+ duration/1.4 +'s ease').removeClass('animate-up--active');

    setTimeout(function () {

    }, 500);

    setTimeout(function () {
        $('.intro').css('display', 'none');
    }, duration + '000');







    // app.append(
    //     "<div class='dramatization'>" +
    //     "<div class='person person-animate'>" +
    //     "<div class='person__body'>" +
    //     "<div class='person__head'></div>" +
    //     "<div class='person__gun'><img src='images/gun-small.jpg' alt=''></div>" +
    //     "</div>" +
    //     "<div class='person__legs'></div>" +
    //     "</div>" +
    //     "<div class='aim aim-animate'><div class='circle'></div></div>" +
    //     "<div class='effects'><div class='effect effect--explosion'>взрыв</div></div>" +
    //     "</div>"
    // );
    //
    // // var duration = 2;
    // // $('.select-gun').css('transition', 'all 0s ease');
    // // $('.gun').addClass('gun-prepare');
    // $('.gun').css('display', 'none');
    //
    // setTimeout(function () {
    //     $('.person').removeClass('person-animate');
    //     $('.aim').removeClass('aim-animate');
    // }, 200);
    //
    // setTimeout(function () {
    //     $('.effect--explosion').addClass('effect--active');
    // }, 2000);









});

$(document).on('click', '.gunpowder', function () {
    var duration = 1,
        gunpowderDuration = 3;


    if ($(this).data('gunpowder') == 0) {
        $('.gun').append(SmallGunpowder).find('.gunpowder').addClass('gunpowder--loading');
        results.push(0);
    }
    if ($(this).data('gunpowder') == 1) {
        $('.gun').append(MediumGunpowder).find('.gunpowder').addClass('gunpowder--loading');
        results.push(1);
    }
    if ($(this).data('gunpowder') == 2) {
        $('.gun').append(BigGunpowder).find('.gunpowder').addClass('gunpowder--loading');
        results.push(2);
    }

    $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
    $('.gun-settings').addClass('move-down');

    setTimeout(function () {
        $('.gunpowder--loading').addClass('gunpowder--loading--animate').css('animation-duration', ''+ gunpowderDuration +'s');

    }, duration/0.7 + '000');

    setTimeout(function () {
        $.each($('.gunpowder--loading div'), function(i, el) {
            setTimeout(function() {
                $(el).addClass("anim");
            }, 100 + (i * 150));
        });
    }, 1000);

    setTimeout(function () {
        $('.gun-img').removeClass('gun-load');

        $('.gun-settings__bullet').removeClass('hidden');
        $('.gun-settings__gunpowder').addClass('hidden');

        $('.gun-settings').removeClass('move-down');
    }, gunpowderDuration + '000');

    console.log(results);
});

$(document).on('click', '.bullet', function () {
    var duration = 1,
        bulletDuration = 3;

    function next() {
        $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
        $('.gun-settings').addClass('move-down');

        setTimeout(function () {
            $('.bullet--loading').addClass('bullet--loading--animate').css('animation-duration', ''+ bulletDuration +'s');
        }, duration/0.7 + '000');

        setTimeout(function () {
            $('.gun-img').removeClass('gun-load').addClass('gun-choose-angle');
            $('.gun-settings__choose__angle').removeClass('animate-right--active');

            $('.gun-settings__bullet').addClass('hidden');
            $('.gun-settings__angle').removeClass('hidden');

            $('.gun-settings').removeClass('move-down');
        }, bulletDuration + '000');
    }

    if ($(this).data('bullet') == 0) {
        $('.gun').append(SmallBullet).find('.bullet').addClass('bullet--loading');
        results.push(0);
        next();
    }
    if ($(this).data('bullet') == 1) {
        $('.gun').append(MediumBullet).find('.bullet').addClass('bullet--loading');
        results.push(1);
        next();
    }
    if ($(this).data('bullet') == 2) {

        $('.gun').append(BigBullet).find('.bullet').addClass('bullet--loading');
        $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
        $('.gun-settings').addClass('move-down');

        setTimeout(function () {
            $('.bullet--loading').addClass('bullet--loading--toobig').css('animation-duration', ''+ bulletDuration +'s');
        }, duration/0.7 + '000');

        setTimeout(function () {
            // $('.gun-img').removeClass('gun-load').addClass('gun-choose-angle');
            // $('.gun-settings__choose__angle').removeClass('animate-right--active');
            $('.bullet--loading').addClass('bullet--toobig');
            $('.gun-settings__bullet').addClass('hidden');
            $('.gun-settings__angle').addClass('hidden');
            $('.tooBig').removeClass('hidden');

            $('.gun-settings').removeClass('move-down');
        }, bulletDuration + '000');
    }



    console.log(results);
});

$(document).on('click', '.angle', function () {
    var duration = 1,
        gunpowderDuration = 3;


    if ($(this).data('angle') == 0) {
        $('.gun-img').removeClass('gun-choose-angle').addClass('gun-high');
        results.push(0);
    }
    if ($(this).data('angle') == 1) {
        // $('.gun-img').removeClass('gun-choose-angle').addClass('gun-high');
        results.push(1);
    }
    if ($(this).data('angle') == 2) {
        $('.gun-img').removeClass('gun-choose-angle').addClass('gun-low');
        results.push(2);
    }

    $('.gun-settings__choose__angle').addClass('animate-right--active');
    $('.gun-settings').addClass('move-down');

    setTimeout(function () {

        $('.gun-settings__angle').addClass('hidden');
        $('.fire').removeClass('hidden');

        $('.gun-settings').removeClass('move-down');
    }, 1200);

    console.log(results);
});

//
// app.append(
//     "<div class='dramatization'>" +
//     "<div class='person'>" +
//     "<div class='person__body'>" +
//     "<div class='person__head'></div>" +
//     "<div class='person__gun'>" +
//     "<img src='images/gun-small.jpg' alt=''>" +
//     "<div class='person__gun__bullet'></div>" +
//     "</div>" +
//     "</div>" +
//     "<div class='person__legs'></div>" +
//     "</div>" +
//     "<div class='aim'><div class='circle'></div></div>" +
//     "<div class='effects'>" +
//     "<div class='effect effect--explosion'>взрыв</div>" +
//     "<div class='effect effect--smoke'>облачко дыма</div>" +
//     "<div class='effect effect--joke'>вот незадача</div>" +
//     "</div>" +
//     "<div class='d-bullet'></div>" +
//     "</div>"
// );



$(document).on('click', '.fire-btn', function () {
// $(document).on('click', function () {

    $(this).addClass('hidden');

    app.append(
        "<div class='dramatization'>" +
            "<div class='person person-animate'>" +
                "<div class='person__body'>" +
                    "<div class='person__head'></div>" +
                    "<div class='person__gun'>" +
                        "<img src='images/gun-small.jpg' alt=''>" +
                        "<div class='person__gun__bullet'></div>" +
                    "</div>" +
                "</div>" +
                "<div class='person__legs'></div>" +
            "</div>" +
            "<div class='aim aim-animate'><div class='circle'></div></div>" +
            "<div class='effects'>" +
                "<div class='effect effect--explosion'>взрыв</div>" +
                "<div class='effect effect--smoke'>облачко дыма</div>" +
                "<div class='effect effect--joke'>вот незадача</div>" +
            "</div>" +
            "<div class='d-bullet'></div>" +
        "</div>"
    );

    var duration = 2;

    $('.gun').css('display', 'none');

    setTimeout(function () {
        $('.person').removeClass('person-animate');
        $('.aim').removeClass('aim-animate');
    }, 200);


    if (_.isEqual(results, [0, 0, 0])) {
        gunUp();
        smoke();
        $('.fire').append(
            "<p>Мало пороха, малая пуля, вверх. Результат - облочко дыма</p>"
        );
    }
    else if (_.isEqual(results, [0, 1, 0])) {
        gunUp();
        smoke();
        $('.fire').append(
            "<p>Мало пороха, средняя пуля, вверх. Результат - облочко дыма</p>"
        );
    }
    else if (_.isEqual(results, [1, 0, 0])) {
        gunUp();
        $('.fire').append(
            "<p>Средне пороха, малая пуля, вверх. Результат - выше отметки (анимация в космос)</p>"
        );
    }
    else if (_.isEqual(results, [2, 0, 0])) {
        gunUp();
        explosion();
        $('.fire').append(
            "<p>Много пороха, малая пуля, вверх. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [2, 1, 0])) {
        gunUp();
        explosion();
        $('.fire').append(
            "<p>Много пороха, средняя пуля, вверх. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [1, 1, 0])) {
        gunUp();
        $('.fire').append(
            "<p>Средне пороха, средняя пуля, вверх. Результат - ствол дергается выше, перелет (анимация в космос)</p>"
        );
    }


    else if (_.isEqual(results, [2, 1, 1])) {
        explosion();
        $('.fire').append(
            "<p>Много пороха, средняя пуля, прямо. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [1, 1, 1])) {
        $('.fire').append(
            "<p>Средне пороха, средняя пуля, прямо. Результат - перелет, но уже близко</p>"
        );
    }
    else if (_.isEqual(results, [0, 1, 1])) {
        $('.fire').append(
            "<p>Мало пороха, средняя пуля, прямо. Результат - недолет</p>"
        );
    }
    else if (_.isEqual(results, [2, 0, 1])) {
        explosion();
        $('.fire').append(
            "<p>Много пороха, малая пуля, прямо. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [1, 0, 1])) {
        $('.fire').append(
            "<p>Средне пороха, малая пуля, прямо. Результат - перелет, но уже близко</p>"
        );
    }
    else if (_.isEqual(results, [0, 0, 1])) {
        $('.fire').append(
            "<p>Мало пороха, малая пуля, прямо. Результат - недолет</p>"
        );
    }


    else if (_.isEqual(results, [2, 1, 2])) {
        gunDown();
        explosion();
        $('.fire').append(
            "<p>Много пороха, средняя пуля, вниз. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [1, 1, 2])) {
        gunDown();
        win();
        $('.fire').append(
            "<p>Средне пороха, средняя пуля, вниз. Результат - попадание!</p>"
        );
    }
    else if (_.isEqual(results, [0, 1, 2])) {
        gunDown();
        bulletGoesDown();
        $('.fire').append(
            "<p>Мало пороха, средняя пуля, вниз. Результат - стол дергается вверх, но пуля не долетает</p>"
        );
    }
    else if (_.isEqual(results, [0, 0, 2]) == true || _.isEqual(results, [1, 0, 2]) == true || _.isEqual(results, [2, 0, 2]) == true) {
        gunDown();
        bulletDown();
        joke();
        $('.fire').append(
            "<p>Малая пуля и вниз. Результат - пуля вываливается</p>"
        );
    }



});


function explosion() {
    setTimeout(function () {
        $('.effect--explosion').addClass('effect--active');
    }, 4500);
}
function joke() {
    setTimeout(function () {
        $('.effect--joke').addClass('effect--active');
    }, 4500);
}
function smoke() {
    setTimeout(function () {
        $('.effect--smoke').addClass('effect--active');
    }, 4500);
}

function gunUp() {
    setTimeout(function () {
        $('.person').addClass('gun-up');
    }, 1500);
}
function gunDown() {
    setTimeout(function () {
        $('.person').addClass('gun-down');
    }, 1500);
}

function bulletDown() {
    setTimeout(function () {
        $('.d-bullet').addClass('d-bullet--down');
    }, 3500);
}

function bulletGoesDown() {
    var bezier_params = {
        start: {
            x: 356,
            y: 533,
            angle: -100
        },
        end: {
            x: 756,
            y: 700,
            angle: 60,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 1000);
    }, 3500);
}

function win() {
    var bezier_params = {
        start: {
            x: 356,
            y: 533,
            angle: -30
        },
        end: {
            x: 1731,
            y: 585,
            angle: 30,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 2000);
    }, 3500);
}