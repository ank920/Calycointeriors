import os

with open('app.js', 'r') as f:
    code = f.read()

replacements = {
    'bedGrid': 'layer1Grid',
    'tableGrid': 'layer2Grid',
    'wardrobeGrid': 'layer3Grid',
    'catalog.beds': 'catalog.layer1',
    'catalog.tables': 'catalog.layer2',
    'catalog.wardrobes': 'catalog.layer3',
    'state.bed': 'state.layer1',
    'state.table': 'state.layer2',
    'state.wardrobe': 'state.layer3',
    'getBed': 'getLayer1',
    'getTable': 'getLayer2',
    'getWardrobe': 'getLayer3',
    'overlayBed': 'overlayLayer1',
    'overlayTableLeft': 'overlayLayer2Left',
    'overlayTableRight': 'overlayLayer2Right',
    'overlayWardrobe': 'overlayLayer3',
    'state.layout.bed': 'state.layout.layer1',
    'state.layout.table': 'state.layout.layer2',
    'state.layout.wardrobe': 'state.layout.layer3',
    'dragStart.bed': 'dragStart.layer1',
    'dragStart.tableLeft': 'dragStart.layer2Left',
    'dragStart.tableRight': 'dragStart.layer2Right',
    'dragStart.wardrobe': 'dragStart.layer3',
    '"bed"': '"layer1"',
    '"table"': '"layer2"',
    '"wardrobe"': '"layer3"',
    '"tableLeft"': '"layer2Left"',
    '"tableRight"': '"layer2Right"',
    'selectedLayer === "layer2" ? "layer2Right"': 'selectedLayer === "layer2" ? "layer2Right"',
    'const table = getLayer2();': 'const layer2Obj = getLayer2();',
    'const bed = getLayer1();': 'const layer1Obj = getLayer1();',
    'const wardrobe = getLayer3();': 'const layer3Obj = getLayer3();',
    'images[bed.src]': 'images[layer1Obj.src]',
    'images[wardrobe.src]': 'images[layer3Obj.src]',
    'images[table.left]': 'images[layer2Obj.left]',
    'images[table.right]': 'images[layer2Obj.right]',
    'table.rightOnly': 'layer2Obj.rightOnly'
}

for k, v in replacements.items():
    code = code.replace(k, v)

# Add currentRoom global
code = 'let currentRoom = "bedroom";\n' + code

# Modify loadCatalog
code = code.replace('await fetch(\'catalog.json\')', 'await fetch(currentRoom === "bedroom" ? "catalog.json" : "catalog-living.json")')

# Inject setup
setup_insert = """
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
    await preload();
    autoFit();
  });
"""

code = code.replace('document.getElementById("layerSelect")', setup_insert + '  document.getElementById("layerSelect")')

with open('app.js', 'w') as f:
    f.write(code)

