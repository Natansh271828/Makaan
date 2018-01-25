
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
        <div class="card_image" style="background-image:url(${this.image})"></div>
        <div class="card_seller_info"> ${this.sellerInfo}</div>
    </div>
    <div class="card_right_div">
        <div class="card_heading">Heading</div>
        <div class="card_highlight">Card Highlight</div>
        <div class="card_info">${this.information}</div>
        <div class="card_description">description</div>
        <div class="card_buttons">Buttons</div>
    </div>
  </div></div>`;

}

Template.prototype.returnCard = function(){
    console.log("in template " + this.image);
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



/////////////////////////////////////

let cardinfo_1 = new CardInfo("https://images.freeimages.com/images/small-previews/adf/sun-burst-1478549.jpg","this is sellar info", "this is some other info");
let cardinfo_2 = new CardInfo("https://images.freeimages.com/images/small-previews/adf/sun-burst-1478549.jpg","information about seller", "eh some info");

let cardInfromation = [cardinfo_1,cardinfo_2];
let theAdapter = new Adapter(cardInfromation);

console.log(theAdapter.makeHtml());