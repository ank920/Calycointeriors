let currentRoom = "bedroom";
let catalog;
let images = {};
let selectedLayer = "layer1";
let dragging = false;
let dragStart = null;
let showBoxes = false;
let rightOnly = false;

const canvas = document.getElementById("roomCanvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

const state = {
  bed: null,
  table: null,
  wardrobe: null,
  layout: {
    bed: null,
    table: null,
    wardrobe: null
  }
};

async function loadCatalog(){
  const res = await fetch(currentRoom === "bedroom" ? "./catalog.json" : "./catalog-living.json");
  catalog = await res.json();
  state.layer1 = catalog.layer1[0].id;
  state.layer2 = catalog.layer2[0].id;
  state.layer3 = catalog.layer3[0].id;
  resetLayoutsToCatalog();
}

function img(src){
  return new Promise((resolve,reject)=>{
    if(images[src]) return resolve(images[src]);
    const i = new Image();
    i.onload = () => { images[src]=i; resolve(i); };
    i.onerror = reject;
    i.src = src;
  });
}

async function preload(){
  const urls = [catalog.base.src];
  catalog.layer1.forEach(x => { if(x.src) urls.push(x.src); if(x.thumb) urls.push(x.thumb); });
  catalog.layer2.forEach(x => { 
    if(x.right) urls.push(x.right); 
    if(x.left) urls.push(x.left); 
    if(x.src) urls.push(x.src);
    if(x.thumb) urls.push(x.thumb); 
  });
  catalog.layer3.forEach(x => { if(x.src) urls.push(x.src); if(x.thumb) urls.push(x.thumb); });
  await Promise.all(urls.map(u => u ? img(u) : Promise.resolve()));
}

function getLayer1(){ return catalog.layer1.find(x => x.id === state.layer1); }
function getLayer2(){ return catalog.layer2.find(x => x.id === state.layer2); }
function getLayer3(){ return catalog.layer3.find(x => x.id === state.layer3); }

function deepClone(x){ return JSON.parse(JSON.stringify(x)); }

function resetLayoutsToCatalog(){
  state.layout.layer1 = deepClone(getLayer1().placement);
  state.layout.layer2 = deepClone(getLayer2().placement);
  state.layout.layer3 = deepClone(getLayer3().placement);
}

function resetSingleLayer(layer){
  if(layer === "layer1") state.layout.layer1 = deepClone(getLayer1().placement);
  if(layer === "layer2") state.layout.layer2 = deepClone(getLayer2().placement);
  if(layer === "layer3") state.layout.layer3 = deepClone(getLayer3().placement);
}

function makeGrid(id, items, type){
  const root = document.getElementById(id);
  root.innerHTML = "";
  for(const item of items){
    const btn = document.createElement("button");
    btn.className = "card";
    btn.dataset.id = item.id;
    btn.dataset.type = type;
    btn.innerHTML = `<img src="${item.thumb}" alt="${item.name}"><strong>${item.name}</strong><small>${item.description}</small>`;
    btn.addEventListener("click", () => {
      state[type] = item.id;
      selectedLayer = type === "layer3" ? "layer3" : (type === "layer2" ? "layer2Right" : type);
      resetSingleLayer(type);
      syncUI();
      render();
    });
    root.appendChild(btn);
  }
}

function syncCards(){
  document.querySelectorAll(".card").forEach(card => {
    const type = card.dataset.type;
    const id = card.dataset.id;
    card.classList.toggle("active", state[type] === id);
  });
}

function syncStatus(){
  statusEl.textContent = `${getLayer1().name} · ${getLayer2().name} · ${getLayer3().name}`;
}

function selectedPlacement(){
  if(selectedLayer === "layer1") return state.layout.layer1;
  if(selectedLayer === "layer3") return state.layout.layer3;
  if(selectedLayer === "layer2Left" && state.layout.layer2.left) return state.layout.layer2.left;
  if(selectedLayer === "layer2Right" && state.layout.layer2.right) return state.layout.layer2.right;
  return state.layout.layer2; // fallback for when layer2 is a single asset
}

function syncSlidersFromLayer(){
  const layer = selectedPlacement();
  const selectEl = document.getElementById("layerSelect");
  const labelText = selectEl.options[selectEl.selectedIndex]?.text || selectedLayer;
  document.getElementById("selectedLabel").textContent = `${labelText} selected`;

  document.getElementById("xRange").value = layer.x;
  document.getElementById("yRange").value = layer.y;
  
  let base;
  if(selectedLayer === "layer1") base = getLayer1().placement;
  else if(selectedLayer === "layer3") base = getLayer3().placement;
  else if(selectedLayer === "layer2Left" && getLayer2().placement.left) base = getLayer2().placement.left;
  else if(selectedLayer === "layer2Right" && getLayer2().placement.right) base = getLayer2().placement.right;
  else base = getLayer2().placement; // fallback

  document.getElementById("scaleRange").value = layer.w / base.w;
  document.getElementById("rotateXRange").value = layer.rotateX ?? 0;
  document.getElementById("rotateYRange").value = layer.rotateY ?? 0;
  document.getElementById("rotateZRange").value = layer.rotateZ ?? 0;
  document.getElementById("brightRange").value = layer.brightness ?? 1;
  document.getElementById("contrastRange").value = layer.contrast ?? 1;
  document.getElementById("shadowRange").value = layer.shadow ?? (selectedLayer.startsWith("layer2") ? 0.25 : 0.3);
}

function syncUI(){
  const selectEl = document.getElementById("roomSelect");
  if(currentRoom === "bedroom"){
    document.getElementById("tab1").textContent = "Beds";
    document.getElementById("tab2").textContent = "Tables";
    document.getElementById("tab3").textContent = "Wardrobes";
    document.getElementById("optLayer1").textContent = "Bed";
    document.getElementById("optLayer2Right").textContent = "Right Side Table";
    document.getElementById("optLayer2Left").textContent = "Left Side Table";
    document.getElementById("optLayer3").textContent = "Wardrobe";
  } else {
    document.getElementById("tab1").textContent = "Sofas";
    document.getElementById("tab2").textContent = "Coffee Tables";
    document.getElementById("tab3").textContent = "Chairs";
    document.getElementById("optLayer1").textContent = "Sofa";
    document.getElementById("optLayer2Right").textContent = "Right Coffee Table";
    document.getElementById("optLayer2Left").textContent = "Left Coffee Table";
    document.getElementById("optLayer3").textContent = "Armchair";
  }
  
  document.getElementById("layerSelect").value = selectedLayer;
  syncCards();
  syncStatus();
  syncSlidersFromLayer();
  if (window.refreshCustomSelects) window.refreshCustomSelects();
}

function applySliderChange(){
  const layer = selectedPlacement();
  const x = Number(document.getElementById("xRange").value);
  const y = Number(document.getElementById("yRange").value);
  const scale = Number(document.getElementById("scaleRange").value);
  const rotateX = Number(document.getElementById("rotateXRange").value);
  const rotateY = Number(document.getElementById("rotateYRange").value);
  const rotateZ = Number(document.getElementById("rotateZRange").value);
  const brightness = Number(document.getElementById("brightRange").value);
  const contrast = Number(document.getElementById("contrastRange").value);
  const shadow = Number(document.getElementById("shadowRange").value);

  let base;
  if(selectedLayer === "layer1") base = getLayer1().placement;
  else if(selectedLayer === "layer3") base = getLayer3().placement;
  else if(selectedLayer === "layer2Left" && getLayer2().placement.left) base = getLayer2().placement.left;
  else if(selectedLayer === "layer2Right" && getLayer2().placement.right) base = getLayer2().placement.right;
  else base = getLayer2().placement; // fallback

  layer.x = x;
  layer.y = y;
  layer.w = base.w * scale;
  layer.h = base.h * scale;
  layer.rotateX = rotateX;
  layer.rotateY = rotateY;
  layer.rotateZ = rotateZ;
  layer.brightness = brightness;
  layer.contrast = contrast;
  layer.shadow = shadow;

  render();
}

function drawImageAdjusted(image, p, brightness=1, contrast=1, opacity=1, rotation=0, skewX=0, skewY=0){
  // Legacy stub, no longer draws furniture onto canvas
}

function applyOverlay(id, image, p, brightness=1, contrast=1, opacity=1, rotateX=0, rotateY=0, rotateZ=0, shadow=0){
  const el = document.getElementById(id);
  if(!el) return;
  el.src = image.src;
  
  const cx = 1586, cy = 992;
  el.style.left = (p.x / cx * 100) + '%';
  el.style.top = (p.y / cy * 100) + '%';
  el.style.width = (p.w / cx * 100) + '%';
  el.style.height = (p.h / cy * 100) + '%';
  el.style.opacity = opacity;
  el.style.filter = `brightness(${brightness}) contrast(${contrast}) drop-shadow(0px 30px 40px rgba(0,0,0,${shadow}))`;
  el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
}

function drawBox(p, label){
  if(!showBoxes) return;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(48,26,68,.95)";
  ctx.setLineDash([8,6]);
  ctx.strokeRect(p.x, p.y, p.w, p.h);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(48,26,68,.92)";
  ctx.fillRect(p.x, Math.max(0,p.y-24), Math.max(70, label.length*7), 22);
  ctx.fillStyle = "#fff";
  ctx.font = "12px system-ui";
  ctx.fillText(label, p.x+8, Math.max(14,p.y-8));
  ctx.restore();
}

function drawVignette(){
  ctx.save();
  const g = ctx.createRadialGradient(canvas.width*.52, canvas.height*.52, canvas.width*.28, canvas.width*.52, canvas.height*.52, canvas.width*.78);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(25,13,4,.18)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}

function render(){
  if(!catalog || !images[catalog.base.src]) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(images[catalog.base.src], 0, 0, canvas.width, canvas.height);

  const layer3Obj = getLayer3();
  const wp = state.layout.layer3;
  applyOverlay('overlayLayer3', images[layer3Obj.src], wp, wp.brightness ?? 1, wp.contrast ?? 1, wp.opacity ?? 1, wp.rotateX ?? 0, wp.rotateY ?? 0, wp.rotateZ ?? 0, wp.shadow ?? .3);

  const layer2Obj = getLayer2();
  const tp = state.layout.layer2;
  
  // Render layer2 single asset (like coffee table)
  if(layer2Obj.src && images[layer2Obj.src]) {
    applyOverlay('overlayLayer2Right', images[layer2Obj.src], tp, tp.brightness ?? 1, tp.contrast ?? 1, tp.opacity ?? 1, tp.rotateX ?? 0, tp.rotateY ?? 0, tp.rotateZ ?? 0, tp.shadow ?? .24);
    drawBox(tp, "layer2");
    if(document.getElementById('overlayLayer2Left')) document.getElementById('overlayLayer2Left').style.display = 'none';
  } else {
    // Render layer2 double asset (like side tables)
    if(!rightOnly && images[layer2Obj.left]) {
      document.getElementById('overlayLayer2Left').style.display = 'block';
      const lp = tp.left;
      applyOverlay('overlayLayer2Left', images[layer2Obj.left], lp, tp.brightness ?? 1, tp.contrast ?? 1, tp.opacity ?? 1, tp.rotateX ?? 0, tp.rotateY ?? 0, tp.rotateZ ?? 0, tp.shadow ?? .22);
      drawBox(lp, currentRoom === "bedroom" ? "left table" : "left asset");
    } else {
      document.getElementById('overlayLayer2Left').style.display = 'none';
    }
    const rp = tp.right;
    applyOverlay('overlayLayer2Right', images[layer2Obj.right], rp, tp.brightness ?? 1, tp.contrast ?? 1, tp.opacity ?? 1, tp.rotateX ?? 0, tp.rotateY ?? 0, tp.rotateZ ?? 0, tp.shadow ?? .24);
    drawBox(rp, currentRoom === "bedroom" ? "right table" : "right asset");
  }

  const layer1Obj = getLayer1();
  const bp = state.layout.layer1;
  applyOverlay('overlayLayer1', images[layer1Obj.src], bp, bp.brightness ?? 1, bp.contrast ?? 1, bp.opacity ?? 1, bp.rotateX ?? 0, bp.rotateY ?? 0, bp.rotateZ ?? 0, bp.shadow ?? .30);

  drawVignette();

  drawBox(wp, "layer3");
  drawBox(bp, "layer1");
}

function canvasPoint(evt){
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * sx,
    y: (evt.clientY - rect.top) * sy
  };
}

function hitTest(p, box){
  return p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
}

canvas.addEventListener("pointerdown", e => {
  const p = canvasPoint(e);
  const boxes = [
    ["layer1", state.layout.layer1],
    ["layer3", state.layout.layer3]
  ];
  
  if(getLayer2().src) {
    boxes.push(["layer2Right", state.layout.layer2]); // use right layer for single assets like coffee table
  } else {
    boxes.push(["layer2Right", state.layout.layer2.right]);
    if (!rightOnly && images[getLayer2().left]) {
      boxes.unshift(["layer2Left", state.layout.layer2.left]);
    }
  }
  for(const [layer, box] of boxes){
    if(hitTest(p, box)){
      selectedLayer = layer;
      syncUI();
      dragging = true;
      canvas.classList.add("dragging");
      dragStart = {
        p,
        layer1: {...state.layout.layer1},
        layer3: {...state.layout.layer3},
        layer2Left: state.layout.layer2.left ? {...state.layout.layer2.left} : null,
        layer2Right: state.layout.layer2.right ? {...state.layout.layer2.right} : {...state.layout.layer2}
      };
      canvas.setPointerCapture(e.pointerId);
      return;
    }
  }
});

canvas.addEventListener("pointermove", e => {
  if(!dragging || !dragStart) return;
  const p = canvasPoint(e);
  const dx = p.x - dragStart.p.x;
  const dy = p.y - dragStart.p.y;

  if(selectedLayer === "layer1"){
    state.layout.layer1.x = dragStart.layer1.x + dx;
    state.layout.layer1.y = dragStart.layer1.y + dy;
  }
  if(selectedLayer === "layer3"){
    state.layout.layer3.x = dragStart.layer3.x + dx;
    state.layout.layer3.y = dragStart.layer3.y + dy;
  }
  if(selectedLayer === "layer2Left" && state.layout.layer2.left){
    state.layout.layer2.left.x = dragStart.layer2Left.x + dx;
    state.layout.layer2.left.y = dragStart.layer2Left.y + dy;
  }
  if(selectedLayer === "layer2Right"){
    if(state.layout.layer2.right) {
      state.layout.layer2.right.x = dragStart.layer2Right.x + dx;
      state.layout.layer2.right.y = dragStart.layer2Right.y + dy;
    } else {
      state.layout.layer2.x = dragStart.layer2Right.x + dx;
      state.layout.layer2.y = dragStart.layer2Right.y + dy;
    }
  }
  syncSlidersFromLayer();
  render();
});

canvas.addEventListener("pointerup", e => {
  dragging = false;
  dragStart = null;
  canvas.classList.remove("dragging");
});

function download(filename, content, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function autoFit(){
  resetLayoutsToCatalog();
  syncUI();
  render();
}

function randomize(){
  state.layer1 = catalog.layer1[Math.floor(Math.random()*catalog.layer1.length)].id;
  state.layer2 = catalog.layer2[Math.floor(Math.random()*catalog.layer2.length)].id;
  state.layer3 = catalog.layer3[Math.floor(Math.random()*catalog.layer3.length)].id;
  resetLayoutsToCatalog();
  syncUI();
  render();
}

async function setup(){
  await loadCatalog();
  makeGrid("layer1Grid", catalog.layer1, "layer1");
  makeGrid("layer2Grid", catalog.layer2, "layer2");
  makeGrid("layer3Grid", catalog.layer3, "layer3");
  
  // Set initial z-index order
  if(currentRoom === "bedroom"){
    document.getElementById("overlayLayer3").style.zIndex = 10;
    document.getElementById("overlayLayer2Left").style.zIndex = 20;
    document.getElementById("overlayLayer2Right").style.zIndex = 20;
    document.getElementById("overlayLayer1").style.zIndex = 30;
  } else {
    document.getElementById("overlayLayer1").style.zIndex = 10;
    document.getElementById("overlayLayer2Left").style.zIndex = 20;
    document.getElementById("overlayLayer2Right").style.zIndex = 20;
    document.getElementById("overlayLayer3").style.zIndex = 30;
  }

  await preload();

  
  document.getElementById("roomSelect").addEventListener("change", async e => {
    currentRoom = e.target.value;
    
    // Update tabs
    if(currentRoom === "bedroom"){
      document.getElementById("tab1").textContent = "Beds";
      document.getElementById("tab2").textContent = "Tables";
      document.getElementById("tab3").textContent = "Wardrobes";
      document.getElementById("optLayer1").textContent = "Bed";
      document.getElementById("optLayer2Right").textContent = "Right Side Table";
      document.getElementById("optLayer2Left").textContent = "Left Side Table";
      document.getElementById("optLayer3").textContent = "Wardrobe";
    } else {
      document.getElementById("tab1").textContent = "Sofas";
      document.getElementById("tab2").textContent = "Coffee Tables";
      document.getElementById("tab3").textContent = "Chairs";
      document.getElementById("optLayer1").textContent = "Sofa";
      document.getElementById("optLayer2Right").textContent = "Right Coffee Table";
      document.getElementById("optLayer2Left").textContent = "Left Coffee Table";
      document.getElementById("optLayer3").textContent = "Armchair";
    }
    
    selectedLayer = "layer1";
    document.getElementById("layer1Grid").innerHTML = "";
    document.getElementById("layer2Grid").innerHTML = "";
    document.getElementById("layer3Grid").innerHTML = "";
    
    await loadCatalog();
    makeGrid("layer1Grid", catalog.layer1, "layer1");
    makeGrid("layer2Grid", catalog.layer2, "layer2");
    makeGrid("layer3Grid", catalog.layer3, "layer3");
    
    // Update z-index order dynamically
    if(currentRoom === "bedroom"){
      document.getElementById("overlayLayer3").style.zIndex = 10;
      document.getElementById("overlayLayer2Left").style.zIndex = 20;
      document.getElementById("overlayLayer2Right").style.zIndex = 20;
      document.getElementById("overlayLayer1").style.zIndex = 30;
    } else {
      document.getElementById("overlayLayer1").style.zIndex = 10;
      document.getElementById("overlayLayer2Left").style.zIndex = 20;
      document.getElementById("overlayLayer2Right").style.zIndex = 20;
      document.getElementById("overlayLayer3").style.zIndex = 30;
    }

    await preload();
    autoFit();
  });
  document.getElementById("layerSelect").addEventListener("change", e => {
    selectedLayer = e.target.value;
    syncUI();
  });

  ["xRange","yRange","scaleRange","rotateXRange","rotateYRange","rotateZRange","brightRange","contrastRange","shadowRange"].forEach(id => {
    document.getElementById(id).addEventListener("input", applySliderChange);
  });

  document.getElementById("outlineToggle").addEventListener("change", e => {
    showBoxes = e.target.checked;
    render();
  });

  document.getElementById("rightOnlyToggle").addEventListener("change", e => {
    rightOnly = e.target.checked;
    render();
  });

  document.getElementById("autoFitBtn").addEventListener("click", autoFit);
  document.getElementById("resetLayerBtn").addEventListener("click", () => {
    resetSingleLayer(selectedLayer);
    syncUI();
    render();
  });

  document.getElementById("randomBtn").addEventListener("click", randomize);
  document.getElementById("resetBtn").addEventListener("click", autoFit);

  syncUI();
  render();
}
setup().catch(err => {
  console.error(err);
  statusEl.innerHTML = "Error loading visualizer: <br/>" + err.message + "<br/>" + err.stack;
});

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.category-section').forEach(sec => sec.style.display = 'none');
    const target = btn.dataset.target;
    document.getElementById(target).style.display = 'block';
  });
});

// Premium Custom Select Logic
window.refreshCustomSelects = function() {
  document.querySelectorAll('select').forEach(select => {
    // If it already has a wrapper, update the options text
    const wrapper = select.closest('.custom-select-wrapper');
    if (wrapper) {
      const trigger = wrapper.querySelector('.custom-select-trigger');
      trigger.textContent = select.options[select.selectedIndex]?.text || '';
      const optionsList = wrapper.querySelector('.custom-options');
      optionsList.innerHTML = '';
      Array.from(select.options).forEach((option, index) => {
        const optEl = document.createElement('div');
        optEl.className = 'custom-option' + (option.selected ? ' selected' : '');
        optEl.textContent = option.text;
        optEl.dataset.value = option.value;
        optEl.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = option.value;
          trigger.textContent = option.text;
          optionsList.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
          optEl.classList.add('selected');
          wrapper.classList.remove('open');
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        optionsList.appendChild(optEl);
      });
      return;
    }

    // Otherwise, create it for the first time
    const newWrapper = document.createElement('div');
    newWrapper.className = 'custom-select-wrapper';
    select.parentNode.insertBefore(newWrapper, select);
    newWrapper.appendChild(select);
    
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.textContent = select.options[select.selectedIndex]?.text || '';
    
    const optionsList = document.createElement('div');
    optionsList.className = 'custom-options';
    
    Array.from(select.options).forEach((option, index) => {
      const optEl = document.createElement('div');
      optEl.className = 'custom-option' + (option.selected ? ' selected' : '');
      optEl.textContent = option.text;
      optEl.dataset.value = option.value;
      optEl.addEventListener('click', (e) => {
        e.stopPropagation();
        select.value = option.value;
        trigger.textContent = option.text;
        optionsList.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
        optEl.classList.add('selected');
        newWrapper.classList.remove('open');
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      optionsList.appendChild(optEl);
    });
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-wrapper').forEach(w => {
        if (w !== newWrapper) w.classList.remove('open');
      });
      newWrapper.classList.toggle('open');
    });
    
    newWrapper.appendChild(trigger);
    newWrapper.appendChild(optionsList);
    
    select.addEventListener('change', () => {
      trigger.textContent = select.options[select.selectedIndex]?.text || '';
      optionsList.querySelectorAll('.custom-option').forEach((el, idx) => {
        el.classList.toggle('selected', idx === select.selectedIndex);
      });
    });
  });
};

// Close custom selects when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
});

// Run custom select setup after initial load
setTimeout(window.refreshCustomSelects, 100);
