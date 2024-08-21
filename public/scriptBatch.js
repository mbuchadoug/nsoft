function changeProduct(item){
    console.log(item,'item')
 let product = item
                                            
     $.ajax({
     dataType: 'json',
  
     type: 'POST',
     url: "/batchAuto",
     data:{code:product},
     
 
       success: function(data) {
         console.log(data,'batch')
 
       }
 
   })
 }