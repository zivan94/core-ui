/**
 * Developer: Stepan Burguchev
 * Date: 2/27/2017
 * Copyright: 2009-2017 Stepan Burguchev®
 *       All Rights Reserved
 * Published under the MIT license
 */

import core from 'comindware/core';

export default function() {
    return new core.layout.VerticalLayout({
        rows: [
            new core.form.editors.TextEditor({
                value: 'foo'
            }),
            new core.form.editors.TextAreaEditor({
                value: 'bar'
            }),
            new core.form.editors.NumberEditor({
                value: 123
            }),
            new core.form.editors.DateTimeEditor({
                value: '2015-07-20T10:46:37Z'
            }),
            new core.form.editors.BooleanEditor({
                value: true,
                displayText: 'Make me some tea!'
            }),
            new core.form.editors.DropdownEditor({
                model: new Backbone.Model({ key: 1 }),
                key: 'key',
                autocommit: true,
                collection: new Backbone.Collection()
            }),
            new core.form.editors.ReferenceBubbleEditor({
                model: new Backbone.Model({ key: 1 }),
                key: 'key',
                autocommit: true,
                collection: new Backbone.Collection([{
                    id: 1,
                    text: 'test'
                }, {
                    id: 2,
                    text: 'testtesttesttest'
                }, {
                    id: 3,
                    text: 'testtesttesttesttesttest'
                }, {
                    id: 4,
                    text: 'testtesttesttesttesttesttesttesttest'
                }, {
                    id: 5,
                    text: 'testtesttesttesttesttesttesttesttesttesttesttest'
                }, {
                    id: 6,
                    text: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest'
                }])
            }),
            new core.form.editors.MultiSelectEditor({
                model: new Backbone.Model({ key: 1 }),
                key: 'key',
                autocommit: true,
                collection: new Backbone.Collection()
            }),
            new core.form.editors.MemberSelectEditor({
                model: new Backbone.Model({ key: 1 }),
                key: 'key',
                autocommit: true,
                collection: new Backbone.Collection()
            }),
        ]
    });
}
