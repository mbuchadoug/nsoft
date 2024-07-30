$.ajax({
   
    dataType: 'json',
    type: 'POST',
	
    url: "/addStock3",
    success: function(data) {
    console.log(data)
    console.log(data.length,'wwww')

    
   for(var i = 0;i<data.length;i++){
    var tr = document.createElement('tr');

    var td1 = tr.appendChild(document.createElement('td'));
    var td2 = tr.appendChild(document.createElement('td'));
	var td3 = tr.appendChild(document.createElement('td'));
    var td4 = tr.appendChild(document.createElement('td'));
    var td5 = tr.appendChild(document.createElement('td'));
    var td6 = tr.appendChild(document.createElement('td'));
    var td7 = tr.appendChild(document.createElement('td'));
    var link= tr.appendChild(document.createElement('td'));
   
    td1.id =data[i]._id
    td4.id = data[i]._id
/*td2.classList.add('text-end', 'pe-0')
td3.classList.add('text-end', 'pe-0')
td4.classList.add('text-end', 'pe-1')
link.classList.add('text-end','pe-0')
link.setAttribute("href", "/rec/delete")
link.className = "text-end";*/

/*let link = document.createTextNode("Delete")

td5.appendChild(link);*/


td1.innerHTML = data[i].name;
td2.innerHTML = data[i].availableCases;
td3.innerHTML = data[i].casesReceived;
td4.innerHTML=  data[i].availableCases + data[i].cases ;
td5.innerHTML = data[i].mformat
td6.innerHTML = data[i].warehouse
td7.innerHTML = data[i].shift
    /*let link2 = "/rec/delete/"+data[i]._id

    var linkText = 'Delete'
link.href="/rec/delete/"+data[i]._id*/
 
    /*link.innerHTML='<a href="'+link2+'">'+linkText+'</a>'

    console.log(link,'33tt')
  

    console.log(td4,'yeah')*/

  document.getElementById("kt_ecommerce_report_sales_table").appendChild(tr)

   }





var table = document.getElementById('kt_ecommerce_report_sales_table')
var cells = table.getElementsByClassName("text-end pe-1")
for(var i = 0; i< cells.length; i++){
cells[i].onclick = function(){
console.log(i,'this')
if(this.hasAttribute('data-clicked')){
    
    return;
}

this.setAttribute('data-clicked', 'yes')
this.setAttribute('data-text', this.innerHTML)

var input = document.createElement('input');
input.setAttribute('type', 'text')
input.value = this.innerHTML
input.style.width = this.offsetWidth - (this.clientLeft * 2) + 'px';
input.style.height = this.offsetHeight - (this.clientTop * 2) + "px";
input.style.border = '0px';
input.style.fontFamily ="inherit";
input.style.fontSize ="inherit";
input.style.textAlign = "inherit";
input.style.backgroundColor = 'LightGoldenRodYellow';

input.onblur = function(){

    var td = input.parentElement;
        console.log(td.id,'td')
    var orig_text = input.parentElement.getAttribute('data-text');
    var current_text = this.value;

     let reg = /\d+\.*\d*/g;

let result = current_text.match(reg)
let currentMark = Number(result)




let resultX = orig_text.match(reg)
let originalMark = Number(resultX)

console.log(currentMark,originalMark,'mark')





    if(orig_text != current_text ){
  
        console.log(current_text,'current_text')
$.ajax({
  dataType: 'json',
            data: {
                code: current_text,
                
            },
            type: 'POST',
            url: "/rec/stock/update/"+td.id,


  success: function(data) {
 

console.log(td.id,'id2')
console.log(td,'coalition')
        td.removeAttribute('data-clicked')
        td.removeAttribute('data-text')
        td.innerHTML = current_text
        
        td.style.cssText = 'padding: 5px';

    
  
    }


});
        console.log(td.id,'id2')
        td.removeAttribute('data-clicked')
        td.removeAttribute('data-text')
        td.innerHTML = current_text

        td.style.cssText = 'padding: 5px';
        
        console.log(orig_text + 'is change to ' + current_text)
    
    } else{
        td.removeAttribute('data-clicked')
        td.removeAttribute('data-text')
        td.innerHTML = orig_text
        td.style.cssText = 'padding: 5px';
        console.log('No changes made')
    
    }

}

this.innerHTML = ''
this.style.cssText = 'padding: 0px';
this.append(input);
this.firstElementChild.select();

}
}





	}

	})





















function receiveStock()
{


    var product=document.sample.product.value;
	var warehouse=document.sample.warehouse.value;
    var casesReceived = document.sample.casesReceived.value;
    var shift=document.sample.shift.value;
    var availableCases = document.sample.availableCases.value
   
	$.ajax({
   
    dataType: 'json',
    type: 'POST',
	data:{product:product,warehouse:warehouse,casesReceived:casesReceived,shift:shift,availableCases:availableCases },
    url: "/receiveStock",
    success: function(data) {
    console.log(data)
    console.log(data.length,'wwww')

    
   /* for(var i = 0;i<data.length;i++){*/
    var tr = document.createElement('tr');

    var td1 = tr.appendChild(document.createElement('td'));
    var td2 = tr.appendChild(document.createElement('td'));
	var td3 = tr.appendChild(document.createElement('td'));
    var td4 = tr.appendChild(document.createElement('td'));
    var td5 = tr.appendChild(document.createElement('td'));
    var td6 = tr.appendChild(document.createElement('td'));
    var td7 = tr.appendChild(document.createElement('td'));
   // var link= tr.appendChild(document.createElement('td'));
    td1.id =data._id
    td5.id = data._id
/*td2.classList.add('text-end', 'pe-0')
td3.classList.add('text-end', 'pe-0')
td4.classList.add('text-end', 'pe-1')
link.classList.add('text-end','pe-0')*/
//link.setAttribute("href", "/rec/delete")
//link.className = "text-end";




    td1.innerHTML = data.name;
    td2.innerHTML = data.availableCases;
    td3.innerHTML = data.casesReceived;
    td4.innerHTML=  data.availableCases + data.casesReceived ;
    td5.innerHTML = data.mformat
    td6.innerHTML = data.warehouse
    td7.innerHTML = data.shift
    //let link2 = "/rec/delete/"+data._id

    //td5.innerHTML = "Delete"
    //var linkText = 'Delete'
    // link.appendChild(linkText);
    //link.href="/rec/delete/"+data._id
    //td5.innerText = 'Delete'
    //link.innerHTML='<a href="'+link2+'">'+linkText+'</a>'

    document.getElementById("kt_ecommerce_report_sales_table").appendChild(tr)
    $("#availableCases").val(data.cases)

   } 
})
}