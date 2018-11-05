<template>
  <md-content>
    <md-list>
      <label-node :label="label"
                  @delete="$emit('deleteLabel', label, index)"
                  v-for="(label, index) in labels"
                  :key="index" />

      <md-list-item>
        <label-create :type="type"
                      @addLabel="(newLabel) => {$emit('addLabel', newLabel)}" />
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
import labelNode from "./labelNode.vue";
import labelCreate from "./labelCreate.vue";

export default {
  name: "labelList",
  components: {
    labelCreate,
    labelNode
  },
  props: {
    typeNode: {
      type: Object,
      required: true
    },
    type: {
      type: Object,
      required: true
    },
    labels: {
      type: Array,
      required: true
    }
  }
};
</script>
