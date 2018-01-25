var express = require("express");
var request = require('request');
var makaan = 'https://www.makaan.com/petra/app/v4/listing?selector={%22fields%22:[%22localityId%22,%22displayDate%22,%22listing%22,%22property%22,%22project%22,%22builder%22,%22displayName%22,%22locality%22,%22suburb%22,%22city%22,%22state%22,%22currentListingPrice%22,%22companySeller%22,%22company%22,%22user%22,%22id%22,%22name%22,%22label%22,%22listingId%22,%22propertyId%22,%22projectId%22,%22propertyTitle%22,%22unitTypeId%22,%22resaleURL%22,%22description%22,%22postedDate%22,%22verificationDate%22,%22size%22,%22measure%22,%22bedrooms%22,%22bathrooms%22,%22listingLatitude%22,%22listingLongitude%22,%22studyRoom%22,%22servantRoom%22,%22pricePerUnitArea%22,%22price%22,%22localityAvgPrice%22,%22negotiable%22,%22rk%22,%22buyUrl%22,%22rentUrl%22,%22overviewUrl%22,%22minConstructionCompletionDate%22,%22maxConstructionCompletionDate%22,%22halls%22,%22facingId%22,%22noOfOpenSides%22,%22bookingAmount%22,%22securityDeposit%22,%22ownershipTypeId%22,%22furnished%22,%22constructionStatusId%22,%22tenantTypes%22,%22bedrooms%22,%22balcony%22,%22floor%22,%22totalFloors%22,%22listingCategory%22,%22possessionDate%22,%22activeStatus%22,%22type%22,%22logo%22,%22profilePictureURL%22,%22score%22,%22assist%22,%22contactNumbers%22,%22contactNumber%22,%22isOffered%22,%22mainImageURL%22,%22mainImage%22,%22absolutePath%22,%22altText%22,%22title%22,%22imageCount%22,%22geoDistance%22,%22defaultImageId%22,%22updatedAt%22,%22qualityScore%22,%22projectStatus%22,%22throughCampaign%22,%22addedByPromoter%22,%22listingDebugInfo%22,%22videos%22,%22imageUrl%22,%22rk%22,%22penthouse%22,%22studio%22,%22paidLeadCount%22,%22listingSellerTransactionStatuses%22,%22allocation%22,%22allocationHistory%22,%22masterAllocationStatus%22,%22status%22,%22sellerCompanyFeedbackCount%22,%22companyStateReraRegistrationId%22],%22filters%22:{%22and%22:[{%22equal%22:{%22cityId%22:11}},{%22equal%22:{%22listingCategory%22:[%22Primary%22,%22Resale%22]}}]},%22paging%22:{%22start%22:0,%22rows%22:20}}&includeNearbyResults=false&includeSponsoredResults=false&sourceDomain=Makaan';
// var Template = require("./Classes/Template");
// var Adapter = require("./Classes/Adapter");
// var CardInfo = require("./Classes/CardInfo");
var app = express();
/*
*CardInfo Object contains information about the card; 
*/
function CardInfo(image,sellerInfo,information){
    this.image = image;
    this.sellerInfo = sellerInfo;
    this.information = information;
}

/*
Template being used to make cards
 */
function Template(card){
    this.image =  card.image;
    this.sellerInfo = card.sellerInfo;
    this.information = card.information;
    this.html =  `<div class="card_container"><div class="card">
    <div class="card_left_div">
        <div class="card_image" style="background-image:url('${this.image}')"></div>
        <div class="card_seller_info">
            <div class="card_seller_image"></div>
            <div class="seller_info">
                <div class="seller_name">${this.sellerInfo}</div>
                <div class="seller_profeciency">seller_prof</div>
            </div>
            <div class="seller_rating">5.0</div>
        </div>
    </div>
    <div class="card_right_div">
        <div class="card_heading">
            <div class="card_title">${this.information}</div> 
            <div class="location">loc</div>
            <hr>
        </div>
        <div class="card_highlights_wrap">
            <div class="card_highlights">
                <div class="price">
                     <div class="total_price">5CR</div>
                    <div class="price_per_sq">5000/sqft</div>
                </div>
                <div class="area">
                    <div class="total_area">1579</div>
                    <div class="area_unit">area in sqft</div>
                </div>
                <div class="construction_status">Under Cons</div>
            </div>
            <hr>
        </div>
        <div class="card_info">
            <div class="availability">by 78 dec</div>
            <div class="bathrooms">2 bathrooms</div>
            <div class="floor">2nd of 17th</div>
        </div>
        <div class="card_description">description</div>
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

var htmlResponse;
app.get("/search",function(req,res){

    request(makaan, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let jsonResponse =  JSON.parse(body);
            jsonResponse = jsonResponse.data[0].facetedResponse;
            
            let cardInfoArray = [];
            for(let i = 0; i < jsonResponse.items.length; i++){
                    let currentItem = jsonResponse.items[i].listing;
                    let sellerInfo = [];




                cardInfoArray.push(new CardInfo(currentItem.mainImageURL,currentItem.companySeller.user.fullName, currentItem.mainImage.title));
            }  
        let theAdapter = new Adapter(cardInfoArray);
        htmlResponse = theAdapter.makeHtml();
        }
   })

    // let cardinfo_1 = new CardInfo("https://images.freeimages.com/images/small-previews/adf/sun-burst-1478549.jpg","this is sellar info", "this is some other info");
    // let cardinfo_2 = new CardInfo("https://images.freeimages.com/images/small-previews/adf/sun-burst-1478549.jpg","information about seller", "eh some info");
    // console.log(cardinfo_1);
    // let cardInfromation = [cardinfo_1,cardinfo_2];
    // let theAdapter = new Adapter(cardInfromation);
    // console.log(theAdapter.makeHtml());

    res.render("search",{html: htmlResponse } );
});
