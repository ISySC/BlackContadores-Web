import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatoMoneda', value => {
    return "$" + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
});

Vue.filter('formatoFecha', function (value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
});