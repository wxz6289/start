<script setup lang="ts">
import { onMounted, ref } from 'vue';

const title = ref('Hello World');
const counter = ref(0);

function changeTitle() {
  window.start.handlers.setTitle(title.value);
}

async function openFile() {
  const filePath = await window.start.handlers.openFile();
  if (filePath) {
    title.value = filePath;
  }
}

onMounted(() => {
  window.start.handlers.ping().then((response) => {
    console.log(response);
  });

  window.start.handlers.onUpdateCounter((value: number) => {
    console.log(value);
    counter.value += value;
    window.start.handlers.counterValue(counter.value);
  });
});

</script>

<template>
  <h1>You did it!</h1>
  <p>{{ title }}</p>
  <div>
    <input v-model="title" placeholder="Enter new title" />
    <input v-model="counter" type="number" placeholder="Enter counter value" />
  </div>
  <button @click="changeTitle">Change Title</button>
  <button @click="openFile">Open File</button>
</template>

<style scoped></style>
