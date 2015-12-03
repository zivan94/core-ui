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

define(['text!./templates/textAreaEditor.html',
        './base/BaseItemEditorView',
        'core/services/LocalizationService',
        'module/lib',
        'core/utils/keyCode',
        'core/utils/utilsApi' ],
    function (template,
              BaseItemEditorView,
              LocalizationService,
              lib,
              keyCode,
              utilsApi) {
        'use strict';

        var changeMode = {
            blur: 'blur',
            keydown: 'keydown'
        };

        var size = {
            auto: 'auto',
            fixed: 'fixed'
        };

        var defaultOptions = {
            changeMode: changeMode.blur,
            size: size.auto,
            emptyPlaceholder: LocalizationService.get('CORE.FORM.EDITORS.TEXTAREAEDITOR.PLACEHOLDER'),
            readonlyPlaceholder: LocalizationService.get('CORE.FORM.EDITORS.TEXTAREAEDITOR.READONLYPLACEHOLDER'),
            disablePlaceholder: LocalizationService.get('CORE.FORM.EDITORS.TEXTAREAEDITOR.DISABLEPLACEHOLDER'),
            maxLength: null,
            readonly: false,
            textHeight: null,
            initialHeight: 2
        };

        /**
         * Some description for initializer
         * @name TextAreaEditorView
         * @memberof module:core.form.editors
         * @class TextAreaEditorView
         * @description TextArea editor
         * @extends module:core.form.editors.base.BaseItemEditorView {@link module:core.form.editors.base.BaseItemEditorView}
         * @param {Object} options Constructor
         * @param {Object} [options.schema] Scheme
         * @param {String} [options.controller] Текст placeholder'а
         * @param {Boolean} [options.enabled=true] Доступ к редактору разрешен
         * @param {Boolean} [options.forceCommit=false] Обновлять значение независимо от ошибок валидации
         * @param {Number} [options.initialHeight=2] Изначальное количство строк
         * @param {String} [options.size=auto] Высота контрола: auto - контрол имеет высоту контента, fixed - фиксированную
         * @param {Boolean} [options.readonly=false] Редактор доступен только для просмотра
         * @param {Number} [options.textHeight] Размер шрифта текста, определяет максимальный размер области ввода
         * @param {Function[]} [options.validators] Массив функций валидации
         * */
        Backbone.Form.editors.TextArea = BaseItemEditorView.extend({
            initialize: function (options) {
                if (options.schema) {
                    _.extend(this.options, defaultOptions, _.pick(options.schema, _.keys(defaultOptions)));
                } else {
                    _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));
                }

                this.placeholder = this.options.emptyPlaceholder;
            },

            focusElement: '.js-textarea',
            className: 'l-field l-field_textarea',

            ui: {
                textarea: '.js-textarea'
            },

            events: {
                'change': '__change',
                'input': '__input',
                'keyup @ui.textarea': '__keyup'
            },

            template: Handlebars.compile(template),

            templateHelpers: function () {
                return this.options;
            },

            setMaxHeight: function(){
                if (this.options.textHeight) {
                    this.options.maxHeight = parseInt(this.ui.textarea.css('line-height')) * this.options.textHeight;
                }
            },

            onRender: function () {
                // Keyboard shortcuts listener
                if (this.keyListener) {
                    this.keyListener.reset();
                }
                this.keyListener = new lib.keypress.Listener(this.ui.textarea[0]);
                this.ui.textarea.attr('rows', this.options.initialHeight);
            },

            addKeyboardListener: function (key, callback) {
                if (!this.keyListener) {
                    utilsApi.helpers.throwInvalidOperationError('You must apply keyboard listener after \'render\' event has happened.');
                }
                var keys = key.split(',');
                _.each(keys, function (k) {
                    this.keyListener.simple_combo(k, callback);
                }, this);
            },

            onShow: function () {
                this.setMaxHeight();
                this.ui.textarea.val(this.getValue() || '').css('maxHeight', this.options.maxHeight);
                switch (this.options.size) {
                case size.auto:
                    this.ui.textarea.autosize({ append: '' });
                    break;
                case size.fixed:
                    this.ui.textarea.attr('rows', this.options.textHeight);
                    break;
                }
            },

            setPermissions: function (enabled, readonly) {
                BaseItemEditorView.prototype.setPermissions.call(this, enabled, readonly);
                this.setPlaceholder();
            },

            setPlaceholder: function () {
                if (!this.getEnabled()) {
                    this.placeholder = this.options.disablePlaceholder;
                } else if (this.getReadonly()) {
                    this.placeholder = this.options.readonlyPlaceholder;
                } else {
                    this.placeholder = this.options.emptyPlaceholder;
                }

                this.ui.textarea.prop('placeholder', this.placeholder);
            },

            __setEnabled: function (enabled) {
                BaseItemEditorView.prototype.__setEnabled.call(this, enabled);
                this.ui.textarea.prop('disabled', !enabled);
            },

            __setReadonly: function (readonly) {
                BaseItemEditorView.prototype.__setReadonly.call(this, readonly);
                if (this.getEnabled()) {
                    this.ui.textarea.prop('readonly', readonly);
                }
            },

            __value: function (value, updateUi, triggerChange) {
                if (this.value === value) {
                    return;
                }
                this.value = value;
                if (updateUi) {
                    this.ui.textarea.val(value);
                }
                if (triggerChange) {
                    this.__triggerChange();
                }
            },

            setCaretPos: function (position) {
                this.ui.textarea.caret(position, position);
            },

            setValue: function (value) {
                this.__value(value, true, false);
            },

            __change: function () {
                this.__triggerInput();
                this.__value(this.ui.textarea.val(), false, true);
            },

            __input: function () {
                this.__triggerInput();
                if (this.options.changeMode === changeMode.keydown) {
                    this.__value(this.ui.textarea.val(), false, true);
                }
            },

            __keyup: function (e) {
                if ([
                    keyCode.LEFT,
                    keyCode.RIGHT,
                    keyCode.HOME,
                    keyCode.END
                ].indexOf(e.keyCode) === -1) {
                    return;
                }

                var caret = this.ui.textarea.caret();
                if (this.oldCaret && this.oldCaret.start === caret.start && this.oldCaret.end === caret.end) {
                    return;
                }

                this.oldCaret = caret;
                var text = this.ui.textarea.val();
                this.trigger('caretChange', text, caret);
            },

            __triggerInput: function () {
                var text = this.ui.textarea.val();
                if (this.oldText === text) {
                    return;
                }

                this.oldText = text;
                var caret = this.ui.textarea.caret();

                this.trigger('input', text, {
                    start: caret.start,
                    end: caret.end
                });
            },

            select: function () {
                this.ui.textarea.select();
            }
        });

        return Backbone.Form.editors.TextArea;
    });
