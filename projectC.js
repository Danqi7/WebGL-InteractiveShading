var VSHADER_SOURCE =
  
  'precision highp float;\n' +
  'precision highp int;\n' +

  //====================structs====================
  'struct LampT {\n' +    // Describes one point-like Phong light source
  '   vec3 pos;\n' +      // (x,y,z,w); w==1.0 for local light at x,y,z position
                          //       w==0.0 for distant light from x,y,z direction 
  '   vec3 ambi;\n' +     // Ia ==  ambient light source strength (r,g,b)
  '   vec3 diff;\n' +     // Id ==  diffuse light source strength (r,g,b)
  '   vec3 spec;\n' +     // Is == specular light source strength (r,g,b)
  '}; \n' +

	'struct MatlT {\n' +		
	'		vec3 emit;\n' +			
	'		vec3 ambi;\n' +			
	'		vec3 diff;\n' +			
	'		vec3 spec;\n' + 		
	'		int shiny;\n' +	
  '		};\n' +
  //====================structs====================
	

  'attribute vec4 a_Position; \n' +		
  'attribute vec4 a_Normal; \n' +	


  //====================light====================
  'uniform LampT u_LampSet[2];\n' +
  //====================light====================


  //====================material====================
  'uniform MatlT u_MatlSet[1];\n' +
  //====================material====================


  //====================shading/lighting mode====================
  'uniform int SLmode;\n' +
  //====================shading/lighting mode====================



  'uniform vec3 u_eyePosWorld; \n' +

  'uniform mat4 u_ModelMatrix; \n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' + 		
  'uniform mat4 u_NormalMatrix; \n' +   //transformation matrix


  'varying vec4 v_Color;\n' +
  'varying vec3 v_Kd; \n' +
  'varying vec4 v_Position; \n' +
  'varying vec3 v_Normal; \n' +

  'void main() {\n' +

  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +

  //====================Gouraud Shading && Blinn-Phong Lighting====================

  '  if(SLmode==1){\n' +


  '    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+

  '    vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +

  '    vec3 lightDirection = normalize(u_LampSet[0].pos - vec3(vertexPosition));\n' +

  '    vec3 lightDirection1 = normalize(u_LampSet[1].pos - vec3(vertexPosition));\n' +

  '    vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +


  '    float nDotL = max(dot(lightDirection, normal), 0.0);\n'+

  '    float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +

  '  vec3 H = normalize(lightDirection + eyeDirection); \n' +

  '  float nDotH = max(dot(H, normal), 0.0); \n' +

  '  vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +

  '  float nDotH1 = max(dot(H1, normal), 0.0); \n' +

  '  float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

  '  float e641 = pow(nDotH1, float(u_MatlSet[0].shiny));\n' +

  '  vec3 emissive = u_MatlSet[0].emit;' +

  '  vec3 ambient = (u_LampSet[0].ambi + u_LampSet[1].ambi) * u_MatlSet[0].ambi;\n' +

  '  vec3 diffuse = u_LampSet[0].diff  * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotH1;\n' +

  '  vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e641;\n' +

  '  v_Color = vec4(emissive + ambient + diffuse + speculr, 1.0);\n' +


  '  }\n'+
   //====================Gouraud Shading && Blinn-Phong Lighting====================


    //====================Gouraud Shading && Phong Lighting====================

  '  if(SLmode==2){\n' +


  '    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+

  '    vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +

  '    vec3 lightDirection = normalize(u_LampSet[0].pos - vec3(vertexPosition));\n' +

  '    vec3 lightDirection1 = normalize(u_LampSet[1].pos - vec3(vertexPosition));\n' +

  '    float d = length(lightDirection);\n' +

  '    float d1 = length(lightDirection1);\n' +

  '    float nDotL = max(dot(lightDirection, normal), 0.0);\n'+

  '    float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +


  '  vec3 L = lightDirection;\n' +

  '  vec3 V = -vec3(vertexPosition);\n' +

  '  vec3 l = normalize(L);\n' +

  '  vec3 n = normal;\n' +

  '  vec3 v = normalize(V);\n' +

  '  vec3 R = reflect(l, n);\n' +


  '  vec3 L1 = lightDirection1;\n' +

  '  vec3 V1 = -vec3(vertexPosition);\n' +

  '  vec3 l1 = normalize(L1);\n' +

  '  vec3 n1 = normal;\n' +

  '  vec3 v1 = normalize(V1);\n' +

  '  vec3 R1 = reflect(l1, n1);\n' +




  '  float shininess = float(u_MatlSet[0].shiny);\n' +

  '  float specular = pow( max(0.0,dot(R,v)), shininess/4.0);\n' +

  '  float specular1 = pow( max(0.0,dot(R1,v1)), shininess/4.0);\n' +


  '  vec3 emissive = u_MatlSet[0].emit;' +

  '  vec3 ambient = (u_LampSet[0].ambi + u_LampSet[1].ambi) * u_MatlSet[0].ambi;\n' +

  '  vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotL1; \n' +

  '  vec3 speculr = u_LampSet[0].spec  * u_MatlSet[0].spec * specular + u_LampSet[1].spec * u_MatlSet[0].spec * specular1;\n' +

  '  v_Color = vec4(emissive + ambient + diffuse + speculr, 1.0);\n' +

  '  }\n'+
   //====================Gouraud Shading && Phong Lighting====================





   //====================Phong Shading && Blinn-Phong Lighting====================
  '  if(SLmode==3){\n' +

  '  v_Position = u_ModelMatrix * a_Position; \n' +

  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +

  '  v_Kd = u_MatlSet[0].diff; \n' +  

  '  }\n'+
    //====================Phong Shading && Blinn-Phong Lighting====================



   //====================Phong Shading && Phong Lighting====================
  '  if(SLmode==4){\n' +

  '  v_Position = u_ModelMatrix * a_Position; \n' +

  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +

  '  v_Kd = u_MatlSet[0].diff; \n' +  

  '  }\n'+
    //====================Phong Shading && Phong Lighting====================

  

  '}\n';


// Fragment shader program
var FSHADER_SOURCE =

  'precision highp float;\n' +
  'precision highp int;\n' +
  
//====================structs====================
  'struct LampT {\n' +    // Describes one point-like Phong light source
  '   vec3 pos;\n' +      // (x,y,z,w); w==1.0 for local light at x,y,z position
                          //       w==0.0 for distant light from x,y,z direction 
  '   vec3 ambi;\n' +     // Ia ==  ambient light source strength (r,g,b)
  '   vec3 diff;\n' +     // Id ==  diffuse light source strength (r,g,b)
  '   vec3 spec;\n' +     // Is == specular light source strength (r,g,b)
  '}; \n' +

  'struct MatlT {\n' +    
  '   vec3 emit;\n' +     
  '   vec3 ambi;\n' +     
  '   vec3 diff;\n' +     
  '   vec3 spec;\n' +     
  '   int shiny;\n' + 
  '   };\n' +
  //====================structs====================


  //====================light====================
  'uniform LampT u_LampSet[2];\n' +
  //====================light====================


  //====================material====================
  'uniform MatlT u_MatlSet[1];\n' +
  //====================material====================


  //====================shading/lighting mode====================
  'uniform int SLmode;\n' +
  //====================shading/lighting mode====================


  'uniform vec3 u_eyePosWorld; \n' +



  'varying vec4 v_Color;\n' +

  'varying vec3 v_Normal;\n' +  

  'varying vec4 v_Position;\n' +  

  'varying vec3 v_Kd; \n' + 


  'void main() { \n' +

  //====================Gouraud Shading && Blinn-Phong Lighting====================

  '  if(SLmode==1){\n' +

  '    gl_FragColor = v_Color;\n'+

  '  }\n'+
  //====================Gouraud Shading && Blinn-Phong Lighting====================


  //====================Gouraud Shading && Phong Lighting====================  
  '  if(SLmode==2){\n' +

  '    gl_FragColor = v_Color;\n'+

  '  }\n'+
  //====================Gouraud Shading && Phong Lighting====================  




   //====================Phong Shading && Blinn-Phong Lighting====================


  '  if(SLmode==3){\n' +


  '    vec3 normal = normalize(v_Normal);\n'+

  '    vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +

  '    vec3 lightDirection1 = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +

  '    vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +



  '    float nDotL = max(dot(lightDirection, normal), 0.0);\n'+

  '    float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +

  '  vec3 H = normalize(lightDirection + eyeDirection); \n' +

  '  float nDotH = max(dot(H, normal), 0.0); \n' +

  '  vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +

  '  float nDotH1 = max(dot(H1, normal), 0.0); \n' +

  '  float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

  '  float e641 = pow(nDotH1, float(u_MatlSet[0].shiny));\n' +

  '  vec3 emissive = u_MatlSet[0].emit;' +

  '  vec3 ambient = (u_LampSet[0].ambi + u_LampSet[1].ambi) * u_MatlSet[0].ambi;\n' +

  '  vec3 diffuse = u_LampSet[0].diff  * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotH1;\n' +

  '  vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e641;\n' +

  '  gl_FragColor = vec4(emissive + ambient + diffuse + speculr, 1.0);\n' +


  '  }\n'+

   //====================Phong Shading && Blinn-Phong Lighting====================


    //====================Phong Shading && Phong Lighting====================

  '  if(SLmode==4){\n' +

  '    vec3 normal = normalize(v_Normal);\n'+

  '    vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +

  '    vec3 lightDirection1 = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +

  '    float d = length(lightDirection);\n' +

  '    float d1 = length(lightDirection1);\n' +

  '    float nDotL = max(dot(lightDirection, normal), 0.0);\n'+

  '    float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +


  '  vec3 L = lightDirection;\n' +

  '  vec3 V = -vec3(v_Position);\n' +

  '  vec3 l = normalize(L);\n' +

  '  vec3 n = normal;\n' +

  '  vec3 v = normalize(V);\n' +

  '  vec3 R = reflect(l, n);\n' +


  '  vec3 L1 = lightDirection1;\n' +

  '  vec3 V1 = -vec3(v_Position);\n' +

  '  vec3 l1 = normalize(L1);\n' +

  '  vec3 n1 = normal;\n' +

  '  vec3 v1 = normalize(V1);\n' +

  '  vec3 R1 = reflect(l1, n1);\n' +




  '  float shininess = float(u_MatlSet[0].shiny);\n' +

  '  float specular = pow( max(0.0,dot(R,v)), shininess/4.0);\n' +

  '  float specular1 = pow( max(0.0,dot(R1,v1)), shininess/4.0);\n' +


  '  vec3 emissive = u_MatlSet[0].emit;' +

  '  vec3 ambient = (u_LampSet[0].ambi + u_LampSet[1].ambi) * u_MatlSet[0].ambi;\n' +

  '  vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotL1; \n' +

  '  vec3 speculr = u_LampSet[0].spec  * u_MatlSet[0].spec * specular + u_LampSet[1].spec * u_MatlSet[0].spec * specular1;\n' +

  '  gl_FragColor = vec4(emissive + ambient + diffuse + speculr, 1.0);\n' +


  '  }\n'+


     //====================Phong Shading && Phong Lighting====================


  '}\n';



// REMAINING GLOBAL VARIABLES
var SLmode = false;   

// Global vars for mouse click-and-drag for rotation.
var isDrag=false;		// mouse-drag: true when user holds down mouse button
var xMclik=0.0;			// last mouse button-down position (in CVV coords)
var yMclik=0.0;   
var xMdragTot=0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var yMdragTot=0.0;  

// Global vars for 3D scene variables (previously used as arguments to draw() function)
var canvas 	= false;
var gl 			= false;
var n_vcount= false;	// formerly 'n', but that name is far too vague and terse
											// to use safely as a global variable.
											
//  Global vars that hold GPU locations for 'uniform' variables.
//		-- For 3D camera and transforms:
var uLoc_eyePosWorld 	= false;
var uLoc_ModelMatrix 	= false;
//var uLoc_MvpMatrix 		= false;
var uLoc_ViewMatrix = false;
var uLoc_projMatrix = false;
var uLoc_NormalMatrix = false;

// global vars that contain the values we send thru those uniforms,
//  ... for our camera:
var	eyePosWorld = new Float32Array(3);	// x,y,z in world coords
//  ... for our transforms:
var modelMatrix = new Matrix4();  // Model matrix
var	mvpMatrix 	= new Matrix4();	// Model-view-projection matrix
var	normalMatrix= new Matrix4();	// Transformation matrix for normals

var ViewMatrix = new Matrix4();
var projMatrix = new Matrix4();

//	... for our first light source:   (stays false if never initialized)
var lamp0 = new LightsT();
var lamp1 = new LightsT();



var floatsPerVertex = 8;
var ANGLE_STEP = 45.0;
var currentAngle = 0;
var g_EyeX = 0.0, g_EyeY = 0.25, g_EyeZ = 4.25; 


//=============================================================================
function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context \'gl\' for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  SLmode = gl.getUniformLocation(gl.program, 'SLmode');
   if (!SLmode) { 
    console.log('Failed to Get the storage locations of SLmode');
    return;
  }
  slmode = 4;
  gl.uniform1i(SLmode,slmode);

  n_vcount = initVertexBuffers(gl);   // vertex count.
  if (n_vcount < 0) {
    console.log('Failed to set the vertex information: n_vcount false');
    return;
  } 
 

  // Set the clear color and enable the depth test
  gl.clearColor(0.4, 0.4, 0.4, 1.0);
  gl.enable(gl.DEPTH_TEST);


  canvas.onmousedown	=	function(ev){myMouseDown( ev, gl, canvas) }; 
  
  					// when user's mouse button goes down call mouseDown() function
  canvas.onmousemove = 	function(ev){myMouseMove( ev, gl, canvas) };
  
											// call mouseMove() function					
  canvas.onmouseup = 		function(ev){myMouseUp(   ev, gl, canvas)};
  					// NOTE! 'onclick' event is SAME as on 'mouseup' event
  					// in Chrome Brower on MS Windows 7, and possibly other 
  					// operating systems; use 'mouseup' instead.
  					
  // Next, register all keyboard events found within our HTML webpage window:
	window.addEventListener("keydown", myKeyDown, false);
	window.addEventListener("keyup", myKeyUp, false);
	window.addEventListener("keypress", myKeyPress, false);




  uLoc_eyePosWorld  = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
  uLoc_ModelMatrix  = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  //uLoc_MvpMatrix    = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  uLoc_ViewMatrix   = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  uLoc_projMatrix   = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  uLoc_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!uLoc_eyePosWorld ||
      !uLoc_ModelMatrix	|| !uLoc_ViewMatrix || !uLoc_NormalMatrix || !uLoc_projMatrix) {
  	console.log('Failed to get GPUs matrix storage locations');
  	return;
  	}
	//  ... for Phong light source:
	// NEW!  Note we're getting the location of a GLSL struct array member:

  lamp0.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[0].pos');	
  lamp0.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[0].ambi');
  lamp0.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[0].diff');
  lamp0.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[0].spec');
  if( !lamp0.u_pos || !lamp0.u_ambi	|| !lamp0.u_diff || !lamp0.u_spec	) {
    console.log('Failed to get GPUs Lamp0 storage locations');
    return;
  }

  lamp1.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[1].pos');	
  lamp1.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[1].ambi');
  lamp1.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[1].diff');
  lamp1.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[1].spec');
  if( !lamp1.u_pos || !lamp1.u_ambi	|| !lamp1.u_diff || !lamp1.u_spec	) {
    console.log('Failed to get GPUs Lamp1 storage locations');
    return;
  }

	// ... for Phong material/reflectance:
	matl0.uLoc_Ke = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
	matl0.uLoc_Ka = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
	matl0.uLoc_Kd = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
	matl0.uLoc_Ks = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
	matl0.uLoc_Kshiny = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');
	if(!matl0.uLoc_Ke || !matl0.uLoc_Ka || !matl0.uLoc_Kd 
			  	  		    || !matl0.uLoc_Ks || !matl0.uLoc_Kshiny
		 ) {
		console.log('Failed to get GPUs Reflectance storage locations');
		return;
	}
	// Position the camera in world coordinates:
	eyePosWorld.set([6.0, 0.0, 0.0]);
	gl.uniform3fv(uLoc_eyePosWorld, eyePosWorld);// use it to set our uniform
	// (Note: uniform4fv() expects 4-element float32Array as its 2nd argument)
	
  // Init World-coord. position & colors of first light source in global vars;
  lamp0.I_pos.elements.set( [6.0, 5.0, 5.0]);
  lamp0.I_ambi.elements.set([0.4, 0.4, 0.4]);
  lamp0.I_diff.elements.set([1.0, 1.0, 1.0]);
  lamp0.I_spec.elements.set([1.0, 1.0, 1.0]);

  // ( MOVED:  set the GPU's uniforms for lights and materials in draw()
  // 					function, not main(), so they ALWAYS get updated before each
  //					on-screen re-drawing)
  
  lamp1.I_pos.elements.set( [5.0, 4.0, 4.0]);
  lamp1.I_ambi.elements.set([0.4, 0.4, 0.4]);
  lamp1.I_diff.elements.set([1.0, 1.0, 1.0]);
  lamp1.I_spec.elements.set([1.0, 1.0, 1.0]);


	var tick = function() {
    currentAngle = animate(currentAngle);  
    winResize();
    //draw(gl, currentAngle, u_ViewMatrix, viewMatrix, ModelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix, projMatrix, u_ProjMatrix);   // Draw shapes
  // console.log('currentAngle=',currentAngle); // put text in console.
    requestAnimationFrame(tick, canvas);   
                      // Request that the browser re-draw the webpage
                      // (causes webpage to endlessly re-draw itself)
  };
  tick();
}

function winResize() {
//==============================================================================
// Called when user re-sizes their browser window , because our HTML file
// contains:  <body onload="main()" onresize="winResize()">

  var nuCanvas = document.getElementById('webgl');  // get current canvas
  // var nuGL = getWebGLContext(nuCanvas);             // and context:

  //Report our current browser-window contents:

  // console.log('nuCanvas width,height=', nuCanvas.width, nuCanvas.height);   
 // console.log('Browser window: innerWidth,innerHeight=', 
                                // innerWidth, innerHeight); // http://www.w3schools.com/jsref/obj_window.asp

  
  //Make canvas fill the top 3/4 of our browser window:
  nuCanvas.width = innerWidth; //Math.min(innerWidth, innerHeight*1.5);
  nuCanvas.height = Math.min(innerWidth/2, innerHeight*0.75);
  //IMPORTANT!  need to re-draw screen contents
  draw();
}

// Record the last time we called 'animate()':  (used for animation timing)
var g_last = Date.now();
function animate(angle) 
{
//==============================================================================
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  
  // Update the current rotation angle (adjusted by the elapsed time)
  //  limit the angle to move smoothly between +20 and -85 degrees:
  if(angle >  120.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
  if(angle < -120.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;
  
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

//matlSel1 = (matlSel +1)%MATL_DEFAULT;
//matlSel2 = (matlSel +1)%MATL_DEFAULT;

//matl0.setMatl(matlSel);// set new material reflectance	

// ... for our first material:
var matlSel0= MATL_RED_PLASTIC;				// see keypress(): 'm' key changes matlSel

var matl0 = new Material(matlSel0);

function draw() {
//-------------------------------------------------------------------------------
	// Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0,                              // Viewport lower-left corner
                0,                              // (x,y) location(in pixels)
              //gl.drawingBufferWidth/2,
              canvas.width,        // viewport width, height.
              //gl.drawingBufferHeight/2
              canvas.height);
  // Set the matrix to be used for to set the camera view
  ViewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ,  // eye position
                        0, 0, 0,                // look-at point (origin)
                        0, 1, 0);               // up vector (+y)
  lamp1.I_pos.elements.set([g_EyeX, g_EyeY, g_EyeZ]);

  gl.uniformMatrix4fv(uLoc_ViewMatrix, false, ViewMatrix.elements);
  // Calculate the view projection matrix
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  //projMatrix.lookAt(eyePosWorld[0], eyePosWorld[1], eyePosWorld[2], // eye pos
  	//								0,  0, 0, 				// aim-point (in world coords)
	//								  0,  0, 1);				// up (in world coords)
  gl.uniformMatrix4fv(uLoc_projMatrix, false, projMatrix.elements);


  // Send fresh 'uniform' values to the GPU:
	//---------------For the light source(s):
  gl.uniform3fv(lamp0.u_pos,  lamp0.I_pos.elements.slice(0,3));
  //		 ('slice(0,3) member func returns elements 0,1,2 (x,y,z) ) 
  gl.uniform3fv(lamp0.u_ambi, lamp0.I_ambi.elements);		// ambient
  gl.uniform3fv(lamp0.u_diff, lamp0.I_diff.elements);		// diffuse
  gl.uniform3fv(lamp0.u_spec, lamp0.I_spec.elements);		// Specular

  gl.uniform3fv(lamp1.u_pos,  lamp1.I_pos.elements.slice(0,3));
  //		 ('slice(0,3) member func returns elements 0,1,2 (x,y,z) ) 
  gl.uniform3fv(lamp1.u_ambi, lamp1.I_ambi.elements);		// ambient
  gl.uniform3fv(lamp1.u_diff, lamp1.I_diff.elements);		// diffuse
  gl.uniform3fv(lamp1.u_spec, lamp1.I_spec.elements);		// Specular
//	console.log('lamp0.u_pos',lamp0.u_pos,'\n' );
//	console.log('lamp0.I_diff.elements', lamp0.I_diff.elements, '\n');
	matl0.setMatl(matlSel0);// set new material reflectance
	//---------------For the Material object(s):
	gl.uniform3fv(matl0.uLoc_Ke, matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(matl0.uLoc_Ka, matl0.K_ambi.slice(0,3));				// Ka ambient
  gl.uniform3fv(matl0.uLoc_Kd, matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(matl0.uLoc_Ks, matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(matl0.uLoc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 
	//	== specular exponent; (parseInt() converts from float to base-10 integer).
// Test our Material object's values:
//	console.log('matl0.K_emit', matl0.K_emit.slice(0,3), '\n');
//	console.log('matl0.uLoc_Ke', matl0.uLoc_Ke, '\n'); //



  modelMatrix.setIdentity();
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  pushMatrix(modelMatrix);

  //==========arm base===========
  	
  //----------------For the Matrices: find the model matrix:
  modelMatrix.setTranslate(-0.5,-0.45,1.0);
  modelMatrix.rotate(currentAngle+25,0,1,0);
  modelMatrix.scale(0.3,0.3,0.3);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  // Send the new matrix values to their locations in the GPU:
  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  

  //gl.drawElements(gl.TRIANGLES, n_vcount, gl.UNSIGNED_SHORT, 0);
  gl.drawArrays(gl.TRIANGLES,
  				armStart/floatsPerVertex,
  				armVerts.length/floatsPerVertex);
  //=====second armbase=======
  modelMatrix.rotate(currentAngle*0.13, 0,0,1);
  modelMatrix.translate(0.0,0.85,0.0);
  modelMatrix.scale(0.7,0.7,0.7);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  
  gl.drawArrays(gl.TRIANGLES,
  				armStart/floatsPerVertex,
  				armVerts.length/floatsPerVertex);

  pushMatrix(modelMatrix);

  //=====upper1========
  modelMatrix.rotate(25,1,0,0);
  modelMatrix.translate(0.08,0.0,0.5);
  modelMatrix.scale(0.4,0.4,0.4);
  modelMatrix.rotate(currentAngle*0.3, 1,0,0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  
  gl.drawArrays(gl.TRIANGLES,
  				armStart/floatsPerVertex,
  				armVerts.length/floatsPerVertex);

  modelMatrix.translate(0.0,0.8,0.25);
  modelMatrix.scale(0.7,0.7,0.7);
  modelMatrix.rotate(45,1,0,0);
  modelMatrix.rotate(currentAngle*0.45, 0,1,0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  
  gl.drawArrays(gl.TRIANGLES,
  				armStart/floatsPerVertex,
  				armVerts.length/floatsPerVertex);
  //====upper2=========
  modelMatrix = popMatrix();

  modelMatrix.rotate(-25,1,0,0);
  modelMatrix.translate(0.08,0.0,-0.5);
  modelMatrix.scale(0.4,0.4,0.4);
  modelMatrix.rotate(-currentAngle*0.3, 1,0,0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  
  gl.drawArrays(gl.TRIANGLES,
  				armStart/floatsPerVertex,
  				armVerts.length/floatsPerVertex);

  modelMatrix.translate(0.0,0.8,-0.25);
  modelMatrix.scale(0.7,0.7,0.7);
  modelMatrix.rotate(-45,1,0,0);
  modelMatrix.rotate(currentAngle*0.45, 0,1,0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
  
  gl.drawArrays(gl.TRIANGLES,
  				armStart/floatsPerVertex,
  				armVerts.length/floatsPerVertex);


  //========sphere===========

     matl0.setMatl(matlSel0+1);
    //---------------For the Material object(s):
	gl.uniform3fv(matl0.uLoc_Ke, matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(matl0.uLoc_Ka, matl0.K_ambi.slice(0,3));				// Ka ambient
  	gl.uniform3fv(matl0.uLoc_Kd, matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(matl0.uLoc_Ks, matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(matl0.uLoc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  modelMatrix.setIdentity();
  normalMatrix.setIdentity();
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();	
  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  modelMatrix.scale(0.8,0.8,-0.8);              // convert to left-handed coord sys
                                          // to match WebGL display canvas.
  modelMatrix.scale(0.3,0.3,0.3);
  modelMatrix.translate(1,0,-5);
  modelMatrix.rotate(currentAngle,0,1,0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();	

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLE_STRIP,
                sphStart/floatsPerVertex,
                sphVerts.length/floatsPerVertex);

  modelMatrix.scale(0.3,0.3,0.3);
  modelMatrix.translate(1,0,-5);
  modelMatrix.rotate(currentAngle,0,1,0);
  modelMatrix.rotate(currentAngle,1,1,0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();	

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLE_STRIP,
                sphStart/floatsPerVertex,
                sphVerts.length/floatsPerVertex);

  modelMatrix.scale(0.5,0.5,0.5);
  modelMatrix.translate(1,0,-5);
  modelMatrix.rotate(currentAngle,0,1,0);
  modelMatrix.rotate(currentAngle,1,0,1);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();	

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLE_STRIP,
                sphStart/floatsPerVertex,
                sphVerts.length/floatsPerVertex);

  //==========tetrahedron=========

       matl0.setMatl(matlSel0+5);
    //---------------For the Material object(s):
	gl.uniform3fv(matl0.uLoc_Ke, matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(matl0.uLoc_Ka, matl0.K_ambi.slice(0,3));				// Ka ambient
  	gl.uniform3fv(matl0.uLoc_Kd, matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(matl0.uLoc_Ks, matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(matl0.uLoc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  modelMatrix.setIdentity();

  normalMatrix.setIdentity();
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();	
  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  modelMatrix.scale(0.2,0.2,0.2);
  modelMatrix.rotate(-90, 1,0,0);
  modelMatrix.rotate(currentAngle*0.3,0,0,1);
  modelMatrix.translate(6,-6,-2);

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES,
                tetraStart/floatsPerVertex,
                tetraVerts.length/floatsPerVertex);

 // modelMatrix.scale(0.2,0.2,0.2);
  //modelMatrix.rotate(-90, 1,0,0);
  //modelMatrix.rotate(currentAngle,0,0,1);
  modelMatrix.translate(0,0,1.3);
  modelMatrix.rotate(currentAngle,0,0,1);

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES,
                tetraStart/floatsPerVertex,
                tetraVerts.length/floatsPerVertex);

  modelMatrix.translate(0,0,1.3);
  modelMatrix.rotate(currentAngle,0,0,1);
  modelMatrix.rotate(currentAngle*0.5,0,1,0);

  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES,
                tetraStart/floatsPerVertex,
                tetraVerts.length/floatsPerVertex);


  
  //======grid===========

  modelMatrix.setIdentity();
  gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);

  ViewMatrix.rotate(-90,1,0,0);
  ViewMatrix.translate(0.0,0.0,-0.6);
  ViewMatrix.scale(0.4, 0.4, 0.4);

  gl.uniformMatrix4fv(uLoc_ViewMatrix, false, ViewMatrix.elements);

  gl.drawArrays(gl.TRIANGLE_STRIP,             // use this drawing primitive, and
                  gndStart/floatsPerVertex, // start at this vertex number, and
                  gndVerts.length/floatsPerVertex);   // draw this many vertices

}

function makeGroundGrid() {
//==============================================================================
// Create a list of vertices that create a large grid of lines in the x,y plane
// centered at x=y=z=0.  Draw this shape using the GL_LINES primitive.

  var xcount = 100;     // # of lines to draw in x,y to make the grid.
  var ycount = 100;   
  var xymax = 100.0;     // grid size; extends to cover +/-xymax in x and y.
  var xColr = new Float32Array([1.0, 1.0, 0.3]);  // bright yellow
  var yColr = new Float32Array([0.5, 1.0, 0.5]);  // bright green.
  
  // Create an (global) array to hold this ground-plane's vertices:
  gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));
            // draw a grid made of xcount+ycount lines; 2 vertices per line.
            
  var xgap = xymax/(xcount-1);    // HALF-spacing between lines in x,y;
  var ygap = xymax/(ycount-1);    // (why half? because v==(0line number/2))
  
  // First, step thru x values as we make vertical lines of constant-x:
  for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
    if(v%2==0) {  // put even-numbered vertices at (xnow, -xymax, 0)
      gndVerts[j  ] = -xymax + (v  )*xgap;  // x
      gndVerts[j+1] = -xymax;               // y
      gndVerts[j+2] = 0.0;                  // z
    }
    else {        // put odd-numbered vertices at (xnow, +xymax, 0).
      gndVerts[j  ] = -xymax + (v-1)*xgap;  // x
      gndVerts[j+1] = xymax;                // y
      gndVerts[j+2] = 0.0;                  // z
    }
    gndVerts[j+3] = 1.0;  //w
    //gndVerts[j+4] = xColr[0];     // red
   // gndVerts[j+5] = xColr[1];     // grn
    //gndVerts[j+6] = xColr[2];     // blu
    gndVerts[j+4] = 0;
    gndVerts[j+5] = 0;
    gndVerts[j+6] = 1;
    gndVerts[j+7] = 0;
  }
  // Second, step thru y values as wqe make horizontal lines of constant-y:
  // (don't re-initialize j--we're adding more vertices to the array)
  for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
    if(v%2==0) {    // put even-numbered vertices at (-xymax, ynow, 0)
      gndVerts[j  ] = -xymax;               // x
      gndVerts[j+1] = -xymax + (v  )*ygap;  // y
      gndVerts[j+2] = 0.0;                  // z
    }
    else {          // put odd-numbered vertices at (+xymax, ynow, 0).
      gndVerts[j  ] = xymax;                // x
      gndVerts[j+1] = -xymax + (v-1)*ygap;  // y
      gndVerts[j+2] = 0.0;                  // z
    }
    gndVerts[j+3] = 1.0;  //w
    //gndVerts[j+4] = yColr[0];     // red
    //gndVerts[j+5] = yColr[1];     // grn
    //gndVerts[j+6] = yColr[2];     // blu
    gndVerts[j+4] = 0;
    gndVerts[j+5] = 0;
    gndVerts[j+6] = 1;
    gndVerts[j+7] = 0;
  }
}

function makeSphere() {
//==============================================================================
// Make a sphere from one OpenGL TRIANGLE_STRIP primitive.   Make ring-like 
// equal-lattitude 'slices' of the sphere (bounded by planes of constant z), 
// and connect them as a 'stepped spiral' design (see makeCylinder) to build the
// sphere from one triangle strip.
  var slices = 13;    // # of slices of the sphere along the z axis. >=3 req'd
                      // (choose odd # or prime# to avoid accidental symmetry)
  var sliceVerts  = 27; // # of vertices around the top edge of the slice
                      // (same number of vertices on bottom of slice, too)
  var sliceAngle = Math.PI/slices;  // lattitude angle spanned by one slice.

  // Create a (global) array to hold this sphere's vertices:
  sphVerts = new Float32Array(  ((slices * 2* sliceVerts) -2) * floatsPerVertex);
                    // # of vertices * # of elements needed to store them. 
                    // each slice requires 2*sliceVerts vertices except 1st and
                    // last ones, which require only 2*sliceVerts-1.
                    
  // Create dome-shaped top slice of sphere at z=+1
  // s counts slices; v counts vertices; 
  // j counts array elements (vertices * elements per vertex)
  var cos0 = 0.0;         // sines,cosines of slice's top, bottom edge.
  var sin0 = 0.0;
  var cos1 = 0.0;
  var sin1 = 0.0; 
  var j = 0;              // initialize our array index
  var isLast = 0;
  var isFirst = 1;
  for(s=0; s<slices; s++) { // for each slice of the sphere,
    // find sines & cosines for top and bottom of this slice
    if(s==0) {
      isFirst = 1;  // skip 1st vertex of 1st slice.
      cos0 = 1.0;   // initialize: start at north pole.
      sin0 = 0.0;
    }
    else {          // otherwise, new top edge == old bottom edge
      isFirst = 0;  
      cos0 = cos1;
      sin0 = sin1;
    }               // & compute sine,cosine for new bottom edge.
    cos1 = Math.cos((s+1)*sliceAngle);
    sin1 = Math.sin((s+1)*sliceAngle);
    // go around the entire slice, generating TRIANGLE_STRIP verts
    // (Note we don't initialize j; grows with each new attrib,vertex, and slice)
    if(s==slices-1) isLast=1; // skip last vertex of last slice.
    for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) { 
      if(v%2==0)
      {       // put even# vertices at the the slice's top edge
              // (why PI and not 2*PI? because 0 <= v < 2*sliceVerts
              // and thus we can simplify cos(2*PI(v/2*sliceVerts))  
        sphVerts[j  ] = sin0 * Math.cos(Math.PI*(v)/sliceVerts);  
        sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts);  
        sphVerts[j+2] = cos0;   
        sphVerts[j+3] = 1.0;
        sphVerts[j+4] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);
        sphVerts[j+5] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);
        sphVerts[j+6] = cos1;
        sphVerts[j+7] = 0.0;            
      }
      else {  // put odd# vertices around the slice's lower edge;
              // x,y,z,w == cos(theta),sin(theta), 1.0, 1.0
              //          theta = 2*PI*((v-1)/2)/capVerts = PI*(v-1)/capVerts
        sphVerts[j  ] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);    // x
        sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);    // y
        sphVerts[j+2] = cos1;                                       // z
        sphVerts[j+3] = 1.0;
        sphVerts[j+4] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);
        sphVerts[j+5] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);
        sphVerts[j+6] = cos1;
        sphVerts[j+7] = 0.0;                                     
      }
     
    }
  }
}


function makeRoboticarm()
{
//make a list of vertces that make robotic arms
armVerts = new Float32Array([
     //0,1,2
     0.25,   0.50,   0.25, 1.0,   0,0,1,0, // v0 White
    -0.25,   0.50,   0.25, 1.0,   0,0,1,0, // v1 Magenta
    -0.25,  -0.50,   0.25, 1.0,   0,0,1,0, // v2 Red
    //0,2,3
     0.25,   0.50,   0.25, 1.0,   0,0,1,0,
    -0.25,  -0.50,   0.25, 1.0,   0,0,1,0,
     0.25,  -0.50,   0.25, 1.0,   0,0,1,0,

     //0,3,4
     0.25,   0.50,   0.25, 1.0,   1,0,0,0,
     0.25,  -0.50,   0.25, 1.0,   1,0,0,0,
     0.25,  -0.50,  -0.25, 1.0,   1,0,0,0,

     //0,4,5
     0.25,   0.50,   0.25, 1.0,    1,0,0,0,
     0.25,  -0.50,  -0.25, 1.0,    1,0,0,0,
     0.25,   0.50,  -0.25, 1.0,    1,0,0,0,

     //0, 5, 6,  
     0.25,   0.50,   0.25, 1.0,      0,1,0,0,
     0.25,   0.50,  -0.25, 1.0,      0,1,0,0,
     -0.25,  0.50,  -0.25, 1.0,      0,1,0,0,

     //0, 6, 1,
      0.25,   0.50,   0.25, 1.0,    0,1,0,0,
     -0.25,   0.50,  -0.25, 1.0,    0,1,0,0,
     -0.25,   0.50,   0.25, 1.0,    0,1,0,0,

     //1, 6, 7, 
     -0.25,   0.50,   0.25, 1.0,        -1,0,0,0,   
     -0.25,   0.50,  -0.25, 1.0,        -1,0,0,0,
     -0.25,  -0.50,  -0.25, 1.0,        -1,0,0,0,

     //1, 7, 2, 
     -0.25,   0.50,   0.25, 1.0,        -1,0,0,0,
     -0.25,  -0.50,  -0.25, 1.0,        -1,0,0,0,
     -0.25,  -0.50,   0.25, 1.0,        -1,0,0,0,

     //7, 4, 3,
     -0.25,  -0.50,  -0.25, 1.0,         0,-1,0,0,
      0.25,  -0.50,  -0.25, 1.0,         0,-1,0,0,
      0.25,  -0.50,   0.25, 1.0,         0,-1,0,0,

     //7, 3, 2,
     -0.25,  -0.50,  -0.25, 1.0,        0,-1,0,0,
      0.25,  -0.50,   0.25, 1.0,        0,-1,0,0,
     -0.25,  -0.50,   0.25, 1.0,        0,-1,0,0,

     //4, 7, 6,
      0.25,  -0.50,  -0.25, 1.0,         0,0,-1,0,
     -0.25,  -0.50,  -0.25, 1.0,         0,0,-1,0,
     -0.25,   0.50,  -0.25, 1.0,         0,0,-1,0,

     //4, 6, 5,
      0.25,  -0.50,  -0.25,  1.0,     0,0,-1,0,
     -0.25,   0.50,  -0.25,  1.0,     0,0,-1,0,
      0.25,   0.50,  -0.25,  1.0,     0,0,-1,0,
     //0,2,3


     //0.25,  -0.50,   0.25,     1.0,  1.0,  0.0,  // v3 Yellow
     //0.25,  -0.50,  -0.25,     0.0,  1.0,  0.0,  // v4 Green
     //0.25,   0.50,  -0.25,     0.0,  1.0,  1.0,  // v5 Cyan
   // -0.25,   0.50,  -0.25,     0.0,  0.0,  1.0,  // v6 Blue
    //-0.25,  -0.50,  -0.25,     0.0,  0.0,  0.0,   // v7 Black
  ]);

console.log("what the heck: ", armVerts.length);


}

function makeTetrahedron()
{
	var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
	var sq2	= Math.sqrt(2.0);				
tetraVerts = new Float32Array([
	 // Face 0: (left side)  
     0.0,  0.0, sq2, 1.0,              -1.5*sq2, -c30*sq2, -c30, 0.0, // Node 0 (apex, +z axis;  blue) 
     c30, -0.5, 0.0, 1.0,             -1.5*sq2, -c30*sq2, -c30, 0.0, // Node 1 (base: lower rt; red)
     0.0,  1.0, 0.0, 1.0,             -1.5*sq2, -c30*sq2, -c30, 0.0, // Node 2 (base: +y axis;  grn)
      // Face 1: (right side)
     0.0,  0.0, sq2, 1.0,             1.5*sq2, -c30*sq2, -c30, 0.0, // Node 0 (apex, +z axis;  blue)
     0.0,  1.0, 0.0, 1.0,             1.5*sq2, -c30*sq2, -c30, 0.0, // Node 2 (base: +y axis;  grn)
    -c30, -0.5, 0.0, 1.0,            1.5*sq2, -c30*sq2, -c30, 0.0, // Node 3 (base:lower lft; white)
      // Face 2: (lower side)
     0.0,  0.0, sq2, 1.0,             0, 2*c30*sq2, -c30, 0.0, // Node 0 (apex, +z axis;  blue) 
    -c30, -0.5, 0.0, 1.0,             0, 2*c30*sq2, -c30, 0.0, // Node 3 (base:lower lft; white)
     c30, -0.5, 0.0, 1.0,           0, 2*c30*sq2, -c30, 0.0, // Node 1 (base: lower rt; red) 
      // Face 3: (base side)  
    -c30, -0.5, 0.0, 1.0,             0,0,3*c30,0.0, // Node 3 (base:lower lft; white)
     0.0,  1.0, 0.0, 1.0,              0,0,3*c30,0.0,   // Node 2 (base: +y axis;  grn)
     c30, -0.5, 0.0, 1.0,             0,0,3*c30,0.0,   // Node 1 (base: lower rt; red)
])
}

function initVertexBuffers(gl) {
//==============================================================================
  
  // Make our 'ground plane'; can you make a'torus' shape too?
  // (recall the 'basic shapes' starter code...)
  makeGroundGrid();
  makeRoboticarm();
  makeSphere();
  makeTetrahedron();
  

  // How much space to store all the shapes in one array?
  // (no 'var' means this is a global variable)
  mySiz = gndVerts.length + armVerts.length + sphVerts.length + tetraVerts.length;

  //console.log("forestVerts numeber is ", forestVerts.length);
   console.log("gndVerts numeber is ", gndVerts.length);
   console.log("armVerts numeber is ", armVerts.length);

  // How many vertices total?
  var nn = mySiz / floatsPerVertex;
  console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex);

  // Copy all shapes into one big Float32 array:
  var verticesColors = new Float32Array(mySiz);
  // Copy them:  remember where to start for each shape:
  gndStart = 0;           // next we'll store the ground-plane;
  for(i=0,j=0; j< gndVerts.length; i++, j++) {
    verticesColors[i] = gndVerts[j];
    }
  armStart = i;
  for (j=0; j < armVerts.length; i++,j++)
  {
    verticesColors[i] = armVerts[j];
  }
  sphStart = i;
  for (j=0; j < sphVerts.length; i++,j++)
  {
    verticesColors[i] = sphVerts[j];
  }
  tetraStart = i;
  for (j=0; j < tetraVerts.length; i++,j++)
  {
    verticesColors[i] = tetraVerts[j];
  }

  // Create a vertex buffer object (VBO)
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write vertex information to buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * 8, 0);
  gl.enableVertexAttribArray(a_Position);
  


  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }

  // Use handle to specify how to retrieve color data from our VBO:
  gl.vertexAttribPointer(
    a_Normal,        // choose Vertex Shader attribute to fill with data
    4,              // how many values? 1,2,3 or 4. (we're using R,G,B)
    gl.FLOAT,       // data type for each value: usually gl.FLOAT
    false,          // did we supply fixed-point data AND it needs normalizing?
    FSIZE * 8,       // Stride -- how many bytes used to store each vertex?
                    // (x,y,z,w, r,g,b) * bytes/value
    FSIZE * 4);     // Offset -- how many bytes from START of buffer to the
                    // value we will actually use?  Need to skip over x,y,z,w
                    
  gl.enableVertexAttribArray(a_Normal);  

  // Unbind the buffer object 
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return mySiz/floatsPerVertex; // return # of vertices
}

function initArrayBuffer(gl, attribute, data, type, num) {
//-------------------------------------------------------------------------------
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

//==================HTML Button Callbacks======================

function clearDrag() {
// Called when user presses 'Clear' button in our webpage
	xMdragTot = 0.0;
	yMdragTot = 0.0;
		  // REPORT updated mouse position on-screen
	document.getElementById('Mouse').innerHTML=
			'Mouse Drag totals (CVV coords):\t'+xMdragTot+', \t'+yMdragTot;	

	// NEW!  re-set the light-source global vars to its original values:
  lamp0.I_pos.elements.set([6.0, 5.0, 5.0]);
  draw();		// update GPU uniforms &  draw the newly-updated image.
}


//==================================Mouse and Keyboard event-handling Callbacks,
//								(modified from Week04 starter code: 5.04jt.ControlMulti.html))

function myMouseDown(ev, gl, canvas) {
//==============================================================================
// Called when user PRESSES down any mouse button;
// 									(Which button?    console.log('ev.button='+ev.button);   )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseDown(pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
//	console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);
	
	isDrag = true;											// set our mouse-dragging flag
	xMclik = x;													// record where mouse-dragging began
	yMclik = y;
};


function myMouseMove(ev, gl, canvas) {
//==============================================================================
// Called when user MOVES the mouse with a button already pressed down.
// 									(Which button?   console.log('ev.button='+ev.button);    )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

	if(isDrag==false) return;				// IGNORE all mouse-moves except 'dragging'

	// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
//	console.log('myMouseMove(CVV coords  ):  x, y=\t',x,',\t',y);

//Mouse-Drag Moves Lamp0 ========================================================
	// Use accumulated mouse-dragging to change the global var 'lamp0.I_pos';
	// (note how accumulated mouse-dragging sets xmDragTot, ymDragTot below:
	//  use the same method to change the y,z coords of lamp0Pos)

	console.log('lamp0.I_pos.elements[0] = ', lamp0.I_pos.elements[0], '\n');
	lamp0.I_pos.elements.set([	
					lamp0.I_pos.elements[0],
					lamp0.I_pos.elements[1] + 4.0*(x-xMclik),	// Horiz drag: change world Y
					lamp0.I_pos.elements[2] + 4.0*(y-yMclik) 	// Vert. drag: change world Z
													]);
	/* OLD
	lamp0Pos.set([lamp0Pos[0],										// don't change world x;
								lamp0Pos[1] + 4.0*(x - xMclik),		// Horiz drag*4 changes world y
						    lamp0Pos[2] + 4.0*(y - yMclik)]);	// Vert drag*4 changes world z
*/ 
	draw();				// re-draw the image using this updated uniform's value
// REPORT new lamp0 position on-screen
		document.getElementById('Mouse').innerHTML=
			'Lamp0 position(x,y,z):\t('+ lamp0.I_pos.elements[0].toFixed(5) +
			                      '\t' + lamp0.I_pos.elements[0].toFixed(5) +
														'\t' + lamp0.I_pos.elements[0].toFixed(5) + ')';	
	
//END=====================================================================

	// find how far we dragged the mouse:
	xMdragTot += (x - xMclik);					// Accumulate change-in-mouse-position,&
	yMdragTot += (y - yMclik);
	xMclik = x;													// Make next drag-measurement from here.
	yMclik = y;
	
/*	  // REPORT updated mouse position on-screen
		document.getElementById('Mouse').innerHTML=
			'Mouse Drag totals (CVV coords):\t'+xMdragTot+', \t'+yMdragTot;	
*/
};

function myMouseUp(ev, gl, canvas) {
//==============================================================================
// Called when user RELEASES mouse button pressed previously.
// 									(Which button?   console.log('ev.button='+ev.button);    )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseUp  (pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
	console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);
	
	isDrag = false;											// CLEAR our mouse-dragging flag, and
	// accumulate any final bit of mouse-dragging we did:
	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);
	console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);
};

function myKeyDown(ev) {
//===============================================================================
// Called when user presses down ANY key on the keyboard, and captures the 
// keyboard's scancode or keycode(varies for different countries and alphabets).
//  CAUTION: You may wish to avoid 'keydown' and 'keyup' events: if you DON'T 
// need to sense non-ASCII keys (arrow keys, function keys, pgUp, pgDn, Ins, 
// Del, etc), then just use the 'keypress' event instead.
//	 The 'keypress' event captures the combined effects of alphanumeric keys and // the SHIFT, ALT, and CTRL modifiers.  It translates pressed keys into ordinary
// ASCII codes; you'll get the ASCII code for uppercase 'S' if you hold shift 
// and press the 's' key.
// For a light, easy explanation of keyboard events in JavaScript,
// see:    http://www.kirupa.com/html5/keyboard_events_in_javascript.htm
// For a thorough explanation of the messy way JavaScript handles keyboard events
// see:    http://javascript.info/tutorial/keyboard-events
//

	switch(ev.keyCode) {			// keycodes !=ASCII, but are very consistent for 
	//	nearly all non-alphanumeric keys for nearly all keyboards in all countries.
		case 37:		// left-arrow key
			// print in console:
			console.log(' left-arrow.');
			// and print on webpage in the <div> element with id='Result':
  		document.getElementById('Result').innerHTML =
  			' Left Arrow:keyCode='+ev.keyCode;
  			g_EyeX -= 0.05;
			draw();
			break;
		case 38:		// up-arrow key
			console.log('   up-arrow.');
  		document.getElementById('Result').innerHTML =
  			'   Up Arrow:keyCode='+ev.keyCode;
  			g_EyeY += 0.05;
			draw();
			break;
		case 39:		// right-arrow key
			console.log('right-arrow.');
  		document.getElementById('Result').innerHTML =
  			'Right Arrow:keyCode='+ev.keyCode;
  			g_EyeX += 0.05;
			draw();
  			break;
		case 40:		// down-arrow key
			console.log(' down-arrow.');
  		document.getElementById('Result').innerHTML =
  			' Down Arrow:keyCode='+ev.keyCode;
  			g_EyeY -= 0.05;
			draw();
  			break;
  		case 90:
  			g_EyeZ -= 0.05;
  			draw();
  			break;
  		case 88:
  			g_EyeZ += 0.05;
  			draw();
  			break;
		default:
			console.log('myKeyDown()--keycode=', ev.keyCode, ', charCode=', ev.charCode);
  		document.getElementById('Result').innerHTML =
  			'myKeyDown()--keyCode='+ev.keyCode;
			break;
	}
}

function myKeyUp(ev) {
//===============================================================================
// Called when user releases ANY key on the keyboard; captures scancodes well

	console.log('myKeyUp()--keyCode='+ev.keyCode+' released.');
}



function myKeyPress(ev) {
//===============================================================================
// Best for capturing alphanumeric keys and key-combinations such as 
// CTRL-C, alt-F, SHIFT-4, etc.
	switch(ev.keyCode)
	{
		//case 77:	// UPPER-case 'M' key:
		//case 109:	// LOWER-case 'm' key:
		//	matlSel = (matlSel +1)%MATL_DEFAULT;		// see materials_Ayerdi.js for list
	//		console.log('MatlSel=', matlSel, '\n');
//console.log('matl0.K_emit', matl0.K_emit, '\n');
	//		matl0.setMatl(matlSel);									// set new material reflectances
	//		draw();																	// re-draw on-screen image.
	//		break;
		case 83: // UPPER-case 's' key:
			matl0.K_shiny += 1.0;								// INCREASE shinyness, but with a
			if(matl0.K_shiny > 128.0) matl0.K_shiny = 128.0;	// upper limit.
			console.log('UPPERcase S: ++K_shiny ==', matl0.K_shiny,'\n');	
			draw();														// re-draw on-screen image.
			break;
		case 115:	// LOWER-case 's' key:
			matl0.K_shiny += -1.0;								// DECREASE shinyness, but with a
			if(matl0.K_shiny < 1.0) matl0.K_shiny = 1.0;		// lower limit.
			console.log('lowercase s: --K_shiny ==', matl0.K_shiny, '\n');
			draw();													// re-draw on-screen image.
			break;
		default:
		console.log('myKeyPress():keyCode=' +ev.keyCode  +', charCode=' +ev.charCode+
													', shift='    +ev.shiftKey + ', ctrl='    +ev.ctrlKey +
													', altKey='   +ev.altKey   +
													', metaKey(Command key or Windows key)='+ev.metaKey);
	}
}

var lightStatus = true;
var lightStatus1 = true;

function ambientAddR()
{
	lamp0.I_ambi.elements.set([
							lamp0.I_ambi.elements[0] + 0.25, 
							lamp0.I_ambi.elements[1],
							lamp0.I_ambi.elements[2]]);
}

function ambientAddG()
{
	lamp0.I_ambi.elements.set([
							lamp0.I_ambi.elements[0], 
							lamp0.I_ambi.elements[1] + 0.25,
							lamp0.I_ambi.elements[2]]);
}

function ambientAddB()
{
	lamp0.I_ambi.elements.set([
							lamp0.I_ambi.elements[0], 
							lamp0.I_ambi.elements[1],
							lamp0.I_ambi.elements[2] + 0.25]);
}

function diffuseAddR()
{
	lamp0.I_diff.elements.set([
							lamp0.I_diff.elements[0] + 0.25, 
							lamp0.I_diff.elements[1],
							lamp0.I_diff.elements[2]]);
}

function diffuseAddG()
{
	lamp0.I_diff.elements.set([
							lamp0.I_diff.elements[0], 
							lamp0.I_diff.elements[1] + 0.25,
							lamp0.I_diff.elements[2]]);
}

function diffuseAddB()
{
	lamp0.I_diff.elements.set([
							lamp0.I_diff.elements[0], 
							lamp0.I_diff.elements[1],
							lamp0.I_diff.elements[2] + 0.25]);
}

function specularAddR()
{
	lamp0.I_spec.elements.set([
							lamp0.I_spec.elements[0] + 0.25, 
							lamp0.I_spec.elements[1],
							lamp0.I_spec.elements[2]]);
}

function specularAddG()
{
	lamp0.I_spec.elements.set([
							lamp0.I_spec.elements[0], 
							lamp0.I_spec.elements[1] + 0.25,
							lamp0.I_spec.elements[2]]);
}

function specularAddB()
{
	lamp0.I_spec.elements.set([
							lamp0.I_spec.elements[0], 
							lamp0.I_spec.elements[1],
							lamp0.I_spec.elements[2] + 0.25]);
}

function lightSwitch()
{
	if (lightStatus == true)
	{
		lightStatus = false;
		//lamp0.I_pos.elements.set( [0,0,0]);
  		lamp0.I_ambi.elements.set([0,0,0]);
  		lamp0.I_diff.elements.set([0,0,0]);
  		lamp0.I_spec.elements.set([0,0,0]);
  		return;
	}
	else
	{
		lightStatus = true;
		//lamp0.I_pos.elements.set( [6.0, 5.0, 5.0]);
  		lamp0.I_ambi.elements.set([0.4, 0.4, 0.4]);
  		lamp0.I_diff.elements.set([1.0, 1.0, 1.0]);
  		lamp0.I_spec.elements.set([1.0, 1.0, 1.0]);
	}
	
}

function lightSwitch1()
{
	if (lightStatus1 == true)
	{
		lightStatus1 = false;
		//lamp0.I_pos.elements.set( [0,0,0]);
  		lamp1.I_ambi.elements.set([0,0,0]);
  		lamp1.I_diff.elements.set([0,0,0]);
  		lamp1.I_spec.elements.set([0,0,0]);
  		return;
	}
	else
	{
		lightStatus1 = true;2
		//lamp0.I_pos.elements.set( [6.0, 5.0, 5.0]);
  		lamp1.I_ambi.elements.set([0.4, 0.4, 0.4]);
  		lamp1.I_diff.elements.set([1.0, 1.0, 1.0]);
  		lamp1.I_spec.elements.set([1.0, 1.0, 1.0]);
	}
}