

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
    if( param === "reset" ){
        if(hash["cityId"]){
            let city = hash["cityId"];
            var llist = [];
            llist.push("cityId" + '=' + city);
            parser.search = '?' + llist.join('&');
            location.href =  parser.href;
            return;
        }

    }

    

    //in case of beds check if parameter is beds and value is not equal to any or 4plus
    if(param === 'beds' && value !== 'any' ){

        if(hash[param] === "any"){
            hash[param] = "";
        }

        //check if the clicked value already exists in beds
        let index = -1;
        //check if beds parameter already exist in the url
        if(hash[param])
         index = hash[param].indexOf(value);
        if(index !== -1){

           //split the beds string at , and remove the "value" form the string and join the string with ','
           let splitArr = hash[param].split(',');
           let newArr = [];
            for(let i = 0; i < splitArr.length; i++){
                if(splitArr[i]  !== value){
                    newArr.push(splitArr[i]);
                }
            }
            hash[param] = newArr.join(',');

            if(hash[param] === "")
            {
                hash[param] = "any";
            }

        }else{
        
         // check if beds parameter is in the url if it is directly append the value
         if(hash[param])
         hash[param] = hash[param] + "," + value;
         else{
            hash[param] = value;
         }

        }

        //append the values
    }else{
        hash[param] = value;
    }
    
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
        }
    });

    $("#hidden_input").keypress(function(e){
        var code = e.keyCode || e.which;
        if(code === 13){
            let val = $(this).val();
            if(val)
                val = val.toLowerCase();            
                URL_add_parameter('cityId',city[val]);

        }
    });

    $(".cbtn.cbtn-p").on('click',function(e){
        $(this).siblings(".phone_number").toggle();
        e.stopPropagation();

    });

})

