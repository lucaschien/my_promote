<template>
  <div class="app-header">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String
    }
  }
}
</script>
