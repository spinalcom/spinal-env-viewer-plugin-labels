<template>
  <md-content>
    <label-type-dialog :show-dialog="showDialog"
                       :tmp="tmp"
                       :dialog-mode="'create'"
                       @confirmType="confirmCreate"
                       @setDialog="setDialog"></label-type-dialog>
    <md-button @click="createLabelType">
      <md-icon>add</md-icon>
    </md-button>
  </md-content>
</template>

<script>
import { LabelTypeModel } from "./labelModel.js";
import labelTypeDialog from "./labelTypeDialog.vue";

export default {
  name: "labelTypeCreate",
  components: {
    labelTypeDialog
  },
  data() {
    return {
      tmp: {},
      showDialog: false
    };
  },
  methods: {
    createLabelType: function() {
      this.tmp = {};
      this.showDialog = true;
    },
    setDialog: function(value) {
      this.showDialog = value;
    },
    confirmCreate: function(inputType) {
      let newType = new LabelTypeModel();

      newType.name.set(inputType.name);
      newType.meshSize.set(inputType.meshSize);
      newType.geometry.set(inputType.geometry);
      newType.color.set(inputType.color);

      this.$emit("addType", newType);
    }
  }
};
</script>
