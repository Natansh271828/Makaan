var express = require("express");
var request = require('request');
var url = require('url');
var webAddress = `https://www.makaan.com/petra/app/v4/listing?selector=`;
var addressEnd = `&includeNearbyResults=false&includeSponsoredResults=false&sourceDomain=Makaan`;
var selector = {"fields":["localityId","displayDate","listing","property","project","builder","displayName","locality","suburb","city","state","currentListingPrice","companySeller","company","user","id","name","label","listingId","propertyId","projectId","propertyTitle","unitTypeId","resaleURL","description","postedDate","verificationDate","size","measure","bedrooms","bathrooms","listingLatitude","listingLongitude","studyRoom","servantRoom","pricePerUnitArea","price","localityAvgPrice","negotiable","rk","buyUrl","rentUrl","overviewUrl","minConstructionCompletionDate","maxConstructionCompletionDate","halls","facingId","noOfOpenSides","bookingAmount","securityDeposit","ownershipTypeId","furnished","constructionStatusId","tenantTypes","bedrooms","balcony","floor","totalFloors","listingCategory","possessionDate","activeStatus","type","logo","profilePictureURL","score","assist","contactNumbers","contactNumber","isOffered","mainImageURL","mainImage","absolutePath","altText","title","imageCount","geoDistance","defaultImageId","updatedAt","qualityScore","projectStatus","throughCampaign","addedByPromoter","listingDebugInfo","videos","imageUrl","rk","penthouse","studio","paidLeadCount","listingSellerTransactionStatuses","allocation","allocationHistory","masterAllocationStatus","status","sellerCompanyFeedbackCount","companyStateReraRegistrationId"],"filters":{"and":[{"equal":{"cityId":11}},{"equal":{"listingCategory":["Primary","Resale"]}}]},"paging":{"start":0,"rows":20}};


// var Template = require("./Classes/Template");
// var Adapter = require("./Classes/Adapter");
// var CardInfo = require("./Classes/CardInfo");
var app = express();
var generalSelector = selector;
/*
*CardInfo Object contains information about the card; 
*/
function CardInfo(image,sellerInfo,heading,pricing,general,description){
    this.image = image;
    this.sellerInfo = sellerInfo;
    this.heading = heading;
    this.pricing = pricing;
    this.general = general;
    this.description = description;
}

/*
Template being used to make cards
 */
function Template(card){
    
    this.image = card.image;
    this.sellerInfo = card.sellerInfo;
    this.heading = card.heading;
    this.pricing = card.pricing;
    this.general = card.general;
    this.description = card.description.substring(0,50);
    this.html =  `<div class="card_container"><div class="card">
    <div class="card_left_div">
        <div class="card_image" style="background-image:url('${this.image}')"></div>
        <div class="card_seller_info">
            <div class="card_seller_image" style="background-image:url(${this.sellerInfo[0]})"></div>
            <div class="seller_info">
                <div class="seller_name">${this.sellerInfo[1]}</div>
                <div class="seller_profeciency">${this.sellerInfo[2]}</div>
            </div>
            <div class="seller_rating">${this.sellerInfo[3]}</div>
        </div>
    </div>
    <div class="card_right_div">
        <div class="card_heading">
            <div class="card_title">${this.heading[0]}<span>&nbsp${this.heading[5]}&nbsp</span><span>&nbspin&nbsp${this.heading[1]}&nbsp</span>${this.heading[2]}</div> 
            <div class="location">${this.heading[3]},&nbsp${this.heading[4]}</div>
            <hr>
        </div>
        <div class="card_highlights_wrap">
            <div class="card_highlights">
                <div class="price">
                     <div class="total_price">${this.pricing[0]}</div>
                    <div class="price_per_sq">${this.pricing[1]}/sqft</div>
                </div>
                <div class="area">
                    <div class="total_area">${this.pricing[2]}</div>
                    <div class="area_unit">area in ${this.pricing[3]}</div>
                </div>
                <div class="construction_status">${this.pricing[4]}</div>
            </div>
            <hr>
        </div>
        <div class="card_info">
            <div class="availability">by 78 dec</div>
            <div class="bathrooms">${this.general[0]}<span>&nbsp bathrooms</span></div>
            <div class="floor">2nd of 17th</div>
        </div>
        <div class="card_description"><p>${this.description}...</p></div>
        <div class="card_buttons">Buttons</div>
    </div>
</div> </div>`;

}
Template.prototype.returnCard = function(){
    //console.log("in template " + this.image);
    return this.html;
}
/*
 Adapater takes CardInfo array as parameter
 return html containing CardInfo in form of cards
*/ 
function Adapter(cards){  
  this.cards =  cards;
}

Adapter.prototype.makeHtml = function(){   
    let finalHtml = "";
    for(let cardInfo of this.cards){
        //console.log(cardInfo);
        let newTemplate = new Template(cardInfo);
        finalHtml += newTemplate.returnCard();

    }
   return finalHtml;
}

app.listen(3000, function(){
    console.log("listening on port 3000");
});
app.use(express.static("./public"));
app.set('view engine', 'ejs');
app.set('views','./views');
app.get("/",function(req,res){
     res.render("index");
});

var htmlResponse = `<div>Hello World</div>`;


function queryApi(newSelector,res){

    let makaan =  webAddress + JSON.stringify(newSelector) + addressEnd;
    console.log(makaan);
    request(makaan, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let jsonResponse =  JSON.parse(body);
            jsonResponse = jsonResponse.data[0].facetedResponse;
            
            let cardInfoArray = [];
            for(let i = 0; i < jsonResponse.items.length; i++){
                    let currentItem = jsonResponse.items[i].listing;
                    let sellerInfo = [];
                    let heading = [];
                    let pricing = [];
                    let generalInfo = [];
                    let description;
                    /*Seller Info*/
                    sellerInfo.push(currentItem.companySeller.user.profilePictureURL);
                    sellerInfo.push(currentItem.companySeller.user.fullName);
                    sellerInfo.push(currentItem.listingSellerTransactionStatuses);
                    sellerInfo.push(5.0);

                    //Heading Info

                    if(currentItem.property.rk === false)
                    heading.push(currentItem.property.bedrooms + " BHK");
                    else
                    heading.push(currentItem.property.bedrooms + " RK");

                    heading.push(currentItem.property.project.builder.displayName);
                    heading.push(currentItem.property.project.name);
                    heading.push(currentItem.property.project.locality.label);
                    heading.push(currentItem.property.project.locality.suburb.city.label);
                    heading.push(currentItem.property.unitType);

                    //price an area

                    pricing.push(currentItem.currentListingPrice.price)
                    pricing.push(currentItem.currentListingPrice.pricePerUnitArea);
                    pricing.push(currentItem.property.size);                    
                    pricing.push(currentItem.property.measure);
                    pricing.push(currentItem.property.project.projectStatus);
                    
                    //general info no of bedrooms etc
                    generalInfo.push(currentItem.property.bathrooms)

                    //decription
                    description = currentItem.description;
                cardInfoArray.push(new CardInfo(currentItem.mainImageURL,sellerInfo,heading,pricing,generalInfo,description));
            }  
        let theAdapter = new Adapter(cardInfoArray);
        htmlResponse = theAdapter.makeHtml();
        res.render("search",{html: htmlResponse } );
        }
   });


}


app.get("/search",function(req,res){

    let q = url.parse(req.url, true);
    let qdata = q.query;
    if(Object.keys(qdata).length === 0){
        //general result
        queryApi(generalSelector,res);   

    }else{
    // if qdata.sort exists

    let newSelector =  JSON.parse(JSON.stringify(generalSelector));
    console.log(newSelector);

     if(qdata.sort){
        if(qdata.sort === "price-asc"){
            newSelector.sort =  [{"field":"price","sortOrder":"ASC"}];      
         }
        else if(qdata.sort === "price-desc" ) {    
            newSelector.sort =  [{"field":"price","sortOrder":"DESC"}];
         }
         else if(qdata.sort === "popularity"){
            newSelector.sort =  [{"field":"listingPopularityScore","sortOrder":"DESC"}];
         }
         else if(qdata.sort === "rating"){
            newSelector.sort =  [{"field":"listingSellerCompanyScore","sortOrder":"DESC"}];

         }else if(qdata.sort === "date"){
            newSelector.sort =  [{"field":"listingDisplayDate","sortOrder":"DESC"}];
         }
         else{
             if(newSelector.sort)
             delete newSelector.sort;
         }
         
    }

    if(qdata.listingType){
        if(qdata.listingType === "rental"){
            newSelector.filters.and[1].equal.listingCategory = ["Rental"];
        }else{
            //do nothing show the normal results 
        }
    }

    if(qdata.beds){
        if(qdata.beds === "4plus"){
            newSelector.filters.and.push({"equal":{"bedrooms":[4,5,6,7,8,9,10]}});
            
        }
        else if(qdata.beds === "1" || qdata.beds === "2" || qdata.beds === "3" ){
            newSelector.filters.and.push({"equal":{"bedrooms":[Number(qdata.beds)]}});
            
        }else{
            // do nothing
        }
    }
    

    //Pricing 
    if(qdata.min_pricing){
        newSelector.filters.and.push({"range":{"price":{"from":Number(qdata.min_pricing)}}});
    }

    if(qdata.max_pricing){
        newSelector.filters.and.push({"range":{"price":{"to":Number(qdata.max_pricing)}}});
    }


queryApi(newSelector,res);
}

    // let cardinfo_1 = new CardInfo("https://images.freeimages.com/images/small-previews/adf/sun-burst-1478549.jpg","this is sellar info", "this is some other info");
    // let cardinfo_2 = new CardInfo("https://images.freeimages.com/images/small-previews/adf/sun-burst-1478549.jpg","information about seller", "eh some info");
    // console.log(cardinfo_1);
    // let cardInfromation = [cardinfo_1,cardinfo_2];
    // let theAdapter = new Adapter(cardInfromation);
    // console.log(theAdapter.makeHtml());

    
});
