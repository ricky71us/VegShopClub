<template>
  <div id="app">
    <v-card class="mx-auto mt-12" max-width="1100" color="orange" rounded>
      <v-list-item dense>
        <v-list-item-content dens class="ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-row no-gutters>
              <v-col cols="12" class="text-md-center">Manage Items</v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card class="mx-auto ma-3" max-width="1100" tile dense shaped>
      <v-form ref="form" v-model="valid">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Name
                  <v-dialog v-model="dialog" width="500" :key="localItem.id" :id="localItem.id">
                    <template v-slot:activator="{ on }">
                      <v-icon color="primary" dark v-on="on" @click="initializeItem()">mdi-plus</v-icon>(Add New Item)
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>Item Details</v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="updatedItem.name"
                          :counter="100"
                          :rules="nameRules"
                          label="Item Name"
                          required
                        ></v-text-field>

                        <v-text-field v-model="updatedItem.description" label="Description"></v-text-field>
                        <v-text-field v-model="updatedItem.minQty" label="Minimum Quantity"></v-text-field>
                        <v-select
                          v-model="updatedItem.defaultUnits"
                          :items="units"
                          label="Unit"
                          required
                        ></v-select>
                        <v-text-field v-model="updatedItem.price" label="Price"></v-text-field>

                        <v-btn
                          :disabled="!valid"
                          color="success"
                          class="mr-4"
                          @click="addNewItem()"
                          @click.stop="dialog = false"
                        >Save</v-btn>

                        <v-btn
                          color="error"
                          class="mr-4"
                          @click="initializeItem()"
                          @click.stop="dialog = false"
                        >Cancel</v-btn>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </th>
                <th class="text-left">Item Details</th>
                <th class="text-left">Active</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>
                  <v-dialog v-model="dialogEdit[item.id]" width="500" :key="item.id" :id="item.id">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        color="primary"
                        :id="item.id"
                        dark
                        v-on="on"
                        @click="editItem(item)"
                      >mdi-pencil</v-icon>
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>Item Details</v-card-title>

                      <v-card-text>
                        <v-text-field
                          v-model="tempItem.name"
                          :counter="100"
                          :rules="nameRules"
                          label="Item Name"
                          required
                        ></v-text-field>

                        <v-text-field v-model="tempItem.description" label="Description"></v-text-field>
                        <v-text-field v-model="tempItem.minQty" :value="parseFloat(tempItem.minQty).toFixed(2)" label="Minimum Quantity"></v-text-field>
                        <v-select
                          v-model="tempItem.defaultUnits"
                          :items="units"
                          label="Unit"
                          required
                        ></v-select>
                        <v-text-field v-model="tempItem.price" label="Price"></v-text-field>

                        <v-btn
                          color="success"
                          class="mr-4"
                          @click="updateItem(item)"
                          @click.stop="$set(dialogEdit, item.id,  false)"
                        >Save</v-btn>

                        <v-btn
                          color="error"
                          class="mr-4"
                          @click="initializeItem()"
                          @click.stop="$set(dialogEdit, item.id,  false)"
                        >Cancel</v-btn>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </td>
                <td>
                  <!-- <v-tooltip bottom> -->
                  <!-- <template v-slot:activator="{ on }"> -->
                  <!-- <v-checkbox
                  v-model="item.isActive"
                      :value="item.isActive"
                  class="ma-0 pa-0"
                  @click="updateItem(item)"
                  dense
                  ></v-checkbox>-->
                  <!-- <v-icon color="red" dark v-on="on" @click="deleteItem(item)">mdi-delete</v-icon> -->
                  <!-- </template>
                  <span>Delete Item</span>
                  </v-tooltip>-->

                  <v-icon
                    @click="toggleItem(item)"
                    v-if="parseInt(item.isActive) === 1"
                    color="green"
                  >mdi-check</v-icon>
                  <v-icon
                    @click="toggleItem(item)"
                    v-if="parseInt(item.isActive) === 0"
                    color="red"
                  >mdi-close</v-icon>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-form>
    </v-card>
    <v-divider></v-divider>
    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ this.message }}
      <v-btn color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "BaseManageItems",

  data() {
    return {
      units: ["nos", "bunches", "kgs", "lbs"],
      localItem: {
        id: 0,
        name: null,
        description: null,
        minQty: null,
        defaultunits: "",
        price: null,
        isActive: true
      },
      updatedItem: {
        id: 0,
        name: null,
        description: null,
        minQty: null,
        defaultUnits: "",
        price: null,
        isActive: true
      },
      tempItem: {
        id: 0,
        name: null,
        description: null,
        minQty: null,
        defaultUnits: "",
        price: null,
        isActive: true
      },
      valid: false,
      name: "",
      nameRules: [v => !!v || "Name is required"],
      dialog: false,
      dialogEdit: [],
      message: null,
      multiLine: true,
      snackbar: false,
      selected: []
    };
  },

  async mounted() {
    await this.getItemsAction();
    this.items.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  },

  methods: {
    ...mapActions([
      "getItemsAction",
      "addItemAction",
      "deleteItemAction",
      "updateItemAction"
    ]),
    snackMessage: function(message) {
      this.message = message;
      this.snackbar = true;
    },
    deleteItem: function(item) {
      if (confirm(`Do you really want to delete Item ${item.name}?`)) {
        this.deleteItemAction(item);
        this.snackMessage(`Category "${item.name}" deleted successfully!`);
      }
    },
    editItem: function(item) {
      this.valid = true;
      //console.log(this.$refs.form.validate())
      this.tempItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        minQty: parseFloat(item.minQty).toFixed(2),
        price: parseFloat(item.price).toFixed(2),
        defaultUnits: item.defaultUnits
      };
    },
    initializeItem: function() {
      this.$refs.form.validate();
      this.updatedItem = {
        id: 0,
        name: "",
        description: "",
        minQty: "",
        price: "",
        defaultUnits: null
      };
    },
    addNewItem: function() {
      if (this.$refs.form.validate()) {
        this.addItemAction(this.updatedItem);
        this.snackMessage(
          `Item "${this.updatedItem.name}" added successfully!`
        );
      }
    },
    toggleItem(item) {
      let msg = "";
      if (parseInt(item.isActive)) {
        item.isActive === 0;
        msg = "is Not Active";
      } else {
        item.isActive === 1;
        msg = "is Active";
      }
      item.isActive = parseInt(item.isActive) === 1 ? 0 : 1;
      //if (this.$refs.form.validate()) {
      this.updateItemAction({
        id: item.id,
        name: item.name,
        description: item.description,
        minQty: item.minQty,
        price: item.price,
        defaultUnits: item.defaultUnits,
        isActive: item.isActive
      });

      this.snackMessage(`Item "${item.name}" ${msg}!`);
      //}
    },
    updateItem: function(item) {
      //if (this.$refs.form.validate()) {
      this.updateItemAction({
        id: this.tempItem.id,
        name: this.tempItem.name,
        description: this.tempItem.description,
        minQty: this.tempItem.minQty,
        price: this.tempItem.price,
        defaultUnits: this.tempItem.defaultUnits,
        isActive: item.isActive
      });
      this.snackMessage(`Item "${this.tempItem.name}" updated successfully!`);
      //}
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    }
  },
  computed: {
    ...mapState(["items"]),
    sortedItems: function() {
      return 0;
    }
  }
};
</script>