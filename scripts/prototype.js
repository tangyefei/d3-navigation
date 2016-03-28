(function(window){
    'use strict'
      function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
      }

      function Vector(x, y) {
        this.x = x;
        this.y = y;
      };

      Vector.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      };

      Vector.prototype.getRotateAngle = function(toVector) {
        var epsilon = 1.0e-6;
        var angle = 0;
        var norVec1 = new Vector(0, 0),
         norVec2 = new Vector(0, 0);

        norVec1.x = this.x / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        norVec1.y = this.y / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        norVec2.x = toVector.x / Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y, 2));
        norVec2.y = toVector.y / Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y, 2));

        var dotProd = (norVec1.x * norVec2.x) + (norVec1.y * norVec2.y);
        if (Math.abs(dotProd - 1.0) <= epsilon) {
         angle = 0;
        } else if (Math.abs(dotProd + 1.0) <= epsilon) {
         angle = Math.PI;
        } else {
         var cross = 0;
         angle = Math.acos(dotProd);
         cross = (norVec1.x * norVec2.y) - (norVec2.x * norVec1.y);
         if (cross < 0) // this rotate clockwise to toVector
           angle = 2 * Math.PI - angle;
        }

        return angle * (180 / Math.PI);
      }

      Vector.prototype.getOffsetAngle = function() {
        var meta = new Vector(1, 0);
        var angle = meta.getRotateAngle(this);
        var angle = (angle > 180 ? (angle - 360) : angle);

        return angle;
      }

      window.Point = Point;
      window.Vector = Vector;
})(window);