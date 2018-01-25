
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

  //module.exports = Adapter;
  