<template>
  <md-content class="container-label">
    <label-type-list :context="context"
                     :label-type-nodes="labelTypeNodes"
                     :label-types="labelTypes"
                     @addType="addType"
                     @deleteType="deleteType" />
  </md-content>
</template>

<script>
const spinalCore = require("spinal-core-connectorjs");
import { createLabelShape } from "./utilities.js";
import labelTypeList from "./labelTypeList.vue";
import labelCreate from "./labelCreate.vue";
import {
  SpinalNode,
  SpinalContext,
  SpinalGraph,
  SPINAL_RELATION_LST_PTR_TYPE
} from "spinal-model-graph";
import { LabelModel } from "./labelModel.js";

function hitTest(e) {
  let viewer = window.spinal.ForgeViewer.viewer;
  let x = (e.clientX / window.innerWidth) * 2 - 1;
  let y = -(e.clientY / window.innerHeight) * 2 + 1;
  let camera = viewer.impl.camera;
  let vector = new THREE.Vector3(x, y, 0).unproject(camera);

  let raycaster = new THREE.Raycaster();
  raycaster.set(camera.position, vector.sub(camera.position).normalize());

  let hit = [];
  for (let shape of viewer.impl.scene.children) {
    let hover = raycaster.intersectObject(shape);
    hit = hit.concat(hover);
  }

  hit.sort((a, b) => {
    return a.distance - b.distance;
  });

  return hit.length > 0 ? hit[0].object : undefined;
}

function onMove(e) {
  let viewer = window.spinal.ForgeViewer.viewer;
  let hover = hitTest(e);
  let updateNeeded = false;

  for (let shape of viewer.impl.scene.children) {
    if (shape == hover && shape.hovered == false) {
      shape.hovered = true;
      shape.material.color.r *= 2;
      shape.material.color.g *= 2;
      shape.material.color.b *= 2;
      updateNeeded = true;
    } else if (shape != hover && shape.hovered == true) {
      shape.hovered = false;
      shape.material.color.r /= 2;
      shape.material.color.g /= 2;
      shape.material.color.b /= 2;
      updateNeeded = true;
    }
  }
  if (updateNeeded) viewer.impl.invalidate(false, true);
}

export default {
  name: "labelContainer",
  components: {
    labelTypeList,
    labelCreate
  },
  data() {
    this.viewer;
    this.graph;
    this.context;
    this.labelTypeNodes = [];
    return {
      labelTypes: []
    };
  },
  methods: {
    loadTypes: function() {
      this.context.getChildren(["hasLabelType"]).then(children => {
        this.labelTypeNodes = children;

        let promises = [];
        for (let child of children) {
          promises.push(child.getElement());
        }
        Promise.all(promises).then(elements => {
          this.labelTypes = elements;
        });
      });
    },
    load: function() {
      let conn = FileSystem.get_inst();
      let self = this;

      spinalCore.load(
        conn,
        "/__users__/admin/graph",
        graph => {
          self.graph = graph;
          self.graph.getContext("labels").then(context => {
            self.context = context;
            if (typeof self.context === "undefined") {
              self.context = new SpinalContext("labels");
              self.graph.addContext(self.context);
            }
            self.loadTypes();
          });
        },
        () => {
          self.graph = new SpinalGraph();
          spinalCore.store(conn, self.graph, "/__users__/admin/graph", () => {
            self.context = new SpinalContext("labels");
            self.graph.addContext(self.context);
          });
        }
      );
    },
    addType: function(newType) {
      let newNode = new SpinalNode(newType.name.get(), undefined, newType);

      this.context.addChildInContext(newNode, "hasLabelType", SPINAL_RELATION_LST_PTR_TYPE);
      this.labelTypes.push(newType);
      this.labelTypeNodes.push(newNode);
    },
    deleteType: function(index) {
      this.labelTypeNodes[index].removeFromGraph();
      this.labelTypes.splice(index, 1);
      this.labelTypeNodes.splice(index, 1);
    }
  },
  created() {
    this.viewer = window.spinal.ForgeViewer.viewer;
    this.graph = window.spinal.ForgeViewer.forgeFile.graph;
  },
  mounted() {
    this.load();
    this.viewer.impl.invalidate(false, true);

    document.addEventListener("mousemove", onMove, false);
  }
};
</script>

<style>
.container-label {
  height: calc(100% - 48px);
  overflow-y: auto;
}

.container-label * {
  box-sizing: border-box;
}

.md-dialog {
  width: 25%;
  padding-left: 2%;
  padding-right: 2%;
}

.md-menu-content {
  z-index: 110;
}
</style>
