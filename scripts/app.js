var rightPanelWidth = 250;
var leftPanelWidth = 5;
var bottomPanelHeight = 150;
var topPanelHeight = 30;
var screenHeight = 0;
var screenWidth = 0;
var seperatorWidth = 4;
var axisLength = 140;
var cameraDistance = 400;
var wireframeColor = 'white';
var selectedWireframeColor = 'red';
var uniqueVertexData = {};
var uniqueEdgeData = {};

var modelData = {
  vertexList : [],
  groupList : [],

};

var projectionData = {
  maximized : false,
  maximizedIndex : -1,
  projectionIndex : 0,
  projections : [
    {
      direction : 'front',
      drawMode : 'flatShaded',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
    {
      direction : 'back',
      drawMode : 'flatShaded',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
    {
      direction : 'left',
      drawMode : 'flatShaded',
      wireframeOverlay : true,
      showAxis : true,
      showGrid : true,
      drawBackfaces : true,
    },
    {
      direction : 'right',
      drawMode : 'flatShaded',
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
      leftPanelWidth : leftPanelWidth,
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
        },
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
      bottomPanelData : {
        selectedTabId : 'test',
      },
      groupList : [],
      vertexList : [],
      groupSelectAll : false,
      groupVisibleAll : true,
      vertexSelectAll : true,
    };
  },
  mounted() {    
	
  },
  created() {
     this.initializeSize();
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
      common.init(leftPanelWidth, topPanelHeight, this.screenWidth-rightPanelWidth-leftPanelWidth, this.screenHeight-bottomPanelHeight-topPanelHeight, seperatorWidth); 
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
      this.contextMenuData.projectionMenu.projectionDirection = projectionData.projections[projectionData.projectionIndex].direction;
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
      
      

      var centerPoint = common.getCenterPoint(e.clientX, e.clientY, projectionData.maximized);
      console.log("clicked (" + e.clientX + "," + e.clientY + ")");
      console.log("center (" + centerPoint.x + "," + centerPoint.y + ")");
      console.log("cdistance (" + (centerPoint.x - e.clientX) + "," + (centerPoint.y - e.clientY) + ")");
      

      if(this.rightPanelData.selectedTabId == 'model' && this.rightPanelData.toolsData.toolsId == 'select') {
        if(this.rightPanelData.toolsData.options.selectOptions == 'vertex') {

        }

      }


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
      case "wireframe" : {
        this.contextMenuData.wireframeOverlay = true;
        projectionData.projections[projectionData.projectionIndex].wireframeOverlay = true;
      }
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
        if(!(actionId == "wireframeOverlay" && this.contextMenuData.wireframeOverlay && this.contextMenuData.drawMode == "wireframe")) {
          this.contextMenuData[actionId] = !this.contextMenuData[actionId];
          projectionData.projections[projectionData.projectionIndex][actionId] = this.contextMenuData[actionId];
          this.hideContextMenu();
        }
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



  refreshGroupList() {
    this.groupList = model.getGroupList(-1);
  },

  refreshVertexList() {
    this.vertexList = model.getVertexList();
  },
  

  groupListChanged(event, param, groupId) {
    if(param == 'select') {
      model.selectGroup(groupId, event.target.checked);
      var selectedGroupCount = 0;
      for(var i=0; i<this.groupList.length; i++){
        if(this.groupList[i].selected) {
          selectedGroupCount++;
        }
      }
      if(selectedGroupCount == this.groupList.length) {
        this.groupSelectAll = true;
      } else {
        this.groupSelectAll = false;
      }
      this.refreshVertexList();
    } else if(param == 'selectAll') {
      model.selectAllGroup(event.target.checked);
      this.vertexSelectAll = event.target.checked;
      this.refreshVertexList();
    } else if(param == 'visible') {
      var visibleGroupCount = 0;
      for(var i=0; i<this.groupList.length; i++){
        if(this.groupList[i].visible) {
          visibleGroupCount++;
        }
      }
      if(visibleGroupCount == this.groupList.length) {
        this.groupVisibleAll = true;
      } else {
        this.groupVisibleAll = false;
      }
    } else if(param == 'visibleAll') {
      for(var i=0; i<this.groupList.length; i++){
        this.groupList[i].visible = event.target.checked;
      }
    }
  },

  vertexListChanged(event, param) {
    if(param == 'select') {
      var selectedVertexCount = 0;
      for(var i=0; i<this.vertexList.length; i++){
        if(this.vertexList[i].selected) {
          selectedVertexCount++;
        }
      }
      if(selectedVertexCount == this.vertexList.length) {
        this.vertexSelectAll = true;
      } else {
        this.vertexSelectAll = false;
      }
    } else if(param == 'selectAll') {
      for(var i=0; i<this.vertexList.length; i++){
        this.vertexList[i].selected = event.target.checked;
      }
    }
  },

  getSelectedGroupList() {
    return model.getSelectedGroupList();
  },

  moveVertexUp() {

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
    rightPanelData: {
		  deep: true, handler(newValue) {
        if(newValue.selectedTabId == 'groups') {
          this.refreshGroupList();
          this.refreshVertexList();
        }
		  }
	  },

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






model.addGroup([
  model.addVertex(-50,50,-50),
  model.addVertex(50,50,-50),
  model.addVertex(50,-50,-50),
  model.addVertex(-50,-50,-50),
], {color:'green'});


model.addGroup([
  model.addVertex(-50,50,50),
  model.addVertex(50,50,50),
  model.addVertex(50,-50,50),
  model.addVertex(-50,-50,50),
], {color:'blue'});


model.addGroup([
  model.addVertex(50,50,50),
  model.addVertex(50,50,-50),
  model.addVertex(50,-50,-50),
  model.addVertex(50,-50,50),
], {color:'orange'});

model.addGroup([
  model.addVertex(-50,50,50),
  model.addVertex(-50,50,-50),
  model.addVertex(-50,-50,-50),
  model.addVertex(-50,-50,50),
], {color:'red'});

model.addGroup([
  model.addVertex(-50,50,50),
  model.addVertex(-50,50,-50),
  model.addVertex(50,50,-50),
  model.addVertex(50,50,50),
], {color:'yellow'});

model.addGroup([
  model.addVertex(-50,-50,50),
  model.addVertex(-50,-50,-50),
  model.addVertex(50,-50,-50),
  model.addVertex(50,-50,50),
], {color:'gray'});




function setupCanvas(projectionId) {
  if(projectionId == 0) {
    canvasList[projectionId].createCanvas(screenWidth-rightPanelWidth-leftPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight, canvasList[projectionId].WEBGL);
  } else {
    canvasList[projectionId].createCanvas(((screenWidth-rightPanelWidth-leftPanelWidth)/2)-(seperatorWidth/2), ((screenHeight-bottomPanelHeight-topPanelHeight)/2)-(seperatorWidth/2), canvasList[projectionId].WEBGL);
  }
  canvasList[projectionId].ortho();
}

function getProjectionIndex(projectionId) {
  if(projectionId == 0) {
    return projectionData.maximizedIndex>-1 ? projectionData.maximizedIndex : 0;
  } else {
    return projectionId-1;
  }
}

function drawCanvas(projectionId) {
  var cameraX, cameraY, cameraZ;
  var cameraUpX, cameraUpY, cameraUpZ;
  switch(projectionData.projections[getProjectionIndex(projectionId)].direction)  {
    case "3d" :  {
      cameraX = 0;
      cameraY = 0;
      cameraZ = cameraDistance;
      cameraUpX = 0;
      cameraUpY = 0;
      cameraUpZ = 0;
      break;
    }
    case "front" :  {
      cameraX = 0;
      cameraY = 0;
      cameraZ = -cameraDistance;
      cameraUpX = 0;
      cameraUpY = -1;
      cameraUpZ = 0;
      break;
    }
    case "back" :  {
      cameraX = 0;
      cameraY = 0;
      cameraZ = cameraDistance;
      cameraUpX = 0;
      cameraUpY = -1;
      cameraUpZ = 0;
      break;
    }
    case "left" :  {
      cameraX = -cameraDistance;
      cameraY = 0;
      cameraZ = 0;
      cameraUpX = 0;
      cameraUpY = -1;
      cameraUpZ = 0;
      break;
    }
    case "right" :  {
      cameraX = cameraDistance;
      cameraY = 0;
      cameraZ = 0;
      cameraUpX = 0;
      cameraUpY = -1;
      cameraUpZ = 0;
      break;
    }
    case "top" :   {
      cameraX = 0;
      cameraY = cameraDistance;
      cameraZ = 0;
      cameraUpX = 0;
      cameraUpY = 0;
      cameraUpZ = -1;
      break;
    }
    case "bottom" :  {
      cameraX = 0;
      cameraY = -cameraDistance;
      cameraZ = 0;
      cameraUpX = 0;
      cameraUpY = 0;
      cameraUpZ = 1;
      break;
    }
  };
  
  canvasList[projectionId].camera(cameraX, cameraY, cameraZ, 0, 0, 0, cameraUpX, cameraUpY, cameraUpZ);
  canvasList[projectionId].background(200);
  
  //for coloring selected unique edges and vertex
  var loopId = Math.random();
  for(var i=0; i<model.getGroupList().length; i++) {
    var group = model.getGroupList()[i];
    if(group.visible) {
      var groupVertexList = model.getVertexList(group.id);
      for(var j=0; j<groupVertexList.length; j++) {
        addUniqueVertex(groupVertexList[j], loopId); 
        addUniqueEdge(groupVertexList[j], groupVertexList[(j+1)%groupVertexList.length], loopId, group.selected);
      }
    }
  } 

  for(var i=0; i<model.getGroupList().length; i++) {
    var group = model.getGroupList()[i];
    if(group.visible) {
      var groupVertexList = model.getVertexList(group.id);
      if(projectionData.projections[getProjectionIndex(projectionId)].drawMode == 'wireframe') {
        canvasList[projectionId].noFill();
      }
      else if(group.color) {
        canvasList[projectionId].fill(group.color);
      }
      
      canvasList[projectionId].beginShape();
      //canvasList[projectionId].beginShape(canvasList[projectionId].QUADS);
      if(projectionData.projections[getProjectionIndex(projectionId)].wireframeOverlay) {
        canvasList[projectionId].strokeWeight(5);
        canvasList[projectionId].stroke(wireframeColor);
      } else {
        canvasList[projectionId].noStroke();
      }
      for(var j=0; j<groupVertexList.length; j++) {
        var vertex =groupVertexList[j];
        canvasList[projectionId].vertex(vertex.x, vertex.y, vertex.z);  
      }
      var vertex = groupVertexList[0];
      if(!vertex) {
        console.log("groupId " + group.id);
      }
      canvasList[projectionId].vertex(vertex.x, vertex.y, vertex.z); 
      canvasList[projectionId].endShape();
    }
 
  }

  if(projectionData.projections[getProjectionIndex(projectionId)].wireframeOverlay) {
    canvasList[projectionId].stroke(selectedWireframeColor);
    for(var key in uniqueEdgeData) {
      var edge = uniqueEdgeData[key];
      if(edge.selected) {
        canvasList[projectionId].line(edge.x1, edge.y1, edge.z1, edge.x2, edge.y2, edge.z2);
      }
      
    }
    for(var key in uniqueVertexData) {
      var vertex = uniqueVertexData[key];
      canvasList[projectionId].stroke(vertex.selected ? selectedWireframeColor : wireframeColor);
      canvasList[projectionId].point(vertex.x, vertex.y, vertex.z);
    }
  }

  if(projectionData.projections[getProjectionIndex(projectionId)].showAxis) {
    canvasList[projectionId].stroke('red');
    canvasList[projectionId].line(0,0,0,this.axisLength,0,0);
    canvasList[projectionId].stroke('green');
    canvasList[projectionId].line(0,0,0,0,this.axisLength,0);
    canvasList[projectionId].stroke('blue');
    canvasList[projectionId].line(0,0,0,0,0,this.axisLength);
  }
}

function addUniqueVertex(vertex, loopId) {
  id = vertex.x.toFixed(2) + "-" + vertex.y.toFixed(2) + "-" + vertex.z.toFixed(2);
  if(!uniqueVertexData[id]) {
    uniqueVertexData[id] = { 'x':vertex.x, 'y':vertex.y, 'z':vertex.z, 'loopId':loopId};
  } 
  if(uniqueVertexData[id].loopId != loopId) {
    uniqueVertexData[id].loopId = loopId;
    uniqueVertexData[id].selected = vertex.selected;
  } else if(vertex.selected) {
    uniqueVertexData[id].selected = true;
  }
}


function createUniqueEdgeId(vertex1, vertex2) {
  return vertex1.x.toFixed(2) + "-" + vertex1.y.toFixed(2) + "-" + vertex1.z.toFixed(2) + "-" + vertex2.x.toFixed(2) + "-" + vertex2.y.toFixed(2) + "-" + vertex2.z.toFixed(2);
}
function checkUniqueEdgeSelected(vertex1, vertex2) {
  return uniqueEdgeData[createUniqueEdgeId(vertex1, vertex2)].selected;
}
function addUniqueEdge(vertex1, vertex2, loopId, selected) {
  id = createUniqueEdgeId(vertex1, vertex2);
  if(!uniqueEdgeData[id]) {
    uniqueEdgeData[id] = {'x1':vertex1.x, 'y1':vertex1.y, 'z1':vertex1.z, 'x2':vertex2.x, 'y2':vertex2.y, 'z2':vertex2.z, 'loopId':loopId};
  }
  if(uniqueEdgeData[id].loopId != loopId) {
    uniqueEdgeData[id].loopId = loopId;
    uniqueEdgeData[id].selected = selected;
  } else if(selected) {
    uniqueEdgeData[id].selected = true;
  }

}



function resize() {
  canvasList[0].resizeCanvas(screenWidth-rightPanelWidth-leftPanelWidth, screenHeight-bottomPanelHeight-topPanelHeight, canvasList[0]);
  for(var i=1; i<canvasList.length; i++) {
      canvasList[i].resizeCanvas(((screenWidth-rightPanelWidth-leftPanelWidth)/2)-(seperatorWidth/2), ((screenHeight-bottomPanelHeight-topPanelHeight)/2)-(seperatorWidth/2), canvasList[i].WEBGL);  
  }
}