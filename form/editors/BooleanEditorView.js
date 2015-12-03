/**
 * Developer: Stepan Burguchev
 * Date: 10/13/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define(['text!./templates/booleanEditor.html', './base/BaseItemEditorView'],
    function (template, BaseItemEditorView) {
        'use strict';

        var defaultOptions = {
            displayText: ''
        };

        /**
         * Some description for initializer
         * @name BooleanEditorView
         * @memberof module:core.form.editors
         * @class BooleanEditorView
         * @description Boolean editor (checkbox)
         * @extends module:core.form.editors.base.BaseItemEditorView {@link module:core.form.editors.base.BaseItemEditorView}
         * @param {Object} options Constructor
         * @param {Object} [options.schema] Scheme
         * @param {Boolean} [options.autocommit=false] Автоматическое обновление значения
         * @param {String} [options.displayText] Отображаемый текст
         * @param {Boolean} [options.enabled=true] Доступ к редактору разрешен
         * @param {Boolean} [options.forceCommit=false] Обновлять значение независимо от ошибок валидации
         * @param {Boolean} [options.readonly=false] Редактор доступен только для просмотра
         * @param {Function[]} [options.validators] Массив функций валидации
         * */
        Backbone.Form.editors.Boolean = BaseItemEditorView.extend({
            initialize: function (options) {
                if (options.schema) {
                    _.extend(this.options, defaultOptions, _.pick(options.schema, _.keys(defaultOptions)));
                } else {
                    _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));
                }
            },

            ui: {
                toggleButton: '.js-toggle-button',
                displayText: '.js-display-text'
            },

            focusElement: null,

            events: {
                'click @ui.toggleButton': '__toggle',
                'click @ui.displayText': '__toggle'
            },

            className: 'l-checkbox',

            attributes: {
                'tabindex': '0'
            },

            template: Handlebars.compile(template),

            templateHelpers: function () {
                return {
                    displayText: this.options.displayText
                };
            },

            __toggle: function () {
                if (!this.getEnabled() || this.getReadonly()) {
                    return;
                }
                this.setValue(!this.getValue());
                this.__triggerChange();
            },

            __value: function (value, triggerChange) {
                this.__toggle();
            },

            onRender: function () {
                if (this.getValue()) {
                    this.$el.addClass('pr-checked');
                }
            },

            setValue: function (value) {
                if (this.value === value) {
                    return;
                }
                this.value = value;
                if (this.value) {
                    this.$el.addClass('pr-checked');
                } else {
                    this.$el.removeClass('pr-checked');
                }
            }
        });

        return Backbone.Form.editors.Boolean;
    });
