function createLabelShape(label, type) {
  let viewer = window.spinal.ForgeViewer.viewer;

  let material = new THREE.MeshPhongMaterial({
    color: type.color.get()
  });
  viewer.impl
    .matman()
    .addMaterial("ADN-Material" + type.color.get(), material, true);

  let geometry;
  if (type.geometry.get() === "sphere") {
    geometry = new THREE.SphereGeometry(type.meshSize.get() / 2, 100, 100);
  } else if (type.geometry.get() === "cube") {
    geometry = new THREE.BoxGeometry(
      type.meshSize.get(),
      type.meshSize.get(),
      type.meshSize.get()
    );
  }

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(label.x.get(), label.y.get(), label.z.get());
  mesh.hovered = false;
  viewer.impl.scene.add(mesh);
  label.mesh = mesh;
}

export {
  createLabelShape
}
