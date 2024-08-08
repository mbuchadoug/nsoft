let availableKeywords =[
'HTML',
'CSS',
'Easy Tutorials',
'Web design tutorials',
'JS',
]

const resultBox = document.getElementById("ember556")
const inputBox = document.getElementById("input-box");


inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;

    if(input.length){
        result = availableKeywords.filter((keyword)=>{
         return   keyword.toLowerCase().includes(input.toLowerCase());

        });
        console.log(result)
        result.map((list)=>{
            console.log(list)
let c =document.createElement("li");
resultBox.appendChild(c)
        });

    }

    //display(result)

  
}



function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });

      resultBox.innerHTML = "<ul>" +content.join('') + "</ul>";
}



function selectInput(list){
    inputBox.value = list.innerHTML
    //resultBox.innerHTML=''
}