var IMG_RES = 224;
const PROBA_MODE = false;
const KEEP = false;
const NO_ANIME = false;
const TRANSPARENT = false;
const DEBUG = false;

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
  "Clear foreground objects": {
    id: [46724, 42399, 36842, 11112, 32019, 41326, 32108],
    arch: "0000110000010010010000010010000010000010000100100110001000110100000111000100001000011",
    archID: "63243567943573",
  },
  "Objects-in-the-dark": {
    id: [5193, 6648, 9549, 11843, 13952, 17334, 39195],
    arch: "0000110000010010010000010010000010000010000100100010001000100100000101000100001100011",
    archID: "60248374938964844",
  },
  "Marine animals": { 
    id: [7835, 8529, 12557, 18528, 21870, 42308, 45216],
    arch: "0000110001010010010000010010000010000010010100100111001000110100000101010110001100011",
    archID: "7249873876571655",
  },
  "Displayed objects": {  
    id: [24543, 21240, 2766, 29132, 16454, 3844, 12637],
    arch: "0000110001010010010000010010000010000010010110100110001000110100000101010110001100011",
    archID: "7145416736602783",
  },
  "Grass in background": { 
    id: [1820, 5974, 198, 2701, 54, 11196, 4237],
    arch: "0000110000010010010000010010100010000010010100100110001000110100000101010100001100011",
    archID: "6890863180160522",
  },
  "Fluffy animals": {  
    id: [1879, 5139, 8022, 10609, 10830, 24462, 15408],
    arch: "0000110000010010010000010010100010000010000100100110001000110100000101010100001100011",
    archID: "6699085235595703",
  },
  "Round-shaped objects": { 
    id: [36873, 36577, 497, 34, 4387, 2565, 5275],
    arch: "0000110000010010010000010010000010000010010100100110001000110100000101000100001100011",
    archID: "6479787826538086",
  },
  "Yellow objects": { 
    id: [452, 1882, 2632, 9494, 15205, 15340, 16126],
    arch: "0000110000010010010000010010000010000010000100100110001000110100000101000100001100011",
    archID: "6288009881973267",
  },
  "Repeating textures": {
    id: [3577, 30546, 17036, 24990, 11213, 33671, 24512],
    arch: "0000110001010010010000010010100010000010010110100110001000110100000101010110001100011",
    archID: "7327771186828613",
  },
  "Black-and-white objects" : {
    id: [20302, 38866, 32370, 30018, 24862, 41537, 38645],
    arch: "0000110001010010010000010010000010000010010100100110001000110100000101000100001100011",
    archID: "665850043296814",
  },
};

const LATENCY_MAT = [ // Normalized
  [0.7080, 0.7100, 0.6825, 1.0000, 0.0290],
  [0.3139, 0.1415, 0.1670, 0.3717, 0.1715],
  [0.1409, 0.0860, 0.5677, 0.2277, 0.0278],
  [0.1090, 0.0527, 0.1711, 0.0822, 0.0813],
  [0.2244, 0.1410, 0.0554, 0.1709, 0.0271],
  [0.3672, 0.0276, 0.0551, 0.0567, 0.0522],
  [0.0541, 0.3658, 0.0545, 0.0851, 0.0259],
  [0.0828, 0.0528, 0.0544, 0.0521, 0.0241],
  [0.4573, 0.0550, 0.2558, 0.0791, 0.0000],
  [0.0546, 0.0570, 0.1647, 0.0541, 0.0246],
  [0.0505, 0.0824, 0.5974, 0.1134, 0.1088],
  [0.0560, 0.1113, 0.0557, 0.0817, 0.0002],
  [0.1382, 0.0320, 0.0817, 0.0546, 0.0268],
  [0.1689, 0.0523, 0.0579, 0.0544, 0.3704],
  [0.1123, 0.0144, 0.3680, 0.0563, 0.6248],
  [0.4534, 0.0546, 0.1399, 0.2257, 0.3661],
  [0.0567, 0.0833, 0.1919, 0.1414, 0.4830],
]
const LATENCY_MAX = 14.7388;
const LATENCY_BASELINE = 3.5481;
const LATENCY_LOW = LATENCY_BASELINE*0.5;
const LATENCY_HIGH = LATENCY_BASELINE*1.5;
window.PREV_LAT = LATENCY_LOW;

var NUM_DEMO_IMGS_PER_ROW = 7;
var NUM_DEMO_IMGS = DEMO_IMGS.length * NUM_DEMO_IMGS_PER_ROW; // 20;
var DEMO_IMG_PAD = 5;
var DEMO_IMG_CACHE = {};

$(window).on('load', function () {
  var vw = $(window).innerWidth();
  if (vw > 1200) vw = 1200;
  window.CANVAS_H = vw*400/1200, 
  window.CANVAS_W = vw;

  window.InfereceSession = new onnx.InferenceSession();
  window.InfereceSession.loadModel("./models/exported.onnx").then(function(){
    create_demo_app();
    load_demo_samples();
  });

  var svg = d3.select('#demo-graph')
    .attr('width', CANVAS_W)
    .attr('height', CANVAS_H);
  render_nodes(svg);
  vis_latency(svg, "");
})

function arch_to_lat(arch){
  var lat = 0;
  for (var i=0; i<NUM_LAYERS; i++) {
    for (var j=0; j<NUM_OPTIONS; j++) {
      var idx = i*NUM_OPTIONS + j;
      if (arch[idx]==="1") {
        lat += LATENCY_MAT[i][j];
      }
    }
  }
  return lat;
}

function load_demo_samples() {
  const scrollbar_w = 12;
  const preview_res = (0.6*window.CANVAS_W-scrollbar_w)/NUM_DEMO_IMGS_PER_ROW;
  for (var category in DEMO_IMGS) {
    for (var i=0; i<NUM_DEMO_IMGS_PER_ROW; i++){
      var img_id = DEMO_IMGS[category].id[i];
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
        var demoCat = $(this).attr("demo-category");
        var cached_url = this.src.toString();
        var thumbnail = $("#demo-sample-"+demoId);
        thumbnail[0].src = cached_url;
        thumbnail.attr("demo-id", demoId);
        thumbnail.attr("demo-category", demoCat);
        thumbnail.on("click", function(){
          var demoID = $(this).attr("demo-id");
          var demoCat = $(this).attr("demo-category");
          $(".demo-samples").css("background-color", "transparent");
          $(this).css("background-color", "red");
          window.ARCH = DEMO_IMGS[demoCat].arch
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
  canvas = create_hidden_canvas();
  if (canvas && canvas.getContext) {
    ctx = canvas.getContext('2d');
    ctx.drawImage(fullImg, 0, 0);
    img_data = ctx.getImageData(0, 0, IMG_RES, IMG_RES);
    img_data = preprocess(img_data.data);
    inputTensor = [
      new Tensor(new Float32Array(img_data), "float32", [1, 3, IMG_RES, IMG_RES])
    ];
    agent_inference(window.InfereceSession, inputTensor, function(outputTensor){
        model_to_d3_plot(outputTensor.data);
    });
  }
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

function render_nodes(svg){

  var nodes=[], joints=[],
      input_links=[], output_links=[];
  // create node def
  for (var layer=0; layer<NUM_LAYERS; layer++){
    var l_in_x = (layer+0.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_in_y = 3.5 * (CANVAS_H / (NUM_OPTIONS+1)),
        l_ou_x = (layer+1.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_ou_y = 3.5 * (CANVAS_H / (NUM_OPTIONS+1));

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
          y = (opt+1.5) * (CANVAS_H / (NUM_OPTIONS+1));
      var module_node = { id: "layer-"+layer+"-opt-"+opt, reflexive: false, x: x, y: y };
      nodes.push(module_node);
    }
  }
  joints.push(layer_output_node);

  // plot start
  plot_nodes(svg, nodes, joints);
}

function model_to_d3_plot(model_arr){

  var nodes=[], joints=[],
      input_links=[], output_links=[];
  var arch = "";
  var total_lat = 0;

  // create node def
  for (var layer=0; layer<NUM_LAYERS; layer++){
    var l_in_x = (layer+0.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_in_y = 3.5 * (CANVAS_H / (NUM_OPTIONS+1)),
        l_ou_x = (layer+1.5) * (CANVAS_W / (NUM_LAYERS+1)),
        l_ou_y = 3.5 * (CANVAS_H / (NUM_OPTIONS+1));

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
          y = (opt+1.5) * (CANVAS_H / (NUM_OPTIONS+1));
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
          total_lat += LATENCY_MAT[layer][opt];
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
      $("svg").css("background-color", "rgba(0, 255, 0, 0.3)");
    } else {
      $("svg").css("background-color", "rgba(255, 0, 0, 0.3)");
    }
    window.ARCH = arch;
  }
  joints.push(layer_output_node);

  latency_ratio = total_lat / LATENCY_MAX;

  // plot start
  var svg = d3.select('#demo-graph');
  plot_paths(svg, input_links, output_links);
  vis_latency(svg, arch);
}

function ratio_remap (ratio) {
  var disp = ratio-0.5
  var new_val = 0.5 + Math.sign(disp) * Math.sqrt(Math.abs(disp));
  return Math.min(Math.max(new_val, 0), 1); // clamp for safety
}

function vis_latency(svg, arch){
  const pad_h = 10,
        pad_v = 30,
        text_pad = 70,
        blue = "#4286f4",
        red = "#f4418b";
  var lat = (arch==="") ? LATENCY_LOW : arch_to_lat(arch);

  const color = d3.interpolate({colors: blue}, {colors: red})

  d3.selectAll("#lat-bar, #lat-bar-border, #lat-bar-text, #lat-bar-baseline, .lat-bar-label").remove();

  svg.append("rect")
    .datum(function () { return this })
    .attr('id', 'lat-bar-border')
    .attr("x", text_pad)
    .attr("y", pad_v)
    .attr("width", CANVAS_W-(pad_h+text_pad))
    .attr("height", 20)
    .style('fill', "transparent")
    .style('stroke', "black");

  var text = svg.append("text")
    .attr('id', 'lat-bar-text')
    .attr("x", pad_h)
    .attr("y", pad_v)
    .attr("dy", 15)
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .style('fill', "black")
    .text("Latency")

  var prev_lat_ratio = (window.PREV_LAT-LATENCY_LOW) / (LATENCY_HIGH-LATENCY_LOW);
  var cur_lat_ratio = (lat-LATENCY_LOW) / (LATENCY_HIGH-LATENCY_LOW);
  svg.append('rect')
    .datum(function () { return this })
    .attr('id', 'lat-bar')
    .attr('fill', color(ratio_remap(prev_lat_ratio)).colors)
    .attr('height', 20)
    .attr('x', text_pad)
    .attr('y', pad_v)
    .attr('width', function(d){
      return prev_lat_ratio * (CANVAS_W-pad_h-text_pad);
    })
    .transition()
    .duration(500)
    .delay(0)
    .attr('fill', color(ratio_remap(cur_lat_ratio)).colors)
    .attr('width', function(d){
      return cur_lat_ratio * (CANVAS_W-pad_h-text_pad);
    })

  var baseline_pos = (LATENCY_BASELINE-LATENCY_LOW) / (LATENCY_HIGH-LATENCY_LOW) * (CANVAS_W-pad_h-text_pad)
  svg.append("rect")
    .datum(function () { return this })
    .attr('id', 'lat-bar-baseline')
    .attr("x", baseline_pos + text_pad)
    .attr("y", pad_v)
    .attr("width", 5)
    .attr("height", 20)
    .style('fill', "red")
    .style('stroke', "red");

  var text = svg.append("text")
    .attr('class', 'lat-bar-label')
    .attr("x", baseline_pos + text_pad)
    .attr("y", 10)
    .attr("dx", -50)
    .attr("dy", 10)
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .style('fill', "black")
    .text("MobileNetV2 (baseline)")

  var text = svg.append("text")
    .attr('class', 'lat-bar-label')
    .attr("x", text_pad)
    .attr("y", 10)
    .attr("dx", 0)
    .attr("dy", 10)
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .style('fill', blue)
    .text("Fast")

  var text = svg.append("text")
    .attr('class', 'lat-bar-label')
    .attr("x", CANVAS_W-pad_h)
    .attr("y", 10)
    .attr("dx", -40)
    .attr("dy", 10)
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .style('fill', red)
    .text("Slow")

  window.PREV_LAT = lat;
}

const FADE_OUT_PREV_LAT  = 200;
const LINE_ANIME_SPEED = 10;
var INFER_SERIAL_ID = 0;
// update graph (called when needed)
function plot_paths(svg, input_links, output_links) {

  window.INFER_SERIAL_ID += 1;

  // clear previous prev_path
  d3.selectAll([
        ".prev-path",
        ".cur-path:not([infer-serial-id='"+ (INFER_SERIAL_ID-1) +"'])",
      ].join(", "))
    .transition()
    .duration(NO_ANIME ? 0 : FADE_OUT_PREV_LAT)
    .attr('opacity', 0 )
    .remove()

  // set current path as prev_path
  d3.selectAll(".cur-path[infer-serial-id='"+ (INFER_SERIAL_ID-1) +"']")
    .transition()
    .duration(NO_ANIME ? 0 : FADE_OUT_PREV_LAT)
    .attr("class", "prev-path")
    .attr('opacity', 0.30 )
    .attr('stroke-width', '18px')
      // .attr('stroke', 'red');
  
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
    svg.append('path')
      .datum(function () { return this })
      .attr("infer-serial-id", INFER_SERIAL_ID)
      .transition()
      .duration(NO_ANIME ? 0 : LINE_ANIME_SPEED)
      .delay(NO_ANIME ? 0 : FADE_OUT_PREV_LAT + LINE_ANIME_SPEED*input_links[i].l_idx)
      .attr('d', lineGenerator(input_link))
      .attr('class', 'cur-path')
      .attr('stroke', 'black')
      .attr('opacity', opacity )
      .attr('stroke-width', stroke+'px')
      .attr('fill', 'none')
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
    svg.append('path')
      .datum(function () { return this })
      .attr("infer-serial-id", INFER_SERIAL_ID)
      .transition()
      .duration(NO_ANIME ? 0 : LINE_ANIME_SPEED)
      .delay(NO_ANIME ? 0 : FADE_OUT_PREV_LAT + LINE_ANIME_SPEED*output_links[i].l_idx)
      .attr('d', lineGenerator(output_link))
      .attr('class', 'cur-path')
      .attr('stroke', 'black')
      .attr('opacity', opacity )
      .attr('stroke-width', stroke+'px')
      .attr('fill', 'none')
  }

  // enforce all path lower than nodes
  d3.selectAll("path, circle, rect")
    .sort(function (a, b) {
      if (a.nodeName === "path" && b.nodeName === "path") {
        if (d3.select(a).attr("class") === "prev-path") return -1;
        else return 1;
      }
      if (a.nodeName === "path") return -1;
      else return 1;
    });

  // set prev-path lower than current path
  // var curPaths = d3.selectAll(".cur-path").node();
  // curPaths.parentNode.appendChild(curPaths);

  // d3.selectAll(".cur-path, .prev-path").sort(function (a, b) {
  //   try {
  //     if (d3.select(a.id).attr("class")==="prev-path") return 1;
  //     else if (d3.select(b.id).attr("class")==="prev-path") return -1;
  //   } catch (e) {
  //     console.log(a, b);
  //   }
  // });
}

function plot_nodes(svg, nodes, joints){

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
