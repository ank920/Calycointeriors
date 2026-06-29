const fs = require('fs');
try {
  let catalog = JSON.parse(fs.readFileSync('catalog.json'));
  let state = {};
  state.layer1 = catalog.layer1[0].id;
  state.layer2 = catalog.layer2[0].id;
  state.layer3 = catalog.layer3[0].id;
  
  function getLayer1(){ return catalog.layer1.find(x => x.id === state.layer1); }
  function getLayer2(){ return catalog.layer2.find(x => x.id === state.layer2); }
  function getLayer3(){ return catalog.layer3.find(x => x.id === state.layer3); }

  console.log("getLayer1:", getLayer1().name);
  console.log("getLayer2:", getLayer2().name);
  console.log("getLayer3:", getLayer3().name);

  // Preload test
  const urls = [catalog.base.src];
  catalog.layer1.forEach(x => urls.push(x.src, x.thumb));
  catalog.layer2.forEach(x => urls.push(x.right, x.left, x.thumb));
  catalog.layer3.forEach(x => urls.push(x.src, x.thumb));

} catch(e) {
  console.error("ERROR catalog.json:", e);
}

try {
  let catalog = JSON.parse(fs.readFileSync('catalog-living.json'));
  let state = {};
  state.layer1 = catalog.layer1[0].id;
  state.layer2 = catalog.layer2[0].id;
  state.layer3 = catalog.layer3[0].id;

  const urls = [catalog.base.src];
  catalog.layer1.forEach(x => urls.push(x.src, x.thumb));
  catalog.layer2.forEach(x => urls.push(x.right, x.left, x.thumb));
  catalog.layer3.forEach(x => urls.push(x.src, x.thumb));
} catch(e) {
  console.error("ERROR catalog-living.json:", e);
}
