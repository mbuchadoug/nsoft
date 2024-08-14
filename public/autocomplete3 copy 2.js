


let availableKeywords2 =[]
let arr2 = []

const resultBox12 = document.getElementById("autoPro")
const resultBox2 = document.getElementById("autoProBox")
const inputBox2 = document.getElementById("ember408");
const clone2 = document.getElementById("lineitems-section");
const octaneBox2= document.getElementById("octane4")
const cloneBtn2 = document.getElementById("cloneBtn");

												
	$.ajax({
    dataType: 'json',
 
    type: 'GET',
    url: "/proAuto",
	

      success: function(data) {
        console.log(data,'shit')
        arr2 = data

for(var i = 0; i<arr2.length;i++){

  availableKeywords2.push(arr2[i].name)
}    



inputBox2.onkeyup = function(){
    let result2 = [];
    let input2 = inputBox2.value;

    if(input2.length){
 

        result2 = availableKeywords2.filter((keyword)=>{
         return   keyword.toLowerCase().includes(input2.toLowerCase());

        });
        console.log(result2)

    }

    display(result2)

    /*if(!result.length){
        resultBox.innerHTML='';
    }*/
}

}

})

function display(result2){
    const content2 = result2.map((list)=>{
  for(var i = 0;i<arr2.length;i++){
  if(arr2[i].name == list){

  
let name = arr2[i].name
let usd = arr2[i].usd
let stock = arr2[i].cases

        return `
        <li onclick=selectInput2(this) class="ac-item-details dropdown-item ac-option ">
        <a tabindex="-1">
          <div class="autocomplete-option" title="${name}">
            <div class="ac-name-rate-sku">
         <div class="ac-name" id="nameList">${name}</div> 
         <div class="grey-text"><div></div>
         <span class="ac-rate">Rate: USD ${usd}.00</span></div></div> 
         <div class="ac-stock">
           <div>Stock on Hand</div>
            <div class="stock-available">${stock}:cases</div></div></div>
            </a>
             <div class="border-line"></div></li>
                             
                             `
        //resultBox.appendChild(list)
        //resultBox2.innerHTML = `<ul class="ac-dropdown-results dropdown-menu input-block-level left-align-options ">`+content2.join('') + `</ul>`
      }
    }

    });
 
    resultBox2.innerHTML = `<ul class="ac-dropdown-results dropdown-menu input-block-level left-align-options ">`+content2.join('') + `</ul>`
     
}



function selectInput2(list){
   // inputBox.value = list.innerText
    //resultBox1.innerHTML=''
    let code = document.getElementById("nameList").textContent
    console.log(code,'codeV')
    var table = document.getElementById("lineitems-section"); // find table to append to
    let tr = table.getElementsByTagName('tr')
    let trSize = tr.length - 1
    console.log(trSize,'trSize')
    //console.log(clone.getElementsByTagName('button'))
    // add new row to end of table
   
    var f2 = table.getElementsByTagName('textarea')
    let nSize = f2.length -1



    $.ajax({
      dataType: 'json',
   
      type: 'POST',
      url: "/proAuto2",
      data:{code:code},
    
  
        success: function(data) {
          console.log(data,'data')
          console.log(f2[nSize],'fff')
          f2[nSize].value = ''
          f2[nSize].value = data.name
          document.getElementById(`price${trSize}`).value = data.usd
          resultBox12.style.display="none"
          
        
          
          //let product = data.product
   
        }
        })

       
}



/*$('table#lineitems-section').on('click', '#remove', function() {
  const tr = this.parentElement
  tr.remove();
});*/
   

