<template>
  <v-row class="fill-height">
    <!-- mostrar pantalla alerta para mensajes -->
    <AlertDialog
      titulo="Black Administrativo - [ Crear cuenta ]"
      :mensaje="mensaje"
      :esCancelar="esCancelar"
      :esAceptar="esAceptar"
      :vToolBarColor="vToolBarColor"
      :dialog.sync="dialog"
    />
    <!-- -->

    <Pago
      :dialog.sync="dialogPago"
      :tokenParams.sync="tokenParams"
      :membershipSelectedMonth.sync="membershipSelectedMonth"
      :membresia="ItemMembership[0].TipoMembresia[0].Descripcion"
      :membresiaID="ItemMembership[0].MembresiaID"
      :precio="ItemMembership[0].PrecioMes"
      :precio_anual="ItemMembership[0].PrecioAnual"
      @create="createAccount"
    />

    <Loading :overlay="overlay" />

    <v-col cols="12" md="3" class="black">
      <v-card-text class="white--text mt-12">
        <h1 class="text-center display-1">Ya casi!</h1>
        <hr />
        <br />
        <p class="text-left">
          Ingresa la información que te solicitamos para crear tu cuenta
        </p>
      </v-card-text>
      <v-col cols="12" md="3">
        <v-btn dark color="light-blue" @click="backToPlans()">Ver planes</v-btn>
      </v-col>
    </v-col>
    <v-col cols="12" md="9" style="height: auto">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-card class="white rounded-lg pa-10" color="white" elevation="24">
              <div style="display: inline">
                <h2 class="text-left pr-1" style="display: inline-block">
                  Black Administrativo - Información de la cuenta para tu plan
                </h2>
                <h2 class="blue--text text-right" style="display: inline-block">
                  {{ ItemMembership[0].TipoMembresia[0].Descripcion }}
                </h2>
              </div>
              <br />
              <v-form>
                <v-text-field
                  v-model="legalNamePerson"
                  :label="str_txt_legal_name"
                  name="name"
                  id="name"
                  prepend-icon="person"
                  type="text"
                  color="light-blue accent-3"
                />
                <v-text-field
                  v-model="companyName"
                  :label="str_txt_company_name"
                  name="companyName"
                  id="companyName"
                  prepend-icon="house"
                  type="text"
                  color="light-blue accent-3"
                />
                <v-text-field
                  v-model="email"
                  id="email"
                  :label="str_txt_email"
                  name="email"
                  prepend-icon="email"
                  color="light-blue accent-3"
                  @click:append="() => (value = !value)"
                  :type="value ? 'email' : 'text'"
                  :rules="[rules.email]"
                  @input="(_) => (email = _)"
                />
                <v-text-field
                  autocomplete="current-password"
                  :value="password"
                  :label="str_txt_password"
                  prepend-icon="lock"
                  :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="() => (value = !value)"
                  :type="value ? 'password' : 'text'"
                  :rules="[rules.password]"
                  @input="(_) => (password = _)"
                ></v-text-field>
                <v-row no-gutters>
                  <v-col cols="8"></v-col>
                  <v-col cols="4">
                    <v-btn
                      class="green darken-3 text-center white--text"
                      block
                      outlined
                      depressed
                      large
                      @click="preCreateAccount()"
                      >Siguiente</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>
import Constants from "../util/constants";
import AlertDialog from "../components/AlertDialog";
import Utils from "../util/utils";
import AccountService from "../network/services/AccountService";
//import Crypto from "../util/crypto";
import Vue from "vue";
import VueCryptojs from "vue-cryptojs";
import Loading from "../components/Loading";
import Pago from "../components/Pago";
import PaymentService from "../network/services/PaymentService";

Vue.use(VueCryptojs);

export default {
  components: {
    AlertDialog,
    Loading,
    Pago,
  },
  props: {
    ItemMembership: { type: Array, require: true },
  },

  data: () => ({
    tokenParams: [],
    dialogPago: false,
    legalNamePerson: "",
    companyName: "",
    email: "",
    password: "",
    repassword: "",
    dialog: false,
    mensaje: "",
    membershipID: 0,
    selectedFrecuency: "",
    esAceptar: false,
    esCancelar: false,
    showMessage: false,
    membershipSelectedMonth: false,
    membershipSelectedYear: false,
    str_txt_legal_name: Constants.str_txt_legal_name,
    str_txt_company_name: Constants.str_txt_company_name,
    str_txt_email: Constants.str_txt_email,
    str_txt_password: Constants.str_txt_password,
    vToolBarColor: "green",
    value: true,
    overlay: false,
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
  mounted() {
    const script = document.createElement("script");
    script.src = "https://cdn.conekta.io/js/latest/conekta.js";
    script.async = true;
    document.body.appendChild(script);
  },
  created() {
    this.Utils = new Utils();
    this.AccountService = new AccountService();
    this.PaymentService = new PaymentService();
    this.membershipID = this.ItemMembership[0].MembresiaID;
    if (this.membershipID == 1) this.membershipSelectedMonth = true;
  },
  methods: {
    backToPlans() {
      this.membershipSelectedYear = false;
      this.membershipSelectedMonth = true;
      this.$emit("backToPlans");
    },
    dashboardPage() {
      this.showMessage = true;
      this.overlay = false;

      this.Utils.SetValue(this.legalNamePerson, "legal_name");
      this.Utils.SetValue(this.companyName, "company_name");
      this.$emit("dashboardPage");
    },
    payment() {
      window.Conekta.setPublicKey("key_CpeARyuQqyrzxxsYKUw6Lrg");
      window.Conekta.Token.create(
        this.tokenParams,
        async (token) => {
          const data = {
            MembresiaID: this.ItemMembership[0].MembresiaID,
            Membresia: this.ItemMembership[0].Descripcion,
            Precio: this.membershipSelectedMonth ? this.ItemMembership[0].PrecioMes : this.ItemMembership[0].PrecioAnual,
            Email: new Utils().GetValue("correoUsuario"),
            Usuario: new Utils().GetValue("legal_name"),
            Token: token.id,
          };

          console.log(data);

          var response = await this.PaymentService.PostPayment(data);

          if (response.data.token != "") {
            this.messageCreateAccountResponse(
              response.data.message,
              false,
              true,
              "red"
            );
          } else {
            this.messageCreateAccountResponse(
              response.data.message,
              false,
              true,
              "green"
            );
          }
        },
        (error) => {
          this.messageCreateAccountResponse(error.message_to_purchaser, "red");
          console.log(error);
        }
      );
    },
    memberships(selected, membershipID) {
      this.membershipID = membershipID;
      this.selectedFrecuency = selected;

      if (selected == "Mensual") {
        this.membershipSelectedMonth = true;
        this.membershipSelectedYear = false;
      } else {
        this.membershipSelectedMonth = false;
        this.membershipSelectedYear = true;
      }
    },
    messageCreateAccountResponse(message, esCancelar, esAceptar, color) {
      this.mensaje = message;
      this.esCancelar = esCancelar;
      this.esAceptar = esAceptar;
      this.vToolBarColor = color;
      this.dialog = true;

      this.overlay = false;
    },
    preCreateAccount() {
      this.membershipID = this.ItemMembership[0].MembresiaID;
      if (this.membershipID !== 1) this.dialogPago = true;
      else this.createAccount();
    },
    async createAccount() {
      if (
        this.legalNamePerson != "" &&
        this.email != "" &&
        this.password != ""
      ) {
        if (
          this.Utils.RegExpPassword(this.password) &&
          this.Utils.RegExpEmail(this.email)
        ) {
          console.log(this.membershipSelectedMonth);

          const accountData = {
            legalNamePerson: this.legalNamePerson,
            companyName: this.companyName,
            email: this.email,
            password: this.password,
            membershipID: 1,
            frecuency: "Mensual",
          };

          await this.AccountService.PostCreateAccount(
            accountData
          ).then((response) => {
            console.log(response);
            if (response.data.token != "") {
              this.Utils.SetValue(response.data.token, "authToken");
              this.Utils.SetValue(
                response.data.response[0].empresaTransID,
                "EmpresaTransID"
              );
              this.Utils.SetValue(this.email, "correoUsuario");
              this.Utils.SetValue(true, "EmpresaActiva");
              this.Utils.SetValue(
                response.data.response[0].AltaDeUsuarios,
                "AltaDeUsuarios"
              );
              this.Utils.SetValue(
                response.data.response[0].NoUsuarios,
                "NoUsuarios"
              );
              this.Utils.SetValue(this.legalNamePerson, "legal_name");
              this.Utils.SetValue(this.companyName, "company_name");
              this.Utils.SetValue(
                response.data.response[0].UsuarioID,
                "UsuarioID"
              );
              this.Utils.SetValue(
                response.data.response[0].MembresiaID,
                "MembresiaID"
              );
              this.Utils.SetValue(
                response.data.response[0].CustomerConektaID,
                "CustomerConektaID"
              );
              this.messageCreateAccountResponse(
                response.data.response[0].message,
                false,
                true,
                "green"
              );

              if (this.membershipID !== 1) {
                this.payment();
              }
              this.dashboardPage();
            } else {
              this.dialogPago = false;
              this.messageCreateAccountResponse(
                response.data.response.message,
                false,
                true,
                "red"
              );
            }
          });
        } else {
          this.dialogPago = false;
          this.messageCreateAccountResponse(
            Constants.str_error_validate_email_password,
            false,
            true,
            "red"
          );
        }
      } else {
        this.dialogPago = false;
        this.messageCreateAccountResponse(
          Constants.str_error_create_account,
          false,
          true,
          "red"
        );
      }
    },
  },
};
</script>
