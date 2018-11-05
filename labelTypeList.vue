<template>
  <md-content>
    <md-list :md-expand-single="false">
      <label-type-node :type-node="labelTypeNodes[index]"
                       :type="type"
                       @delete="$emit('deleteType', index)"
                       v-for="(type, index) in labelTypes"
                       :key="index" />
      <md-list-item>
        <label-type-create @addType="(newType) => {$emit('addType', newType)}" />
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
import labelTypeNode from "./labelTypeNode.vue";
import labelTypeCreate from "./labelTypeCreate.vue";

export default {
  name: "labelTypeList",
  components: {
    labelTypeNode,
    labelTypeCreate
  },
  props: {
    labelTypeNodes: {
      type: Array,
      required: true
    },
    labelTypes: {
      type: Array,
      required: true
    }
  },
  methods: {
    addLabel: function(newLabel) {
      this.$emit("addLabel", newLabel);
    },
    infoLabel: function(label) {
      this.dialogMode = "info";

      this.tmp = {};
      this.tmp.name = label.name.get();
      this.tmp.description = label.description.get();
      this.tmp.x = label.x.get();
      this.tmp.y = label.y.get();
      this.tmp.z = label.z.get();
      this.active = label;

      this.showLabelDialog = true;
    },
    setLabelDialog: function(value) {
      this.showLabelDialog = value;
    }
  }
};
</script>
