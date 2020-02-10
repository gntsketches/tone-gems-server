console.clear();

// http://musicappblog.com/wp-content/uploads/2015/10/Fugue-Machine-main-screen-1.jpg

// I like the design of this synth http://www.ikmultimedia.com/products/unosynth/

var canvas = document.getElementById('pianoroll');
resizeCanvasToDisplaySize(canvas);

var ctx=canvas.getContext("2d");
var w = canvas.scrollWidth;
var h = canvas.scrollHeight;
var cellwidth=w/16;
var cellheight=h/28;

drawPianoGrid();

drawNote(2,4,4);
drawNote(4,8,4);
drawNote(7,12,1, true);

drawPlayHead(357);

function drawNote(x,y,length, selected=false){
  x=x*cellwidth;
  y=y*cellheight;
  ctx.beginPath();
  ctx.fillStyle = "rgb(128,128,128)";
  if(selected){
    ctx.strokeStyle = "rgb(255,255,255)";
  }else{
    ctx.strokeStyle = "rgb(24,24,24)";
  }
  ctx.rect(x, y, cellwidth*length, cellheight);
  ctx.fill()
  ctx.stroke();
}

function drawPlayHead(x){
  ctx.beginPath();
  ctx.moveTo(x,0);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.lineTo(x,h);
  ctx.shadowBlur=0;
  ctx.stroke();
}


function drawPianoGrid(){
  for(y=0;y<w;y=y+cellheight){
    for(x=0;x<w;x=x+cellwidth){
      if(x % 8 ==0){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.strokeStyle = "black";
        ctx.lineTo(x,h);
        ctx.shadowBlur=0;
        ctx.stroke();
      }
      ctx.beginPath();
      if(y % 8){
        ctx.fillStyle = "rgb(32,32,32)";
      }else{
        ctx.fillStyle = "rgb(40,40,40)";
      }
      ctx.strokeStyle = "rgb(24,24,24)";
      ctx.rect(x, y, cellwidth, cellheight);
      ctx.fill()
      ctx.stroke();
    }
  }
}


function resizeCanvasToDisplaySize(canvas) {
  // look up the size the canvas is being displayed
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  // If it's resolution does not match change it
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}
