<template>
  <div class="NavItem" :class="{ 'is-active': isActive }" :style="nestStyle" @click="$emit('click')">
    <div class="NavItem__Label">
      <span class="NavItem__Icon" v-if="$slots['icon']"><slot name="icon" /></span>
      {{ label }}
    </div>
    <div class="NavItem__Menu" v-if="$slots['menu']">
      <slot name="menu" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true
    },
    nestLevel: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nestStyle(): any {
      return {
        "padding-left": `${this.nestLevel * 16 + 4}px`
      };
    }
  }
});
</script>

<style scoped>
.NavItem {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  line-height: 48px;
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  text-align: left;
  transition: 0.3s;
  box-sizing: border-box;
  outline: none;
}

.NavItem:hover {
  cursor: pointer;
}

.NavItem.is-active,
.NavItem:hover,
.NavItem:focus {
  background-color: rgba(0, 79, 153, 0.492);
}

.NavItem__Icon {
  margin-right: var(--space-lv1);
}
</style>
