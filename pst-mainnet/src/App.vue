<template>
  <div id="app">
    <main>
      <router-view />
    </main>

    <footer></footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
#app {
  font-family: "Noto Sans Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  min-height: calc(100vh - 100px);
}

a {
  color: #5982f1;
}

ul {
  padding-inline-start: 20px;
}
</style>
