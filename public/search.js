

var city = {
    "gurgaon":11,
    "mumbai":18,
    "delhi":6,
    "chennai":5,
    "kolkata":16,
    "bangalore":2
};




function URL_add_parameter( param, value){
        
    var url        = location.href;
    var hash       = {};
    var parser     = document.createElement('a');
    parser.href    = url;
    var parameters = parser.search.split(/\?|&/);
    for(var i=0; i < parameters.length; i++) {
        if(!parameters[i])
            continue;

        var ary      = parameters[i].split('=');
        hash[ary[0]] = ary[1];
    }
    hash[param] = value;
    var list = [];  
    Object.keys(hash).forEach(function (key) {
        list.push(key + '=' + hash[key]);
    });
    parser.search = '?' + list.join('&');
    location.href =  parser.href;
     //alert(location.href);
    }  


$(function(){
    $("#input").keypress(function(e){
        var code = e.keyCode || e.which;
        if(code === 13){
            let val = $(this).val();
            if(val)
                val = val.toLowerCase();            
                URL_add_parameter('cityId',city[val]);
            console.log(val);

        }
    });
})