localStorage.setItem('javascriptLoaded','no');

$("#botonModal").click(function(){
    $('#myModal').on('shown.bs.modal', function(e) {
            if(localStorage.getItem('javascriptLoaded') == 'no'){
                console.log("$$$$$$$$$$", "siiii cargo js");
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'http://www.productosnano.com/catalog/view/theme/journal2/js/main.js';
                head.appendChild(script);
                localStorage.setItem('javascriptLoaded', 'yes');

            }else{
                console.log("$$$$$$$$$$", "no cargo js");
            }
        });
    
});

