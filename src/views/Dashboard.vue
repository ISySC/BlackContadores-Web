<template>
  <!-- App.vue -->
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title id="navigationTitle">
              {{ str_title_name_app }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ str_slogan }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider style="margin-bottom: 20px"></v-divider>

        <v-list dense nav>
          <v-list-item-group color="blue">
            <v-list-item
              :to="item.path"
              v-for="item in menu"
              :key="item.title"
              link
              id="btnLnk"
              @click="stateSelected(item.id)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar id="appBarStyle" app>
        <span id="spanTitle"
          >BUEN DIA {{ str_legal_name }}
          <span id="spanSubtitle">{{ str_company_name }}</span></span
        >
      </v-app-bar>
      <v-main >
        <router-view />
      </v-main>
      <v-footer app>
        <ContentFooter />
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import ContentFooter from "../components/ContentFooter";
import Constants from "../util/constants";
import Utils from "../util/utils";

export default {
  components: {
    ContentFooter,
  },

  data: () => ({
    str_title_name_app: Constants.str_title_name_app,
    str_slogan: Constants.str_slogan,
    str_legal_name: "",
    str_company_name: "",

    menu: [
      {
        title: Constants.str_registro_diario,
        icon: "mdi-book-open-variant",
        id: 1,
        path: "registro-diario",
      },
      {
        title: Constants.str_edo_resultados,
        icon: "mdi-file-document-multiple",
        id: 2,
        path: "estado-resultados",
      },
      {
        title: Constants.str_balance_general,
        icon: "mdi-format-columns",
        id: 3,
        path: "balance-general",
      },
      {
        title: Constants.str_deuda,
        icon: "mdi-cash-minus",
        id: 4,
        path: "deudas",
      },
      {
        title: Constants.str_configuracion,
        icon: "mdi-folder-cog-outline",
        id: 5,
        path: "configuracion",
      },
      {
        title: Constants.str_perfil,
        icon: "mdi-account",
        id: 6,
        path: "perfil",
      },
    ],
    model: 0,
  }),

  created() {
    this.str_legal_name = new Utils().GetValue("legal_name");
    this.str_company_name = new Utils().GetValue("company_name");
  },

  methods: {
    stateSelected(itemID) {
      switch (itemID) {
        case 1: //registro diario
          break;
        case 2: //estado resultados
          break;
        case 3: //balance general
          break;
        case 4: //deudas
          break;
        case 5: //configuracion
          break;
        case 6: //perfil
          break;

        default:
          break;
      }
    },
  },
};
</script>


<style >
#appBarStyle {
  background-color: black;
}

#spanTitle {
  color: white;
  font-size: 22px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  padding: 10px;
}

#spanSubtitle {
  color: white;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  display: block;
  width: 450px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#navigationTitle {
  color: black;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  font-weight: 500;
}

#navigationStyle {
  background-color: lightgrey;
}

#btnLnk {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 0.98rem !important;
}
</style>