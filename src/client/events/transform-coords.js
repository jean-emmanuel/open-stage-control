/*

  Adapted from https://gist.github.com/Yaffle/1145197#file-convertpointfrompagetonode-js

  Disabled for now

*/


var I = new WebKitCSSMatrix()

function Point(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
}

Point.prototype.transformBy = function(matrix) {
    var tmp = matrix.multiply(I.translate(this.x, this.y, this.z))
    return new Point(tmp.m41, tmp.m42, tmp.m43)
}

function getTransformationMatrix(w) {

    var transformationMatrix = I,
        node = w

    while (node) {
        if (node._ignore_css_transforms) break
        if (node._drag_widget) {

            var transform = node._drag_widget.cssTransform || 'none',
                c = transform === 'none' ? I : new WebKitCSSMatrix(transform)

            transformationMatrix = c.multiply(transformationMatrix)

        }
        node = node.parentNode

    }

    transformationMatrix = I.multiply(transformationMatrix)

    return transformationMatrix

}

export default function cssTransformCoords(node, x, y) {

    return new Point(x, y, 0).transformBy(getTransformationMatrix(node).inverse())

}
