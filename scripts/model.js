var model = {
    vertexIndex : 0,
    vertexList : [],
    groupIndex : 0,
    groupList : [],
    

    init : function() {

    },

    addVertex : function(x, y, z) {
        var vertex = {
            x : x,
            y : y,
            z : z,
            id : this.vertexIndex++,
            selected : true,
            groupId : -1,
        };
        this.vertexList.push(vertex);
        return vertex.id;
    },

    getVertex : function(id) {
        for(var i=0; i<this.vertexList.length; i++) {
            if(this.vertexList[i].id == id) {
                return this.vertexList[i];
            }
        }
        return {};
    },

    getSelectedVertexlist : function(selectedGroupList) {
        var vertexList = [];
        for(var i=0; i<selectedGroupList.length; i++) {
            for(var j=0; j<this.vertexList.length; j++) {
                var vertex = this.vertexList[j];
                if(vertex.groupId == selectedGroupList[i].id) {
                    vertexList.push(vertex);
                }
            }
        }
        return vertexList;
    },

    getVertexList : function(groupId) {
        if(groupId>-1) {
            return this.getSelectedVertexlist([{id:groupId}]);
        } else {
            var selectedGroupList = this.getSelectedGroupList();
            return this.getSelectedVertexlist(selectedGroupList.length == 0 ? [{id:-1}] : selectedGroupList);
        }
        
    },


    getSelectedGroupList : function() {
        var selectedGroupList = [];
        for(var i=0; i<this.groupList.length; i++) {
            if(this.groupList[i].selected) {
                selectedGroupList.push(this.groupList[i]);
            }
        }
        return selectedGroupList;
    },

    addGroup : function(vertexIdList, properties) {
        this.selectAll(false);
        var group = {
            id: this.groupIndex++,
            color : properties && properties.color ? properties.color : 255,
            vertexCount : vertexIdList.length,
            selected : true,
            visible : true,
        };
        this.groupList.push(group);
        for(var i=0; i<vertexIdList.length; i++) {
            this.getVertex(vertexIdList[i]).groupId = group.id;
            this.getVertex(vertexIdList[i]).selected = true;
        }
        return group.id;
    },

    getGroupList : function() {
        return this.groupList;
    },

    getGroup : function(id) {
        for(var i=0; i<this.groupList.length; i++) {
            if(this.groupList[i].id == id) {
                return this.groupList[i];
            }
        }
        return {};
    },

    selectAllGroup : function(checked) {
        for(var i=0; i<this.groupList.length; i++) {
            this.selectGroup(this.groupList[i].id, checked);
        }
    },

    selectGroup : function(groupId, checked) {
        var group = this.getGroup(groupId);
        group.selected = checked;
        var vertexList = this.getVertexList(groupId);
        for(var i=0; i<vertexList.length; i++) {
            vertexList[i].selected = checked;
        }
    },

    selectAllVertex : function(checked) {
        for(var i=0; i<this.vertexList.length; i++) {
            this.vertexList[i].selected = checked;
        }
    },

    selectAll : function(checked) {
        this.selectAllGroup(checked);
        this.selectAllVertex(checked);
    }

}