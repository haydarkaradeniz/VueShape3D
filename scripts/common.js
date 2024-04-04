var common = {
    canvasLeft : 0,
    canvasTop : 0,
    canvasWidth : 0,
    canvasHeight : 0,
    seperatorWidth : 0,

    init : function (canvasLeft, canvasTop, canvasWidth, canvasHeight, seperatorWidth) {
        this.canvasLeft = canvasLeft;
        this.canvasTop = canvasTop;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.seperatorWidth = seperatorWidth;
    },

    checkInCanvas : function (clientX, clientY) {
        return (clientX > this.canvasLeft && clientX < (this.canvasLeft + this.canvasWidth) && clientY > this.canvasTop && clientY < (this.canvasTop + this.canvasHeight));
    },

    checkInArea : function (clientX, clientY, left, top, width, height) {
        return (clientX > left && clientX < (left + width) && clientY > top && clientY < (top + height));
    },

    retrieveCanvasIndex(clientX, clientY) {
        if(clientX > this.canvasLeft && clientX < ((this.canvasLeft + this.canvasWidth - this.seperatorWidth)/2) && clientY > this.canvasTop && clientY < ((this.canvasTop + this.canvasHeight - this.seperatorWidth)/2)) {
            return 0;
        } else if(clientX > ((this.canvasLeft + this.canvasWidth + this.seperatorWidth)/2) && clientX < (this.canvasLeft + this.canvasWidth) && clientY > this.canvasTop && clientY < ((this.canvasTop + this.canvasHeight - this.seperatorWidth)/2)) {
            return 1;
        } else if(clientX > this.canvasLeft && clientX < ((this.canvasLeft + this.canvasWidth - this.seperatorWidth)/2) && clientY > ((this.canvasTop + this.canvasHeight + this.seperatorWidth)/2) && clientY < (this.canvasTop + this.canvasHeight)) {
            return 2;
        } else if(clientX > ((this.canvasLeft + this.canvasWidth + this.seperatorWidth)/2) && clientX < (this.canvasLeft + this.canvasWidth) && clientY > ((this.canvasTop + this.canvasHeight + this.seperatorWidth)/2) && clientY < (this.canvasTop + this.canvasHeight)) {
            return 3;
        } else {
            return -1;
        }
    },

    getCenterPoint(clientX, clientY, maximized) {
        if(maximized) {
            return {
                x : this.canvasLeft + (this.canvasWidth/2),
                y : this.canvasTop + (this.canvasHeight/2)
            }
        } else {
            var canvasIndex = this.retrieveCanvasIndex(clientX, clientY);
            if(canvasIndex == 0) {
                return {
                    x : this.canvasLeft + (this.canvasWidth/4) - (this.seperatorWidth/4),
                    y : this.canvasTop + (this.canvasHeight/4) - (this.seperatorWidth/4),
                }
            } else if(canvasIndex == 1) {
                return {
                    x : this.canvasLeft + (this.canvasWidth*3/4) + (this.seperatorWidth/4),
                    y : this.canvasTop + (this.canvasHeight/4) - (this.seperatorWidth/4),
                }
            } else if(canvasIndex == 2) {
                return {
                    x : this.canvasLeft + (this.canvasWidth/4) - (this.seperatorWidth/4),
                    y : this.canvasTop + (this.canvasHeight*3/4) + (this.seperatorWidth/4),
                }
            } else if(canvasIndex == 3) {
                return {
                    x : this.canvasLeft + (this.canvasWidth*3/4) + (this.seperatorWidth/4),
                    y : this.canvasTop + (this.canvasHeight*3/4) + (this.seperatorWidth/4),
                }
            }
        }

    }

}