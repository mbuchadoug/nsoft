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
    url: "/salesAuto",
	

      success: function(data) {
       
        arr = data

for(var i = 0; i<arr.length;i++){

  availableKeywords.push(arr[i].salesPerson)
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
      url: "/salesAuto2",
      data:{code:code},
    
  
        success: function(data) {
          console.log(data,'data')
     
    document.getElementById('salesPerson').value=data.salesPerson
    document.getElementById('embr4').textContent=data.salesPerson
   
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

 n[0].id = 'cases'+trSize
 n[1].id = 'quantity'+trSize
 n[2].id = 'price'+trSize
 n[0].data = 'cases'+trSize
 n[1].data = 'quantity'+trSize
 n[2].data = 'price'+trSize

 var n2 = document.getElementsByName('cross')
 n2[trSize-1].id = 'autoPro'+trSize

 
 var n3 = document.getElementsByName('cross2')
 n3[trSize-1].id = 'autoProBox'+trSize

 var amount = document.getElementsByName('amount')
 amount[trSize-1].id = 'amount'+trSize
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

