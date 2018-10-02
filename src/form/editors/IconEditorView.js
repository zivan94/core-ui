//@flow
import IconButtonView from './impl/iconEditor/views/IconButtonView';
import IconPanelView from './impl/iconEditor/views/IconPanelView';
import template from './impl/iconEditor/templates/iconEditorComponentView.html';
import categories from './impl/iconEditor/categories';
import icons from './impl/iconEditor/icons';
import BaseLayoutEditorView from './base/BaseLayoutEditorView';

const constants = {
    iconPropertyDefaultName: 'iconClass'
};

export default BaseLayoutEditorView.extend({
    initialize(options) {
        const modelIconProperty = options.modelIconProperty;

        if (modelIconProperty && modelIconProperty !== constants.iconPropertyDefaultName) {
            this.model.set('iconClass', this.model.get(options.modelIconProperty));
        }

        this.iconsMeta = options.iconsMeta || icons;
        this.iconsCategories = options.iconsCategories || categories;
    },

    template: Handlebars.compile(template),

    className: 'editor editor_icon',

    regions: {
        iconSelectorHeaderRegion: '.js-icon-selector-header'
    },

    ui: {
        deleteIconButton: '.js-delete-icon'
    },

    events: {
        'click @ui.deleteIconButton': '__onDeleteIconClick'
    },

    onRender() {
        !this.model.get('color') && this.model.set('color', '#000000');

        this.popupPanel = Core.dropdown.factory.createDropdown({
            buttonView: IconButtonView,
            panelView: IconPanelView,
            buttonViewOptions: {
                model: this.model
            },
            panelViewOptions: {
                collection: this.__getConfig(),
                showColorPicker: this.options.showColorPicker,
                model: this.model
            },
            autoOpen: true
        });

        this.popupPanel.on('panel:click:item', id => {
            this.ui.deleteIconButton.show();
            this.model.set('iconClass', id);
            this.trigger('click:item', id);
            this.close();
        });

        this.showChildView('iconSelectorHeaderRegion', this.popupPanel);
        if (!this.model.get('iconClass')) {
            this.ui.deleteIconButton.hide();
        }
    },

    open() {
        this.popupPanel.open();
    },

    close() {
        this.popupPanel.close();
    },

    isEmptyValue() {
        return !this.model.has('iconClass');
    },

    __getConfig() {
        const iconService = window.application.options.iconService;
        const useBrands = iconService && iconService.useBrands;
        return new Backbone.Collection(
            Object.values(this.iconsCategories)
            .map(category => ({
                name: category.label,
                groupItems: category.icons
                .reduce((arr, icon) => {
                    const metaIcon = this.iconsMeta[icon];
                    const isBrand = metaIcon ? metaIcon.styles.includes('brands') : true;
                    if (!useBrands && isBrand) {
                        return arr;
                    }
                    arr.push({
                        id: icon,
                        name: metaIcon ? metaIcon.label : icon,
                        filter: metaIcon ? metaIcon.search.terms : [icon],
                    });

                    return arr;
                }, [])
            }))
        );
    },

    __onDeleteIconClick() {
        this.model.set('iconClass', null);
        this.trigger('click:item', null);
        this.ui.deleteIconButton.hide();
    }
});
