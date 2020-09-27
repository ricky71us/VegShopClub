<template>
  <div>
    <v-bottom-navigation v-model="bottomNav">
      <v-btn  value="recent">
        <span>Manage Users</span>
        <v-icon small>mdi-history</v-icon>
      </v-btn>

      <v-btn value="favorites">
        <span>Manage Orders</span>
        <v-icon small>mdi-heart</v-icon>
      </v-btn>

      <v-btn value="nearby">
        <span>Manage Items</span>
        <v-icon small>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  data: () => ({
    links: [
      //'Home',
      // 'About Us',
      // 'Team',
      // 'Services',
      // 'Blog',
      // 'Contact Us',
    ],
     bottomNav: 'recent',
  }),
};
</script>