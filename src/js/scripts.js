$('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());

var app = $('.app'),
    start = $('.start-button'),
    intro = $('.intro');

var results = [];

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
                    "<p>Засыпте порох</p>" +
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

});

$(document).on('click', '.gunpowder', function () {
    var duration = 1,
        gunpowderDuration = 3;

    // console.log($(this).data('size'));

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

$(document).on('click', '.fire-btn', function () {

    $(this).addClass('hidden');

    if (_.isEqual(results, [0, 0, 0])) {
        console.log('все по нулям');

        $('.fire').append(
            "<p>Мало пороха, малая пуля, вверх. Результат - облочко дыма</p>"
        );
    }
    else if (_.isEqual(results, [0, 1, 0])) {
        $('.fire').append(
            "<p>Мало пороха, средняя пуля, вверх. Результат - облочко дыма</p>"
        );
    }
    else if (_.isEqual(results, [1, 0, 0])) {
        $('.fire').append(
            "<p>Средне пороха, малая пуля, вверх. Результат - выше отметки (анимация в космос)</p>"
        );
    }
    else if (_.isEqual(results, [2, 0, 0])) {
        $('.fire').append(
            "<p>Много пороха, малая пуля, вверх. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [2, 1, 0])) {
        $('.fire').append(
            "<p>Много пороха, средняя пуля, вверх. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [1, 1, 0])) {
        $('.fire').append(
            "<p>Средне пороха, средняя пуля, вверх. Результат - ствол дергается выше, перелет (анимация в космос)</p>"
        );
    }


    else if (_.isEqual(results, [2, 1, 1])) {
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
        $('.fire').append(
            "<p>Много пороха, средняя пуля, вниз. Результат - разрыв</p>"
        );
    }
    else if (_.isEqual(results, [1, 1, 2])) {
        $('.fire').append(
            "<p>Средне пороха, средняя пуля, вниз. Результат - попадание!</p>"
        );
    }
    else if (_.isEqual(results, [0, 1, 2])) {
        $('.fire').append(
            "<p>Мало пороха, средняя пуля, вниз. Результат - стол дергается вверх, но пуля не долетает</p>"
        );
    }
    else if (_.isEqual(results, [0, 0, 2]) == true || _.isEqual(results, [1, 0, 2]) == true || _.isEqual(results, [2, 0, 2]) == true) {
        $('.fire').append(
            "<p>Малая пуля и вниз. Результат - пуля вываливается</p>"
        );
    }



});
