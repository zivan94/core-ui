/**
 * Developer: Stepan Burguchev
 * Date: 2/27/2017
 * Copyright: 2009-2017 Stepan Burguchev®
 *       All Rights Reserved
 * Published under the MIT license
 */

import { Handlebars } from 'lib';
import { helpers } from 'utils';
import template from './horizontalLayout.hbs';
import LayoutBehavior from '../behaviors/LayoutBehavior';

const classes = {
    CLASS_NAME: 'layout__horizontal-layout',
    ITEM: 'layout__horizontal-layout-list-item',
    HIDDEN: 'layout__hidden'
};

export default Marionette.LayoutView.extend({
    initialize(options) {
        helpers.ensureOption(options, 'columns');

        this.columns = options.columns;
    },

    template: Handlebars.compile(template),

    className: classes.CLASS_NAME,

    behaviors: {
        LayoutBehavior: {
            behaviorClass: LayoutBehavior
        }
    },

    ui: {
        list: '.js-list'
    },

    templateHelpers() {
        return {
            title: this.options.title
        };
    },

    onShow() {
        this.__rowsCtx = [];
        this.options.columns.forEach(view => {
            view.on('change:visible', this.__handleChangeVisibility.bind(this));
            const regionEl = document.createElement('div');
            regionEl.setAttribute('class', classes.ITEM);
            this.ui.list.append(regionEl);
            const region = this.addRegion(_.uniqueId('horizontalLayoutItem'), {
                el: regionEl
            });
            this.__rowsCtx.push({
                view,
                regionEl,
                region
            });
            region.show(view);
        });
        this.__updateState();
    },

    update() {
        this.columns.forEach(view => {
            if (view.update) {
                view.update();
            }
        });
        this.__updateState();
    },

    __handleChangeVisibility(view, visible) {
        const ctx = this.__rowsCtx.find(x => x.view === view);
        ctx.region.$el.toggleClass(classes.HIDDEN, !visible);
    }
});
