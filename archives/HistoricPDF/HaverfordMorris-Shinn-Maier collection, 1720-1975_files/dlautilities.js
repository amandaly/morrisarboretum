jQuery(function($){

	//Change contact"about(page)" info
    var oldLink = $('#footer .contact a').attr('href');
    var newLink = oldLink + window.location;
    $('#footer .contact a').attr('href',newLink);
	//End of changing contact"about(page)" info

    var permalink = $("a#permalink").eq(0);
    var url = permalink.html();
    if (url != null) {
       permalink.html(url.replace(/\//g, '<wbr/>/'));
    }   
    $(window).load(function() {
        
        $("img.autotop").each(function(i){
    		if (this.height < 100 && this.height > 0){
    			$(this).addClass("innerthumb").css("margin-top", -1*this.height/2);
    		}
    	});  
    });
	var orgClass = $("body").attr("class");
    $("div#pfptop").add("div#pfpback").click(function(){
        $("body").toggleClass("printer").toggleClass(orgClass);
        return false;
    })
});
    
function fixAncillaryContent() {
   if (document.getElementById("ancillaryContent") != null) {
      document.getElementById("ancillaryContent").innerHTML = unescapeHTML(document.getElementById("ancillaryContent").innerHTML);
   }
}
function unescapeHTML(s)
{
  return s.replace(
    /&(amp|[lg]t|quot);/g,
    function(m, p1)
    {
      var map = {
        amp:  "&",
        lt:   "<",
        gt:   ">",
        quot: '"'
      };

      return map[p1];
    });
  
}
var fixWidth = function(w) {
      
       var fixed;
       if (jQuery.browser.msie) {
           fixed = (w * .5) + 125;
       } else {
           fixed = (w * .51) + 290;
       }
	  return fixed;

   } 
function widedatawidth() {
	
    if (jQuery("body").hasClass("printer")) {
	   jQuery("#recordinfo").css("width", "69%");
       jQuery("recordfacets").css("margin-left", "72%");
	} else {
	var winW = 1000;
	if (parseInt(navigator.appVersion)>3) {
	 if (navigator.appName=="Netscape") {
	  winW = window.innerWidth;
	 }
	 if (navigator.appName.indexOf("Microsoft")!=-1) {
	  winW = document.body.offsetWidth;
	 }
	}
	
	if (winW < 843){
		var divWidth = winW * 0.40;
		var margWidth = winW * 0.41;
	}
	else {
		var divWidth = winW * 0.49;
		var margWidth = winW * 0.51;
		
	}
	var titletableWidth = winW - 236 - (.08 * winW);
	if (winW > 1029){
		var titletableWidth = fixWidth(winW);
	}
	
	var title1Width = titletableWidth*.48;
	var title2Width = titletableWidth*.48;
	
	if( document.getElementById('recordinfo') ) {
	document.getElementById('recordinfo').style.width=divWidth+"px";	
	}
	if( document.getElementById('recordfacets') ) {
	document.getElementById('recordfacets').style.marginLeft=margWidth+"px";	
	}
	if( document.getElementById('recordtitleholder'))  {
	document.getElementById('recordtitleholder').style.width=titletableWidth+"px";	
	}
	if( document.getElementById('firsttitle'))  {
	document.getElementById('firsttitle').style.width=title1Width+"px";	
	}
	if( document.getElementById('secondtitle'))  {
	document.getElementById('secondtitle').style.width=title2Width+"px";
	}
	}
}						

function setIframeWidth() {

	if (jQuery.browser.msie) { document.getElementById('iframe').width = 0; }
	document.getElementById('iframe').width = (0.98 * document.getElementById('iframediv').offsetWidth);
}

function updateFindRelatedItemsForm() {
	var form = document.getElementById("record-facet-form");
	var fqInput = form.elements.namedItem("fq");
	var fq = "";
	for (var i = 0; i < form.elements.length; i++) {
		if (form.elements[i].type == "checkbox" && form.elements[i].checked == true) {
			fq = (fq == "") ? form.elements[i].value : fq+" AND "+form.elements[i].value;
		}	
	}
	fqInput.value = fq;
}
function fixMenuHeight() {
	if (!(jQuery.browser.msie && jQuery.browser.version <= 6 )) {
	    var h = jQuery(window).height();
	    jQuery("#fixedsidebar").height(h - 112);
    }
}

// *********************************************************************
// **** DLA ADVANCED SEARCH SUBMIT ****
//
//The following line replaces "$(document).ready(function() {" and plays much better with the rest of the code in this file:
jQuery(function($){

var normalizeSpaces = function(st) {
       st = st.replace(/\s+/g, ' ');
       st = st.replace(/^\s+/, '');
       st = st.replace(/\s+$/, '');
       st = st.replace(/\(\s+\(/g, '((');
       st = st.replace(/\)\s+\)/g, '))');
       
       return st;
}

// ***********************************************************************
// ****** PROCESS TEXT ROW *****
var processTextRow = function(currentTextBox) {
    var qchunk = '';
    var feedback = '';
    var currentString = currentTextBox.val();
    currentString = normalizeSpaces(currentString);
    var idChunks = currentTextBox.attr('id').split('_');
    var currentType = idChunks[0];
    var position = idChunks[2];
    var currentField = $("#" + currentType + "_field_" + position + ' option:selected').attr('value');
    var currentOperator = $('#' + currentType + '_operator_' + position + ' option:selected').attr('value');

    //The rows with empty text fields are simply ignored:
    if ($(currentTextBox).val().length) {

        var currentSuboperator = $('#' + currentType + '_suboperator_' + position + ' option:selected').attr('value');


        // ************************************
        // Catch any problems in the string:
        //In case there are forbidden characters:
        if (currentString.match(/([!@#$%\^&()+={}\[\]|\\:;<>,.\/])/)) {
            feedback = "The character '" + RegExp.$1 + "' is not allowed.";
            errorFlag = 1;

            //In case there are quotes:
        } else if (currentString.match(/[\"]/)) {
            feedback = "Don't enter quotes. Select 'As a phrase' option.";
            errorFlag = 1;

        } else if (currentString.match(/^[*?]/)) {
            feedback = "Wildcard characters (* and ?) are not allowed at the beginning of a string.";
            errorFlag = 1;
        }
        

        // ************************************
        // Display any error messages
        $('#text_error_' + position).text(feedback);
        feedback = '';


        // ************************************
        // Build the query chunk:
        // Add the operator:
        if (currentOperator) {
            qchunk +=  ' ' + currentOperator + ' ';
        }

        var q1 = '';

        //In case of a phrase:
        if (currentSuboperator == 'phrase') {

            //Add the field:
            if (currentField != "any_field") {
                qchunk += currentField + ':';
            }

            currentString = '\"' + currentString + '\"';
            // Add the string:
            q1 += currentString;

        } else {
            // Process multi-terms string (from 1 to n):
            var terms = currentString.split(' ');
            for (i = 0; i < terms.length; i++) {

                q1 += ' ' + currentSuboperator + ' ';

                //Add the field:
                if (currentField != "any_field") {
                    q1 += currentField + ':';
                }
                //Add the term:
                q1 += terms[i];
            }

            q1 = q1.replace(/^\s*(AND|OR)\s*/, '');
            if (terms.length > 1) {
                q1 = ' (' + q1 + ') ';
            }
        }

        qchunk += q1;
    }

    return qchunk;
}

// ***********************************************************************
// ****** PROCESS NUMBER ROW *****
var processNumberRow =function(currentTextBox) {

    var qchunk = '';
    var feedback1 = '';
    var feedback2 = '';
    var currentString = currentTextBox.val();
    currentString = normalizeSpaces(currentString);
    var idChunks = currentTextBox.attr('id').split('_');
    var currentType = idChunks[0];
    var currentElement = idChunks[1];
    var position = idChunks[2];
    var currentField = $("#" + currentType + "_field_" + position + ' option:selected').attr('value');
    var currentOperator = $('#' + currentType + '_operator_' + position + ' option:selected').attr('value');

    // We are looking only once at each row, so we ignore "string2" text boxes as they come up in the "each" loop:
    if (currentElement != 'string2') {
        var currentString2 = $('#' + currentType + '_string2_' + position).val();
        currentString2 = normalizeSpaces(currentString2);
 
        // ************************************
        // Catch any problems in the strings:
        if (currentString == '') {
            feedback1 = "The field should not be empty.";
            errorFlag = 1;
        } else if (! (currentString.match(/(^[0-9]+|\*|min)$/))) {
            feedback1 = "Enter only a number or 'min'.";
            errorFlag = 1;
        }

        if (currentString2 == '') {
            feedback2 = 'The field should not be empty.';
            errorFlag = 1;
        } else if (! (currentString2.match(/^([0-9]+|max)$/))) {
            feedback2 = "Enter only a number or 'max'.";
            errorFlag = 1;
        }

        if (currentString.match(/(^[0-9]+|\*)$/)
        && currentString2.match(/(^[0-9]+|\*)$/)
        && parseInt(currentString) > parseInt(currentString2)
        ) {
            feedback1 = "The 'from' field cannot be larger than the 'to' field";
            errorFlag = 1;
        }
        // ************************************
        // Display any error messages
        $('#number_error1_' + position).text(feedback1);
        feedback1 = '';

        $('#number_error2_' + position).text(feedback2);
        feedback2 = '';

        // ************************************
        // Build the query chunk:
        if (! (currentString == 'min' && currentString2 == 'max')) {

            // Add the operator:
            qchunk += ' ' + currentOperator + ' ';

            //Add the field:
            if (currentField != "any_field") {
                qchunk += currentField + ':';
            }
            //Add the [x TO y] statement:
            if (currentString == 'min') {
                currentString = '*';
            }
            if (currentString2 == 'max') {
                currentString2 = '*';
            }
            qchunk += '[' + currentString + ' TO ' + currentString2 + ']';
        }
    }

    return qchunk;
}


// *********************************************************************
// **** ADVANCED SEARCH SUBMIT EVENT HANDLER****
// What happens when the user hits the "submit" button
    $('#advancedsearch').submit(function() {

        // errorFlag is a global variable. If we find any entry error anywhere in the form, we will set its value to 1.
        errorFlag = 0;
        var q = '';
        var counter = 0;

        // For each text field, gather the various elements needed to build the corresponding query chunk:
        $('#advancedsearch input:text').each(function() {

            var currentTextBox = $(this);
            var idChunks = currentTextBox.attr('id').split('_');
            var currentType = idChunks[0];

            // Process Text and Number rows:
           var funcs = {'text':processTextRow, 'number':processNumberRow};
           var chunk =  funcs[currentType](currentTextBox) ;

           if (chunk){
                  // Remove initial "AND" or "OR", if it is there:
                  if (counter < 1){
                    chunk = chunk.replace(/^\s*(AND|OR)\s*/, '');
                  }
               // Add parentheses to avoid ambiguity in the query:
               if (counter > 1) { q =  '('  + q  + ')' };
               q += chunk;
               if (chunk) {counter++};
           }
        });

      q = normalizeSpaces(q);
   
        // If the form is error free, submit it:
        if (!errorFlag) {
       //      alert(q);
         // Go to the DLA page with the newly build query:
            location.href = "search.html?q=" + q;
        }

        return false;
    });
});
// ***********************************************************************
function statusLookup($){
    var chunk_size = 50;
    var type = $('.statusLookup').attr('type') || 'brief';
    var id_list = $.map(
        $('.statusLookup'),
        function(status_el) {
            return status_el.getAttribute('bib')
        }
    );
    while (id_list.length) {
        var chunk = [];
        while (chunk.length < chunk_size && id_list.length) {
            chunk.push(id_list.pop());
        }
        $.getJSON('status.'+type+'.json',{'ids':chunk.join(',')},
            function(data) {
                for (var id in data) {
                    $('.statusLookup[bib='+id+']').html(data[id]);
                }
            }
        );
    }
}
function openshutside(id) { 
	var contents = document.getElementById("C"+id); 
	var control = document.getElementById("I"+id); 
	if (contents.style.display == "none") {    
	contents.style.display = "block";  
	} 
	else if (contents.style.display == "block") {    
	contents.style.display = "none"; 
	}
	else {    
	contents.style.display = "block";
	}
	
	
	
	if (control.className == "recordDescription") {
	control.className = "headerclosedarrow";
	} 
	else if (control.className == "headerclosedarrow") {
	control.className = "recordDescription";
	}
	else {
	control.className = "recordDescription nobg";
	}
}




function fixMailto() {
	var mailto = document.getElementById('mailto');
	if (mailto != null) {
		mailto.href = mailto.href.replace(/\$CURRENTPAGE/, escape(window.location.href));
	}
}
