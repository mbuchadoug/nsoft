let availableKeywords2 =[]
let arr2 = []
const resultBox12 = document.getElementById("autoPro")
const resultBox2 = document.getElementById("autoProBox")
const inputBox2 = document.getElementById("ember408");


const autoPro1 = document.getElementById("autoPro2")
const autoProBox1 = document.getElementById("autoProBox2")
const area1 = document.getElementById("area1");

const autoPro3 = document.getElementById("autoPro3")
const autoProBox3 = document.getElementById("autoProBox3")
const area2 = document.getElementById("area2");



$('body').on('click','#ember408', function (e) {
  console.log('yeah')
  let salesPerson=document.getElementById('salesPerson').value
  console.log(salesPerson,'salesPerson')
let p =  document.getElementById('autoPro');
if(p.style.display == "none"){


document.getElementById("autoPro").style.display = "";



												
$.ajax({
  dataType: 'json',

  type: 'POST',
  data:{code:salesPerson},
  url: "/proAuto",


    success: function(data) {
      console.log(data,'shit')
      arr2 = data

for(var i = 0; i<arr2.length;i++){

availableKeywords2.push(arr2[i].product)
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
    console.log(list,'listtttt')
for(var i = 0;i<arr2.length;i++){
if(arr2[i].product == list){


let name = arr2[i].product
//let usd = arr2[i].usd
let stock = arr2[i].qty

      return `
      <li onclick=selectInput2(this) class="ac-item-details dropdown-item ac-option ">
      <a tabindex="-1" >
        <div class="autocomplete-option" title="${name}">
          <div class="ac-name-rate-sku">
       <div class="ac-name" id="nameList">${name}</div> 
       <div class="grey-text"><div></div>
    </div></div> 
       <div class="ac-stock">
         <div>Stock on Hand</div>
          <div class="stock-available">${stock}:units</div></div></div>
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





}
})






$('body').on('click','#area1', function (e) {
  console.log('yeah')
let p =  document.getElementById('autoPro2');
if(p.style.display == "none"){


document.getElementById("autoPro2").style.display = "";



												
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



 function keyup(){
  let result1 = [];
  let input1 = area1.value;

  if(input1.length){


      result1 = availableKeywords2.filter((keyword)=>{
       return   keyword.toLowerCase().includes(input1.toLowerCase());

      });
      console.log(result1)

  }

  display1(result1)


}

}

})

function display1(result1){
  const content1 = result1.map((list1)=>{
for(var i = 0;i<arr2.length;i++){
if(arr2[i].name == list1){


let name = arr2[i].name
let usd = arr2[i].usd
let stock = arr2[i].cases

      return `
      <li onclick=selectInput1(this) class="ac-item-details dropdown-item ac-option ">
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
   
    }
  }

  });

  autoProBox1.innerHTML = `<ul class="ac-dropdown-results dropdown-menu input-block-level left-align-options ">`+content1.join('') + `</ul>`
   
}





}else{
  document.getElementById("autoPro2").style.display = "none";
}
})
















function selectInput2(list){
  // inputBox.value = list.innerText
   //resultBox1.innerHTML=''
   console.log(list,'list')
   let diiv =list.getElementsByClassName('autocomplete-option')
   console.log(diiv,'div')
   let title = diiv[0].title
console.log(title,'title')
   let code = title // document.getElementById("nameList").textContent
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
   



function selectInput1(list1){
  // inputBox.value = list.innerText
   //resultBox1.innerHTML=''
   console.log(list,'list')
   let diiv =list.getElementsByClassName('autocomplete-option')
   console.log(diiv,'div')
   let title = diiv[0].title
   let code = title
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
         console.log(data,'data1')
         console.log(f2[nSize],'fff')
         f2[nSize].value = ''
         f2[nSize].value = data.name
         autoPro1.style.display="none"
         autoProBox1.style.display="none"
         document.getElementById(`price${trSize}`).value = data.usd
      
         
       
         
         //let product = data.product
  
       }
       })
 
      
 }
 

 



$('body').on('click','#area2', function (e) {
  console.log('yeah')
let p =  document.getElementById('autoPro3');
if(p.style.display == "none"){


document.getElementById("autoPro3").style.display = "";



												
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



 function keyup(){
  let result1 = [];
  let input1 = area1.value;

  if(input1.length){


      result1 = availableKeywords2.filter((keyword)=>{
       return   keyword.toLowerCase().includes(input1.toLowerCase());

      });
      console.log(result1)

  }

  display2(result1)


}

}

})

function display2(result1){
  const content1 = result1.map((list1)=>{
for(var i = 0;i<arr2.length;i++){
if(arr2[i].name == list1){


let name = arr2[i].name
let usd = arr2[i].usd
let stock = arr2[i].cases

      return `
      <li onclick=selectInput3(this) class="ac-item-details dropdown-item ac-option ">
      <a tabindex="-1" >
        <div class="autocomplete-option" title="${name}">
          <div class="ac-name-rate-sku">
       <div class="ac-name" id="nameList" >${name}</div> 
       <div class="grey-text"><div></div>
       <span class="ac-rate">Rate: USD ${usd}.00</span></div></div> 
       <div class="ac-stock">
         <div>Stock on Hand</div>
          <div class="stock-available">${stock}:cases</div></div></div>
          </a>
           <div class="border-line"></div></li>
                           
                           `
   
    }
  }

  });

  autoProBox3.innerHTML = `<ul class="ac-dropdown-results dropdown-menu input-block-level left-align-options ">`+content1.join('') + `</ul>`
   
}





}else{
  document.getElementById("autoPro3").style.display = "none";
}
})






function selectInput3(list1){
  // inputBox.value = list.innerText
   //resultBox1.innerHTML=''
   console.log(list,'list')
   let diiv =list.getElementsByClassName('autocomplete-option')
   console.log(diiv,'div')
   let title = diiv[0].title
   let code = title
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
         console.log(data,'data1')
         console.log(f2[nSize],'fff')
         f2[nSize].value = ''
         f2[nSize].value = data.name
         autoPro3.style.display="none"
         autoProBox3.style.display="none"
         document.getElementById(`price${trSize}`).value = data.usd
      
         
       
         
         //let product = data.product
  
       }
       })
 
      
 }
 










