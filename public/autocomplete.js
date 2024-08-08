let availableKeywords =[
'Pick n Pay',
'OK',
'Muzamhindo',
'Bon Marche',
'Spar',
]
const resultBox1 = document.getElementById("ember556")
const resultBox = document.querySelector(".ac-dropdown-menu")
const inputBox = document.getElementById("input-box");


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



function display(result){
    const content = result.map((list)=>{
        return `
        <li onclick=selectInput(this) class="dropdown-item ac-option  "><a tabindex="-1">
                       <div class="autocomplete-option">
                         <div class="option">
                         <div class="media align-items-center" title="Mr. Joe">
                            <span class="align-items-center d-inline-flex text-medium justify-content-center me-0 bg-initials-default rounded-circle ">M</span>
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
    resultBox1.style.display="none"
    document.getElementById('embr4').textContent=list.innerText
}


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