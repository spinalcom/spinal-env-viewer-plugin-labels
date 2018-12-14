<template>
  <md-list-item md-expand>
    <span class="md-list-item-text">{{type.name.get()}}</span>
    <md-button @click="infoType(type)">
      <md-icon>menu</md-icon>
    </md-button>
    <md-button @click="$emit('delete')">
      <md-icon>delete</md-icon>
    </md-button>
    <label-list :type-node="typeNode"
                :type="type"
                :labels="labels"
                @addLabel="addLabel"
                @deleteLabel="deleteLabel"
                slot="md-expand" />
    <label-type-dialog :show-dialog="showDialog"
                       :tmp="tmp"
                       :dialog-mode="dialogMode"
                       @confirmType="(edit) => {$emit('editType', type, labels, edit)}"
                       @setDialog="(value) => {showDialog = value}"
                       @setDialogMode="(value) => {dialogMode = value}" />
  </md-list-item>
</template>

<script>
import Vue from "vue";
import { SpinalNode } from "spinal-model-graph";
import { createLabelShape } from "./utilities.js";
import labelTypeDialog from "./labelTypeDialog.vue";
import labelList from "./labelList.vue";

export default {
  name: "labelTypeNode",
  components: {
    labelTypeDialog,
    labelList
  },
  props: {
    context: {
      type: Object,
      required: false
    },
    typeNode: {
      type: Object,
      required: true
    },
    type: {
      type: Object,
      required: true
    }
  },
  data() {
    this.viewer;
    return {
      labelNodes: [],
      labels: [],
      showDialog: false,
      tmp: {},
      dialogMode: ""
    };
  },
  methods: {
    loadLabels: function() {
      this.typeNode.getChildren(["hasLabel"]).then(labelNodes => {
        this.labelNodes = labelNodes;

        let promises = [];
        for (let label of labelNodes) {
          promises.push(label.getElement());
        }
        Promise.all(promises).then(elements => {
          this.labels = elements;

          for (let label of this.labels) {
            createLabelShape(label, this.type);
          }
          this.viewer.impl.invalidate(false, true);
        });
      });
    },
    infoType: function() {
      this.dialogMode = "info";

      this.tmp = {};
      this.tmp.name = this.type.name.get();
      this.tmp.meshSize = this.type.meshSize.get();
      this.tmp.geometry = this.type.geometry.get();
      this.tmp.color = this.type.color.get();
      this.active = this.type;

      this.showDialog = true;
    },
    editType: function(edit) {
      if (this.type.name.get() !== edit.name) this.type.name.set(edit.name);

      if (this.type.meshSize.get() !== edit.meshSize) {
        for (let label of this.labels) {
          let scale = edit.meshSize / this.type.meshSize.get();

          label.mesh.scale.x = scale;
          label.mesh.scale.y = scale;
          label.mesh.scale.z = scale;
        }
        this.type.meshSize.set(edit.meshSize);
      }

      if (this.type.geometry.get() !== edit.geometry) {
        this.type.geometry.set(edit.geometry);
        for (let label of this.labels) {
          this.viewer.impl.scene.remove(label.mesh);
          createLabelShape(label, this.type);
        }
      }

      if (this.type.color.get() !== edit.color) {
        this.type.color.set(edit.color);
        for (let label of this.labels) {
          label.mesh.material = new THREE.MeshPhongMaterial({
            color: this.type.color.get()
          });
          this.viewer.impl
            .matman()
            .addMaterial(
              "ADN-Material" + this.type.color.get(),
              label.mesh.material,
              true
            );
        }
      }
      this.viewer.impl.invalidate(true);
    },
    addLabel: function(newLabel) {
      let labelNode = new SpinalNode(newLabel.name.get(), undefined, newLabel);

      this.typeNode.addChildInContext(labelNode, "hasLabel", 0, this.context);
      this.labelNodes.push(labelNode);
      this.labels.push(newLabel);

      createLabelShape(newLabel, this.type);
      this.viewer.impl.invalidate(false, true);
    },
    deleteLabel: function(label, index) {
      this.labelNodes[index].removeFromGraph();
      this.labelNodes.splice(index, 1);
      this.labels.splice(index, 1);

      this.viewer.impl.scene.remove(label.mesh);
      this.viewer.impl.invalidate(true);
    }
  },
  created() {
    this.viewer = window.spinal.ForgeViewer.viewer;
  },
  mounted() {
    this.loadLabels();
  }
};
</script>
