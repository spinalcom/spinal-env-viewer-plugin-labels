<template>
  <md-dialog :md-active.sync="show"
             class="md-dialog">
    <md-field>
      <label>Name</label>
      <md-input v-model="tmp.name"
                :disabled="mode === 'info'"></md-input>
    </md-field>
    <md-field>
      <label>Size</label>
      <md-input v-model="tmp.meshSize"
                type="number"
                :disabled="mode === 'info'"></md-input>
    </md-field>
    <md-field>
      <label>Geometry</label>
      <md-select v-model="tmp.geometry"
                 :disabled="mode === 'info'">
        <md-option value="sphere">Sphere</md-option>
        <md-option value="cube">Cube</md-option>
      </md-select>
    </md-field>
    <md-field>
      <label>Color</label>
      <md-select v-model="tmp.color"
                 :disabled="mode === 'info'">
        <md-option value="red">Red</md-option>
        <md-option value="green">Green</md-option>
        <md-option value="blue">Blue</md-option>
        <md-option value="black">Black</md-option>
        <md-option value="white">White</md-option>
      </md-select>
    </md-field>
    <md-dialog-actions>
      <md-button v-if="mode === 'edit'"
                 @click="mode = 'info'">Cancel</md-button>
      <md-button v-else
                 @click="show = false">Close</md-button>

      <md-button v-if="mode === 'info'"
                 @click="mode = 'edit'">
        <md-icon>edit</md-icon>
      </md-button>
      <md-button v-else
                 @click="confirmType">
        <md-icon>check</md-icon>
      </md-button>
    </md-dialog-actions>
    <md-dialog-alert :md-active.sync="alertInvalidType"
                     md-title="Invalid label type" />
  </md-dialog>
</template>

<script>
export default {
  name: "labelForm",
  props: ["showDialog", "tmp", "dialogMode"],
  data() {
    return {
      alertInvalidType: false
    };
  },
  computed: {
    show: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit("setDialog", value);
      }
    },
    mode: {
      get() {
        return this.dialogMode;
      },
      set(value) {
        this.$emit("setDialogMode", value);
      }
    }
  },
  methods: {
    confirmType: function() {
      if (
        !this.tmp.name ||
        !this.tmp.meshSize ||
        this.tmp.meshSize <= 0 ||
        !this.tmp.geometry ||
        !this.tmp.color
      ) {
        this.alertInvalidType = true;
        return;
      }

      this.$emit("confirmType", this.tmp);
      this.show = false;
    }
  }
};
</script>
