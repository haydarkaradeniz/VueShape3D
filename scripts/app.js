var rightPanelWidth = 250;
var bottomPanelHeight = 150;
var topPanelHeight = 30;
var screenHeight = 0;
var screenWidth = 0;
var seperatorWidth = 4;

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
      seperatorWidth : seperatorWidth,
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
     common.init(0, topPanelHeight, this.screenWidth-rightPanelWidth, this.screenHeight-bottomPanelHeight-topPanelHeight, seperatorWidth);
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
      projectionData.projectionIndex = projectionData.maximized ? projectionData.maximizedIndex : common.retrieveCanvasIndex(clientX, clientY);
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


var canvasList  = [
  new p5(( sketch ) => {
  sketch.setup = () => {
    setupCanvas(0);
  };
  sketch.draw = () => {
    drawCanvas(0)
  };
}, document.getElementById('canvas0')),
new p5(( sketch ) => {
  sketch.setup = () => {
    setupCanvas(1);
  };
  sketch.draw = () => {
    drawCanvas(1)
  };
}, document.getElementById('canvas1')),
new p5(( sketch ) => {
  sketch.setup = () => {
    setupCanvas(2);
  };
  sketch.draw = () => {
    drawCanvas(2)
  };
}, document.getElementById('canvas2')),
new p5(( sketch ) => {
  sketch.setup = () => {
    setupCanvas(3);
  };
  sketch.draw = () => {
    drawCanvas(3)
  };
}, document.getElementById('canvas3')),
new p5(( sketch ) => {
  sketch.setup = () => {
    setupCanvas(4);
  };
  sketch.draw = () => {
    drawCanvas(4)
  };
}, document.getElementById('canvas4'))
];




function setupCanvas(projectionId) {
  if(projectionId == 0) {
    canvasList[projectionId].createCanvas(screenWidth-rightPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight, canvasList[projectionId].WEBGL);
  } else {
    canvasList[projectionId].createCanvas(((screenWidth-rightPanelWidth)/2)-(seperatorWidth/2), ((screenHeight-bottomPanelHeight-topPanelHeight)/2)-(seperatorWidth/2), canvasList[projectionId].WEBGL);
  }
}

function drawCanvas(projectionId) {
  canvasList[projectionId].background(200);
  canvasList[projectionId].fill(255);
  //canvasList[projectionId].rect(0,0,50,50);
  canvasList[projectionId].box(50);
}

function resize() {
  canvasList[0].resizeCanvas(screenWidth-rightPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight, canvasList[0]);
  for(var i=1; i<canvasList.length; i++) {
      canvasList[i].resizeCanvas(((screenWidth-rightPanelWidth)/2)-(seperatorWidth/2), ((screenHeight-bottomPanelHeight-topPanelHeight)/2)-(seperatorWidth/2), canvasList[i].WEBGL);  
  }
}