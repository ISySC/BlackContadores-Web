<template>
  <v-row justify="center">
    <!-- mostrar pantalla alerta para mensajes -->
    <AlertDialog
      titulo="Black Administrativo - [ Registro diario ]"
      :mensaje="mensaje"
      :esCancelar="esCancelar"
      :esAceptar="esAceptar"
      :vToolBarColor="vToolBarColor"
      :dialog.sync="dialogAlert"
    />
    <!-- -->

    <Loading :overlay="overlay" />

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title id="titleStyle">
          <span class="headline">{{ title }} </span>
        </v-card-title>

        <v-container>
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="12">
              <v-select
                :value="cxcID"
                ref="collection"
                outlined
                :label="
                  this.TipoCuenta == 3
                    ? 'Cuentas por cobrar'
                    : 'Cuentas por pagar'
                "
                required
                :items="itemsCollection"
                item-text="Descripcion"
                item-value="CxCID"
                item-key="itemsCollection"
                return-object
                @change="collectionSeleccionada"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select
                outlined
                :value="cuentaID"
                ref="cuentas"
                :items="itemsCuentas"
                item-value="CuentaID"
                item-text="Descripcion"
                item-key="itemsCuentas"
                return-object
                label="Cuenta afectar (*)"
                @change="cuentaSeleccionada"
                style="padding-left: 1px"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select
                :value="subclasificacionID"
                ref="subclasificaciones"
                outlined
                label="Subclasificación (*)"
                required
                :items="itemsSubClasificacion"
                item-text="Concepto"
                item-value="ConceptoID"
                item-key="itemsSubClasificacion"
                return-object
                @change="subclasificacionSeleccionada"
              ></v-select>
            </v-col>
            <v-col cols="6" sm="12">
              <v-divider />
              <br>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-text-field
                align="right"
                label="Total"
                outlined
                readonly
                v-model="total"
                reverse
              ></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-text-field
                reverse
                label="Saldo"
                outlined
                readonly
                v-model="saldo"
              ></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6"></v-col>
            <v-col cols="6" sm="6" md="6">
              <v-text-field
                reverse
                style="text-align: end"
                align="right"
                label="Abono (*)"
                required
                outlined
                type="number"
                :min="0"
                :max="saldoMax"
                v-model="abono"
                @keypress="validarNumero"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn width="25%" color="error" @click.native="cancelar">
            Cancelar
          </v-btn>
          <v-btn width="30%" color="blue" dark @click.native="aceptar">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CompanyServices from "../network/services/CompanyService";
import Constants from "../util/constants";
import AlertDialog from "../components/AlertDialog";
import Loading from "../components/Loading";
import Utils from "../util/utils";

export default {
  components: {
    AlertDialog,
    Loading,
  },
  props: {
    dialog: { type: Boolean, default: false },
    title: { type: String, default: "" },
    cxCID: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    tipoCuenta: { type: Number, default: 3 },

  },
  data: () => ({
    activo: true,
    nombre: "",
    esAceptar: false,
    esCancelar: false,
    dialogAlert: false,
    cxcID: 0,
    totalMonto: "",
    saldo: "",
    abono: 0,
    saldoMax: 0,
    mensaje: "",
    value: true,
    overlay: false,
    vToolBarColor: "green",
    TipoCuenta: 0,
    itemsCollection: [],
    collections: [],
    itemsCuentas: [],
    cuentas: [],
    subclasificaciones: [],
    itemsSubClasificacion: [],
    subclasificacionID: 0,
    cuentaID: 0,
    rules: {
      required: (value) => !!value || "Este campo es requerido",
    },
  }),
  watch: {
    dialog() {
      if (this.$props.dialog) {
        if (this.TipoCuenta != this.$props.tipoCuenta) {
          this.$refs["collection"].reset();
          this.total = 0;
          this.saldo = 0;
          this.abono = 0;
        }
        this.TipoCuenta = this.$props.tipoCuenta;
        this.getCuentasPor();
        this.getbankaccount();
        this.getsubclasifications();
      }
    },
  },
  created() {
    this.CompanyServices = new CompanyServices();
    this.Utils = new Utils();
  },
  methods: {
    async getbankaccount() {
      let data = {
        empresaTransID: this.Utils.GetValue("EmpresaTransID"),
        mostrarInactivos: 0,
      };

      const rs_itemscuentas = await this.CompanyServices.GetBankaccounts(data);

      if (rs_itemscuentas.status === 200) {
        this.cuentas = rs_itemscuentas.data.response;
        this.itemsCuentas = this.itemsCuentas = this.cuentas.filter(
          (cuenta) => cuenta.TipoCuentaID == 1 || cuenta.TipoCuentaID == 2
        );
      }
    },
    async getsubclasifications() {
      let data = {
        EmpresaTransID: this.Utils.GetValue("EmpresaTransID"),
        mostrarInactivos: 0,
      };
      const response = await this.CompanyServices.GetSubclasifications(data);

      if (response.status === 200) {
        this.subclasificaciones = response.data.response;
        this.itemsSubClasificacion = this.subclasificaciones.filter(
          (sub) => sub.ClasificacionID == 4
        );
      }
    },
    cuentaSeleccionada(value) {
      this.cuentaID = value.CuentaID;
    },
    validarNumero(e) {
      if (e.keyCode < 48 || e.keyCode > 57) {
        if (e.keyCode != 46) e.preventDefault();
      }
    },
    collectionSeleccionada(value) {
      var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.cxcID = value.CxCID;
      this.totalMonto = this.collections.filter(
        (cxc) => cxc.CxCID === value.CxCID
      )[0]["Total"];
      this.total = formatter.format(this.totalMonto);
      this.saldoMax = this.collections.filter(
        (cxc) => cxc.CxCID === value.CxCID
      )[0]["Saldo"];
      this.saldo = formatter.format(this.saldoMax);
    },
    async getCuentasPor() {
      let params = {
        EmpresaTransID: this.Utils.GetValue("EmpresaTransID"),
        TipoCuentaID: this.TipoCuenta,
      };

      var response = await this.CompanyServices.GetCollections(params);

      if (response.data.success !== false) {
        this.itemsCollection = response.data.response;
        this.collections = response.data.response;
      } else {
        this.messageCreateAccountResponse(
          response.data.message,
          false,
          true,
          "red"
        );
      }
    },
    async aceptar() {
      if (this.cxcID != 0) {
        if (this.abono <= this.saldoMax && this.abono > 0) {
          this.$emit("update:abono", this.abono);
          this.$emit("update:cxCID", this.cxcID);
          this.$emit("update:total", this.totalMonto);
          this.$emit("update:cuentaPago", this.cuentaID);
          this.$emit("update:dialog", false);
        } else {
          this.overlay = false;
          this.mensaje = "El abono no puede ser 0 ni mayor al saldo restante.";
          this.esCancelar = false;
          this.esAceptar = true;
          this.vToolBarColor = "red";

          this.dialogAlert = true;
        }
      } else {
        this.overlay = false;
        this.mensaje = Constants.str_error_registry;
        this.esCancelar = false;
        this.esAceptar = true;
        this.vToolBarColor = "red";

        this.dialogAlert = true;
      }
    },
    cancelar() {
      this.nombre = "";
      this.$emit("update:dialog", false);
    },
  },
};
</script>

<style scoped>
#titleStyle {
  background-color: black;
  color: white;
}
</style>