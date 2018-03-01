
import core from 'coreApi';
import { initializeCore } from '../../utils/helpers';
import 'jasmine-jquery';

const $ = core.lib.$;

describe('Editors', () => {
    const findInput = function(view) {
        return view.$('.js-input');
    };

    const collectionData = [{
        id: 1,
        name: 1
    }, {
        id: 2,
        name: 2
    }, {
        id: 3,
        name: 3
    }];

    let rootRegion;

    const dynamicController = core.form.editors.reference.controllers.BaseReferenceEditorController.extend({
        fetch() {
            return new Promise(resolve => {
                this.collection.reset(collectionData);

                this.totalCount = 3;

                return resolve({
                    collection: collectionData,
                    totalCount: this.totalCount
                });
            });
        }
    });

    beforeEach(() => {
        rootRegion = initializeCore();
    });

    afterEach(() => {
        core.services.WindowService.closePopup();
    });

    describe('ReferenceBubbleEditorView', () => {
        it('should get focus when focus() is called', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            expect(findInput(view)).toBeFocused();
            expect(view.hasFocus).toEqual(true, 'Must have focus.');
        });

        it('should lose focus when blur() is called', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            view.blur();

            expect(findInput(view)).not.toBeFocused();
            expect(view.hasFocus).toEqual(false, 'Must have focus.');
        });

        it('should show empty model placeholder on empty value', () => {
            //Todo test
            expect(true).toEqual(true);
        });

        it('UI should match it configuration', () => {
            //Todo test
            expect(true).toEqual(true);
        });

        it('should show error view if wrongly instantiated', () => {
            //Todo test
            expect(true).toEqual(true);
        });

        it('should show error view with appropriate message and help text', () => {
            //Todo test
            expect(true).toEqual(true);
        });

        it('should have `value` matched with initial value', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            expect(view.getValue()).toEqual([{ id: 1, name: 1 }]);
        });

        it('view collection should have reset on dropdown open', () => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                controller: new dynamicController({
                    collection: new core.form.editors.reference.collections.BaseReferenceCollection()
                }),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            const doneFn = jasmine.createSpy();

            view.panelCollection.on('reset', () => doneFn);

            expect(doneFn.calledOnce);
        });

        it('should have collection matched it static initial collection', () => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            expect(view.viewModel.get('panel').get('collection').toJSON()).toEqual(collectionData);
        });

        it('should have collection matched it dynamic initial collection', () => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                controller: new dynamicController({
                    collection: new core.form.editors.reference.collections.BaseReferenceCollection()
                }),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            view.panelCollection.on('reset', () => {
                expect(view.panelCollection.toJSON()).toEqual(collectionData);
            });
        });

        it('should change value on setValue() get called', () => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.setValue([{ id: 2, name: 2 }]);

            expect(view.getValue()).toEqual([{ id: 2, name: 2 }]);
        });

        it('should open panel when focus input', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            expect(view.dropdownView.isOpen).toEqual(true, 'Must open dropdown on focus.');
        });

        it('should change value on panel item select', () => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            expect(view.dropdownView.isOpen).toEqual(true, 'Must open dropdown on focus.');

            view.panelCollection.at(1).select();

            expect(view.getValue()).toEqual([{ id: 2, name: 2 }]);
        });

        it('should highlight or check panel items based on editor value', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity
            });

            rootRegion.show(view);

            view.focus();

            expect(view.dropdownView.isOpen).toEqual(true, 'Must open dropdown on focus.');
        });

        it('should trigger change on remove icon item click', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                controller: new dynamicController({
                    collection: new core.form.editors.reference.collections.BaseReferenceCollection()
                }),
                key: 'value',
                maxQuantitySelected: Infinity,
                autocommit: true
            });

            const doneFn = jasmine.createSpy();

            rootRegion.show(view);

            view.on('change', () => {
                doneFn();
            });

            $(view.$('.bubbles__i')[0]).trigger('mouseenter');

            view.$('.js-bubble-delete')[0].click();

            expect(doneFn).toHaveBeenCalled();
        });

        it('should remove items on remove icon item click', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity,
                autocommit: true
            });

            rootRegion.show(view);

            $(view.$('.bubbles__i')[1]).trigger('mouseenter');

            view.$('.js-bubble-delete')[0].click();
            expect(view.getValue()).toEqual([{ id: 1, name: 1 }]);

            $(view.$('.bubbles__i')[0]).trigger('mouseenter');

            view.$('.js-bubble-delete')[0].click();
            expect(view.getValue()).toEqual([]);
        });

        it('should set size for panel', () => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                maxQuantitySelected: Infinity,
                autocommit: true
            });

            rootRegion.show(view);

            view.$('.js-button-region').outerWidth(70);
            view.$('.bubbles').click();
            let panel = $('.visible-collection');
            expect(panel.outerWidth()).toEqual(200);

            view.blur();
            view.$('.js-button-region').outerWidth(700);
            view.$('.bubbles').click();
            panel = $('.visible-collection');
            expect(panel.outerWidth()).toEqual(700);
        });

        it('should remove items on uncheck in panel', done => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                controller: new dynamicController({
                    collection: new core.form.editors.reference.collections.BaseReferenceCollection()
                }),
                key: 'value',
                maxQuantitySelected: Infinity,
                autocommit: true
            });

            rootRegion.show(view);

            view.focus();

            view.on('change', () => {
                expect(view.getValue()).toEqual([{ id: 1, name: 1 }]);
                done();
            });

            view.on('view:ready', () => {
                $('.js-core-ui__global-popup-region').find('.dd-list__i')[1].click();
            });
        });

        it('should uncheck items on remove items click', done => {
            const model = new Backbone.Model({
                value: [{ id: 1, name: 1 }, { id: 2, name: 2 }]
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                controller: new dynamicController({
                    collection: new core.form.editors.reference.collections.BaseReferenceCollection()
                }),
                key: 'value',
                maxQuantitySelected: Infinity,
                autocommit: true
            });

            rootRegion.show(view);

            view.focus();

            view.on('change', () => {
                expect(view.panelCollection.at(0).selected).toEqual(false);
                done();
            });

            view.on('view:ready', () => {
                $(view.$('.bubbles__i')[0]).trigger('mouseenter');
                view.$('.js-bubble-delete')[0].click();
            });
        });

        it('should use default parameters if non is passed', () => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value'
            });

            rootRegion.show(view);

            expect(view.options).toEqual(jasmine.objectContaining({
                displayAttribute: 'name',
                controller: null,
                showAddNewButton: false,
                showEditButton: false,
                showCheckboxes: false,
                textFilterDelay: 300,
                maxQuantitySelected: 1,
                canDeleteItem: true
            }));
        });

        it('should show checkboxes and have correct style if showCheckboxes parameter set to true', done => {
            const model = new Backbone.Model({
                value: null
            });

            const view = new core.form.editors.ReferenceBubbleEditor({
                model,
                collection: new Backbone.Collection(collectionData),
                key: 'value',
                showCheckboxes: true
            });

            rootRegion.show(view);

            view.focus();

            view.on('view:ready', () => {
                expect($('.js-core-ui__global-popup-region').find('.dd-list__i.dev_dd-list__i_with_checkbox').length).toEqual(3);
                expect($('.js-core-ui__global-popup-region').find('.js-checkbox').length).toEqual(3);
                done();
            });
        });
    });
});
