<template>
  <div class="home-view">
    <RecordForm />
    <RecordList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import RecordForm from '../components/RecordForm.vue'
import RecordList from '../components/RecordList.vue'
import { useRecordsStore } from '../stores/records.js'

const store = useRecordsStore()

onMounted(async () => {
  await store.fetchRecords()
})
</script>

<style scoped>
.home-view {
  max-width: 700px;
  margin: 0 auto;
}
</style>
