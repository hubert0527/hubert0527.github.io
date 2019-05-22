var IMG_RES = 224;

const MEAN = {
  32:  [0.491, 0.482, 0.447],
  64:  [0.485, 0.456, 0.406],
  224: [0.485, 0.456, 0.406],
}
const STD = {
  32:  [0.247, 0.244, 0.262],
  64:  [0.229, 0.224, 0.225],
  224: [0.229, 0.224, 0.225],
}

NODE_DEFS = {
  0: "InvertedResBlock_3x3_6F",
  1: "InvertedResBlock_3x3_3F",
  2: "InvertedResBlock_5x5_6F", 
  3: "InvertedResBlock_5x5_3F",
  4: "BasicBlock",
}

const NUM_LAYERS=17, NUM_OPTIONS=5;

const DEMO_IMGS = {
  "Objects-in-the-dark": [ // 0.060248374938964844
    5193, 6648, 9549, 11843, 13952, 17334, 39195,
  ],
  "Marine animals": [ // 0.07249873876571655
    7835, 8529, 12557, 18528, 21870, 42308, 45216,
  ],
  "Scattered objects": [  // 0.07145416736602783
    24543, 21240, 2766, 29132, 16454, 3844, 12637,  
  ],
  "Grass in background": [ // 0.06890863180160522
    1820, 5974, 198, 2701, 54, 11196, 4237,
  ],
  "Fluffy animals": [ // 0.06699085235595703 
    1879, 5139, 8022, 10609, 10830, 16105, 24462, 
  ],
  "Round-shaped objects": [ // 0.06479787826538086
    36873, 36577, 497, 34, 7843, 2565, 5275,
  ],
  "Yellow objects": [ // 0.06288009881973267
    452, 1882, 2632, 9494, 15205, 15340, 16126,
  ],
  "Repeating textures": [ // 0.0721781849861145
    33255, 31397, 25801, 32722, 24421, 18813, 19711, 
  ],
};
var ARCH="";
const DEBUG = false;

var NUM_DEMO_IMGS_PER_ROW = 7;
var NUM_DEMO_IMGS = DEMO_IMGS.length * NUM_DEMO_IMGS_PER_ROW; // 20;
var DEMO_IMG_PAD = 5;
var DEMO_IMG_CACHE = {};

$(window).on('load', function () {
  var vw = $(window).innerWidth();
  if (vw > 1200) vw = 1200;
  window.CANVAS_H = vw*500/1200, 
  window.CANVAS_W = vw;

  create_demo_app();
  load_demo_samples();
  plot_nodes_only();
})

function load_demo_samples() {
  const scrollbar_w = 12;
  const preview_res = (0.6*window.CANVAS_W-scrollbar_w)/NUM_DEMO_IMGS_PER_ROW;
  for (var category in DEMO_IMGS) {
    for (var i=0; i<NUM_DEMO_IMGS_PER_ROW; i++){
      var img_id = DEMO_IMGS[category][i];
      // Load placehodler
      var thumbnailId = "demo-sample-"+img_id;
      $("#demo-samples").append(
        "<img id=\""+thumbnailId+"\" class=\"demo-samples\"" + 
        "src=\"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=\"" +
        "\"height=\""+preview_res+"\" width=\""+preview_res+"\">")
      tippy("#"+thumbnailId, {
        content: category,
        animation: 'fade',
        distance: 5,
        theme: 'my',
        followCursor: true,
        placement: 'top-start',
        size: "large",
        trigger: "mouseenter focus click",
        popperOptions: {
          modifiers: {
            preventOverflow: {
              enabled: false
            },
            hide: {
              enabled: false
            }
          }
        }
        // interactive: true,
      });

      var url = "./images/demo-samples/" + img_id + ".png",
          full_img = new Image();
      full_img.height = IMG_RES;
      full_img.width = IMG_RES;
      $(full_img).attr("demo-id", img_id);
      $(full_img).attr("demo-category", category);

      full_img.onload = function() {
        // use browser cache
        var demoId = $(this).attr("demo-id");
        var cached_url = this.src.toString();
        var thumbnail = $("#demo-sample-"+demoId);
        thumbnail[0].src = cached_url;
        thumbnail.on("click", function(){
          var demoID = $(this).attr("demo-id");
          var demoCat = $(this).attr("demo-category");
          $(".demo-samples").css("background-color", "transparent");
          $(this).css("background-color", "red");
          run_demo_sample_inference(DEMO_IMG_CACHE[parseInt(demoId)]);
        });
      }
      full_img.src = url;
      DEMO_IMG_CACHE[img_id]= full_img;
    }
  }
}

function create_demo_app(){
  var ctx, img_st, img_data, inputTensor, fileblob;

  // Create file uploader
  const fileUploader = document.querySelector('#demo-img-uploader');
  fileUploader.addEventListener('change', (e) => {
    // Create demo model
    const session = new onnx.InferenceSession();
    session.loadModel("./models/exported.onnx").then(() => {
      fileblob = e.target.files[0];
      load_image_to_html(fileblob, function(){
        canvas = create_hidden_canvas();
        if (canvas && canvas.getContext) {
          ctx = canvas.getContext('2d');
          ctx.drawImage(document.getElementById("demo-thumbnail"), 0, 0);
          img_data = ctx.getImageData(0, 0, IMG_RES, IMG_RES);
          img_data = preprocess(img_data.data)
          inputTensor = [
            new Tensor(new Float32Array(img_data), "float32", [1, 3, IMG_RES, IMG_RES])
          ];
          agent_inference(session, inputTensor, function(outputTensor){
              model_to_d3_plot(outputTensor.data);
          });
        }
      });  
    });
  });
}

function run_demo_sample_inference(fullImg) {
  const session = new onnx.InferenceSession();
  session.loadModel("./models/exported.onnx").then(() => {
    canvas = create_hidden_canvas();
    if (canvas && canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.drawImage(fullImg, 0, 0);
      img_data = ctx.getImageData(0, 0, IMG_RES, IMG_RES);
      img_data = preprocess(img_data.data);
      console.log(img_data);
      inputTensor = [
        new Tensor(new Float32Array(img_data), "float32", [1, 3, IMG_RES, IMG_RES])
      ];
      agent_inference(session, inputTensor, function(outputTensor){
          model_to_d3_plot(outputTensor.data);
      });
    }
  });
}

function agent_inference(session, input, callback){
    // execute the model
    session.run(input).then(output => {
      // consume the output
      const outputTensor = output.values().next().value;
      callback(outputTensor)
    });
}

function create_hidden_canvas(){
  var prevCanvas = $("#extractFileCanvas")[0];
  if (prevCanvas){
    const context = prevCanvas.getContext('2d');
    try{
      context.clearRect(0, 0, canvas.width, canvas.height);
    } catch (e) {
      context.clearRect(0, 0, $(canvas).attr("width"), $(canvas).attr("height"));
    }
    $(prevCanvas).attr("width", CANVAS_W).attr("height", CANVAS_H);
    return prevCanvas;
  } else {
    var canvas = document.createElement('canvas');  // Dynamically Create a Canvas Element
    canvas.id = "extractFileCanvas";  // Give the canvas an id
    canvas.width  = IMG_RES;  // Set the width of the Canvas
    canvas.height = IMG_RES;  // Set the height of the Canvas
    canvas.style.display   = "none";  // Make sure your Canvas is hidden
    document.body.appendChild(canvas);  // Insert the canvas into your page
    return canvas
  }
}

function load_image_to_html(fileblob, callback){
  var reader = new FileReader();
  var target_img_node = $("#demo-thumbnail");
  target_img_node[0].onload = function(){
    $(this).attr("crossOrigin", "anonymous");
    callback();
  }
  reader.onload = function(e) {
    target_img_node.attr("src", e.target.result)
  };
  reader.readAsDataURL(fileblob);
}

function preprocess(html_img){
  // var result = [];
  var r=[], g=[], b=[];
  for(var i=0; i<html_img.length; i++){
    var ch = i % 4;
    if (ch==3) continue; // html image has alpha channel
    var pixel = ((html_img[i]/255) - MEAN[IMG_RES][ch]) / STD[IMG_RES][ch];
    if (ch==0) {
      r.push(pixel)
    } else if (ch==1) {
      g.push(pixel)
    } else {
      b.push(pixel)
    }
  }
  return r.concat(g, b);
}

function plot_nodes_only(){

  var nodes=[], joints=[],
      input_links=[], output_links=[];
  // create node def
  for (var layer=0; layer<NUM_LAYERS; layer++){
    var l_in_x = (layer+0.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_in_y = 3 * (CANVAS_H / (NUM_OPTIONS+1)),
        l_ou_x = (layer+1.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_ou_y = 3 * (CANVAS_H / (NUM_OPTIONS+1));

    // Input / Output node can have larger space
    if (layer===0) {
      l_in_x -= 0.15 * (CANVAS_W / (NUM_LAYERS+1));
    } else if (layer===NUM_LAYERS-1) {
      l_ou_x += 0.15 * (CANVAS_W / (NUM_LAYERS+1));
    }

    var layer_input_node  = { id: "layer-input-"+layer,  reflexive: false, x: l_in_x, y: l_in_y };
    var layer_output_node = { id: "layer-output-"+layer, reflexive: false, x: l_ou_x, y: l_ou_y };
    joints.push(layer_input_node);

    for (var opt=0; opt<NUM_OPTIONS; opt++) {
      var idx = layer*NUM_OPTIONS + opt,
          x = (layer+1) * (CANVAS_W / (NUM_LAYERS+1)),
          y = (opt+1) * (CANVAS_H / (NUM_OPTIONS+1));
      var module_node = { id: "layer-"+layer+"-opt-"+opt, reflexive: false, x: x, y: y };
      nodes.push(module_node);
    }
  }
  joints.push(layer_output_node);

  // plot start
  construct_plot(nodes, joints, [], []);
}

const PROBA_MODE = false;
const KEEP = false;
const NO_ANIME = true;
const TRANSPARENT = false;

function model_to_d3_plot(model_arr){

  var nodes=[], joints=[],
      input_links=[], output_links=[];
  var arch = "";

  // create node def
  for (var layer=0; layer<NUM_LAYERS; layer++){
    var l_in_x = (layer+0.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_in_y = 3 * (CANVAS_H / (NUM_OPTIONS+1)),
        l_ou_x = (layer+1.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_ou_y = 3 * (CANVAS_H / (NUM_OPTIONS+1));

    // Input / Output node can have larger space
    if (layer===0) {
      l_in_x -= 0.15 * (CANVAS_W / (NUM_LAYERS+1));
    } else if (layer===NUM_LAYERS-1) {
      l_ou_x += 0.15 * (CANVAS_W / (NUM_LAYERS+1));
    }

    var layer_input_node  = { id: "layer-input-"+layer,  reflexive: false, x: l_in_x, y: l_in_y };
    var layer_output_node = { id: "layer-output-"+layer, reflexive: false, x: l_ou_x, y: l_ou_y };
    joints.push(layer_input_node);

    var noSelection=true;
    for (var opt=0; opt<NUM_OPTIONS; opt++) {
      var idx = layer*NUM_OPTIONS + opt,
          x = (layer+1) * (CANVAS_W / (NUM_LAYERS+1)),
          y = (opt+1) * (CANVAS_H / (NUM_OPTIONS+1));
      var module_node = { id: "layer-"+layer+"-opt-"+opt, reflexive: false, x: x, y: y };
      nodes.push(module_node);
      if ( PROBA_MODE ) {
        noSelection = false;
        input_links.push({
          l_idx: layer*2,
          proba: model_arr[idx],
          data: [
            {x: layer_input_node.x, y: layer_input_node.y}, // start
            {x: module_node.x, y: module_node.y}, // end
          ]});
        output_links.push({
          l_idx: layer*2+1,
          proba: model_arr[idx],
          data: [
            {x: module_node.x, y: module_node.y}, // start
            {x: layer_output_node.x, y: layer_output_node.y}, // end
          ]});
      } else {
        if ( model_arr[idx] > 0.5 ) {
          arch += "1";
          noSelection = false;
          input_links.push({
            l_idx: layer*2,
            data: [
              {x: layer_input_node.x, y: layer_input_node.y}, // start
              {x: module_node.x, y: module_node.y}, // end
            ]});
          output_links.push({
            l_idx: layer*2+1,
            data: [
              {x: module_node.x, y: module_node.y}, // start
              {x: layer_output_node.x, y: layer_output_node.y}, // end
            ]});
        } else {
          arch += "0";
        }
      }
    }

    // no selection in this layer, select default node (i.e., the last option)
    if (noSelection) {
      input_links.push([
        {x: layer_input_node.x, y: layer_input_node.y}, // start
        {x: module_node.x, y: module_node.y}, // end
      ]);
      output_links.push([
        {x: module_node.x, y: module_node.y}, // start
        {x: layer_output_node.x, y: layer_output_node.y}, // end
      ]);
    }
  }
  if (DEBUG) {
    if (arch===ARCH) {
      console.log(arch, ARCH, arch==arch, arch===ARCH)
      $("svg").css("background-color", "green");
    } else {
      $("svg").css("background-color", "red");
    }
    window.ARCH = arch;
  }
  joints.push(layer_output_node);

  // plot start
  construct_plot(nodes, joints, input_links, output_links);
}


// update graph (called when needed)
function construct_plot(nodes, joints, input_links, output_links) {

  // clear graph
  if (!KEEP) {
    d3.selectAll("#demo-graph > *").remove();
  }

  var svg = d3.select('#demo-graph')
    // .on('contextmenu', () => { d3.event.preventDefault(); })
    .attr('width', CANVAS_W)
    .attr('height', CANVAS_H);

  var lineGenerator = d3.line()
    .curve(d3.curveCardinal)
    .x(function(d) { return d.x })
    .y(function(d) { return d.y });

  for (var i=0; i<input_links.length; i++){
    var input_link = input_links[i].data;
    var interpolate = {
      x: (4*input_link[0].x + input_link[1].x) / 5,
      y: (input_link[0].y + input_link[1].y) / 2,
    }
    var opacity = PROBA_MODE ? input_links[i].proba : (TRANSPARENT?0.3:1);
    var stroke = PROBA_MODE ? (2*input_links[i].proba) + 1 : 3;
    input_link.splice(1, 0, interpolate);
    path = svg.append('path')
    if (!NO_ANIME) {
      path.lower()
        .transition()
        .duration(50)
        .delay(30*input_links[i].l_idx)
    }
    path.attr('d', lineGenerator(input_link))
      .attr('stroke', 'black')
      .attr('opacity', opacity )
      .attr('stroke-width', stroke+'px')
      .attr('fill', 'none');
  }
  for (var i=0; i<output_links.length; i++){
    var output_link = output_links[i].data;
    var interpolate = {
      x: (output_link[0].x + 4*output_link[1].x) / 5,
      y: (output_link[0].y + output_link[1].y) / 2,
    }
    var opacity = PROBA_MODE ? output_links[i].proba : (TRANSPARENT?0.3:1);
    var stroke = PROBA_MODE ? (2*output_links[i].proba) + 1 : 3;
    output_link.splice(1, 0, interpolate);
    path = svg.append('path')
    if (!NO_ANIME) {
      path.lower()
        .transition()
        .duration(50)
        .delay(30*output_links[i].l_idx)
    }
    path.attr('d', lineGenerator(output_link))
      .attr('stroke', 'black')
      .attr('opacity', opacity )
      .attr('stroke-width', stroke+'px')
      .attr('fill', 'none');
  }

  var colorsGen = d3.scaleOrdinal([
    "#EA4335",
    "#4285F4",
    "#FBBC05",
    "#34A853",
    "#721E6E",
  ]);

  for (var i=0; i<nodes.length; i++){
    var node = nodes[i];
    svg.append('circle')
      .data([node])
      .attr('r', 12)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .style('fill', (d) => colorsGen(d.id))
      .style('stroke', (d) => d3.rgb(colorsGen(d.id)).darker().toString());
  }

  const tw=24, th=16, fs=12;
  const xScale = d3.scaleLinear().domain([0, 8]).range([0, 500]);
  const font_dx=2, font_dy=11;
  for (var i=1; i<joints.length-1; i++){
    var joint = joints[i];
    svg.append("rect")
      .data([joint])
      .attr("x", (d) => d.x-tw/2)
      .attr("y", (d) => d.y-th/2)
      .attr("width", tw)
      .attr("height", th)
      .style('fill', "white")
      .style('stroke', "black");
    var text = svg.append("text")
      .data([joint])
      .attr("x", (d) => d.x-tw/2)
      .attr("y", (d) => d.y-th/2)
      .attr("dx", font_dx)
      .attr("dy", font_dy)
      .style("font-size", fs+"px")
      .style('fill', "black")
      .text("sum")
      // .attr('transform', (d,i)=>{ return 'rotate(90, '+ d.x + ', ' + d.y +')' });
  }

  const io_node_rx=50, io_node_ry=15, io_fs=14, io_fw="bold";

  // Input node
  var input = joints[0];
  svg.append("ellipse")
    .data([input])
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("rx", io_node_rx)
    .attr("ry", io_node_ry)
    .style('fill', "#c5e2b5")
    .style('stroke', "black")
    .attr('transform', (d,i)=>{ return 'rotate(90, '+ d.x + ', ' + d.y +')' }); 
  var text = svg.append("text")
    .data([input])
    .attr("x", (d) => d.x-18)
    .attr("y", (d) => d.y-8)
    .attr("dx", font_dx)
    .attr("dy", font_dy)
    .style("font-size", io_fs+"px")
    .style("font-weight", io_fw)
    .style('fill', "black")
    .text("Input")
    .attr('transform', (d,i)=>{ return 'rotate(90, '+ d.x + ', ' + d.y +')' }); 

  // Output node
  var output = joints[joints.length-1];
  svg.append("ellipse")
    .data([output])
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("rx", io_node_rx)
    .attr("ry", io_node_ry)
    .style('fill', "#c5e2b5")
    .style('stroke', "black")
    .attr('transform', (d,i)=>{ return 'rotate(90, '+ d.x + ', ' + d.y +')' }); 
  var text = svg.append("text")
    .data([output])
    .attr("x", (d) => d.x-22)
    .attr("y", (d) => d.y-8)
    .attr("dx", font_dx)
    .attr("dy", font_dy)
    .style("font-size", io_fs+"px")
    .style("font-weight", io_fw)
    .style('fill', "black")
    .text("Output")
    .attr('transform', (d,i)=>{ return 'rotate(90, '+ d.x + ', ' + d.y +')' }); 
}
