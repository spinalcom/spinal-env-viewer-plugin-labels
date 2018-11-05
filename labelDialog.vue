<template>
  <md-dialog :md-active.sync="show"
             class="md-dialog">
    <md-field>
      <label>Name</label>
      <md-input v-model="tmp.name"
                :disabled="mode === 'info'"></md-input>
    </md-field>
    <md-field>
      <label>Description</label>
      <md-textarea v-model="tmp.description"
                   :disabled="mode === 'info'"></md-textarea>
    </md-field>
    <md-dialog-actions>
      <md-button v-if="mode !== 'info'"
                 @click="setupPositionLabel"
                 class="md-raised md-primary"
                 style="margin: auto auto">PLACE ON THE MODEL</md-button>
    </md-dialog-actions>
    <div v-if="mode !== 'info'"
         id="div-xyz">
      <md-field>
        <label>x</label>
        <md-input v-model="tmp.x"
                  type="number"
                  disabled></md-input>
      </md-field>
      <md-field>
        <label>y</label>
        <md-input v-model="tmp.y"
                  type="number"
                  disabled></md-input>
      </md-field>
      <md-field>
        <label>z</label>
        <md-input v-model="tmp.z"
                  type="number"
                  disabled></md-input>
      </md-field>
    </div>
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
                 @click="confirmLabel">
        <md-icon>check</md-icon>
      </md-button>
    </md-dialog-actions>
    <md-dialog-alert :md-active.sync="alertInvalidLabel"
                     md-title="Invalid label" />
  </md-dialog>
</template>

<script>
export default {
  name: "labelForm",
  props: ["showDialog", "tmp", "dialogMode"],
  data() {
    this.viewer;
    return {
      alertInvalidLabel: false
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
    setupPositionLabel: function() {
      this.show = false;
      document.addEventListener("mousedown", this.positionLabel, true);
      document.addEventListener("keyup", this.cleanupPostionLabel);
    },
    positionLabel: function(e) {
      let clicked = this.viewer.clientToWorld(e.layerX, e.layerY, false);

      if (clicked) {
        this.tmp.x = Math.round(clicked.intersectPoint.x);
        this.tmp.y = Math.round(clicked.intersectPoint.y);
        this.tmp.z = Math.round(clicked.intersectPoint.z);
        this.cleanupPostionLabel();
      }
    },
    cleanupPostionLabel: function() {
      this.show = true;
      document.removeEventListener("mousedown", this.positionLabel, true);
      document.removeEventListener("keyup", this.cleanupPostionLabel);
    },
    confirmLabel: function() {
      if (
        !this.tmp.name ||
        this.tmp.x === undefined ||
        this.tmp.y === undefined ||
        this.tmp.z === undefined
      ) {
        this.alertInvalidLabel = true;
        return;
      }

      this.$emit("confirmLabel", this.tmp);
      this.show = false;
    }
  },
  created() {
    this.viewer = window.spinal.ForgeViewer.viewer;
  }
};
</script>

<style scoped>
#div-xyz {
  display: flex;
}
</style>
