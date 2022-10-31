/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./../../bootstrap');

import Vue from 'vue';

import DashboardPlugin from './../../plugins/dashboard-plugin';

import Global from './../../mixins/global';

import Form from './../../plugins/form';
import BulkAction from './../../plugins/bulk-action';
import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination]);

// plugin setup
Vue.use(DashboardPlugin);

const app = new Vue({
    el: '#main-body',

    mixins: [
        Global
    ],

    data: function () {
        return {
            form: new Form('contact'),
            bulk_action: new BulkAction('contacts'),
            can_login : false
        }
    },

    mounted() {
        this.form.create_user = false;

        //swiper slider for long tabs items
        for (let [index, item] of document.querySelectorAll('[data-swiper]').entries()) {
            item.id = index;

            new Swiper(".swiper-tabs-container", {
                loop: false,
                slidesPerView: Number(item.getAttribute('data-swiper')),
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });
        }
        //swiper slider for long tabs items
    },

    methods:{
        onCanLogin(event) {
            if (event.target.checked) {
                if (this.form.email) {
                    axios.get(url + '/auth/users/autocomplete', {
                        params: {
                            column: 'email',
                            value : this.form.email
                        }
                    })
                    .then(response => {
                        if (response.data.errors) {
                            if (response.data.data) {
                                this.form.errors.set('email', {
                                    0: response.data.data
                                });

                                return false;
                            }

                            this.can_login = true;
                            this.form.create_user = true;

                            return true;
                        }

                        if (response.data.error) {
                            this.$notify({
                                message: response.data.message,
                                timeout: 0,
                                icon: 'fas fa-bell',
                                type: 'warning',
                            });

                            return false;
                        }

                        if (response.data.success) {
                            this.form.errors.set('email', {
                                0: can_login_errors.email
                            });

                            this.can_login = false;
                            this.form.create_user = false;

                            return false;
                        }
                    })
                    .catch(error => {
                    });
                } else {
                    this.form.errors.set('email', {
                        0: can_login_errors.valid
                    });

                    this.can_login = false;
                    this.form.create_user = false;

                    return false;
                }

                return false;
            } else {
                this.form.errors.clear('email');

                this.can_login = false;
                this.form.create_user = false;

                return false;
            }
        }
    }
});
