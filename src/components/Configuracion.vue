<template id="ca">
  <v-main class="px-4" style="padding: 0px; padding-top: 60px; height: 100%">
    <base-material-card color="blue pa-0" style="height: 97%">
      <template v-slot:heading>
        <p class="text-left text-h5">
          CONFIGURACIONES DEL SISTEMA |
          <span class="text-subtitle-1" id="textDescription">Ajustes</span>
        </p>
      </template>
      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" sm="3" class="px-4">
              <base-material-stats-card
                style="cursor: pointer"
                color="orange darken-4"
                icon="mdi-48px mdi-cash-refund"
                title="Categoria"
                value="Deudas"
                sub-icon="mdi-cog"
                sub-text="Ajuste de deudas iniciales, nuevas deudas, etc."
              />
            </v-col>
            <v-col cols="12" sm="3" class="px-4">
              <base-material-stats-card
                style="cursor: pointer"
                title="Categoria"
                color="indigo"
                icon="mdi-48px mdi-account-cash"
                value="Cuentas"
                sub-icon="mdi-cog"
                sub-text="Ajuste de cuentas para futuros movimientos."
              />
            </v-col>
            <v-col cols="12" sm="3" class="px-4">
              <router-link
                :to="membresiaID == 1 ? '' : '/usuarios'"
                style="text-decoration: none; color: inherit"
                disabled
              >
                <base-material-stats-card
                  style="cursor: pointer"
                  title="Categoria"
                  color="green"
                  icon="mdi-48px mdi-account-group"
                  value="Usuarios"
                  :sub-icon="membresiaID == 1 ? '' : 'mdi-cog'"
                  :disabled="membresiaID == 1"
                  :sub-text="membresiaID == 1 ? 'Para tener esta funcionalidad adquiera una membresia para mas de 1 usuario.' : 'Gestiona los usuarios que acceden a tu empresa.'"
                  :subTextColor="membresiaID == 1 ? 'red' : 'gray'"
                />
              </router-link>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </base-material-card>
  </v-main>
</template>
<script>
import Utils from "../util/utils";

export default {
  components: {},
  data: () => ({
    membresiaID: 0,
  }),

  created() {
    this.membresiaID = new Utils().GetValue("MembresiaID");
    //this.membresiaID = 2;
  },
  methods: {},
};
</script>

