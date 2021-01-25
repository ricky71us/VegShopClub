<template>
  <div>
    <v-card class="mx-auto mt-4" max-width="344" outlined >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"
            >No Active Order</v-list-item-title
          >
          <v-list-item-subtitle
            >Please contact the admin to create a new order.</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({}),
  mounted(){    
  },
  computed: {
    ...mapGetters["noActiveOrder", "getCurrentOrder"],
  },
};
</script>

<style lang="scss" scoped>
</style>