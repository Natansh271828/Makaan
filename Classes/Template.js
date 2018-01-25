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

//module.exports  = Template;