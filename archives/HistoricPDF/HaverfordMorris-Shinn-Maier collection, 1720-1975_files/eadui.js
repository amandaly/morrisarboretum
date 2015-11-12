jQuery(function($){
     var truncate = function(s) {
       s = s.replace(/\s+/g, " ").trim(); 
         var maxChar = 80;
         if (s.length <= maxChar) {
             return s
         } else {
             var cur = 0;
             var pieces = s.split(" ");
             var ret = []
             var i;
             for (i = 0; i < pieces.length; i++) {
                 var piece = pieces[i];
                 var l = piece.length;
                 if ((cur + l) > maxChar) {
                     break;
                 } else {
                     cur += l;
                     ret.push(piece); 
                 }
             }
             ret.push("&hellip;");
             return ret.join(" ");
        }
     }
     
     
     var permalink = $("a#permalink").eq(0);
     var url = permalink.html();
     permalink.html(url.replace(/\//g, '<wbr/>/'));
     
     $('.sidecont #toplining, .sidecont #logo, .sidecont #sidestrip, .sidecont #biceps, .sidecont #fixedsidebar')
                    .css("position", "fixed");
     $(".sidecont div#fixedsidebar").css("margin-left", "26px");
     $("body.sidebar.sidecont").css("background-attachment", "fixed");
     
     // I don't enjoy this, but the AT XSLT doesn't generate consistent divs
     // after headers, and it even makes it hard to create them. So we can try this.

     $("#main h3").click(function(){
         $(this).toggleClass("open").toggleClass("closed")
         $(this).nextAll().each(function(){
             // toggle visibility of every element up to the next header.
             if (this.nodeName.match(/H[123]/i)) {
                 return false;
             }
             $(this).toggleClass("collapsed");
         });
     });

     // This assumes that CSS hiding is not being used for anything else.
     // Refine the paths if that's not good enough.
     $("#show_all").click(function(event){
         $("#main .collapsed").removeClass("collapsed");
         $("#main h3").addClass("open").removeClass("closed");
     });
     $("#hide_all").click(function(event){
        $("#main h3").each(function(){
         $(this).removeClass("open").addClass("closed");
         $(this).nextAll().each(function(){
             // toggle visibility of every element up to the next header.
             if (this.nodeName.match(/H[123]/i)) {
                 return false;
             }
             $(this).addClass("collapsed");
         });
        }); 
        
     });
     $("a#restrictionslink").click(function() {
         var target = $(this.hash);
         var foldsUp = target.parent();
         if (foldsUp.is(":hidden")) {
             foldsUp.show().prev("h3").removeClass("closed").addClass("open");
         };
     });
     //Sliding headers:
     //disable for IE6 and pages with no series headers
     var series = $(".series h4");
     var numSections = series.length;
     
     if (($.browser.msie && $.browser.version < 7) || (numSections < 1)) {
         return;
     }
     var cl = $("table.containerList");
     var ranges;
     var showing = false;
     var content;
     var stickyHeader = $("<h4/>").css({
         "position" : "fixed",
         "top":"-8px",
         "padding-bottom":"5px",
         "background-color":"#f9e7c2",
         "padding-left":"2.27em",
         "border-top":"solid 2px #bdbdbd",
         "width":"98%",
         "line-height":"120%",
         "display":"none"
         }).addClass("sticky");
     cl.before(stickyHeader);
     $("h4.sticky").wrap("<div style='font-size:93%'/>");

     var calcBounds = function() {

         ranges = [];

         ranges.push({
             range:[0, series.eq(0).offset().top],
             enabled:false
         });
         ranges.push({
             range:[cl.height() + cl.offset().top, $(document).height()],
             enabled:true
         });
         var header;
         var height = -1;
         series.each(function(i) {
             header = series.eq(i);
             if (height == -1) {//haven't set it yet
                 height = series.eq(i).height();
             }
             range = {
                 enabled:true,
                 header:header.text()                 
             };
             var bottom;
             if (i+1 < numSections) {
                  bottom =  series.eq(i + 1).offset().top - height;
                  range.range = [header.offset().top, bottom];
                  ranges.push(range);
                  ranges.push({range:[bottom + 1, bottom + height], enabled:false}) 
              } else {
                 bottom = cl.height() + cl.offset().top -1;
                 range.range = [header.offset().top, bottom];
                 ranges.push(range);
              }
         });
         stickyHeader.css("left",header.offset().left);


     };
     calcBounds();

     $(window).bind("resize", calcBounds);
     var getBounds = function() {
         var theTop = $(window).scrollTop();
         for (var idx = 0; idx < ranges.length; idx++) {
             var r = ranges[idx];
             if ((r.range[0] <= theTop) && (r.range[1] > theTop)) {

                 break;
             }
         }
         return r;
     };

     $(window).scroll(function() {

         var bounds = getBounds();
         if (bounds.enabled && (showing === false || content !== bounds.header)) {
             showing = true;
             content = truncate(bounds.header);
             stickyHeader.html(content).show();
         } else if (!bounds.enabled && showing === true) {
             showing = false;
             stickyHeader.html("");
             stickyHeader.hide();
         }
     });
     
 });
