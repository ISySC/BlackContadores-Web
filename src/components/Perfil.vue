<template id="ca">
  <v-main class="px-4" style="padding: 0px; padding-top: 60px; height: 100%">
    <AlertDialog
      :titulo="titulo"
      :mensaje="mensaje"
      :esCancelar="esCancelar"
      :esAceptar="esAceptar"
      vToolBarColor="red"
      :dialog.sync="dialog"
    />

    <Loading :overlay="overlay" />

    <!-- mostrar pantalla alerta para mensajes -->
    <AlertDialog
      titulo="Black Administrativo - [ Problemas con el servicio ]"
      :mensaje="mensaje"
      :esCancelar="esCancelar"
      :esAceptar="esAceptar"
      :vToolBarColor="vToolBarColor"
      :dialog.sync="dialogAlert"
    />
    <!-- -->

    <base-material-card color="blue pa-0" style="height: 99%">
      <template v-slot:heading>
        <p class="text-left text-h5">
          PERFIL DE USUARIO |
          <span class="text-subtitle-1 pr-5" id="textDescription"
            >Datos de perfil
          </span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                small
                @click="editar = !editar"
                :color="editar ? 'green' : ''"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>{{ editar ? "Deshabilitar" : "Habilitar " }} Edición</span>
          </v-tooltip>
          <v-btn
            :loading="loading"
            :disabled="!editar"
            class="ma-1 ml-7"
            color="green"
            x-large
            :hidden="!editar"
            @click="updateProfile"
          >
            Guardar
          </v-btn>
        </p>
      </template>
      <v-card-text class="pa-0">
        <v-container class="pt-2">
          <v-row no-gutters>
            <v-col cols="12" sm="9" class="pr-7">
              <v-container class="pa-0">
                <v-row no-gutters class="pa-0">
                  <v-col cols="12" sm="12" class="pr-7 pb-4">
                    <v-card
                      elevation="8"
                      class="d-flex flex-column rounded-lg black white--text"
                    >
                      <v-card-title class="pt-3 pl-7 title">
                        Datos de la Empresa
                      </v-card-title>
                      <hr />
                      <v-card-text class="text-center white">
                        <v-text-field
                          class="mr-2"
                          :disabled="!editar"
                          :label="str_txt_company_name"
                          required
                          prepend-icon="house"
                          type="text"
                          :value="Empresa"
                          @input="(_) => (Empresa = _)"
                        ></v-text-field>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-select
                                :disabled="!editar"
                                :value="GiroID"
                                prepend-icon="mdi-map"
                                style="width: 90%"
                                label="Giro de la empresa"
                                :items="itemsGiros"
                                item-text="NombreGiro"
                                item-value="GiroID"
                                item-key="itemsGiros"
                                return-object
                                @change="giroSeleccionado"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-select
                                :disabled="!editar"
                                :value="SubGiroID"
                                prepend-icon="mdi-map"
                                style="width: 90%"
                                label="Subgiro de la empresa"
                                :items="itemsSubGiros"
                                item-text="NombreSubGiro"
                                item-value="SubGiroID"
                                item-key="itemsSubGiros"
                                return-object
                                @change="subGiroSeleccionado"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-select
                                :disabled="!editar"
                                :value="ActividadID"
                                prepend-icon="mdi-map"
                                style="width: 90%"
                                label="Actividad de la empresa"
                                :items="itemsActividades"
                                item-text="NombreActividad"
                                item-value="ActividadID"
                                item-key="itemsActividades"
                                return-object
                                @change="actividadSeleccionado"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" class="pr-7">
                    <v-card
                      elevation="8"
                      class="d-flex flex-column rounded-lg black"
                    >
                      <v-card-title class="white--text pt-3 pl-7 title">
                        Membresia
                      </v-card-title>
                      <hr />
                      <v-card-text class="text-center white pa-0">
                        <v-container>
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              md="3"
                              :key="items.MembresiaID"
                              v-for="items in membershipsList"
                            >
                              <v-card-text class="pa-1">
                                <Membresias
                                  :Actual="
                                    MembresiaID == items.MembresiaID
                                      ? true
                                      : false
                                  "
                                  :NombreMembresia="
                                    items.TipoMembresia[0].Descripcion
                                  "
                                  :PrecioMes="items.PrecioMes"
                                  :PrecioAnual="items.PrecioAnual"
                                  :MembresiaID="items.MembresiaID"
                                  :EsSugerido="false"
                                  :NoUsuarios="items.NoUsuarios"
                                  :Caracteristicas="
                                    items.TipoMembresia[0].Caracteristicas
                                  "
                                  @createAccountPage="createAccountPage"
                                />
                              </v-card-text>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row> </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card
                style="height: 100%"
                elevation="8"
                class="d-flex flex-column rounded-lg black"
              >
                <v-card-title class="white--text pt-3 pl-7 title">
                  Datos de Cuenta
                </v-card-title>
                <hr />
                <v-card-text class="text-center white" style="height: 100%">
                  <v-avatar color="indigo" size="100">
                    <v-icon x-large dark> mdi-48px mdi-account-circle </v-icon>
                  </v-avatar>
                  <br /><br /><br />
                  <v-text-field
                    :label="str_txt_legal_name"
                    :disabled="!editar"
                    required
                    prepend-icon="person"
                    type="text"
                    :value="Nombre"
                    @input="(_) => (Nombre = _)"
                  ></v-text-field>
                  <v-text-field
                    :disabled="true"
                    label="Usuario"
                    prepend-icon="email"
                    required
                    id="email"
                    name="email"
                    :value="email"
                    color="light-blue accent-3"
                    @click:append="() => (value = !value)"
                    :type="value ? 'email' : 'text'"
                    :rules="[rules.email]"
                    @input="(_) => (email = _)"
                  ></v-text-field>
                  <v-text-field
                    :disabled="!editar"
                    label="Contraseña"
                    required
                    prepend-icon="lock"
                    autocomplete="current-password"
                    :value="password"
                    :type="value ? 'password' : 'text'"
                    :rules="[rules.password]"
                    @input="(_) => (password = _)"
                  ></v-text-field>
                  <v-divider />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </base-material-card>
  </v-main>
</template>

<script>
import AlertDialog from "../components/AlertDialog";
import AccountService from "../network/services/AccountService";
import Utils from "../util/utils";
import Enumerable from "linq";
import Constants from "../util/constants";
import Loading from "../components/Loading";
import Membresias from "../components/Membresias";

export default {
  components: {
    Loading,
    AlertDialog,
    Membresias,
  },
  data: () => ({
    loading: false,
    Actividades: [],
    itemsActividades: [],
    ActividadID: 0,
    itemsSubGiros: [],
    SubGiros: [],
    SubGiroID: 0,
    GiroID: 0,
    itemsGiros: [],
    editar: false,
    MembresiaID: 0,
    membershipsList: [],
    ItemMembershipSelected: [],
    password: "",
    email: "",
    Nombre: "",
    Empresa: "",
    items: [],
    dialog: false,
    dialogAlert: false,
    esCancelar: false,
    esAceptar: false,
    mensaje: "",
    titulo: "",
    overlay: false,
    vToolBarColor: "",
    str_txt_legal_name: Constants.str_txt_legal_name,
    str_txt_company_name: Constants.str_txt_company_name,
    str_no_data: Constants.str_no_data,
    str_txt_password: Constants.str_txt_password,
    value: true,
    rules: {
      required: (value) => !!value || "Este campo es requerido",

      password: (value) => {
        const pattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#/$%/^&/*])(?=.{8,})/;

        return (
          pattern.test(value) ||
          "Se requiere una contraseña mayor o igual a 8 caracteres. Incluye mayúsculas, números y caracteres especiales ($!#%&@)"
        );
      },

      email: (value) => {
        const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;

        return (
          pattern.test(value) ||
          "Correo no válido. Favor de verificar la estructura (ejemplo@tuempresa.com)"
        );
      },
    },
  }),

  created() {
    this.AccountService = new AccountService();
    this.Utils = new Utils();
    this.getProfile();
  },

  async mounted() {
    this.getProfile();
  },

  methods: {
    async updateProfile() {
      this.loading = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let empresaTransID = "1543832721";

      const accountData = {
        RepresentanteLegal: this.Nombre,
        NombreEmpresa: this.Empresa,
        CorreoUsuario: this.email,
        Contrasena: this.password,
        GiroID: this.GiroID,
        SubGiroID: this.SubGiroID,
        ActividadID: this.ActividadID,
        companyTransID: empresaTransID,
      };

      var response = await this.AccountService.PostUpdateProfile(accountData);

      if (response.data.token != "") {
        this.messageCreateAccountResponse(
          response.data.response[0].message,
          true,
          true,
          "green"
        );
        this.editar = false;
      } else {
        this.Utils.SetValue("", "authToken");
        this.messageCreateAccountResponse(
          response.data.response.message,
          false,
          true,
          "red"
        );
      }

      this.loading = false;
    },
    showFeature(showFor, planId) {
      return showFor.includes(planId);
    },
    async getProfile() {
      this.overlay = true;

      let params = {
        EmpresaTransID: "1543832721", //new Utils().GetValue("empresaTransID"),
      };

      var response = await this.AccountService.GetProfile(params);
      console.log(response);
      if (response.data.success !== false) {
        this.membershipsList = JSON.parse(
          response.data.response.membresias[0].Membresias
        );
        console.log(response.data.response);
        this.itemsGiros = response.data.response.giros;
        this.SubGiros = response.data.response.subgiros;
        this.Actividades = response.data.response.actividades;
        this.email = response.data.response.perfil[0].CorreoUsuario;
        this.password = response.data.response.perfil[0].Contrasena;
        this.GiroID = response.data.response.perfil[0].GiroID;
        this.giroSeleccionado({ GiroID: this.GiroID });
        this.SubGiroID = response.data.response.perfil[0].SubGiroID;
        this.subGiroSeleccionado({ SubGiroID: this.SubGiroID });
        this.ActividadID = response.data.response.perfil[0].ActividadID;
        this.Nombre = response.data.response.perfil[0].RepresentanteLegal;
        this.Empresa = response.data.response.perfil[0].NombreEmpresa;
        this.MembresiaID = response.data.response.perfil[0].MembresiaID;
      } else {
        this.messageCreateAccountResponse(
          response.data.message,
          false,
          true,
          "red"
        );
      }

      this.overlay = false;
    },
    messageCreateAccountResponse(message, esCancelar, esAceptar, color) {
      this.mensaje = message;
      this.esCancelar = esCancelar;
      this.esAceptar = esAceptar;
      this.vToolBarColor = color;
      this.dialogAlert = true;

      this.overlay = false;
    },
    createAccountPage(MembresiaID) {
      this.ItemMembershipSelected = Enumerable.from(this.membershipsList)
        .where((m) => m.MembresiaID == MembresiaID)
        .toArray();
    },
    giroSeleccionado(value) {
      this.GiroID = value.GiroID;
      this.itemsSubGiros = this.SubGiros.filter(
        (Giro) => Giro.GiroID == value.GiroID
      );
    },
    subGiroSeleccionado(value) {
      this.SubGiroID = value.SubGiroID;
      this.itemsActividades = this.Actividades.filter(
        (Actividad) => Actividad.SubGiroID == value.SubGiroID
      );
    },
    actividadSeleccionado(value) {
      this.ActividadID = value.ActividadID;
    },
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>