jQuery.fn.convertToPercentString = function(people){
	return this.text((100*(people/totalPopulation)).toFixed(2)+"%");
};

var hasEquality = ["ny", "ia", "wa", "me", "nh", "ma", "ct", "md", "dc", 
	"vt", "ri", "de", "mn", "ca", "nj"];
var constitutionallyBanned = ["mt", "id", "ut", "az", "ak", "nd", "sd", 
"ne", "ks", "ok", "tx", "la", "ar", "mo", "mi", "oh", "ky", "tn", "ms", 
"al", "tn", "ga",  "fl", "sc", "nc", "va", "co", "or", "wi", "nv"];
var legislativelyBanned = ["wy", "nm", "in", "wv", "pa"];
var protections = ["il"];
var colors = {"equality":"#21799C", "ban": "darkred", "law": "#FC5B5B", "partial": "lightblue"};

var population = {al:4822023, ak:731449, az:6553255, ar:2949131, ca:38041430, 
	co:5187582, ct:3590347, de:917092, dc:632323, fl:19317568, ga:9919945, 
	hi:1392313, id:1595728, il:12875255, "in":6537334, ia:3074186, ks:2885905,
	ky:4380415, la:4601893, me:1329192, md:5884563, ma:6646144, mi:9883360, 
	mn:5379139, ms:2984926, mo:6021988, mt:1005141, ne:1855525, nv:2758931, 
	nh:1320718, nj:8864590, nm:2085538, ny:19570261, nc:9752073, nd:699628, 
	oh:11544225, ok:3814820, or:3899353, pa:12763536, ri:1050292, sc:4723723, 
	sd:833354, tn:6456243, tx:26059203, ut:2855287, vt:626011, va:8185867, 
	wa:6897012, wv:1855413, wi:5726398, wy:576412};
	
var totalPopulation = 313914040;

function recalculateNational(){
	var data = {
		equality:{ states:0, people:0 }, 
		ban:{ states:0, people:0 }, 
		law:{ states:0, people:0 }, 
		partial:{ states:0, people:0 }
	};
	for (var state in usMap) {
      var statusObj = data[usRaphael[state].marriage]; 
			statusObj.states++;
			statusObj.people +=  usRaphael[state].population
		
    }
	jQuery("#equality span").convertToPercentString(data.equality.people);
	jQuery("#ban span").convertToPercentString(data.ban.people);
	jQuery("#partial span").convertToPercentString(data.partial.people);
	jQuery("#law span").convertToPercentString(data.law.people);
}

function marriageToggle(status){
}
  window.onload = function () {
    window.R = Raphael("container", 935, 700),
      attr = {
      "fill": "#d3d3d3",
      "stroke": "#fff",
      "stroke-opacity": "1",
      "stroke-linejoin": "round",
      "stroke-miterlimit": "4",
      "stroke-width": "0.75",
      "stroke-dasharray": "none"
    },
    window.usRaphael = {};
    
    //Draw Map and store Raphael paths
    for (var state in usMap) {
      usRaphael[state] = R.path(usMap[state]).attr(attr);
    }
    
    //Do Work on Map

    for (var state in usRaphael) {
		var status;
		if(hasEquality.indexOf(state)>-1){
			status = "equality";
		}
		else if(constitutionallyBanned.indexOf(state)>-1){
			status = "ban";
		}
		else if(legislativelyBanned.indexOf(state)>-1){
			status =  "law";
		}
		else{
			status = "partial";
		}
		var raphaelState = usRaphael[state];
		raphaelState.color = raphaelState.originalColor =  colors[status];
		raphaelState.marriage = raphaelState.originalMarriage = status;
	
	    raphaelState.population = population[state];
      	raphaelState.animate({fill: raphaelState.color}, 500);
	  	raphaelState.state = state;
	  	raphaelState.node.setAttribute("id", state);
      	raphaelState.toFront();
      	R.safari();
      
      	(function (st, state) { //st is the state element, state is the state itself
			window.click_queue = []; 

        	st[0].style.cursor = "pointer";

        	st[0].onmouseover = st[0].onmouseout = function () {
          		st.toFront();
          		R.safari();
        	};


			st[0].onclick = function() { 
				var color = hasEquality.indexOf(state)>-1 ? colors.ban :  st.originalColor;
          		st.marriage = st.marriage !== st.originalMarriage ? 
					st.originalMarriage : st.marriage !== "equality" ? 
					"equality" : st.originalMarriage;
				if(st.marriage === "equality"){color=colors.equality;}
				st.animate({fill: color}, 300);
			
				var index = click_queue.indexOf(st.state);
			
				if(index === -1){
					click_queue.push(st.state);
				}
				else{
					click_queue.splice(index, 1);
				}
				$("#permalink").attr("href", "?"+click_queue);
				history.replaceState({},"",$("#permalink").attr("href"));
			
				if(location.search.length>1){
					var states_string = click_queue.join(", ").toUpperCase();
					if(click_queue.length>1){
						states_string = states_string.slice(0, -3) + " and" + states_string.slice(-3 );
					}
				
					$("#hypothetical").html("Hypothetically, if " + states_string + " got marriage equality...").add(".hypothetical-text").show();
				}
				else{
					$("#hypothetical, .hypothetical-text").hide();
				}
			
		  		recalculateNational();
			};
                   
      })(usRaphael[state], state);
    }
       recalculateNational();     
try{
	setTimeout(function(){
	var states_to_flip = location.search.substring(1).split(",");
	$.each(states_to_flip, function(i,v){
		$("#"+v).click();
	});
	},1000);
}
catch(e){}
  };



  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-40718670-1', 'marriageequalitymap.org');
  ga('send', 'pageview');
