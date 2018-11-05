<template>
  <md-list-item>
    {{label.name.get()}}
    <md-button @click="infoLabel(label)">
      <md-icon>menu</md-icon>
    </md-button>
    <md-button @click="$emit('delete')">
      <md-icon>delete</md-icon>
    </md-button>
    <label-dialog :show-dialog="showDialog"
                  :tmp="tmp"
                  :dialog-mode="dialogMode"
                  @confirmLabel="editLabel"
                  @setDialog="(value) => {showDialog = value}"
                  @setDialogMode="(value) => {dialogMode = value}" />
  </md-list-item>
</template>

<script>
import labelDialog from "./labelDialog.vue";

export default {
  name: "labelNode",
  components: {
    labelDialog
  },
  props: {
    label: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDialog: false,
      tmp: {},
      dialogMode: ""
    };
  },
  methods: {
    infoLabel: function(label) {
      this.dialogMode = "info";
      this.tmp = {};
      this.tmp.name = label.name.get();
      this.tmp.description = label.description.get();
      this.tmp.x = label.x.get();
      this.tmp.y = label.y.get();
      this.tmp.z = label.z.get();
      this.active = label;
      this.showDialog = true;
    },
    editLabel: function(edit) {
      this.label.name.set(edit.name);
      this.label.description.set(edit.description);
      this.label.x.set(edit.x);
      this.label.y.set(edit.y);
      this.label.z.set(edit.z);
      this.label.mesh.position.set(edit.x, edit.y, edit.z);

      window.spinal.ForgeViewer.viewer.impl.invalidate(true);
    }
  }
};
</script>
