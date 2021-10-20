var drawmode = 'draw';
var currentColor = "black";
var width = 5;

var squarebegin = { x: 0, y: 0 };

var selectionstart = { x: 0, y: 0 };
var selectionend = { x: 0, y: 0 };

var undotree = [];
var undo_number = -1;
var curveon = false;

(function() {

    var canvas = document.querySelector('#editor');

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "white"; // white is background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));


    // Creating a tmp canvas
    var tmp_canvas = document.createElement('canvas');
    var tmp_ctx = tmp_canvas.getContext('2d');
    tmp_canvas.id = 'tmp_canvas';
    tmp_canvas.width = canvas.width;
    tmp_canvas.height = canvas.height;
    tmp_canvas.style = `  display: flex; flex-flow: column; height: 90vh; width: 100%; cursor: crosshair; `;

    sketch.appendChild(tmp_canvas);


    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    // Pencil Points
    var ppts = [];

    /* Mouse Capturing Work */
    tmp_canvas.addEventListener('mousemove', function(e) {
        mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    }, false);


    /* Drawing on Paint App */
    tmp_ctx.lineWidth = width;
    tmp_ctx.lineJoin = 'round';
    tmp_ctx.lineCap = 'round';
    tmp_ctx.strokeStyle = currentColor;
    tmp_ctx.fillStyle = currentColor;
    tmp_canvas.oncontextmenu = function() {

        return false; // cancel default menu
    }

    window.onresize = function() {
        tmp_canvas.width = canvas.width;
        tmp_canvas.height = canvas.height;
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    }



    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    tmp_ctx.closePath();

    // Emptying up Pencil Points
    ppts = [];
    tmp_ctx.lineWidth = width;
    tmp_ctx.strokeStyle = currentColor;
    tmp_ctx.fillStyle = currentColor;
    ctx.globalCompositeOperation = "source-over";
    tmp_ctx.globalCompositeOperation = "source-over";

    document.getElementById('tool').addEventListener('change', function() {

        drawmode = this.value;

        switch (drawmode) {

            case "draw":
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                tmp_ctx.closePath();

                // Emptying up Pencil Points
                ppts = [];
                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "erase":
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                tmp_ctx.closePath();

                // Emptying up Pencil Points
                ppts = [];
                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = 'white';
                tmp_ctx.fillStyle = 'white';
                tmp_ctx.globalCompositeOperation = "destination-over";
                ctx.globalCompositeOperation = "destination-out";
                break;
            case "square":
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                tmp_ctx.closePath();

                // Emptying up Pencil Points
                ppts = [];
                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "circle":
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                tmp_ctx.closePath();

                // Emptying up Pencil Points
                ppts = [];
                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "spray":
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                tmp_ctx.closePath();

                // Emptying up Pencil Points
                ppts = [];
                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "select":
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                tmp_ctx.closePath();

                // Emptying up Pencil Points
                ppts = [];
                tmp_ctx.lineWidth = 5;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
        }


    });
    document.getElementById('size').addEventListener('change', function() {
        width = parseInt(this.value);
    });





    tmp_canvas.addEventListener('mousedown', function(e) {
        undotree.push(canvas.toDataURL("image/png"));
        undo_number += 1;
        if (drawmode == 'spray') {
            if (!curveon) {
                curveon = true;

            } else {
                if (event.detail == 2) {
                    curveon = false;
                }
            }
        } else if (drawmode == 'square') {
            squarebegin.x = mouse.x;
            squarebegin.y = mouse.y;
        } else if (drawmode == 'circle') {
            squarebegin.x = mouse.x;
            squarebegin.y = mouse.y;
        } else if (drawmode == 'perfectcircle') {
            squarebegin.x = mouse.x;
            squarebegin.y = mouse.y;
        } else if (drawmode == 'squarefill') {

            squarebegin.x = mouse.x;
            squarebegin.y = mouse.y;
            tmp_ctx.lineWidth = 1;
        } else if (drawmode == 'select') {
            squarebegin.x = mouse.x;
            squarebegin.y = mouse.y;
            selectionstart.x = mouse.x;
            selectionstart.y = mouse.y;
        } else {
            squarebegin.x = mouse.x;
            squarebegin.y = mouse.y;
        }

        tmp_canvas.addEventListener('mousemove', onPaint, false);

        mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

        ppts.push({ x: mouse.x, y: mouse.y });

        onPaint();
    }, false);
    tmp_canvas.addEventListener('onkeydown', function(e) {
        console.log('keydown');

    });
    document.onkeydown = function(event) {
        if (event.ctrlKey && event.key === 'z') {
            tmp_ctx.lineWidth = width;
            tmp_ctx.strokeStyle = currentColor;
            tmp_ctx.fillStyle = currentColor;
            ctx.globalCompositeOperation = "source-over";
            tmp_ctx.globalCompositeOperation = "source-over";
            base_image = new Image();
            base_image.src = undotree[undo_number];
            base_image.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(base_image, 0, 0);
            };
            console.log("undo");
            undotree.shift(undo_number);
            undo_number -= 1;

        }
        if (event.keyCode == 46) {
            if (drawmode == 'select') {
                undotree.push(canvas.toDataURL("image/png"));
                undo_number += 1;
                console.log('removed');
                ctx.clearRect(selectionstart.x, selectionstart.y, selectionend.x - squarebegin.x, selectionend.y - squarebegin.y);
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                //tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y);
            }
        }
    }
    tmp_canvas.addEventListener('mouseup', function() {
        tmp_ctx.setLineDash([]);
        if (drawmode == 'squarefill') {
            tmp_ctx.lineCap = "round";
            tmp_ctx.strokeStyle = currentColor;
            tmp_ctx.fillStyle = currentColor;
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
            tmp_ctx.setLineDash([]);
            tmp_ctx.fillRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y);
        }



        tmp_canvas.removeEventListener('mousemove', onPaint, false);
        if (drawmode == 'select') {


            selectionend.x = mouse.x;
            selectionend.y = mouse.y;
            tmp_ctx.closePath();

            return;
        }
        // Writing down to real canvas now
        ctx.drawImage(tmp_canvas, 0, 0);
        // Clearing tmp canvas

        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);


        // Emptying up Pencil Points
        ppts = [];

    }, false);


    function clear() {
        tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }

    $('#canvasclear').on('click', clear);

    var onPaint = function() {

        switch (drawmode) {

            case "draw":

                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "erase":

                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = 'white';
                tmp_ctx.fillStyle = 'white';
                tmp_ctx.globalCompositeOperation = "destination-over";
                ctx.globalCompositeOperation = "destination-out";
                break;
            case "square":

                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "circle":

                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "spray":

                tmp_ctx.lineWidth = width;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
            case "select":

                tmp_ctx.lineWidth = 5;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;

            default:

                tmp_ctx.lineWidth = 5;
                tmp_ctx.strokeStyle = currentColor;
                tmp_ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = "source-over";
                tmp_ctx.globalCompositeOperation = "source-over";
                break;
        }



        if (drawmode == 'draw') {
            tmp_ctx.lineWidth = width;
            // Saving all the points in an array
            tmp_ctx.lineCap = "round";
            // Saving all the points in an array
            ppts.push({ x: mouse.x, y: mouse.y });

            if (ppts.length < 3) {
                var b = ppts[0];
                tmp_ctx.beginPath();
                //ctx.moveTo(b.x, b.y);
                //ctx.lineTo(b.x+50, b.y+50);
                tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                tmp_ctx.fill();
                tmp_ctx.closePath();

                return;
            }

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

            for (var i = 1; i < ppts.length - 2; i++) {
                var c = (ppts[i].x + ppts[i + 1].x) / 2;
                var d = (ppts[i].y + ppts[i + 1].y) / 2;

                tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
            }

            // For the last 2 points
            tmp_ctx.quadraticCurveTo(
                ppts[i].x,
                ppts[i].y,
                ppts[i + 1].x,
                ppts[i + 1].y
            );
            tmp_ctx.stroke();
        } else if (drawmode == 'erase') {
            tmp_ctx.lineWidth = width;
            // Saving all the points in an array

            // Saving all the points in an array
            ppts.push({ x: mouse.x, y: mouse.y });

            if (ppts.length < 3) {
                var b = ppts[0];
                tmp_ctx.beginPath();
                //ctx.moveTo(b.x, b.y);
                //ctx.lineTo(b.x+50, b.y+50);
                tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                tmp_ctx.fill();
                tmp_ctx.closePath();

                return;
            }

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

            for (var i = 1; i < ppts.length - 2; i++) {
                var c = (ppts[i].x + ppts[i + 1].x) / 2;
                var d = (ppts[i].y + ppts[i + 1].y) / 2;

                tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
            }

            // For the last 2 points
            tmp_ctx.quadraticCurveTo(
                ppts[i].x,
                ppts[i].y,
                ppts[i + 1].x,
                ppts[i + 1].y
            );
            tmp_ctx.stroke();
        } else if (drawmode == 'spray') {
            tmp_ctx.lineWidth = width;
            tmp_ctx.beginPath();


            ppts.push({ x: mouse.x, y: mouse.y });
            tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
            tmp_ctx.quadraticCurveTo(

                mouse.x,
                mouse.y,
                mouse.x + Math.cos(Math.random() * Math.PI * 2),
                mouse.y + Math.sin(Math.random() * Math.PI * 2)
            );


            if (curveon == true) {
                tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
                tmp_ctx.stroke();
            }
        } else if (drawmode == 'square') {
            tmp_ctx.lineWidth = width;
            tmp_ctx.strokeStyle = currentColor;
            tmp_ctx.fillStyle = currentColor;
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
            tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y);
        } else if (drawmode == 'squarefill') {


            tmp_ctx.lineWidth = width;
            tmp_ctx.lineCap = "square";
            tmp_ctx.strokeStyle = currentColor;
            tmp_ctx.lineWidth = 1;
            tmp_ctx.fillStyle = currentColor;
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
            tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y);
            tmp_ctx.setLineDash([5, 16]);

        } else if (drawmode == 'circle') {
            tmp_ctx.lineWidth = width;

            tmp_ctx.beginPath();
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);


            // tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y); //used for refrence point
            //   tmp_ctx.arc(squarebegin.x + getDistance(squarebegin.x, squarebegin.y, mouse.x, mouse.y), squarebegin.y + getDistance(squarebegin.x, squarebegin.y, mouse.x, mouse.y), getDistance(squarebegin.x, squarebegin.y, mouse.x, mouse.y), 0, 360, false);
            drawEllipse(squarebegin.x, squarebegin.y, mouse.x, mouse.y);
            console.log("X: " + (mouse.x - squarebegin.x).toString() + " | Y: " + (mouse.y - squarebegin.y).toString());

            tmp_ctx.stroke();
            tmp_ctx.closePath();



        } else if (drawmode == 'perfectcircle') {
            tmp_ctx.lineWidth = width;

            tmp_ctx.beginPath();
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);

            // tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y); //used for refrence point
            tmp_ctx.arc(squarebegin.x, squarebegin.y, getDistance(squarebegin.x, squarebegin.y, mouse.x, mouse.y), 0, 360, false);
            // drawEllipse(squarebegin.x, squarebegin.y, mouse.x, mouse.y);
            //   console.log("X: " + (mouse.x - squarebegin.x).toString() + " | Y: " + (mouse.y - squarebegin.y).toString());

            tmp_ctx.stroke();
            tmp_ctx.closePath();



        } else if (drawmode == 'perfectcirclefill') {
            tmp_ctx.lineWidth = width;

            tmp_ctx.beginPath();
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);

            // tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y); //used for refrence point
            tmp_ctx.arc(squarebegin.x, squarebegin.y, getDistance(squarebegin.x, squarebegin.y, mouse.x, mouse.y), 0, 360, false);
            tmp_ctx.fill();
            // drawEllipse(squarebegin.x, squarebegin.y, mouse.x, mouse.y);
            //   console.log("X: " + (mouse.x - squarebegin.x).toString() + " | Y: " + (mouse.y - squarebegin.y).toString());

            tmp_ctx.stroke();
            tmp_ctx.closePath();



        } else if (drawmode == 'circlefill') {
            tmp_ctx.lineWidth = width;

            tmp_ctx.beginPath();
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);

            // tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y); //used for refrence point
            //tmp_ctx.arc(squarebegin.x, squarebegin.y, getDistance(squarebegin.x, squarebegin.y, mouse.x, mouse.y), 0, 360, false);
            drawEllipse(squarebegin.x, squarebegin.y, mouse.x, mouse.y);
            tmp_ctx.fill();
            //   console.log("X: " + (mouse.x - squarebegin.x).toString() + " | Y: " + (mouse.y - squarebegin.y).toString());

            tmp_ctx.stroke();
            tmp_ctx.closePath();



        } else if (drawmode == 'select') {
            tmp_ctx.lineCap = "square";
            tmp_ctx.lineWidth = 1;
            tmp_ctx.strokeStyle = "#00599C";
            tmp_ctx.fillStyle = currentColor;
            tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
            tmp_ctx.strokeRect(mouse.x, mouse.y, squarebegin.x - mouse.x, squarebegin.y - mouse.y);
            tmp_ctx.setLineDash([5, 11]);


        }
    };

    function drawEllipse(x1, y1, x2, y2) {

        var radiusX = (x2 - x1) * 0.5, /// radius for x based on input
            radiusY = (y2 - y1) * 0.5, /// radius for y based on input
            centerX = x1 + radiusX, /// calc center
            centerY = y1 + radiusY,
            step = 0.01, /// resolution of ellipse
            a = step, /// counter
            pi2 = Math.PI * 2 - step; /// end angle

        /// start a new path
        tmp_ctx.beginPath();

        /// set start point at angle 0
        tmp_ctx.moveTo(centerX + radiusX * Math.cos(0),
            centerY + radiusY * Math.sin(0));

        /// create the ellipse    
        for (; a < pi2; a += step) {
            tmp_ctx.lineTo(centerX + radiusX * Math.cos(a),
                centerY + radiusY * Math.sin(a));
        }

        /// close it and stroke it for demo
        tmp_ctx.closePath();
        tmp_ctx.stroke();
    }

    function getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

}());

//color picker


// Simple example, see optional options for more configuration.
var pickr = Pickr.create({
    el: '#colorpicker',
    theme: 'nano', // or 'monolith', or 'nano'

    default: "black",

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],


    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            save: true
        },
        // Main components
        preview: true,
        opacity: true,
        hue: true,
    }
});



pickr.on('init', (color, instance) => {
    console.log('Event: "init"', instance);
    //   currentColor = color.toHEXA().toString();
}).on('hide', instance => {
    console.log('Event: "hide"', instance);
}).on('save', (color, instance) => {
    console.log('Event: "save"', color, instance);
    currentColor = color.toHEXA().toString();
    instance.hide();
}).on('clear', instance => {
    console.log('Event: "clear"', instance);
}).on('change', (color, source, instance) => {
    console.log('Event: "change"', color, source, instance);
    currentColor = color.toHEXA().toString();
}).on('changestop', (source, instance) => {
    console.log('Event: "changestop"', source, instance);
}).on('cancel', instance => {
    console.log('Event: "cancel"', instance);
}).on('swatchselect', (color, instance) => {
    console.log('Event: "swatchselect"', color, instance);
    currentColor = color;
});