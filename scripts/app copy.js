var rightPanelWidth = 250;
var bottomPanelHeight = 150;
var topPanelHeight = 30;
var screenHeight = 0;
var screenWidth = 0;

var projectionData = {
  maximized : false,
  maximizedIndex : 0,
  projectionIndex : 0,
  projections : [
    {
      direction : 'front',
      drawMode : 'wireframe',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
    {
      direction : 'left',
      drawMode : 'wireframe',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
    {
      direction : 'top',
      drawMode : 'wireframe',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
    {
      direction : '3d',
      drawMode : 'wireframe',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
  ],
};

const app = Vue.createApp({
  data() {
    return {
      rightPanelWidth : rightPanelWidth,
      bottomPanelHeight : bottomPanelHeight,
      topPanelHeight : topPanelHeight,
      screenHeight,
      screenWidth,
      contextMenuData : {
        visible : false,
        top : 0,
        left : 0,
        width : 170,
        height : 300,
        drawMode : 'wireframe',
        wireframeOverlay : true,
        showAxis : true,
        showGrid : true,
        drawBackfaces : true,
        maximize : false,
        projectionMenu : {
          visible : false,
          top : 0,
          left : 0,
          width : 100,
          height : 170,
          projectionDirection : "",
        }
      },
      rightPanelData : {
        selectedTabId : 'model',
        toolsData : {
          toolsId : 'select',
          options : {
            selectOptions : 'vertex'
          }
        }
      },
    };
  },
  mounted() {    
	
  },
  created() {
     this.initializeSize();
     common.init(0, topPanelHeight, this.screenWidth-rightPanelWidth, this.screenHeight-bottomPanelHeight-topPanelHeight);
     window.addEventListener("resize", this.resizeEventHandler);
     window.addEventListener("contextmenu", this.contextmenuEventHandler);
     window.addEventListener("click", this.clickEventHandler);
	 
     
  },
  destroyed() {
     window.removeEventListener("resize", this.resizeEventHandler);
     window.removeEventListener("contextmenu", this.contextmenuEventHandler);
     window.removeEventListener("click", this.clickEventHandler);
     
  },
  methods: {  

    resizeEventHandler(e) {
      this.initializeSize();
      resize();
    },

    initializeSize() {
      this.screenHeight = window.innerHeight;
      this.screenWidth =  window.innerWidth;
    },

    showContextMenu(clientX, clientY) {
      this.contextMenuData.top = clientY;
      this.contextMenuData.left = clientX;
      projectionData.projectionIndex = common.retrieveCanvasIndex(clientX, clientY);
      this.contextMenuData.drawMode = projectionData.projections[projectionData.projectionIndex].drawMode;
      this.contextMenuData.wireframeOverlay = projectionData.projections[projectionData.projectionIndex].wireframeOverlay;
      this.contextMenuData.showAxis = projectionData.projections[projectionData.projectionIndex].showAxis;
      this.contextMenuData.showGrid = projectionData.projections[projectionData.projectionIndex].showGrid;
      this.contextMenuData.drawBackfaces = projectionData.projections[projectionData.projectionIndex].drawBackfaces;
      this.contextMenuData.visible = true;
    },

    hideContextMenu() {
      this.contextMenuData.visible = false;
      this.contextMenuData.projectionMenu.visible = false;
    },

    contextmenuEventHandler(e) {
      e.preventDefault();
      this.contextMenuData.projectionMenu.visible = false;
      if(common.checkInCanvas(e.clientX, e.clientY)) {
        this.showContextMenu(e.clientX, e.clientY);
      }        	
    },

    clickEventHandler(e) {
      if(!common.checkInArea(e.clientX, e.clientY, this.contextMenuData.left, this.contextMenuData.top, this.contextMenuData.width, this.contextMenuData.height)) {
        this.hideContextMenu();
      }
      this.contextMenuData.projectionMenu.top = e.clientY;
    },


  selectTools(toolsId) {
    this.rightPanelData.toolsData.toolsId = toolsId;
    switch (toolsId) {
      case "select": {
        break;
      }
    };

  },
  contextMenuAction(actionId) {
    switch(actionId) {
      case "wireframe" :
      case "flatShaded" :
      case "smoothShaded" : {
        this.contextMenuData.drawMode = actionId;
        projectionData.projections[projectionData.projectionIndex].drawMode = actionId;
        this.hideContextMenu();
        break;
      }
      case "wireframeOverlay" :
      case "showAxis" :
      case "showGrid" :
      case "drawBackfaces" : {
        this.contextMenuData[actionId] = !this.contextMenuData[actionId];
        projectionData.projections[projectionData.projectionIndex][actionId] = this.contextMenuData[actionId];
        this.hideContextMenu();
        break;
      }
      case "maximize" : {
        if(projectionData.maximized) {
          projectionData.maximized = false;
          projectionData.maximizedIndex = -1;
        } else {
          projectionData.maximized = true;
          projectionData.maximizedIndex = projectionData.projectionIndex;
        }
        this.contextMenuData.maximize = projectionData.maximized;
        this.hideContextMenu();
        break;
      }
      case "projection" : {
        this.contextMenuData.projectionMenu.visible = !this.contextMenuData.projectionMenu.visible;
        if(this.contextMenuData.projectionMenu.visible) {
          this.contextMenuData.projectionMenu.left = this.contextMenuData.left + this.contextMenuData.width;
          this.contextMenuData.projectionMenu.projectionDirection = projectionData.projections[projectionData.projectionIndex].direction;
        }
        break;
      }
      case "3d" :
      case "front" :
      case "back" :
      case "left" :
      case "right" :
      case "top" : 
      case "bottom" :{
        projectionData.projections[projectionData.projectionIndex].direction = actionId;
        this.hideContextMenu();
        break;
      }
      case "resetView" : {


        
        this.hideContextMenu();
        break;
      }

    };


  },
	
  },
  computed: {
	 
  },
  
  watch: {/*
	  windowSizeMsg: {
		  deep: true, handler(newValue) {
			this.message = window.innerWidth + " x " + window.innerHeight;
		  }
	  }
      */
	screenHeight(newValue, oldValue) {
		screenHeight = newValue;
	},
	screenWidth(newValue, oldValue) {
		screenWidth = newValue;
	},
  }
  


});

app.mount("#app");

var images = [];
var seperatorWidth = 2;
var axisLength = 50;

function setup() {
  createCanvas(screenWidth-rightPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight, WEBGL);
  if(projectionData.maximized) {
    images = [];
    images.push(createGraphics(screenWidth-rightPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight));
  } else {
    images = [];
    for(var i=0; i<4; i++) {
      images.push(createGraphics(((screenWidth-rightPanelWidth)/2)-(seperatorWidth/2), ((screenHeight-bottomPanelHeight-topPanelHeight)/2)-(seperatorWidth/2)));
    }
  }
}

function drawImages() {
  if(projectionData.maximized) {
    image(images[0], -(screenWidth-rightPanelWidth)/2, -(screenHeight-bottomPanelHeight-topPanelHeight)/2);
  } else {
    //images[0].resize(((screenWidth-rightPanelWidth)/2)-(seperatorWidth/2), ((screenHeight-bottomPanelHeight-topPanelHeight)/2)-(seperatorWidth/2));
    image(images[0], -(screenWidth-rightPanelWidth)/2, -(screenHeight-bottomPanelHeight-topPanelHeight)/2);
    image(images[1], (seperatorWidth/2), -(screenHeight-bottomPanelHeight-topPanelHeight)/2);
    image(images[2], -(screenWidth-rightPanelWidth)/2, seperatorWidth/2);
    image(images[3], seperatorWidth/2, seperatorWidth/2);
  }

  for(var i=0; i<images.length; i++) {
    images[i].background(100 + (i*30));
  }
}




function resize() {
  resizeCanvas(screenWidth-rightPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight);
  //drawImages();
}

function draw() {
  background(0);




  
  //ellipse(50,50,80,80);
   //fill(20,250,8);
/*
   line(-((screenWidth-margin)/2), 0, ((screenWidth-margin)/2), 0);
   line(0, -((screenHeight-margin)/2), 0, ((screenHeight-margin)/2));
   rotateX(angleX);
   rotateY(angleY);
   rotateY(angleZ);
   if(rectData.width > 0 ) {
		rect(rectData.x - ((screenWidth-margin)/2), rectData.y - ((screenHeight-margin)/2), rectData.width, rectData.height);
   }
	*/

  if(!projectionData.maximized) {
    //drawSeperators();
  }
  drawAxis();
  drawImages();
 
    
  
}

function drawSeperators() {
    strokeWeight(5);
    stroke(255);
    line(-((screenWidth-rightPanelWidth)/2), 0, ((screenWidth-rightPanelWidth)/2), 0);
    line(0, -((screenHeight-bottomPanelHeight-topPanelHeight)/2), 0, ((screenHeight-bottomPanelHeight-topPanelHeight)/2));
}

function drawAxis() {
  if(projectionData.maximized && projectionData.projections[projectionData.maximizedIndex].showAxis) {
    drawAxisLine(0,0,0,0)
  } else if(!projectionData.maximized) {
    if(projectionData.projections[0].showAxis) {
      drawAxisLine(-((screenWidth-rightPanelWidth)/4), -((screenHeight-bottomPanelHeight-topPanelHeight)/4), 0, 0);
    }
    if(projectionData.projections[1].showAxis) {
      drawAxisLine(((screenWidth-rightPanelWidth)/4), -((screenHeight-bottomPanelHeight-topPanelHeight)/4), 0, 1);
    }
    if(projectionData.projections[2].showAxis) {
      drawAxisLine(-((screenWidth-rightPanelWidth)/4), ((screenHeight-bottomPanelHeight-topPanelHeight)/4), 0, 2);
    }
    if(projectionData.projections[3].showAxis) {
      drawAxisLine(((screenWidth-rightPanelWidth)/4), ((screenHeight-bottomPanelHeight-topPanelHeight)/4), 0, 3);
    }
  }
}

function drawAxisLine(centerX, centerY, centerZ, projectionIndex) {
    centerX = (screenWidth-rightPanelWidth)/4;
    centerY = (screenHeight-bottomPanelHeight-topPanelHeight)/4;
    centerZ = 0;
    directionTransformation(projectionIndex, false);
    images[projectionIndex].strokeWeight(1);
    images[projectionIndex].stroke('#FF0000');
    //images[projectionIndex].line(centerX, centerY, centerX+axisLength, centerY);
    images[projectionIndex].stroke('#00FF00');
    images[projectionIndex].line(centerX, centerY, centerX, centerY+axisLength);
    images[projectionIndex].stroke('#0000FF');
    images[projectionIndex].line(centerX, centerY, 0, centerX, centerY, -1);
    directionTransformation(projectionIndex, true);   
  }

  function directionTransformation(projectionIndex, reverse) {
    /*switch(direction)  {
      case 'front' : {
        rotateX(angleX);
        rotateY(angleY);
        rotateY(angleZ);
      }
    };*/

  }
  


