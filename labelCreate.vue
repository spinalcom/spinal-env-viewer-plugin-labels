<template>
  <md-content>
    <label-dialog :show-dialog="showDialog"
                  :tmp="tmp"
                  :dialog-mode="'create'"
                  @confirmLabel="confirmCreate"
                  @setDialog="setDialog"></label-dialog>
    <md-button @click="createLabel">
      <md-icon>add</md-icon>
    </md-button>
  </md-content>
</template>

<script>
import { LabelModel } from "./labelModel.js";
import labelDialog from "./labelDialog.vue";

export default {
  name: "labelCreate",
  components: {
    labelDialog
  },
  props: ["type"],
  data() {
    return {
      tmp: {},
      showDialog: false
    };
  },
  methods: {
    createLabel: function() {
      this.tmp = {};
      this.showDialog = true;
    },
    setDialog: function(value) {
      this.showDialog = value;
    },
    confirmCreate: function(inputLabel) {
      let newLabel = new LabelModel();

      newLabel.type = this.type;
      newLabel.name.set(inputLabel.name);
      newLabel.description.set(inputLabel.description);
      newLabel.x.set(inputLabel.x);
      newLabel.y.set(inputLabel.y);
      newLabel.z.set(inputLabel.z);

      this.$emit("addLabel", newLabel);
    }
  }
};
</script>
