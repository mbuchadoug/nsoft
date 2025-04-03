
   
$.ajax({
       
    dataType: 'json',
    type: 'POST',
    data:{date:'1/1/2025 - 12/12/2025'},
    url: "/accounts5/dashChart4",
    success: function(data) {
      console.log(data,'data')
      let labels1=[]
      let labels2=[]
for (var i = 0;i<data.length;i++){
        labels2.push(data[i].cases)

        labels1.push(data[i].product)
       // labels1.push(data[i].bestSellingProductX)
     
     }

    

    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
console.log(labels2,'labels2')
//contractQty
const  element = document.getElementById('myChartIV');

const height = parseInt(KTUtil.css(element, 'height'));

const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 

const options = {
    series: [{
        name: 'Quantity Sold',
        data: labels2
    }],
    chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
            show: false
        }              
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: ['28%'],
            borderRadius: 5,                     
            dataLabels: {
                position: "top" // top, center, bottom
            },
            startingShape: 'flat'
        },
    },
    legend: {
        show: false
    },
    dataLabels: {
        enabled: true, 
        offsetY: -28,                                             
        style: {
            fontSize: '13px',
            colors: [labelColor]
        }                         
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories:labels1,
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            style: {
                colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                fontSize: '13px'
            }                    
        },
        crosshairs: {
            fill: {         
                gradient: {         
                    opacityFrom: 0,
                    opacityTo: 0
                }
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                fontSize: '13px'
            },
            formatter: function (val) {
                return  parseInt(val)
            }
        }
    },
    fill: {
        opacity: 1
    },
    states: {
        normal: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        hover: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
                value: 0
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '12px'
        },
        y: {
            formatter: function (val) {
                return  val 
            }
        }
    },
    colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
    grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
            lines: {
                show: true
            }
        }
    }
};


const chart = new ApexCharts(element, options);
console.log(ApexCharts,'apex')  

// Set timeout to properly get the parent elements width
setTimeout(function() {
          chart.render(); 
         
}, 400); 




}
})







$.ajax({
   
    dataType: 'json',
    type: 'POST',
    data:{product:'kambucha No1',date:'1/1/2025 - 12/12/2025'},
    url: "/accounts5/dashChart1",
    success: function(data) {
        let labels3=[]
  let labels4=[]
  console.log(data,'dataV')
  for (var i = 0;i<data.length;i++){
   
    labels3.push(data[i].cases)
    labels4.push(data[i].salesPerson)

    // labels3.push(data[i].qty)
     }

let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];

//contractQty
var element = document.getElementById("myChart5");
var height = parseInt(KTUtil.css(element, 'height'));
var labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 

var options = {
    series: [{
        name: 'Stock',
        data:  labels3
    }],
    chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
            show: false
        }              
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: ['28%'],
            borderRadius: 5,                     
            dataLabels: {
                position: "top" // top, center, bottom
            },
            startingShape: 'flat'
        },
    },
    legend: {
        show: false
    },
    dataLabels: {
        enabled: true, 
        offsetY: -28,                                             
        style: {
            fontSize: '13px',
            colors: [labelColor]
        }                         
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories:labels4,
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            style: {
                colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                fontSize: '13px'
            }                    
        },
        crosshairs: {
            fill: {         
                gradient: {         
                    opacityFrom: 0,
                    opacityTo: 0
                }
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                fontSize: '13px'
            },
            formatter: function (val) {
                return  parseInt(val) 
            }
        }
    },
    fill: {
        opacity: 1
    },
    states: {
        normal: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        hover: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
                value: 0
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '12px'
        },
        y: {
            formatter: function (val) {
                return  val 
            }
        }
    },
    colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
    grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
            lines: {
                show: true
            }
        }
    }
};

var chart = new ApexCharts(element, options);  

// Set timeout to properly get the parent elements width
setTimeout(function() {
    chart.render();   
}, 200); 






    
    }
   
});
         











             

var button5 = document.getElementById('myChart5tab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha No1'
      let date = document.getElementById('date1').textContent

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart5');
  
      const height = parseInt(KTUtil.css(element, 'height'));
    
      const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
      const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
   
      const options = {
          series:[],
          chart: {
              fontFamily: 'inherit',
              type: 'bar',
              height: height,
              toolbar: {
                  show: false
              }              
          },
          plotOptions: {
              bar: {
                  horizontal: false,
                  columnWidth: ['28%'],
                  borderRadius: 5,                     
                  dataLabels: {
                      position: "top" // top, center, bottom
                  },
                  startingShape: 'flat'
              },
          },
          legend: {
              show: false
          },
          dataLabels: {
              enabled: true, 
              offsetY: -28,                                             
              style: {
                  fontSize: '13px',
                  colors: [labelColor]
              }                         
          },
          stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
          },
          xaxis: {
              categories:labels2,
              axisBorder: {
                  show: false,
              },
              axisTicks: {
                  show: false
              },
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  }                    
              },
              crosshairs: {
                  fill: {         
                      gradient: {         
                          opacityFrom: 0,
                          opacityTo: 0
                      }
                  }
              }
          },
          yaxis: {
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  },
                  formatter: function (val) {
                      return  parseInt(val)
                  }
              }
          },
          fill: {
              opacity: 1
          },
          states: {
              normal: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              hover: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              active: {
                  allowMultipleDataPointsSelection: false,
                  filter: {
                      type: 'none',
                      value: 0
                  }
              }
          },
          tooltip: {
              style: {
                  fontSize: '12px'
              },
              y: {
                  formatter: function (val) {
                      return  val 
                  }
              }
          },
          colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
          grid: {
              borderColor: borderColor,
              strokeDashArray: 4,
              yaxis: {
                  lines: {
                      show: true
                  }
              }
          }
      };
  
  
  
   
  
  
  
  
  
  
    const chart = new ApexCharts(element, options);
   chart.render()
  
      // Set timeout to properly get the parent elements width
     /*setTimeout(function() {
                chart.render(); 
               
      }, 400); */
      
      
      
      
      $.ajax({
         
          dataType: 'json',
          type: 'POST',
          data:{product:product,date:date},
          url: "/accounts5/dashChart1",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].salesPerson,"y":data[i].cases.toFixed(2)})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Sales',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
          
   



      var button6 = document.getElementById('myChart6tab').addEventListener('click', function(){
 

        /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
          var uid = 	document.getElementById('uid').value
          
          var name = id+uid
          document.getElementById(id).id = name*/
          
          let product = 'kambucha No2'
          let date = document.getElementById('date1').textContent
    
      
          const labels1= []
          const labels2= []
       
        let labelsX=[]
          
        
        
              let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
          
          //contractQty
         const  element = document.getElementById('myChart6');
      
          const height = parseInt(KTUtil.css(element, 'height'));
        
          const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
          const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
       
          const options = {
              series:[],
              chart: {
                  fontFamily: 'inherit',
                  type: 'bar',
                  height: height,
                  toolbar: {
                      show: false
                  }              
              },
              plotOptions: {
                  bar: {
                      horizontal: false,
                      columnWidth: ['28%'],
                      borderRadius: 5,                     
                      dataLabels: {
                          position: "top" // top, center, bottom
                      },
                      startingShape: 'flat'
                  },
              },
              legend: {
                  show: false
              },
              dataLabels: {
                  enabled: true, 
                  offsetY: -28,                                             
                  style: {
                      fontSize: '13px',
                      colors: [labelColor]
                  }                         
              },
              stroke: {
                  show: true,
                  width: 2,
                  colors: ['transparent']
              },
              xaxis: {
                  categories:labels2,
                  axisBorder: {
                      show: false,
                  },
                  axisTicks: {
                      show: false
                  },
                  labels: {
                      style: {
                          colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                          fontSize: '13px'
                      }                    
                  },
                  crosshairs: {
                      fill: {         
                          gradient: {         
                              opacityFrom: 0,
                              opacityTo: 0
                          }
                      }
                  }
              },
              yaxis: {
                  labels: {
                      style: {
                          colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                          fontSize: '13px'
                      },
                      formatter: function (val) {
                          return  parseInt(val)
                      }
                  }
              },
              fill: {
                  opacity: 1
              },
              states: {
                  normal: {
                      filter: {
                          type: 'none',
                          value: 0
                      }
                  },
                  hover: {
                      filter: {
                          type: 'none',
                          value: 0
                      }
                  },
                  active: {
                      allowMultipleDataPointsSelection: false,
                      filter: {
                          type: 'none',
                          value: 0
                      }
                  }
              },
              tooltip: {
                  style: {
                      fontSize: '12px'
                  },
                  y: {
                      formatter: function (val) {
                          return  val 
                      }
                  }
              },
              colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
              grid: {
                  borderColor: borderColor,
                  strokeDashArray: 4,
                  yaxis: {
                      lines: {
                          show: true
                      }
                  }
              }
          };
      
      
      
       
      
      
      
      
      
      
        const chart = new ApexCharts(element, options);
       chart.render()
      
          // Set timeout to properly get the parent elements width
         /*setTimeout(function() {
                    chart.render(); 
                   
          }, 400); */
          
          
          
          
          $.ajax({
             
              dataType: 'json',
              type: 'POST',
              data:{product:product,date:date},
              url: "/accounts5/dashChart1",
              success: function(data) {
          console.log(data,'data')
          let labels3=[]
          let labels4=[]
          for (var i = 0;i<data.length;i++){
            labels3.push({"x":data[i].salesPerson,"y":data[i].cases.toFixed(2)})
            // labels3.push(data[i].qty)
             }
        
             console.log(labels3,'labels')
             chart.updateSeries([{
                name: 'Sales',
                data: labels3,
                
            
              }])
      
          
          
              }
          
              })
          })  
          

          


      var button7 = document.getElementById('myChart7tab').addEventListener('click', function(){
 

        /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
          var uid = 	document.getElementById('uid').value
          
          var name = id+uid
          document.getElementById(id).id = name*/
          
          let product = 'kambucha No3'
          let date = document.getElementById('date1').textContent
    
      
          const labels1= []
          const labels2= []
       
        let labelsX=[]
          
        
        
              let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
          
          //contractQty
         const  element = document.getElementById('myChart7');
      
          const height = parseInt(KTUtil.css(element, 'height'));
        
          const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
          const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
       
          const options = {
              series:[],
              chart: {
                  fontFamily: 'inherit',
                  type: 'bar',
                  height: height,
                  toolbar: {
                      show: false
                  }              
              },
              plotOptions: {
                  bar: {
                      horizontal: false,
                      columnWidth: ['28%'],
                      borderRadius: 5,                     
                      dataLabels: {
                          position: "top" // top, center, bottom
                      },
                      startingShape: 'flat'
                  },
              },
              legend: {
                  show: false
              },
              dataLabels: {
                  enabled: true, 
                  offsetY: -28,                                             
                  style: {
                      fontSize: '13px',
                      colors: [labelColor]
                  }                         
              },
              stroke: {
                  show: true,
                  width: 2,
                  colors: ['transparent']
              },
              xaxis: {
                  categories:labels2,
                  axisBorder: {
                      show: false,
                  },
                  axisTicks: {
                      show: false
                  },
                  labels: {
                      style: {
                          colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                          fontSize: '13px'
                      }                    
                  },
                  crosshairs: {
                      fill: {         
                          gradient: {         
                              opacityFrom: 0,
                              opacityTo: 0
                          }
                      }
                  }
              },
              yaxis: {
                  labels: {
                      style: {
                          colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                          fontSize: '13px'
                      },
                      formatter: function (val) {
                          return  parseInt(val)
                      }
                  }
              },
              fill: {
                  opacity: 1
              },
              states: {
                  normal: {
                      filter: {
                          type: 'none',
                          value: 0
                      }
                  },
                  hover: {
                      filter: {
                          type: 'none',
                          value: 0
                      }
                  },
                  active: {
                      allowMultipleDataPointsSelection: false,
                      filter: {
                          type: 'none',
                          value: 0
                      }
                  }
              },
              tooltip: {
                  style: {
                      fontSize: '12px'
                  },
                  y: {
                      formatter: function (val) {
                          return  val 
                      }
                  }
              },
              colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
              grid: {
                  borderColor: borderColor,
                  strokeDashArray: 4,
                  yaxis: {
                      lines: {
                          show: true
                      }
                  }
              }
          };
      
      
      
       
      
      
      
      
      
      
        const chart = new ApexCharts(element, options);
       chart.render()
      
          // Set timeout to properly get the parent elements width
         /*setTimeout(function() {
                    chart.render(); 
                   
          }, 400); */
          
          
          
          
          $.ajax({
             
              dataType: 'json',
              type: 'POST',
              data:{product:product,date:date},
              url: "/accounts5/dashChart1",
              success: function(data) {
          console.log(data,'data')
          let labels3=[]
          let labels4=[]
          for (var i = 0;i<data.length;i++){
            labels3.push({"x":data[i].salesPerson,"y":data[i].cases.toFixed(2)})
            // labels3.push(data[i].qty)
             }
        
             console.log(labels3,'labels')
             chart.updateSeries([{
                name: 'Sales',
                data: labels3,
                
            
              }])
      
          
          
              }
          
              })
          })  
          
              
       
    


          var button8 = document.getElementById('myChart8tab').addEventListener('click', function(){
 

            /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
              var uid = 	document.getElementById('uid').value
              
              var name = id+uid
              document.getElementById(id).id = name*/
              
              let product = 'kambucha lite'
              let date = document.getElementById('date1').textContent
        
          
              const labels1= []
              const labels2= []
           
            let labelsX=[]
              
            
            
                  let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
              
              //contractQty
             const  element = document.getElementById('myChart8');
          
              const height = parseInt(KTUtil.css(element, 'height'));
            
              const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
              const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
           
              const options = {
                  series:[],
                  chart: {
                      fontFamily: 'inherit',
                      type: 'bar',
                      height: height,
                      toolbar: {
                          show: false
                      }              
                  },
                  plotOptions: {
                      bar: {
                          horizontal: false,
                          columnWidth: ['28%'],
                          borderRadius: 5,                     
                          dataLabels: {
                              position: "top" // top, center, bottom
                          },
                          startingShape: 'flat'
                      },
                  },
                  legend: {
                      show: false
                  },
                  dataLabels: {
                      enabled: true, 
                      offsetY: -28,                                             
                      style: {
                          fontSize: '13px',
                          colors: [labelColor]
                      }                         
                  },
                  stroke: {
                      show: true,
                      width: 2,
                      colors: ['transparent']
                  },
                  xaxis: {
                      categories:labels2,
                      axisBorder: {
                          show: false,
                      },
                      axisTicks: {
                          show: false
                      },
                      labels: {
                          style: {
                              colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                              fontSize: '13px'
                          }                    
                      },
                      crosshairs: {
                          fill: {         
                              gradient: {         
                                  opacityFrom: 0,
                                  opacityTo: 0
                              }
                          }
                      }
                  },
                  yaxis: {
                      labels: {
                          style: {
                              colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                              fontSize: '13px'
                          },
                          formatter: function (val) {
                              return  parseInt(val)
                          }
                      }
                  },
                  fill: {
                      opacity: 1
                  },
                  states: {
                      normal: {
                          filter: {
                              type: 'none',
                              value: 0
                          }
                      },
                      hover: {
                          filter: {
                              type: 'none',
                              value: 0
                          }
                      },
                      active: {
                          allowMultipleDataPointsSelection: false,
                          filter: {
                              type: 'none',
                              value: 0
                          }
                      }
                  },
                  tooltip: {
                      style: {
                          fontSize: '12px'
                      },
                      y: {
                          formatter: function (val) {
                              return  val 
                          }
                      }
                  },
                  colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
                  grid: {
                      borderColor: borderColor,
                      strokeDashArray: 4,
                      yaxis: {
                          lines: {
                              show: true
                          }
                      }
                  }
              };
          
          
          
           
          
          
          
          
          
          
            const chart = new ApexCharts(element, options);
           chart.render()
          
              // Set timeout to properly get the parent elements width
             /*setTimeout(function() {
                        chart.render(); 
                       
              }, 400); */
              
              
              
              
              $.ajax({
                 
                  dataType: 'json',
                  type: 'POST',
                  data:{product:product,date:date},
                  url: "/accounts5/dashChart1",
                  success: function(data) {
              console.log(data,'data')
              let labels3=[]
              let labels4=[]
              for (var i = 0;i<data.length;i++){
                labels3.push({"x":data[i].salesPerson,"y":data[i].cases.toFixed(2)})
                // labels3.push(data[i].qty)
                 }
            
                 console.log(labels3,'labels')
                 chart.updateSeries([{
                    name: 'Sales',
                    data: labels3,
                    
                
                  }])
          
              
              
                  }
              
                  })
              })  
              
    

            
            
            
              
       
var button4 = document.getElementById('buttonIV').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
  
     

      let date = document.getElementById('date4').textContent


      let labels4=[]
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChartIV');
  
      const height = parseInt(KTUtil.css(element, 'height'));
    
      const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
      const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
   
      const options = {
          series:[],
          chart: {
              fontFamily: 'inherit',
              type: 'bar',
              height: height,
              toolbar: {
                  show: false
              }              
          },
          plotOptions: {
              bar: {
                  horizontal: false,
                  columnWidth: ['28%'],
                  borderRadius: 5,                     
                  dataLabels: {
                      position: "top" // top, center, bottom
                  },
                  startingShape: 'flat'
              },
          },
          legend: {
              show: false
          },
          dataLabels: {
              enabled: true, 
              offsetY: -28,                                             
              style: {
                  fontSize: '13px',
                  colors: [labelColor]
              }                         
          },
          stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
          },
          xaxis: {
              categories:labels2,
              axisBorder: {
                  show: false,
              },
              axisTicks: {
                  show: false
              },
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  }                    
              },
              crosshairs: {
                  fill: {         
                      gradient: {         
                          opacityFrom: 0,
                          opacityTo: 0
                      }
                  }
              }
          },
          yaxis: {
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  },
                  formatter: function (val) {
                      return  parseInt(val)
                  }
              }
          },
          fill: {
              opacity: 1
          },
          states: {
              normal: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              hover: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              active: {
                  allowMultipleDataPointsSelection: false,
                  filter: {
                      type: 'none',
                      value: 0
                  }
              }
          },
          tooltip: {
              style: {
                  fontSize: '12px'
              },
              y: {
                  formatter: function (val) {
                      return  val 
                  }
              }
          },
          colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
          grid: {
              borderColor: borderColor,
              strokeDashArray: 4,
              yaxis: {
                  lines: {
                      show: true
                  }
              }
          }
      };
  
  
  
   
  
  
  
  
  
  
    const chart = new ApexCharts(element, options);
   chart.render()
  
      // Set timeout to properly get the parent elements width
     /*setTimeout(function() {
                chart.render(); 
               
      }, 400); */
      
      
      
      
      $.ajax({
         
          dataType: 'json',
          type: 'POST',
          data:{ date:date},
          url: "/accounts5/dashChart4",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
   
      for (var i = 0;i<data.length;i++){
          labels3.push({"x":data[i].product ,"y":data[i].cases})
                   // labels3.push(data[i].qty)
           }
      
           console.log(labels3,'labels')
           chart.updateSeries([{
              name: 'Sales',
              data: labels3, 
              
          
            }])

           
  
        }
      
       
      
          })
      })  
      



        
       
var button5 = document.getElementById('button5').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
  
     

      let date = document.getElementById('date5').textContent


      let labels4=[]
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChartV');
  
      const height = parseInt(KTUtil.css(element, 'height'));
    
      const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
      const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
   
      const options = {
          series:[],
          chart: {
              fontFamily: 'inherit',
              type: 'bar',
              height: height,
              toolbar: {
                  show: false
              }              
          },
          plotOptions: {
              bar: {
                  horizontal: false,
                  columnWidth: ['28%'],
                  borderRadius: 5,                     
                  dataLabels: {
                      position: "top" // top, center, bottom
                  },
                  startingShape: 'flat'
              },
          },
          legend: {
              show: false
          },
          dataLabels: {
              enabled: true, 
              offsetY: -28,                                             
              style: {
                  fontSize: '13px',
                  colors: [labelColor]
              }                         
          },
          stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
          },
          xaxis: {
              categories:labels2,
              axisBorder: {
                  show: false,
              },
              axisTicks: {
                  show: false
              },
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  }                    
              },
              crosshairs: {
                  fill: {         
                      gradient: {         
                          opacityFrom: 0,
                          opacityTo: 0
                      }
                  }
              }
          },
          yaxis: {
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  },
                  formatter: function (val) {
                      return  parseInt(val)
                  }
              }
          },
          fill: {
              opacity: 1
          },
          states: {
              normal: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              hover: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              active: {
                  allowMultipleDataPointsSelection: false,
                  filter: {
                      type: 'none',
                      value: 0
                  }
              }
          },
          tooltip: {
              style: {
                  fontSize: '12px'
              },
              y: {
                  formatter: function (val) {
                      return  val 
                  }
              }
          },
          colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
          grid: {
              borderColor: borderColor,
              strokeDashArray: 4,
              yaxis: {
                  lines: {
                      show: true
                  }
              }
          }
      };
  
  
  
   
  
  
  
  
  
  
    const chart = new ApexCharts(element, options);
   chart.render()
  
      // Set timeout to properly get the parent elements width
     /*setTimeout(function() {
                chart.render(); 
               
      }, 400); */
      
      
      
      
      $.ajax({
         
          dataType: 'json',
          type: 'POST',
          data:{ date:date},
          url: "/accounts5/dashChart5",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
   
      for (var i = 0;i<data.length;i++){
          labels3.push({"x":data[i].salesPerson ,"y":data[i].cases})
                   // labels3.push(data[i].qty)
           }
      
           console.log(labels3,'labels')
           chart.updateSeries([{
              name: 'Sales',
              data: labels3, 
              
          
            }])

           
  
        }
      
       
      
          })
      })  
      






//////////////////////////////////////////////

const labelsX =[]

$.ajax({
   
    dataType: 'json',
    type: 'POST',
    url: "/accounts5/dashChartG1",
    success: function(data) {
    console.log(data)
    let labels1 =[]

     for (var i = 0;i<data.length;i++){
        labels1.push(data[i].cases)
        labelsX.push(data[i].month)
   
   
     }

  
console.log(labelsX,'labelsX')

var element = document.getElementById("myChart");
var height = parseInt(KTUtil.css(element, 'height'));       
var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');
var baseColor = KTUtil.getCssVariableValue('--bs-gray-800');
var lightColor = KTUtil.getCssVariableValue('--bs-light-info');

var options = {
    series: [{
        name: 'Cases',
        data: labels1
    }],
    chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: height,
        toolbar: {
            show: false
        }
    },             
    legend: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        type: 'solid',
        opacity: 0
    },
    stroke: {
        curve: 'smooth',
        show: true,
        width: 2,
        colors: [baseColor]
    },
    xaxis: {   
                      
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false
        },
        crosshairs: {
            position: 'front',
            stroke: {
                color: baseColor,
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            show: false
        }
    },
    states: {
        normal: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        hover: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
                value: 0
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '12px'
        },
        x: {
            formatter: function (val) {
                val--
                return labelsX[val] 
            }
        },
        y: {
            formatter: function (val) {
                return  val 
          
            }
        }
    },
    colors: [lightColor],
    grid: {                 
        strokeDashArray: 4,
        padding: {
            top: 0,
            right: -20,
            bottom: -20,
            left: -20
        },
        yaxis: {
            lines: {
                show: true
            }
        }
    },
    markers: {
        strokeColor: baseColor,
        strokeWidth: 2
    }
}; 

var chart = new ApexCharts(element, options);

// Set timeout to properly get the parent elements width
setTimeout(function() {
    chart.render();   
}, 300);  
}

// Public methods
    
    
   
});







$.ajax({
   
    dataType: 'json',
    type: 'POST',
    data:{ product:'kambucha No1'},
    url: "/accounts5/dashChartG2",
    success: function(data) {
    console.log(data)
    let labels1 =[]

     for (var i = 0;i<data.length;i++){
        labels1.push(data[i].cases)
        labelsX.push(data[i].month)
   
   
     }

  
console.log(labelsX,'labelsX')

var element = document.getElementById("myChart1");
var height = parseInt(KTUtil.css(element, 'height'));       
var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');
var baseColor = KTUtil.getCssVariableValue('--bs-gray-800');
var lightColor = KTUtil.getCssVariableValue('--bs-light-info');

var options = {
    series: [{
        name: 'Cases',
        data: labels1
    }],
    chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: height,
        toolbar: {
            show: false
        }
    },             
    legend: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        type: 'solid',
        opacity: 0
    },
    stroke: {
        curve: 'smooth',
        show: true,
        width: 2,
        colors: [baseColor]
    },
    xaxis: {   
                      
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false
        },
        crosshairs: {
            position: 'front',
            stroke: {
                color: baseColor,
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            show: false
        }
    },
    states: {
        normal: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        hover: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
                value: 0
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '12px'
        },
        x: {
            formatter: function (val) {
                val--
                return labelsX[val] 
            }
        },
        y: {
            formatter: function (val) {
                return  val 
          
            }
        }
    },
    colors: [lightColor],
    grid: {                 
        strokeDashArray: 4,
        padding: {
            top: 0,
            right: -20,
            bottom: -20,
            left: -20
        },
        yaxis: {
            lines: {
                show: true
            }
        }
    },
    markers: {
        strokeColor: baseColor,
        strokeWidth: 2
    }
}; 

var chart = new ApexCharts(element, options);

// Set timeout to properly get the parent elements width
setTimeout(function() {
    chart.render();   
}, 300);  
}

// Public methods
    
    
   
});
////////////////button4




    
var button = document.getElementById('button4').addEventListener('click', function(){

    let labels3=[]
    let labels4 = []
    let labels5 = []
    let product = document.getElementById('product').value

    //let term = document.getElementById('term2').value
    //let productName = document.getElementById('productName3').value
          /*
    
    $.ajax({
       
        dataType: 'json',
        type: 'POST',
        url: "/feesChart",
        success: function(data) {
        console.log(data)
         for (var i = 0;i<data.length;i++){
            labels3.push(data[i].amount)
            labels13.push(data[i].month)
       
       
         }
    */
      
    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
    
    //contractQty
    var element = document.getElementById("myChart1");
    var height = parseInt(KTUtil.css(element, 'height'));       
    var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');
    var baseColor = KTUtil.getCssVariableValue('--bs-gray-800');
    var lightColor = KTUtil.getCssVariableValue('--bs-light-info');
    
    var options = {
        series: [],
        chart: {
            fontFamily: 'inherit',
            type: 'area',
            height: height,
            toolbar: {
                show: false
            }
        },             
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'solid',
            opacity: 0
        },
        stroke: {
            curve: 'smooth',
            show: true,
            width: 2,
            colors: [baseColor]
        },
        xaxis: {   
                          
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            },
            crosshairs: {
                position: 'front',
                stroke: {
                    color: baseColor,
                    width: 1,
                    dashArray: 3
                }
            },
            tooltip: {
                enabled: true,
                formatter: undefined,
                offsetY: 0,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0
                }
            }
        },
        tooltip: {
            style: {
                fontSize: '12px'
            },
            x: {
                formatter: function (val) {
                    val--
                    return labels5[val] 
                }
            },
            y: {
                formatter: function (val) {
                    return  val 
              
                }
            }
        },
        colors: [lightColor],
        grid: {                 
            strokeDashArray: 4,
            padding: {
                top: 0,
                right: -20,
                bottom: -20,
                left: -20
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        markers: {
            strokeColor: baseColor,
            strokeWidth: 2
        }
    }; 
    
    
    const chart = new ApexCharts(element, options);
    chart.render()
    
    // Set timeout to properly get the parent elements width
    $.ajax({
             
        dataType: 'json',
        type: 'POST',
        data:{ product:product},
        url: "/accounts5/dashChartG2",
        success: function(data) {
    console.log(data,'data')
    
    
    for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].month ,"y":data[i].cases})
        labels4.push(data[i].cases)
        labels5.push(data[i].month)
               // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Cases',
            data: labels4, 
            
        
          }])
    
         
    
      }
    
     
    
        })
    })  
    















///////////product stats

   
$.ajax({
       
    dataType: 'json',
    type: 'POST',
    url: "/accounts5/dashGX1",
    success: function(data) {
      console.log(data,'data')
      let labels1=[]
      let labels2=[]
for (var i = 0;i<data.length;i++){
        labels2.push(data[i].bestSeller)
        labels2.push(data[i].bestSellingProduct)
        labels1.push(data[i].bestSellerX)
        labels1.push(data[i].bestSellingProductX)
     
     }
    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
console.log(labels2,'labels2')
//contractQty
const  element = document.getElementById('myChart3');

const height = parseInt(KTUtil.css(element, 'height'));

const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 

const options = {
    series: [{
        name: 'Quantity Sold',
        data: labels2
    }],
    chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
            show: false
        }              
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: ['28%'],
            borderRadius: 5,                     
            dataLabels: {
                position: "top" // top, center, bottom
            },
            startingShape: 'flat'
        },
    },
    legend: {
        show: false
    },
    dataLabels: {
        enabled: true, 
        offsetY: -28,                                             
        style: {
            fontSize: '13px',
            colors: [labelColor]
        }                         
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories:labels1,
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            style: {
                colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                fontSize: '13px'
            }                    
        },
        crosshairs: {
            fill: {         
                gradient: {         
                    opacityFrom: 0,
                    opacityTo: 0
                }
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                fontSize: '13px'
            },
            formatter: function (val) {
                return  parseInt(val)
            }
        }
    },
    fill: {
        opacity: 1
    },
    states: {
        normal: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        hover: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
                value: 0
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '12px'
        },
        y: {
            formatter: function (val) {
                return  val 
            }
        }
    },
    colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
    grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
            lines: {
                show: true
            }
        }
    }
};


const chart = new ApexCharts(element, options);
console.log(ApexCharts,'apex')  

// Set timeout to properly get the parent elements width
setTimeout(function() {
          chart.render(); 
         
}, 400); 




}
})






/////////////////////
























