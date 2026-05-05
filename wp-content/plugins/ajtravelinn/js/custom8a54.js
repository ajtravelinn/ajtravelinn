
//
$(document).ready(function() {
			$('#fullpage').fullpage({
				'verticalCentered': false,
				'scrollingSpeed': 600,
				'autoScrolling': false,
				'css3': true,
				'navigation': true,
				'navigationPosition': 'right',
			});
		});

// wow
$(function()
{
    new WOW().init();
    $(".rotate").textrotator();
})


//SCRIPT IN DOWN
$(document).ready(function() {
	$('nav ul li a').click(function() {
		 var section = $(this).attr('href');
		  $('html, body').animate({ scrollTop: $(section).offset().top }, 1000);
			$(section).toggle();
			});
	 });
			  
$(document).ready(function() {
    $('.rotating-text').textrotator({
        animation: 'fade',
        speed: 2000,
        separator: ',',
        interval: 2000,
        loop: true
    });
});

