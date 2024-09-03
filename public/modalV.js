


function click55(){
    
let salutation = document.getElementById('salutation').value
let firstName = document.getElementById('firstName').value	
let lastName = document.getElementById('lastName').value
let companyName = document.getElementById('companyName').value	
let customer = document.getElementById('customer').value
let email = document.getElementById('email').value	
let mobile = document.getElementById('mobile').value
let mobile2 = document.getElementById('mobile2').value
let address = document.getElementById('address').value	
let town = document.getElementById('town').value
let city = document.getElementById('city').value
let country = document.getElementById('country').value	
console.log(salutation,firstName,lastName,companyName,'pkp')							
$.ajax({
    dataType: 'json',
  
    type: 'POST',
    data:{salutation:salutation,firstName:firstName, lastName:lastName, companyName:companyName, customer:customer,
    email:email,mobile:mobile,mobile2:mobile2,address:address,town:town,city:city,country:country},
    url: "/modal",
  
  
      success: function(data) {
   console.log(data,'bho')

      }

    })


    }