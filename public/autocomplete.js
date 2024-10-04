let availableKeywords =[]
let arr = []

const resultBox1 = document.getElementById("ember556")
const resultBox = document.querySelector(".ac-dropdown-menu")
const inputBox = document.getElementById("input-box");
const clone = document.getElementById("lineitems-section");
const octaneBox = document.getElementById("octane4")
const cloneBtn = document.getElementById("cloneBtn");

												
	$.ajax({
    dataType: 'json',
 
    type: 'GET',
    url: "/sales/custAuto",
	

      success: function(data) {
        console.log(data,'shit')
        arr = data

for(var i = 0; i<arr.length;i++){

  availableKeywords.push(arr[i].companyName)
}    



inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;

    if(input.length){
 

        result = availableKeywords.filter((keyword)=>{
         return   keyword.toLowerCase().includes(input.toLowerCase());

        });
        console.log(result)

    }

    display(result)

    /*if(!result.length){
        resultBox.innerHTML='';
    }*/
}

}

})

function display(result){
    const content = result.map((list)=>{
        return `
        <li onclick=selectInput(this) class="dropdown-item ac-option  "><a tabindex="-1">
                       <div class="autocomplete-option">
                         <div class="option">
                         <div class="media align-items-center" title="Mr. Joe">
                            <img src="/uploads/propic.jpg" class="align-items-center d-inline-flex text-medium justify-content-center me-0 bg-initials-default rounded-circle "> 
                             <div class="media-body contact-dropdown-content ps-3">
                               <div class="d-flex align-items-center"><span class="text-ellipsis ">${list}</span> <!---->
                             </div> <!----></div></div></div> <!----></div></a></li>
                             
                             
                             `
        //resultBox.appendChild(list)

    });

      resultBox.innerHTML = `<ul class="ac-dropdown-results dropdown-menu show left-align-options" >` +content.join('') + `</ul>` +''+` <a class="ac-quick-create" onclick=modalV() id="btnModal"   tabindex="-1" data-ember-action="" data-ember-action-559="559">
      <i  class="zf-ac-add-new-icon"><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440.72 440.73"><path fill="#408dfb" d="M220.36 0C98.66 0 0 98.66 0 220.36s98.66 220.37 220.36 220.37 220.36-98.66 220.36-220.37S342.06 0 220.36 0zm106.21 242.74h-83.79v83.8c0 12.43-10.07 22.5-22.5 22.5s-22.5-10.07-22.5-22.5v-83.8h-83.8c-12.42 0-22.5-10.07-22.5-22.5s10.08-22.5 22.5-22.5h83.8v-83.79c0-12.43 10.07-22.5 22.5-22.5s22.5 10.07 22.5 22.5v83.79h83.79c12.43 0 22.5 10.08 22.5 22.5s-10.07 22.5-22.5 22.5z" id="Layer_1-2"></path></svg></i>
     <span  class="zf-ac-add-new-label">New Customer</span></a>`;
}



function selectInput(list){
   // inputBox.value = list.innerText
    //resultBox1.innerHTML=''
    let code = list.innerText

    $.ajax({
      dataType: 'json',
   
      type: 'POST',
      url: "/sales/custAuto2",
      data:{code:code},
    
  
        success: function(data) {
          console.log(data,'data')
          let fullname = data.salutation +''+ data.lastName
          let address = data.address
          let city = data.city
          let town = data.town
          let country = data.country

    resultBox1.style.display="none"
    document.getElementById('company').value= data.companyName
    document.getElementById('address').value = data.address
    document.getElementById('clientName').value = fullname

    document.getElementById('embr4').textContent=data.companyName
    octaneBox.innerHTML =`<div class="row" ><div class="col-lg-10 offset-lg-2"><!----> <!----> 
    <div id="ember520" class="ember-view info-item cursor-pointer">
    <span class="text-blue"><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon align-text-bottom"><path d="M394.8 422h-90c-11 0-20-9-20-20s9-20 20-20h90c11 0 20 9 20 20s-9 20-20 20zm97-145h-187c-11 0-20-9-20-20s9-20 20-20h187c11 0 20 9 20 20s-9 20-20 20zm0-145h-187c-11 0-20-9-20-20s9-20 20-20h187c11 0 20 9 20 20s-9 20-20 20zM227.2 422c-11 0-20-9-20-20v-37.3c0-22.2-22.3-40.3-49.8-40.3H89.8c-27.4 0-49.8 18.1-49.8 40.3V402c0 11-9 20-20 20s-20-9-20-20v-37.3c0-44.3 40.3-80.3 89.8-80.3h67.6c49.5 0 89.8 36 89.8 80.3V402c0 11-8.9 20-20 20zM123.6 244.8C80.8 244.8 46 210 46 167.2s34.8-77.6 77.6-77.6 77.6 34.8 77.6 77.6-34.8 77.6-77.6 77.6zm0-115.1c-20.7 0-37.6 16.9-37.6 37.6 0 20.7 16.8 37.6 37.6 37.6s37.6-16.9 37.6-37.6c0-20.8-16.8-37.6-37.6-37.6z"></path></svg>&nbsp;  View Customer Details</span><div id="ember521" class="ember-view">
    <div id="ember522" class="ember-view"></div></div></div></div></div></div> 
    <div class="row form-group placeholder-container"><!----> 
    <div class="col-lg-8 offset-lg-2"><!---->
     <div class="row"><!----> 
     <div class="col-lg-4">
     <div id="ember523" class="popovercontainer address-group ember-view">
    <div id="ember538" class="ember-view"><div class="address-list">
    <div><span data-ember-action="" data-ember-action-539="539">
    <span class="customer-address-header text-uppercase d-inline-block mb-2">
    <span>Billing Address</span> 
    <span class="cursor-pointer text-muted ms-1"><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 512" class="icon icon-xsmall"><g id="Layer_2-2"><path d="M50.3 512c-13.04 0-25.74-5.08-35.2-14.35C3.47 486.27-1.93 469.88.64 453.82l16.9-105.61c3.01-18.79 11.71-35.82 25.17-49.27l272.83-272.7c35.01-34.99 91.99-34.98 127.01.02l41.14 41.12c16.96 16.96 26.31 39.5 26.32 63.47 0 23.98-9.33 46.52-26.29 63.47L210.3 467.59c-12.98 12.98-29.4 21.57-47.47 24.84L59.23 511.2c-2.97.54-5.96.8-8.93.8zM379.02 39.99c-12.74 0-25.48 4.85-35.18 14.54L71 327.23c-7.46 7.45-12.28 16.9-13.95 27.31l-16.9 105.61c-.73 4.55 1.54 7.55 2.95 8.93 1.41 1.38 4.46 3.58 8.99 2.76l103.6-18.77A49.498 49.498 0 00182 439.3l273.4-273.27c9.4-9.39 14.57-21.89 14.57-35.18s-5.19-25.79-14.59-35.19l-41.14-41.12c-9.71-9.71-22.47-14.56-35.22-14.56z"></path><path transform="rotate(-45.01 331.896 178.02)" d="M311.84 79.14h40.01v197.75h-40.01z"></path></g></svg></span></span></span> <!----></div></div></div> 
    <address id="ember540" class="font-small ember-view"><div class="text-break ">
    <span><strong>${fullname}</strong></span>
     <div class="preserve-wrap">${town},</div><!---->
     <div class="preserve-wrap">${address}</div> <!----> <!----> ${city}, <!----> <!----> ${country}<br> <!----> <!----> <!----><!----></div></address></div></div>
      <div class="col-lg-4">
      <div id="ember527" class="popovercontainer address-group ember-view">
      <div id="ember528" class="ember-view"><div class="address-list"><div>
      <span data-ember-action="" data-ember-action-529="529"><span class="customer-address-header text-uppercase d-inline-block mb-2"><span>Shipping Address</span> 
      <span class="cursor-pointer text-muted ms-1"><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 512" class="icon icon-xsmall"><g id="Layer_2-2"><path d="M50.3 512c-13.04 0-25.74-5.08-35.2-14.35C3.47 486.27-1.93 469.88.64 453.82l16.9-105.61c3.01-18.79 11.71-35.82 25.17-49.27l272.83-272.7c35.01-34.99 91.99-34.98 127.01.02l41.14 41.12c16.96 16.96 26.31 39.5 26.32 63.47 0 23.98-9.33 46.52-26.29 63.47L210.3 467.59c-12.98 12.98-29.4 21.57-47.47 24.84L59.23 511.2c-2.97.54-5.96.8-8.93.8zM379.02 39.99c-12.74 0-25.48 4.85-35.18 14.54L71 327.23c-7.46 7.45-12.28 16.9-13.95 27.31l-16.9 105.61c-.73 4.55 1.54 7.55 2.95 8.93 1.41 1.38 4.46 3.58 8.99 2.76l103.6-18.77A49.498 49.498 0 00182 439.3l273.4-273.27c9.4-9.39 14.57-21.89 14.57-35.18s-5.19-25.79-14.59-35.19l-41.14-41.12c-9.71-9.71-22.47-14.56-35.22-14.56z"></path><path transform="rotate(-45.01 331.896 178.02)" d="M311.84 79.14h40.01v197.75h-40.01z"></path></g></svg></span></span></span> <!----></div></div></div>
       <div><a class="font-xs" href="#" data-ember-action="" data-ember-action-530="530">Add new address</a></div></div></div></div></div>`
        }
        })
}



cloneBtn.onclick = function(){

  var row = document.getElementById("rowToClone"); // find row to copy
  var table = document.getElementById("lineitems-section"); // find table to append to
  var clone = row.cloneNode(true); // copy children too
  
  let tr = table.getElementsByTagName('tr')
  let trSize = tr.length 
  console.log(clone.td,'num')
  table.appendChild(clone);
  clone.id = "newID"+trSize; 
  //console.log(clone.getElementsByTagName('button'))
  // add new row to end of table
  var f = clone.getElementsByTagName('textarea')
  var f2 = table.getElementsByTagName('textarea')
  var f3 = clone.getElementsByTagName('input')
  for(var i = 0;i<f3.length;i++){
    f3[i].value=''
  }
  let sizeArea = f2.length-1
  let nSize = f.length -1
  f[nSize].id = 'area'+sizeArea
  f[nSize].data = 'area'+sizeArea
  console.log(f[nSize],'text')
  console.log(f,'text2')
  f2[sizeArea].value= ''
 var x = clone.getElementsByTagName('button')
 console.log(x,'x')

 var size = x.length-1
 x[size].id = 'num'+size
 x[size].setAttribute("onclick", "removeX()");
 //console.log(x[size],'ahhhh')

 var n = clone.getElementsByTagName('input')

 n[0].id = 'quantity'+trSize
 n[1].id = 'price'+trSize
 n[2].id = 'stock'+trSize
 n[0].data = 'quantity'+trSize
 n[1].data = 'price'+trSize
 n[2].data = 'stock'+trSize

 var n2 = document.getElementsByName('cross')
 n2[trSize-1].id = 'autoPro'+trSize
 console.log(trSize,'trSizeClone')

 console.log(document.getElementById(`autoPro${trSize}`),'666')
 var n3 = document.getElementsByName('cross2')
 n3[trSize-1].id = 'autoProBox'+trSize

 var amount = document.getElementsByName('amount')
 amount[trSize-1].id = 'amount'+trSize
 document.getElementById('xxx').setAttribute("onclick","selectInput1(this)")

 console.log(document.getElementById('xxx'),'6756')
}


function removeX(){
  var table = document.getElementById("lineitems-section")
  var x = table.getElementsByTagName('tr')
 var size = x.length-1
  console.log($("#lineitems-section tr:last-child"))
  if($("#lineitems-section tr").length != 0)
  {               
      //$("#lineitems-section tr").remove();
      x[size].remove()
     
  }
  else
  {
      alert("Now table is empty");
  }
}
$('#removeX').on('click', function(event) {
  console.log(event,'event')
  event.preventDefault();
  $(this).closest('tr').remove();



  
});

/*$('table#lineitems-section').on('click', '#remove', function() {
  const tr = this.parentElement
  tr.remove();
});*/

$('#deleteRow').on('click',function()
    {

      console.log('click')
              if($("#lineitems-section tr").length != 0)
              {               
                  $("#lineitems-section tr:first-child").remove();
              }
              else
              {
                  alert("Now table is empty");
              }
   });    


function modalV(){
    let sbox = document.getElementById("ember556")
var modal = document.getElementById("ember648");

// Get the button that opens the modal
var btn = document.getElementById("btnModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  //sbox.innerHTML=''
  resultBox1.style.display='none';
   sbox.style.display='none';
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
//sbox.innerHTML=''
resultBox1.style.display='none';
 sbox.style.display='none';
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    resultBox1.style.display='none';
  sbox.style.display='none';
    modal.style.display = "none";
  }
}
}

