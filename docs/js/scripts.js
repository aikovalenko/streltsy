$('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());

var app = $('.app'),
    start = $('.start-button'),
    intro = $('.intro');

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
                "<div class='bullet bullet--loading'></div>" +
                "<div class='gunpowder gunpowder--loading gunpowder--medium'>" +
                    "<div></div><div></div><div></div><div></div><div></div><div></div>" +
                "</div>" +
                "<img class='gun-img' src='images/gun.jpg'>" +
            "</div>" +
            "<div class='gun-settings'>" +
                "<div class='gun-settings__bullet hidden'>" +
                    "<p>Выберите пулю</p>" +
                    "<div class='gun-settings__choose'>" +
                        "<div class='bullet bullet--small'></div>" +
                        "<div class='bullet bullet--medium'></div>" +
                        "<div class='bullet bullet--big'></div>" +
                    "</div>" +
                "</div>" +
                "<div class='gun-settings__gunpowder'>" +
                    "<p>Засыпте порох</p>" +
                    "<div class='gun-settings__choose'>" +
                        "<div class='gunpowder gunpowder--small'>" +
                            "<div></div><div></div><div></div>" +
                        "</div>" +
                        "<div class='gunpowder gunpowder--medium'>" +
                            "<div></div><div></div><div></div><div></div><div></div><div></div>" +
                        "</div>" +
                        "<div class='gunpowder gunpowder--big'>" +
                            "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div class='fire hidden'>" +
                    "<button>Пли!</button>" +
                "</div>" +
            "</div>" +
        "</div>"
    );
}


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

    $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
    $('.gun-settings').addClass('move-down');

    setTimeout(function () {
        $('.gunpowder--loading').addClass('gunpowder--loading--animate').css('animation-duration', ''+ gunpowderDuration +'s');
        // $('.gunpowder--loading').find('div').each(function () {
        //
        // });

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

});

$(document).on('click', '.bullet', function () {
    var duration = 1,
        bulletDuration = 3;
    $('.gun-img').css('transition', 'all '+ duration +'s ease').addClass('gun-load');
    $('.gun-settings').addClass('move-down');

    setTimeout(function () {
        $('.bullet--loading').addClass('bullet--loading--animate').css('animation-duration', ''+ bulletDuration +'s');
    }, duration/0.7 + '000');

    setTimeout(function () {
        $('.gun-img').removeClass('gun-load');

        $('.gun-settings__bullet').addClass('hidden');
        $('.fire').removeClass('hidden');

        $('.gun-settings').removeClass('move-down');
    }, bulletDuration + '000');
});