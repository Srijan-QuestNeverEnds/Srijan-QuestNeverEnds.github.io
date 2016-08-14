//<!--Original:Philip Winston<pwinston@yahoo.com>-http://members.xoom.com/ebullets
//<!--'Scrolling Fix' by Troels Jakobsen<tjak@get2net.dk>-->
//<!--'Two dimensions DOTSIZE by element' by Ludwig von 97 - http://lv97.net/-->
//<!--Adapted for XTHML + Netscape/Mozilla/FireFox/... by GhislainLavoie on <http://www.editeurjavascript.com/forum>, vwphillips on <http://js-x.com/forum> and LV97, thanks to Willy Duitt too -->
//<!--"body" for HTML = "documentElement" for XHTML. Tested with appnanmes: Microsoft Internet Explorer (4.0) and Netscape (5.0), last update 21st September 2004 by LV97-->
//<!--Made compatible with DOCTYPES (HTML5)+increased readability but reduced overall size by LV97 on 09/02/2012-->
//<!--
var nDots=2//=number of elements including dot0
,DOTSIZEHEIGHT=new Array(1,60,60,60,60,52,60)//*2
,DOTSIZEWIDTH=new Array(1,32,32,28,35,51,68)//*2
,Xpos=0,Ypos=0,Ypos=0,DELTAT=.01,SEGLEN=5,SPRINGK=6,MASS=2,GRAVITY=0,RESISTANCE=10,STOPVEL=0.1,STOPACC=0.1,BOUNCE=0.60
,isNetscape=navigator.appName=="Netscape",followmouse=true,dots=new Array()
init()

function init(){
	var i=0;
	for(i=0;i<nDots;i++){
		dots[i]=new dot(i)
	}

	if (!isNetscape){
		//I only know how to read the locations of the <LI> items in IE, skip this for now/Note by LV97: WTF is this ?
		//setInitPositions(dots)
	}

	for(i=0;i<nDots;i++){
		dots[i].obj.left=dots[i].X+"px"//*1
		dots[i].obj.top=dots[i].Y+"px"//*1
	}

	if (isNetscape){
		startanimate()
	}else{
		//let dots sit there for a few seconds since they're hiding on the real bullets
		setTimeout("startanimate()",300)//was3000 editedbyavailchet#testing
}}

function dot(i){
	this.X=Xpos
	this.Y=Ypos
	this.dx=0
	this.dy=0
	this.obj=eval("document.getElementById('dot'+"+i+").style")
}
// previously "if(isNetscape){this.obj=eval("document.dot"+i);}
// else{this.obj=eval("dot"+i+".style");}}"(GhislainLavoie)
function startanimate(){
	setInterval("animate()",5)//was20 editedbyavailchet#testing
}

function setInitPositions(dots){
	var i=0
	for(i=0;i<startloc.length && i<(nDots-1);i++){
		dots[i+1].X=-DOTSIZEWIDTH[i]//*2
		dots[i+1].Y=2*DOTSIZEHEIGHT[i]//*2
	}
	dots[0].X=dots[1].X
	dots[0].Y=dots[1].Y-SEGLEN
}

function MoveHandler(e){
	Xpos=e.pageX
	Ypos=e.pageY
	return true
}

function MoveHandlerIE(){
	Xpos=window.event.x+document.body.scrollLeft//"body" for HTML = "documentElement" for XHTML (LV97)
	Ypos=window.event.y+document.body.scrollTop
}

if (isNetscape){//document.captureEvents(Event.MOUSEMOVE);<--removed by GhislainLavoie
	document.onmousemove = MoveHandler
}else{
	document.onmousemove = MoveHandlerIE
}

function vec(X, Y){this.X=X;this.Y=Y}

//adds force in X and Y to spring for dot[i] on dot[j]
function springForce(i, j, spring){
	var dx=(dots[i].X-dots[j].X),dy=(dots[i].Y-dots[j].Y),len=Math.sqrt(dx*dx+dy*dy);
	if(len>SEGLEN){
		var springF=SPRINGK*(len-SEGLEN)
		spring.X+=(dx/len)*springF
		spring.Y+=(dy/len)*springF
}}

//source:http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window
function getScrollTop(){
    if(typeof pageYOffset!= 'undefined'){//most browsers
        return pageYOffset;
    }
    else{
        var B= document.body; //IE 'quirks'
        var D= document.documentElement; //IE with doctype
        D= (D.clientHeight)? D: B;
        return D.scrollTop;
    }
}

function getScrollLeft(){
    if(typeof pageXOffset!= 'undefined'){//most browsers
        return pageXOffset;
    }
    else{
        var B= document.body; //IE 'quirks'
        var D= document.documentElement; //IE with doctype
        D= (D.clientHeight)? D: B;
        return D.scrollLeft;
    }
}

function animate(){
	var start=0
	if (followmouse){
		dots[0].X=Xpos
		dots[0].Y=Ypos
		start = 1
	}
	for(i=start;i< nDots;i++){
		var spring=new vec(0,0)
		if(i>0){
			springForce(i-1,i,spring)
		}
		if(i<(nDots-1)){
			springForce(i+1,i,spring)
		}
		var resist=new vec(-dots[i].dx*RESISTANCE,-dots[i].dy*RESISTANCE),
		accel=new vec((spring.X+resist.X)/MASS,(spring.Y+resist.Y)/MASS+GRAVITY)
		dots[i].dx+=(DELTAT*accel.X)
		dots[i].dy+=(DELTAT*accel.Y)
		if (Math.abs(dots[i].dx)<STOPVEL && Math.abs(dots[i].dy)<STOPVEL && Math.abs(accel.X)<STOPACC && Math.abs(accel.Y)<STOPACC){
			dots[i].dx=0
			dots[i].dy=0
		}
		dots[i].X+=dots[i].dx
		dots[i].Y+=dots[i].dy
		//var height=document.body.clientHeight+document.body.scrollTop//"body" for HTML = "documentElement" for XHTML (LV97)
		//var width=document.body.clientWidth+document.body.scrollLeft
		////the two above lines,previously: if (isNetscape) {height=window.innerHeight+document.scrollTop;width=window.innerWidth+document.scrollLeft}else{height=document.body.clientHeight+document.body.scrollTop;width=document.body.clientWidth+document.body.scrollLeft} (LV97 & vwphillips)
		var width,height;//replace by LV97 on 09/02/2012 souce of new code:http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
		if(typeof window.innerWidth!='undefined'){//the most standard compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
			width=window.innerWidth
			height=window.innerHeight
		}
		//IE6 in standards compliant mode(i.e. with a valid doctype as the first line in the document)
		else if(typeof document.documentElement!='undefined' && typeof document.documentElement.clientWidth!='undefined' && document.documentElement.clientWidth!=0){
			width=document.documentElement.clientWidth
			height=document.documentElement.clientHeight
		}else{//older versions of IE
			width=document.getElementsByTagName('body')[0].clientWidth
			height=document.getElementsByTagName('body')[0].clientHeight
		}
		height+=getScrollTop()
		width+=getScrollLeft()
		if(dots[i].Y >= height-DOTSIZEHEIGHT[i]-1){//*2
			if(dots[i].dy>0){
				dots[i].dy=BOUNCE*-dots[i].dy
			}
			dots[i].Y=height-DOTSIZEHEIGHT[i]-1//*2
		}
		if (dots[i].X>=width-DOTSIZEWIDTH[i]-1){//*2
			if(dots[i].dx>0){
				dots[i].dx=BOUNCE*-dots[i].dx
			}
			dots[i].X=width-DOTSIZEWIDTH[i]-1//*2
		}
		if(dots[i].X<0){
			if(dots[i].dx<0){
				dots[i].dx=BOUNCE*-dots[i].dx
			}
			dots[i].X=0
		}
		dots[i].obj.left=dots[i].X+"px"//*1
		dots[i].obj.top=dots[i].Y+"px"//*1
}}
//*1:+"px"(XHTML related)suggested by GhislainLavoie
//*2:2 dimensions dotsize+adaptable width(LV97)
