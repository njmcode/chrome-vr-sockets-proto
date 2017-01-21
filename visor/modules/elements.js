var ElementFactory = (function() {

  var TEXTURES = {

  }

  function VisorFloor() {
    var geo = new THREE.PlaneGeometry(1000, 1000);

    var texture = THREE.ImageUtils.loadTexture(
    'assets/textures/patterns/dots.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(250, 250);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      map: texture
    });

    var mesh = new THREE.Mesh(geo, material);

    return mesh;
  }

  function VisorSphere() {
    var geo = new THREE.SphereGeometry( 30, 40, 40 );

    var texture = THREE.ImageUtils.loadTexture(
      'assets/textures/patterns/dots.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(60, 60);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      map: texture,
      side: THREE.BackSide
    });
    var mesh = new THREE.Mesh(geo, material);

    return mesh;
  }

  function ScaryFace() {
    var texture = new THREE.ImageUtils.loadTexture(
      'assets/textures/scare.png'
    );
    var geo = new THREE.PlaneGeometry(5, 5);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer.getMaxAnisotropy();
    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      map: texture
    });
    var mesh  = new THREE.Mesh(geo, material);
    mesh.position.set(0, 0, -5);
    mesh.material.opacity = 1;

    return mesh;
  }

  return {
    VisorFloor: VisorFloor,
    VisorSphere: VisorSphere,
    ScaryFace: ScaryFace
  }

})();