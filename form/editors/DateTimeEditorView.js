/**
 * Developer: Grigory Kuznetsov
 * Date: 07/16/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer */

define(['module/lib','text!./templates/dateTimeEditor.html', './base/BaseLayoutEditorView', './impl/dateTime/views/DateView', './impl/dateTime/views/TimeView'],
    function (lib, template, BaseLayoutEditorView, DateView, TimeView) {
        'use strict';

        var defaultOptions = {
            enableDelete: false
        };

        Backbone.Form.editors.DateTime = BaseLayoutEditorView.extend({
            initialize: function(options) {
                options = options || {};
                if (options.schema) {
                    _.extend(this.options, defaultOptions, _.pick(options.schema, _.keys(defaultOptions)));
                } else {
                    _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));
                }

                var readonly = this.getReadonly(),
                    enabled = this.getEnabled();

                this.dateTimeModel = new Backbone.Model({
                    value: this.value,
                    readonly: readonly,
                    enabled: enabled
                });

                this.listenTo(this.dateTimeModel, 'change:value', this.__change, this);
            },

            ui: {
                deleteButton: '.js-clear-button'
            },

            events: {
                'click @ui.deleteButton': '__onClear'
            },

            regions: {
                dateRegion: '.js-date-region',
                timeRegion: '.js-time-region'
            },

            className: 'l-field date-time',

            template: Handlebars.compile(template),

            templateHelpers: function () {
                return this.options;
            },

            __change: function () {
                this.__value(this.dateTimeModel.get('value'), true, true);
            },

            setValue: function (value) {
                this.__value(value, true, false);
                this.dateTimeModel.set('value', value);
            },

            getValue: function () {
                return this.value === null ? this.value : lib.moment(this.value).toISOString();
            },

            onRender: function () {
                this.dateView = new DateView({
                    model: this.dateTimeModel
                });

                this.timeView = new TimeView({
                    model: this.dateTimeModel
                });

                this.dateRegion.show(this.dateView);
                this.timeRegion.show(this.timeView);
                if (!this.options.enableDelete) {
                    this.ui.deleteButton.hide();
                }
            },

            __value: function (value, updateUi, triggerChange) {
                if (this.value === value) {
                    return;
                }
                this.value = value;

                if (triggerChange) {
                    this.__triggerChange();
                }
            },

            __setEnabled: function (enabled) {
                BaseLayoutEditorView.prototype.__setEnabled.call(this, enabled);
                this.dateTimeModel.set({enabled: this.getEnabled()});
            },

            __setReadonly: function (readonly) {
                BaseLayoutEditorView.prototype.__setReadonly.call(this, readonly);
                this.dateTimeModel.set({readonly: this.getReadonly()});
            },

            __onClear: function() {
                this.setValue(null);
            }
        });

        return Backbone.Form.editors.DateTime;
    });