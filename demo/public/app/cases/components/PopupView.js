export default function() {
    const model = new Backbone.Model({
        name: '',
        dueDate: '2015-07-20T10:46:37Z',
        description: 'no-op',
        computed: false,
        ref: []
    });

    const formSchema = {
        name: {
            title: 'Name',
            type: 'Text',
            autocommit: true,
            required: true,
            validators: ['required']
        },
        idealDays: {
            title: 'Ideal Days',
            type: 'Number',
            autocommit: true,
            required: true,
            validators: ['required']
        },
        dueDate: {
            title: 'Due Date',
            type: 'DateTime'
        },
        description: {
            title: 'Description',
            type: 'TextArea'
        },
        computed: {
            type: 'Boolean',
            displayText: 'Computed via expression'
        },
        expression: {
            type: 'Code',
            title: 'Expression',
            autocommit: true,
            required: true,
            validators: ['required']
        },
        ref: {
            type: 'Datalist',
            title: 'Datalist',
            autocommit: true,
            collection: new Backbone.Collection(),
            required: true,
            validators: ['required']
        }
    };

    const createPopup = () =>
        new core.layout.Popup({
            size: {
                width: '800px',
                height: '700px'
            },
            newTabUrl: '#', //array with arguments or single url for window.open
            header: 'New Operation',
            buttons: [
                {
                    id: false,
                    text: 'Cancel',
                    customClass: 'btn-small btn-outline',
                    handler() {
                        core.services.WindowService.closePopup();
                    }
                },
                {
                    id: true,
                    text: 'Save',
                    customClass: 'btn-small',
                    handler(popup) {
                        const error = popup.validate();
                        if (error) {
                            return;
                        }
                        popup.setLoading(true);
                        setTimeout(() => {
                            popup.setLoading(false);
                            popup.content.form.commit();
                            core.services.WindowService.closePopup();
                            alert(JSON.stringify(model.toJSON(), null, 4));
                        }, 1000);
                    }
                }
            ],
            content: new core.layout.Form({
                model,
                schema: formSchema,
                transliteratedFields: {
                    description: 'name'
                },
                content: new core.layout.TabLayout({
                    tabs: [
                        {
                            id: 'general',
                            name: 'General',
                            view: new core.layout.VerticalLayout({
                                rows: [
                                    core.layout.createFieldAnchor('name'),
                                    new core.layout.HorizontalLayout({
                                        columns: [core.layout.createFieldAnchor('idealDays'), core.layout.createFieldAnchor('dueDate')]
                                    }),
                                    core.layout.createFieldAnchor('description'),
                                    core.layout.createEditorAnchor('computed')
                                ]
                            })
                        },
                        {
                            id: 'expression',
                            name: 'Computed Expression',
                            view: core.layout.createFieldAnchor('expression')
                        },
                        {
                            id: 'ref',
                            name: 'Datalist editor',
                            view: core.layout.createFieldAnchor('ref')
                        }
                    ]
                })
            })
        });

    const View = Marionette.View.extend({
        template: Handlebars.compile('<input class="js-show-popup" type="button" value="Show Popup" />'),

        events: {
            'click .js-show-popup'() {
                core.services.WindowService.showPopup(createPopup());
            }
        }
    });

    return new View();
}
