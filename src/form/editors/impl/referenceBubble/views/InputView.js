/**
 * Developer: Ksenia Kartvelishvili
 * Date: 21.04.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */


import lib from 'modules/lib';
import template from '../templates/input.html';

const config = {
    TEXT_FETCH_DELAY: 100
};

const classes = {
    EMPTY: ' empty'
};

export default Marionette.ItemView.extend({
    initialize(options) {
        this.reqres = options.reqres;
        this.parent = options.parent;

        this.fetchDelayId = _.uniqueId('fetch-delay-id-');

        this.filterValue = '';
    },

    template: Handlebars.compile(template),

    tagName: 'li',

    className: 'bubbles__form',

    ui: {
        input: '.js-input'
    },

    focusElement: '.js-input',

    events: {
        'keyup @ui.input': '__search',
        'input @ui.input': '__search'
    },

    modelEvents: {
        'change:empty': '__updateInputPlaceholder'
    },

    onRender() {
        this.updateInput();
        this.__updateInputPlaceholder();
        this.__assignKeyboardShortcuts();
    },

    focus() {
        this.ui.input.focus();
    },

    __assignKeyboardShortcuts() {
        if (this.keyListener) {
            this.keyListener.reset();
        }
        this.keyListener = new lib.keypress.Listener(this.ui.input[0]);
        _.each(this.keyboardShortcuts, (value, key) => {
            const keys = key.split(',');
            _.each(keys, k => {
                this.keyListener.simple_combo(k, value.bind(this));
            }, this);
        }, this);
    },

    keyboardShortcuts: {
        up() {
            this.reqres.request('input:up');
        },
        down() {
            this.reqres.request('input:down');
        },
        'enter,num_enter'() {
            this.reqres.request('member:select');
        },
        backspace() {
            const value = this.__getFilterValue();
            if (value.length === 0) {
                if (!this.options.enabled) {
                    return;
                }
                this.reqres.request('bubble:delete:last');
            } else {
                this.updateInput(value.slice(0, value.length - 1));
            }
        }
    },

    __getFilterValue() {
        return this.ui.input.val().toLowerCase().trim() || '';
    },

    updateInput(value = '') {
        this.ui.input.val(value);
        this.__updateInputWidth(this.__calculateDesiredInputWidth(value));
    },

    __search() {
        const value = this.__getFilterValue();
        if (this.filterValue === value) {
            return;
        }
        this.__updateInputWidth(this.__calculateDesiredInputWidth(value || this.ui.input.attr('placeholder')));
        Core.utils.helpers.setUniqueTimeout(this.fetchDelayId, () => {
            this.filterValue = value;
            this.reqres.request('input:search', value);
        }, config.TEXT_FETCH_DELAY);
    },

    __calculateDesiredInputWidth(value) {
        let styleBlock;
        const div = $('<div />', {
            style: styleBlock
        });
        let style;
        const styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        let width;
        let i;

        styleBlock = 'position:absolute; left: -1000px; top: -1000px; display:none;';
        for (i = 0; i < styles.length; i++) {
            style = styles[i];
            styleBlock += `${style}:${this.ui.input.css(style)};`;
        }
        div.text(value);
        $('body').append(div);
        width = div.width() + 25;
        div.remove();
        const parentWidth = this.parent.outerWidth();
        if (parentWidth !== 0 && (width > parentWidth - 10)) {
            width = parentWidth - 10;
        }
        return width;
    },

    __updateInputWidth(width) {
        this.ui.input.css({ width: `${width}px` });
    },

    __updateInputPlaceholder() {
        const empty = this.model.get('empty');
        const placeholder = empty ? Localizer.get('SUITEGENERAL.FORM.EDITORS.BUBBLESELECT.NOTSET') : '';
        this.__updateInputWidth(this.__calculateDesiredInputWidth(placeholder));
        this.ui.input.attr({ placeholder }).toggleClass(classes.EMPTY, empty);
    }
});