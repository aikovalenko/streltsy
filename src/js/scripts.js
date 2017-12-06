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




function introRender() {
    app.append(
        "<div class='intro '>" +

            "<div class='game-name'>" +
                "<div class='animate-s animate-top animate-js header'>изучи<br>«ОГНЕВОЙ БОЙ»</div>" +
                "<div class='animate-s animate-top animate-js header--under'>XVII века</div>" +
            "</div>" +
            // "<div class='intro__text animate animate-right'>" +
            //     "<p>Вступительное описание к игре</p>" +
            //     "<div class='start'><button class='start-button'>Начать игру</button></div>" +
            // "</div>" +
            "<button class='start-button decoration animate-s animate-down animate-js js-quiz'>Начать</button>" +
        "</div>"
    );



}

function firstRender() {
    app.append(
        "<div class='select-gun'>" +
            "<div class='gun absolute-img'>" +
                "<img class='gun-img' src='images/gun.png'>" +
                // "<div id='test' class='gun-settings__angle gun-settings__choose__angle animate animate-right animate-right--active'>" +
                //     "<button class='angle' data-angle='0'>Выше</button>" +
                //     "<button class='angle' data-angle='1'>Прямо</button>" +
                //     "<button class='angle' data-angle='2'>Ниже</button>" +
                // "</div>" +
            "</div>" +
            "<div class='gun-settings'>" +
                "<div class='gun-set gun-settings__bullet hidden'>" +
                    "<div class='animate-top js-animate  step-powder'>II</div>" +
                    "<div class='decoration animate-top js-animate gun-set__block gun-set__block--top'>Выбери и заряди пулю</div>" +
                    "<div class='decoration animate-down js-animate gun-settings__choose gun-set__block gun-set__block--bottom'>" +
        "<div class='bullet-wrap' data-bullet='0'><div class='bullet bullet--small'></div><div class='bullet-text'><b>6-ти граммовая</b> литая свинцовая<br>пуля</div></div>" + "<div class='bullet-wrap' data-bullet='1'><div class='bullet bullet--medium'></div><div class='bullet-text'><b>18-ти граммовая</b> литая свинцовая<br>пуля</div></div>" + "<div class='bullet-wrap' data-bullet='2'><div class='bullet bullet--big'></div><div class='bullet-text'><b>29-ти граммовая</b> литая свинцовая<br>пуля</div></div>" +
                    "</div>" +
                "</div>" +
                "<div class='gun-set gun-settings__gunpowder'>" +
                    "<div class='animate-top js-animate  step-powder'>I</div>" +
                    "<div class='decoration animate-top js-animate gun-set__block gun-set__block--top'>Отмеряй и засыпь порох</div>" +
                    "<div class='decoration animate-down gun-set__block gun-settings__choose gun-settings__gunpowder__choose js-animate gun-set__block--bottom'>" +
        "<div class='gunpowder gunpowder--small' data-gunpowder='0'>" +
        "<div></div><div></div><div></div>" +
        "<span class='gunpowder__text'>9 грамм зернёного пороха</span>" +
        "</div>" + "<div class='gunpowder gunpowder--medium' data-gunpowder='1'>" +
        "<div></div><div></div><div></div><div></div><div></div><div></div>" +
        "<span class='gunpowder__text'>37 грамм зернёного пороха</span>" +
        "</div>" + "<div class='gunpowder gunpowder--big' data-gunpowder='2'>" +
        "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>" +
        "<span class='gunpowder__text'>95 грамм зернёного пороха</span>" +
        "</div>" +
                    "</div>" +
                "</div>" +
                "<div class='gun-set gun-settings__angle hidden'>" +
                    "<div class='animate-top js-animate  step-powder'>III</div>" +
                    "<div class='decoration animate-top js-animate gun-set__block gun-set__block--top'>Целься! Выбери наклон!</div>" +
                    "<div id='test' class='decoration animate-down gun-set__block gun-settings__angle gun-settings__choose__angle js-animate gun-set__block--bottom'>" +
                        "<button class='angle' data-angle='0'><img width='255' src='images/aim-up-small.png'><span>Выше цели</span></button>" +
                        "<button class='angle' data-angle='1'><img width='300' src='images/aim-norm-small.png'><span>Ровно в цель</span></button>" +
                        "<button class='angle' data-angle='2'><img width='270' src='images/aim-down-small.png'><span>Ниже цели</span></button>" +
                    "</div>" +
                "</div>" +
                // "<div class='fire hidden'>" +
                //     "<button class='fire-btn'>Пли!</button>" +
                // "</div>" +
                "<div class='fire hidden gun-set'>" +
                    "<div class='animate-top js-animate  step-powder'>IV</div>" +
                    "<div class='decoration animate-top js-animate gun-set__block gun-set__block--top'>Приготовились</div>" +
                    "<div class='decoration fire-btn animate-down js-animate gun-settings__choose gun-set__block gun-set__block--bottom'>Пали!</div>" +
                "</div>" +
                "<div class='tooBig hidden gun-set'>" +
                    "<div class='decoration animate-top js-animate gun-set__block gun-set__block--top'>Пуля слишком большого калибра</div>" +
                "</div>" +
            "</div>" +
        "</div>"
    );
}

var SmallGunpowder = "<div class='gunpowder gunpowder--small' data-gunpowder='0'>" +
                        "<div></div><div></div><div></div>" +
                        // "<span class='gunpowder__text'>9 грамм зернёного пороха</span>" +
                     "</div>",
    MediumGunpowder = "<div class='gunpowder gunpowder--medium' data-gunpowder='1'>" +
                         "<div></div><div></div><div></div><div></div><div></div><div></div>" +
                            // "<span class='gunpowder__text'>37 грамм зернёного пороха</span>" +
                        "</div>",
    BigGunpowder = "<div class='gunpowder gunpowder--big' data-gunpowder='2'>" +
                         "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>" +
                    // "<span class='gunpowder__text'>95 грамм зернёного пороха</span>" +
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
    $('.intro .animate-js').removeClass('animate-s');
    // $('.intro .animate').css('transition', 'all '+ duration +'s ease');

    //
    //
    //
    //
    setTimeout(function () {
        $('.intro').addClass('hide');
        $('.gun-set .js-animate').addClass('animate-s');
        // $('.select-gun.animate').css('transition', 'all '+ duration/1.4 +'s ease').removeClass('animate-up--active');
        $('.select-gun').css('opacity', '1');
    }, 500);
    //
    // setTimeout(function () {
    //     $('.intro').css('display', 'none');
    // }, duration + '000');







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


    if ($(this).data('gunpowder') === 0) {
        $('.gun').append(SmallGunpowder).find('.gunpowder').addClass('gunpowder--loading');
        results.push(0);
    }
    if ($(this).data('gunpowder') === 1) {
        $('.gun').append(MediumGunpowder).find('.gunpowder').addClass('gunpowder--loading');
        results.push(1);
    }
    if ($(this).data('gunpowder') === 2) {
        $('.gun').append(BigGunpowder).find('.gunpowder').addClass('gunpowder--loading');
        results.push(2);
    }

    $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
    // $('.gun-settings').addClass('move-down');
    $('.gun-set .js-animate').removeClass('animate-s');

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

        // $('.gun-settings').removeClass('move-down');
        // $('.gun-set .js-animate').addClass('animate-s');
    }, gunpowderDuration + '000');
    setTimeout(function () {
        $('.gun-set .js-animate').addClass('animate-s');
    }, 4000);

    console.log(results);
});

$(document).on('click', '.bullet-wrap', function () {
    var duration = 1,
        bulletDuration = 3;

    function next() {
        $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
        // $('.gun-settings').addClass('move-down');
        $('.gun-set .js-animate').removeClass('animate-s');

        setTimeout(function () {
            $('.bullet--loading').addClass('bullet--loading--animate').css('animation-duration', ''+ bulletDuration +'s');
        }, duration/0.7 + '000');

        setTimeout(function () {
            $('.gun-img').removeClass('gun-load');
            $('.gun-settings__choose__angle').removeClass('animate-right--active');

            $('.gun-settings__bullet').addClass('hidden');
            $('.gun-settings__angle').removeClass('hidden');

            // $('.gun-settings').removeClass('move-down');
        }, bulletDuration + '000');

        setTimeout(function () {
            $('.gun-set .js-animate').addClass('animate-s');
        }, 4000);
    }

    if ($(this).data('bullet') === 0) {
        $('.gun').append(SmallBullet).find('.bullet').addClass('bullet--loading');
        results.push(0);
        next();
    }
    if ($(this).data('bullet') === 1) {
        $('.gun').append(MediumBullet).find('.bullet').addClass('bullet--loading');
        results.push(1);
        next();
    }
    if ($(this).data('bullet') === 2) {

        $('.gun').append(BigBullet).find('.bullet').addClass('bullet--loading');
        $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
        // $('.gun-settings').addClass('move-down');
        $('.gun-set .js-animate').removeClass('animate-s');

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

            // $('.gun-settings').removeClass('move-down');
        }, bulletDuration + '000');
        setTimeout(function () {
            $('.gun-set .js-animate').addClass('animate-s');
        }, 4000);
        setTimeout(function () {
            $('.gun-set .js-animate').removeClass('animate-s');
        }, 8000);
        setTimeout(function () {
            $('.gun-set .js-animate').removeClass('animate-s');
            $('.bullet--loading').removeClass('bullet--toobig');
            $('.gun-settings__bullet').removeClass('hidden');
            $('.tooBig').addClass('hidden');
            $('.gun-img').removeClass('gun-load');
            $('.bullet--big').remove();
        }, 8500);
        setTimeout(function () {
            $('.gun-set .js-animate').addClass('animate-s');
        }, 9000);
    }



    console.log(results);
});

$(document).on('click', '.angle', function () {
    var duration = 1,
        gunpowderDuration = 3;


    if ($(this).data('angle') === 0) {
        $('.gun-img').removeClass('gun-choose-angle').addClass('gun-high');
        $('body').append(
            "<div class='angle-illustration angle-illustration--up'>" +
            "</div>"
        );
        results.push(0);
    }
    if ($(this).data('angle') === 1) {
        // $('.gun-img').removeClass('gun-choose-angle').addClass('gun-high');
        $('body').append(
            "<div class='angle-illustration angle-illustration--ok'>" +
            "</div>"
        );
        results.push(1);
    }
    if ($(this).data('angle') === 2) {
        $('.gun-img').removeClass('gun-choose-angle').addClass('gun-low');
        $('body').append(
            "<div class='angle-illustration angle-illustration--down'>" +
            "</div>"
        );
        results.push(2);
    }

    $('.gun-settings__choose__angle').addClass('animate-right--active');
    // $('.gun-settings').removeClass('move-down');
    $('.gun-set .js-animate').removeClass('animate-s');
    $('.gun').addClass('gun-zoom');
    setTimeout(function () {
        $('.angle-illustration').css('opacity', '1');
    }, 300);
    setTimeout(function () {

        $('.gun-settings__angle').addClass('hidden');
        $('.fire').removeClass('hidden');


        // $('.gun-settings').removeClass('move-down');
        // $('.gun-set .js-animate').addClass('animate-s');
    }, 1200);
    setTimeout(function () {

        $('.gun-set .js-animate').addClass('animate-s');

    }, 1300);


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
$(document).on('click','.js-new-game', function () {
    location.reload();
});

// results = [0, 0, 2];
$(document).on('click', '.fire-btn', function () {

// $(document).on('click', function () {
// $(document).on('click', function () {

    $(this).addClass('hidden');

    // app.append(
    //     "<div class='dramatization'>" +
    //         "<div class='person person-animate'>" +
    //             "<div class='person__body'>" +
    //                 "<div class='person__head'></div>" +
    //                 "<div class='person__gun'>" +
    //                     "<img src='images/gun-small.jpg' alt=''>" +
    //                     "<div class='person__gun__bullet'></div>" +
    //                 "</div>" +
    //             "</div>" +
    //             "<div class='person__legs'></div>" +
    //         "</div>" +
    //         "<div class='aim aim-animate'><div class='circle'></div></div>" +
    //         "<div class='effects'>" +
    //             "<div class='effect effect--explosion'>взрыв</div>" +
    //             "<div class='effect effect--smoke'>облачко дыма</div>" +
    //             "<div class='effect effect--joke'>вот незадача</div>" +
    //         "</div>" +
    //         "<div class='d-bullet'></div>" +
    //     "</div>"
    // );

    function norm() {


        app.append(
            "<div class='dramatization'>" +
            "<div class='shot shot-animate'>" +
            "<img width='100%' src='images/shot.png' alt=''>" +
            "</div>" +
            "<div class='person person-animate'>" +
            "<img class='js-person js-person-up' width='300' src='images/aim-up-small.png' alt=''>" +
            "<img class='js-person js-person-down' width='300' src='images/aim-down-small.png' alt=''>" +
            "<img class='js-person js-person-norm' width='300' src='images/aim-norm-small.png' alt=''>" +
            "</div>" +
            "<div class='aim aim-animate'>" +
            "<img width='180' src='images/aim-small.png' alt=''>" +
            "</div>" +
            "<div class='d-bullet'></div>" +
            "</div>"
        );
    }
    function explode() {
        app.append(
            "<div class='dramatization'>" +
            "<div class='shot shot-animate'>" +
            "<img width='100%' src='images/explode.png' alt=''>" +
            "</div>" +
            "<div class='d-bullet'></div>" +
            "</div>"
        );
    }

    var duration = 2;

    $('.gun').css('display', 'none');
    $('.angle-illustration').css('opacity', '0');
    $('.gun-settings').css('opacity', '0');

    setTimeout(function () {
        $('.person').removeClass('person-animate');
        $('.aim').removeClass('aim-animate');
        // $('.shot').removeClass('shot-animate');
    }, 200);
    setTimeout(function () {
    //     // $('.person').removeClass('person-animate');
    //     // $('.aim').removeClass('aim-animate');
        $('.shot').removeClass('shot-animate');
    //     $('.js-person').css('opacity', '0');
    //     $('.js-person-up').css('opacity', '1');
    }, 2000);





    if (_.isEqual(results, [0, 0, 0])) {
        norm();
        $('.js-person-up').css('opacity', '1');

        gunUp();
        smoke();
        // $('.fire').append(
        //     "<p>Мало пороха, малая пуля, вверх. Результат - облочко дыма</p>"
        // );

        $('body').append(
            "<div class='result-screen result-screen--fail-low'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно ниже мишени.<br>Попробуй засыпать побольше пороха!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );

        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 6000);
    }
    else if (_.isEqual(results, [0, 1, 0])) {
        norm();
        $('.js-person-up').css('opacity', '1');

        gunUp();
        smoke();
        // $('.fire').append(
        //     "<p>Мало пороха, средняя пуля, вверх. Результат - облочко дыма</p>"
        // );

        $('body').append(
            "<div class='result-screen result-screen--fail-low'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно ниже мишени.<br>Попробуй засыпать побольше пороха!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 6000);
    }
    else if (_.isEqual(results, [1, 0, 0])) {
        norm();
        $('.js-person-up').css('opacity', '1');
        setTimeout(function () {
            $('.js-person').css('opacity', '0');
            $('.js-person-up').css('opacity', '1');
        }, 2000);
        gunUp();
        bulletGoesSpace();
        // $('.fire').append(
        //     "<p>Средне пороха, малая пуля, вверх. Результат - выше отметки (анимация в космос)</p>"
        // );
        $('body').append(
            "<div class='special'>Мушкет обладает большой силой отдачи, поэтому во время выстрела ствол подбрасывает вверх</div>"
        );
        $('body').append(
            "<div class='result-screen result-screen--fail-high'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно выше мишени.<br>Попробуй прицелится немного ниже.<br><br><i>Подсказка: ты выбрал правильный порох!</i></div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
            $('.special').css('opacity', '0');
        }, 12000);
    }
    else if (_.isEqual(results, [2, 0, 0])) {
        explode();
        $('.js-person-up').css('opacity', '1');

        gunUp();
        explosion();
        // $('.fire').append(
        //     "<p>Много пороха, малая пуля, вверх. Результат - разрыв</p>"
        // );

        $('body').append(
            "<div class='result-screen result-screen--explode'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'><b>Разрыв ствола!</b><br>\n" +
            "Ты засыпал слишком много пороха!<br>\n" +
            "Надеемся, ты не пострадал.<br>\n" +
            "Попробуй засыпать чуть меньше пороха.</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 4000);
    }
    else if (_.isEqual(results, [2, 1, 0])) {
        explode();
        $('.js-person-up').css('opacity', '1');

        gunUp();
        explosion();
        // $('.fire').append(
        //     "<p>Много пороха, средняя пуля, вверх. Результат - разрыв</p>"
        // );

        $('body').append(
            "<div class='result-screen result-screen--explode'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'><b>Разрыв ствола!</b><br>\n" +
            "Ты засыпал слишком много пороха!<br>\n" +
            "Надеемся, ты не пострадал.<br>\n" +
            "Попробуй засыпать чуть меньше пороха.</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 4000);
    }
    else if (_.isEqual(results, [1, 1, 0])) {
        norm();
        $('.js-person-up').css('opacity', '1');
        setTimeout(function () {
            $('.js-person').css('opacity', '0');
            $('.js-person-up').css('opacity', '1');
        }, 2000);
        gunUp();
        bulletGoesSpace();
        gunUp();
        // $('.fire').append(
        //     "<p>Средне пороха, средняя пуля, вверх. Результат - ствол дергается выше, перелет (анимация в космос)</p>"
        // );
        $('body').append(
            "<div class='special'>Мушкет обладает большой силой отдачи, поэтому во время выстрела ствол подбрасывает вверх</div>"
        );
        $('body').append(
            "<div class='result-screen result-screen--fail-high'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно выше мишени.<br>Попробуй прицелится немного ниже.<br><br><i>Подсказка: ты выбрал правильный порох!</i></div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
            $('.special').css('opacity', '0');
        }, 12000);
    }


    else if (_.isEqual(results, [2, 1, 1])) {
        explode();
        $('.js-person-norm').css('opacity', '1');
        setTimeout(function () {
            $('.js-person').css('opacity', '0');
            $('.js-person-up').css('opacity', '1');
        }, 2000);

        explosion();
        // $('.fire').append(
        //     "<p>Много пороха, средняя пуля, прямо. Результат - разрыв</p>"
        // );


        $('body').append(
            "<div class='result-screen result-screen--explode'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'><b>Разрыв ствола!</b><br>\n" +
            "Ты засыпал слишком много пороха!<br>\n" +
            "Надеемся, ты не пострадал.<br>\n" +
            "Попробуй засыпать чуть меньше пороха.</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 4000);
    }
    else if (_.isEqual(results, [1, 1, 1])) {
        norm();
        $('.js-person-norm').css('opacity', '1');
        setTimeout(function () {
            $('.js-person').css('opacity', '0');
            $('.js-person-up').css('opacity', '1');
        }, 2000);
        bulletGoesAlmost();
        $('body').append(
            "<div class='special'>Мушкет обладает большой силой отдачи, поэтому во время выстрела ствол подбрасывает вверх</div>"
        );

        $('body').append(
            "<div class='result-screen result-screen--almost'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Ты почти попал!<br>Пуля прошла немного выше мишени.<br>Попробуй прицелится немного ниже</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
            $('.special').css('opacity', '0');

        }, 12000);
    }
    else if (_.isEqual(results, [0, 1, 1])) {
        norm();
        $('.js-person-norm').css('opacity', '1');

        // $('.fire').append(
        //     "<p>Мало пороха, средняя пуля, прямо. Результат - недолет</p>"
        // );
        bulletGoesDownEvenWorth();
        $('body').append(
            "<div class='result-screen result-screen--fail-low'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно ниже мишени.<br>Попробуй засыпать побольше пороха!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 12000);

    }
    else if (_.isEqual(results, [2, 0, 1])) {
        explode();
        $('.js-person-norm').css('opacity', '1');

        explosion();
        // $('.fire').append(
        //     "<p>Много пороха, малая пуля, прямо. Результат - разрыв</p>"
        // );
        $('body').append(
            "<div class='result-screen result-screen--explode'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'><b>Разрыв ствола!</b><br>\n" +
            "Ты засыпал слишком много пороха!<br>\n" +
            "Надеемся, ты не пострадал.<br>\n" +
            "Попробуй засыпать чуть меньше пороха.</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 4000);
    }
    else if (_.isEqual(results, [1, 0, 1])) {
        norm();
        $('.js-person-norm').css('opacity', '1');
        bulletGoesAlmost();
        // $('.fire').append(
        //     "<p>Средне пороха, малая пуля, прямо. Результат - перелет, но уже близко</p>"
        // );
        $('body').append(
            "<div class='result-screen result-screen--fail-high'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно выше мишени.<br>Попробуй прицелится немного ниже.<br><br><i>Подсказка: ты выбрал правильный порох!</i></div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 12000);
    }
    else if (_.isEqual(results, [0, 0, 1])) {
        norm();
        $('.js-person-norm').css('opacity', '1');
        bulletGoesDownEvenWorth();
        // $('.fire').append(
        //     "<p>Мало пороха, малая пуля, прямо. Результат - недолет</p>"
        // );

        $('body').append(
            "<div class='result-screen result-screen--fail-low'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно ниже мишени.<br>Попробуй засыпать побольше пороха!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 12000);


    }


    else if (_.isEqual(results, [2, 1, 2])) {
        explode();
        $('.js-person-down').css('opacity', '1');

        gunDown();
        explosion();
        // $('.fire').append(
        //     "<p>Много пороха, средняя пуля, вниз. Результат - разрыв</p>"
        // );
        $('body').append(
            "<div class='result-screen result-screen--explode'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'><b>Разрыв ствола!</b><br>\n" +
            "Ты засыпал слишком много пороха!<br>\n" +
            "Надеемся, ты не пострадал.<br>\n" +
            "Попробуй засыпать чуть меньше пороха.</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 4000);
    }
    else if (_.isEqual(results, [1, 1, 2])) {
        norm();
        $('.js-person-down').css('opacity', '1');
        setTimeout(function () {
            $('.js-person').css('opacity', '0');
            $('.js-person-up').css('opacity', '1');
        }, 2000);
        gunDown();
        win();
        // $('.fire').append(
        //     "<p>Средне пороха, средняя пуля, вниз. Результат - попадание!</p>"
        // );
        $('body').append(
            "<div class='special'>Мушкет обладает большой силой отдачи, поэтому во время выстрела ствол подбрасывает вверх</div>"
        );
        $('body').append(
            "<div class='result-screen result-screen--win'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'><b>Точное попадание!</b><br>Ты мог бы стать отличным стрельцом!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
            $('.special').css('opacity', '0');
        }, 12000);
    }
    else if (_.isEqual(results, [0, 1, 2])) {
        norm();
        $('.js-person-down').css('opacity', '1');
        setTimeout(function () {
            $('.js-person').css('opacity', '0');
            $('.js-person-up').css('opacity', '1');
        }, 2000);
        gunDown();
        bulletGoesDown();
        // $('.fire').append(
        //     "<p>Мало пороха, средняя пуля, вниз. Результат - стол дергается вверх, но пуля не долетает</p>"
        // );
        $('body').append(
            "<div class='special'>Мушкет обладает большой силой отдачи, поэтому во время выстрела ствол подбрасывает вверх</div>"
        );
        $('body').append(
            "<div class='result-screen result-screen--fail-low'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно ниже мишени.<br>Попробуй засыпать побольше пороха!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
            $('.special').css('opacity', '0');
        }, 12000);
    }
    else if (_.isEqual(results, [0, 0, 2]) === true || _.isEqual(results, [1, 0, 2]) === true || _.isEqual(results, [2, 0, 2]) === true) {
        norm();
        $('.js-person-down').css('opacity', '1');
        $('.d-bullet').addClass('d-bullet--low');
        gunDown();
        bulletDown();
        joke();
        // $('.fire').append(
        //     "<p>Малая пуля и вниз. Результат - пуля вываливается</p>"
        // );
        $('body').append(
            "<div class='result-screen result-screen--fail-low'>" +
            "<div class='decoration result-screen__top'>Результат выстрела</div>" +

            "<div class='result-screen__middle'>Пуля прошла сильно ниже мишени.<br>Попробуй засыпать побольше пороха!</div>" +
            "<div class='decoration result-screen__bottom js-new-game'>начать снова</div>" +
            "</div>"
        );
        setTimeout(function () {
            $('.dramatization').css('opacity', '0');
            $('.result-screen').css('opacity', '1').css('z-index', '9');
        }, 7000);
    }

// //The data for our line
//     var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
//         { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
//         { "x": 80,  "y": 5},  { "x": 100, "y": 60}];
//
//     //This is the accessor function we talked about above
//     var lineFunction = d3.svg.line()
//         .x(function(d) { return d.x; })
//         .y(function(d) { return d.y; })
//         .interpolate("linear");
//
//     //The SVG Container
//     var svgContainer = d3.select("body").append("svg")
//         .attr("width", 200)
//         .attr("height", 200);
//
//     //The line SVG Path we draw
//     var lineGraph = svgContainer.append("path")
//         .attr("d", lineFunction(lineData))
//         .attr("stroke", "blue")
//         .attr("stroke-width", 2)
//         .attr("fill", "none");

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
            x: 331,
            y: 1350,
            angle: -100
        },
        end: {
            x: 556,
            y: 1600,
            angle: 60,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 7000);
    }, 3500);
}
function bulletGoesDownEvenWorth() {
    var bezier_params = {
        start: {
            x: 335,
            y: 1393,
            angle: -70
        },
        end: {
            x: 482,
            y: 1575,
            angle: 30,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 7000);
    }, 3500);
}
function bulletGoesAlmost() {
    var bezier_params = {
        start: {
            x: 334,
            y: 1344,
            angle: -20
        },
        end: {
            x: 982,
            y: 1275,
            angle: 30,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 7000);
    }, 3500);
}
function bulletGoesSpace() {
    var bezier_params = {
        start: {
            x: 334,
            y: 1344,
            angle: -30
        },
        end: {
            x: 1080,
            y: 1080,
            angle: 30,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 7000);
    }, 3500);
}

function win() {
    var bezier_params = {
        start: {
            x: 331,
            y: 1350,
            angle: -30
        },
        end: {
            x: 885,
            y: 1445,
            angle: 30,
            length: 0.25
        }
    };
    setTimeout(function () {
        $('.person').addClass('gun-goes-up');
        $('.d-bullet').addClass('d-bullet--not-far').animate({path : new $.path.bezier(bezier_params)}, 7000);
    }, 3500);
}