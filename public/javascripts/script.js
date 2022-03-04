$(document).ready(function() {
    var index = 0;
    var id = [];
    $('#button1').on('click', function() {
		$("#pagin li").empty();
		$("#pagin li:empty").remove();
        $('body').append($("<div class='line-content' id='chart" + index + "'></div>"));

        Highcharts.chart('chart' + index, {
		   title: {
        text: 'Chart-'+index+''
    },
            series: [{
                data: [1, 2, 3]
            }]
        });
        var temp = "chart" + index + "";
		console.log(temp);
        id.push(temp);

        index++;
		pageSize = 1;

	var pageCount =  $(".line-content").length / pageSize;
    
     for(var i = 0 ; i<pageCount;i++){
        
       $("#pagin").append('<li><a href="#">'+(i+1)+'</a></li> ');
     }
        $("#pagin li").first().find("a").addClass("current")
    showPage = function(page) {
	    $(".line-content").hide();
	    $(".line-content").each(function(n) {
	        if (n >= pageSize * (page - 1) && n < pageSize * page)
	            $(this).show();
	    });        
	}
    
	showPage(1);

	$("#pagin li a").click(function() {
	    $("#pagin li a").removeClass("current");
	    $(this).addClass("current");
	    showPage(parseInt($(this).text())) 
	});   
    });

    $('#download').on('click', function() {
console.log(id);
  var doc = new jsPDF('portrait', 'pt', 'a4', true);
  var elementHandler = {
    '#ignorePDF': function(element, renderer) {
      return true;
    }
  };

  var source = document.getElementById("top-content");
  doc.fromHTML(source, 15, 15, {
    'width': 560,
    'elementHandlers': elementHandler
  });

  var DOMURL = window.URL || window.webkitURL || window;
   var elements = id;
  
 // console.log(xx);
  for (let i in elements) {
    
      
      let svg = document.querySelectorAll('svg');
      let canvas = document.createElement('canvas');
      let canvasIE = document.createElement('canvas');
      let context = canvas.getContext('2d');

      let data1 = (new XMLSerializer()).serializeToString(svg[i]);

      canvg(canvas, data1);
      let svgBlob = new Blob([data1], {
        type: 'image/svg+xml;charset=utf-8'
      });

      let url = DOMURL.createObjectURL(svgBlob);
  
      let img = new Image();
      img.src = url;
      img.onload = function() {
        context.canvas.width = $("#"+elements[i]).find('svg').width();
        context.canvas.height = $("#"+elements[i]).find('svg').height();

        context.drawImage(img, 0, 0);
        // freeing up the memory as image is drawn to canvas
        DOMURL.revokeObjectURL(url);

        var dataUrl;
        if (isIEBrowser()) { // Check of IE browser 
          var svg = $(elements[i]).highcharts().container.innerHTML;
          canvg(canvasIE, svg[i]);
          dataUrl = canvasIE.toDataURL('image/JPEG');
        } else {
          dataUrl = canvas.toDataURL('image/jpeg');
        }
       
        doc.addImage(dataUrl, 'JPEG', 20, 150, 560, 350);
          
		  let bottomContent = document.getElementById("bottom-content");
  doc.fromHTML(bottomContent, 15, 700, {
    'width': 560,
    'elementHandlers': elementHandler
  });
		 doc.fromHTML(source, 15, 15, {
    'width': 560,
    'elementHandlers': elementHandler
  });
  
  doc.addPage();
  
      };
	 
      
    
    }
	
    
  setTimeout(function() {
    doc.save('TestChart.pdf');
  }, 1000);

});
 
});

function isIEBrowser() {
  var ieBrowser;
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // Internet Explorer
  {
    ieBrowser = true;
  } else //Other browser
  {
    console.log('Other Browser');
    ieBrowser = false;
  }

  return ieBrowser;
};
   