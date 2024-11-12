$.ajax({
       
    dataType: 'json',
    type: 'POST',
    url: "/dashChartStockXI",
    success: function(data) {
console.log(data,'data')
let labels1 =[]
let labels2=[]
for (var i = 0;i<data.length;i++){
        labels2.push(data[i].product)
        labels1.push(data[i].cases)
     }
    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];

//contractQty
const  element = document.getElementById('myChart');

const height = parseInt(KTUtil.css(element, 'height'));

const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 

const options = {
    series: [{
        name: 'Stock',
        data: labels1
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
    url: "/dashChartStockRM",
    success: function(data) {
console.log(data,'data')
let labels1 =[]
let labels2=[]
for (var i = 0;i<data.length;i++){
        labels2.push(data[i].item)
        labels1.push(data[i].massTonnes)
     }
    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];

//contractQty
const  element = document.getElementById('myChartRM');

const height = parseInt(KTUtil.css(element, 'height'));

const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 

const options = {
    series: [{
        name: 'Raw Materials',
        data: labels1
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
console.log(ApexCharts,'apex')  

// Set timeout to properly get the parent elements width
setTimeout(function() {
          chart.render(); 
         
}, 400); 
    

    }
})














var button = document.getElementById('myChart5tab').addEventListener('click', function(){
 

    
      
      let item = 'kambucha lite'
      let status = document.getElementById('status').value
      
    
    

      
  
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
          data:{item:item,status:status},
          url: "/rm/dashChartFermentation",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
          labels3.push({"x":data[i].refNumber,"y":data[i].tanks.toFixed(0)})
          // labels3.push(data[i].qty)
           }
      
           console.log(labels3,'labels')
           chart.updateSeries([{
              name: 'Stock',
              data: labels3,
              
          
            }])
  
      
      
          }
      
          })
      })  
      
          
   
   




      $.ajax({
   
        dataType: 'json',
        type: 'POST',
        data:{product:'kambucha lite',status:"null"},
        url: "/rm/dashChartFermentation",
        success: function(data) {
            let labels3=[]
      let labels4=[]
      console.log(data,'dataV')
      for (var i = 0;i<data.length;i++){
       
        labels3.push(data[i].tanks.toFixed(0))
        labels4.push(data[i].refNumber)

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
        
    
     

      
var button6 = document.getElementById('myChart6tab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha level1'
      let status = document.getElementById('status').value

  
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
          data:{item:product,status:status},
          url: "/rm/dashChartFermentation",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].refNumber,"y":data[i].tanks})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
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
      
      let product = 'kambucha level2'
      let status = document.getElementById('status').value
      
    
 
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
          data:{item:product,status:status},
          url: "/rm/dashChartFermentation",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].refNumber,"y":data[i].tanks})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
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
      
      let product = 'kambucha level2'
      let status = document.getElementById('status').value
  
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
          data:{item:product,status:status},
          url: "/rm/dashChartFermentation",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].refNumber,"y":data[i].tanks})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
 
      







          
var button9 = document.getElementById('myChart9tab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'manyuchi'
      let status = document.getElementById('status').value
      

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart9');
  
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
          data:{product:product,status:status},
          url: "/rm/dashChartFermentation",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].refNumber,"y":data[i].tanks})
          // labels3.push(data[i].qty)
           }
      
           console.log(labels3,'labels')
           chart.updateSeries([{
              name: 'Stock',
              data: labels3,
              
          
            }])
  
      
      
          }
      
          })
      })  
      


//PT2







var button = document.getElementById('myChart5tabS').addEventListener('click', function(){
 

    
      
    let stage = 'raw'
    
  
  

    

    const labels1= []
    const labels2= []
 
    let labelsX=[]
    
  
  
    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
    
    //contractQty
   const  element = document.getElementById('myChart5S');

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
        data:{stage:stage},
        url: "/rm/dashChartStockSub",
        success: function(data) {
    console.log(data,'data')
    let labels3=[]
    let labels4=[]
    for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].item,"y":data[i].massKgs})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock (kgs)',
            data: labels3,
            
        
          }])

    
    
        }
    
        })
    })  
    
        
 
 




    $.ajax({
 
      dataType: 'json',
      type: 'POST',
      data:{stage:'raw'},
      url: "/rm/dashChartStockSub",
      success: function(data) {
          let labels3=[]
    let labels4=[]
    for (var i = 0;i<data.length;i++){
     
      labels3.push(data[i].massKgs)
      labels4.push(data[i].item)

      // labels3.push(data[i].qty)
       }

  let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
  
  //contractQty
  var element = document.getElementById("myChart5S");
  var height = parseInt(KTUtil.css(element, 'height'));
  var labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
  var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
  
  var options = {
      series: [{
          name: 'Raw Materials',
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
      
  
   

    
var button6 = document.getElementById('myChart6tabS').addEventListener('click', function(){


  /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
    var uid = 	document.getElementById('uid').value
    
    var name = id+uid
    document.getElementById(id).id = name*/
    
    let stage = 'wash'


    const labels1= []
    const labels2= []
 
  let labelsX=[]
    
  
  
        let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
    
    //contractQty
   const  element = document.getElementById('myChart6S');

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
        data:{stage:stage},
        url: "/rm/dashChartStockSub",
        success: function(data) {
    console.log(data,'data')
    let labels3=[]
    let labels4=[]
    for (var i = 0;i<data.length;i++){
      labels3.push({"x":data[i].item,"y":data[i].massKgs})
      // labels3.push(data[i].qty)
       }
  
       console.log(labels3,'labels')
       chart.updateSeries([{
          name: 'Stock',
          data: labels3,
          
      
        }])

    
    
        }
    
        })
    })  
    
        
 



    
    
var button7 = document.getElementById('myChart7tabS').addEventListener('click', function(){


  /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
    var uid = 	document.getElementById('uid').value
    
    var name = id+uid
    document.getElementById(id).id = name*/
    
    let stage = 'crush'
    
  

    const labels1= []
    const labels2= []
 
  let labelsX=[]
    
  
  
        let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
    
    //contractQty
   const  element = document.getElementById('myChart7S');

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
        data:{stage:stage},
        url: "/rm/dashChartStockSub",
        success: function(data) {
    console.log(data,'data')
    let labels3=[]
    let labels4=[]
    for (var i = 0;i<data.length;i++){
      labels3.push({"x":data[i].item,"y":data[i].massKgs})
      // labels3.push(data[i].qty)
       }
  
       console.log(labels3,'labels')
       chart.updateSeries([{
          name: 'Stock',
          data: labels3,
          
      
        }])

    
    
        }
    
        })
    })  
    
        
 






    
var button8 = document.getElementById('myChart8tabS').addEventListener('click', function(){


    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let stage = 'cooking'
      
    
  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart8S');
  
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
          data:{stage:stage},
          url: "/rm/dashChartStockSub",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].item,"y":data[i].massKgs})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
          
   
  
  
  
  



         
var button9 = document.getElementById('myChart9tabS').addEventListener('click', function(){


    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let stage = 'fermentation'
      
    
  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart9S');
  
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
          data:{stage:stage},
          url: "/rm/dashChartStockSub",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].item,"y":data[i].massKgs})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
          
   
  
  

         
var button10 = document.getElementById('myChart10tabS').addEventListener('click', function(){


    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let stage = 'blending'
      
    
  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart10S');
  
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
          data:{stage:stage},
          url: "/rm/dashChartStockSub",
          success: function(data) {
      console.log(data,'dataBlending')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].item,"y":data[i].massKgs})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
          
   
  
  
  
  

    /************ */

     



    $.ajax({
   
        dataType: 'json',
        type: 'POST',
        data:{product:'kambucha lite'},
        url: "/rm/dashChartBlendingTanks",
        success: function(data) {
            let labels3=[]
      let labels4=[]
      console.log(data,'dataV')
      for (var i = 0;i<data.length;i++){
       
        labels3.push(data[i].litres)
        labels4.push(data[i].tankNumber)

        // labels3.push(data[i].qty)
         }

    let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
    
    //contractQty
    var element = document.getElementById("myChart5B");
    var height = parseInt(KTUtil.css(element, 'height'));
    var labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
    var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
    
    var options = {
        series: [{
            name: 'Litres',
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
             
    



var buttonR = document.getElementById('myChart5Btab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha lite'

      console.log('returns')

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart5B');
  
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
          data:{product:product},
          url: "/rm/dashChartBlendingTanks",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].tankNumber,"y":data[i].litres})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
          
   

///////////



var buttonR6 = document.getElementById('myChart6Btab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha level1'

      console.log('returns')

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart6B');
  
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
          data:{product:product},
          url: "/rm/dashChartBlendingTanks",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].tankNumber,"y":data[i].litres})
        // labels3.push(data[i].qty)
         }
    
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  








      

var buttonR7 = document.getElementById('myChart7Btab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha level1'

      console.log('returns')

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart7B');
  
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
          data:{product:product},
          url: "/rm/dashChartBlendingTanks",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].tankNumber,"y":data[i].litres})
        // labels3.push(data[i].qty)
         }
    
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  
      
////////////



var buttonR8 = document.getElementById('myChart8Btab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha level1'

      console.log('returns')

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart8B');
  
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
          data:{product:product},
          url: "/rm/dashChartBlendingTanks",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].tankNumber,"y":data[i].litres})
        // labels3.push(data[i].qty)
         }
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  


      
/////////////////////


var buttonR9 = document.getElementById('myChart9Btab').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let product = 'kambucha level1'

      console.log('returns')

  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChart9B');
  
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
          data:{product:product},
          url: "/rm/dashChartBlendingTanks",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
        labels3.push({"x":data[i].tankNumber,"y":data[i].litres})
        // labels3.push(data[i].qty)
         }
    
    
         console.log(labels3,'labels')
         chart.updateSeries([{
            name: 'Stock',
            data: labels3,
            
        
          }])
  
      
      
          }
      
          })
      })  

///////////////


/////////////////////////warehouseRtns



$.ajax({
   
    dataType: 'json',
    type: 'POST',
    data:{reason:'breakage'},
    url: "/dashChartStockWRtns",
    success: function(data) {
        let labels3=[]
  let labels4=[]
  console.log(data,'dataV')
  for (var i = 0;i<data.length;i++){
   
    labels3.push(data[i].casesReceived)
    labels4.push(data[i].name)

    // labels3.push(data[i].qty)
     }

let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];

//contractQty
var element = document.getElementById("myChart5WR");
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
         




var buttonWR = document.getElementById('myChart5tabWR').addEventListener('click', function(){


/*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
  var uid = 	document.getElementById('uid').value
  
  var name = id+uid
  document.getElementById(id).id = name*/
  
  let reason = 'breakage'

  console.log('returns')


  const labels1= []
  const labels2= []

let labelsX=[]
  


      let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
  
  //contractQty
 const  element = document.getElementById('myChart5WR');

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
      data:{reason:reason},
      url: "/dashChartStockWRtns",
      success: function(data) {
  console.log(data,'data')
  let labels3=[]
  let labels4=[]
  for (var i = 0;i<data.length;i++){
    labels3.push({"x":data[i].name,"y":data[i].casesReceived})
    // labels3.push(data[i].qty)
     }

     console.log(labels3,'labels')
     chart.updateSeries([{
        name: 'Stock',
        data: labels3,
        
    
      }])

  
  
      }
  
      })
  })  
  
      


///////////



var buttonWR6 = document.getElementById('myChart6tabWR').addEventListener('click', function(){


/*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
  var uid = 	document.getElementById('uid').value
  
  var name = id+uid
  document.getElementById(id).id = name*/
  
  let reason = 'expired'

  console.log('returns')


  const labels1= []
  const labels2= []

let labelsX=[]
  


      let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
  
  //contractQty
 const  element = document.getElementById('myChart5WR');

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
      data:{reason:reason},
      url: "/dashChartStockWRtns",
      success: function(data) {
  console.log(data,'data')
  let labels3=[]
  let labels4=[]
  for (var i = 0;i<data.length;i++){
    labels3.push({"x":data[i].name,"y":data[i].casesReceived})
    // labels3.push(data[i].qty)
     }

     console.log(labels3,'labels')
     chart.updateSeries([{
        name: 'Stock',
        data: labels3,
        
    
      }])

  
  
      }
  
      })
  })  
  
      
      


      
      