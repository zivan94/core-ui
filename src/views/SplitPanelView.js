//@flow
import template from '../templates/splitPanel.hbs';
import GlobalEventService from '../services/GlobalEventService';

const config = {
    smallSize: 550,
    largeSize: 700,
    throttleDelay: 200
};

const classes = {
    smallPanelSize: 'size-small',
    largePanelSize: 'size-large',
    middlePanelSize: 'size-middle'
};

const defaultOptions = {
    panel1Min: 20,
    panel2Min: 20
};

export default Marionette.View.extend({
    constructor() {
        Marionette.View.prototype.constructor.apply(this, arguments);

        _.defaults(this.options, defaultOptions);

        _.bindAll(this, '__startDragging', '__stopDragging', '__handleDocumentMouseMove', '__handleDocumentMouseUp', '__handleResizerMousedown', '__handleWindowResize');
        /*
        this.listenTo(GlobalEventService, 'window:resize', _.throttle(this.__handleWindowResize, config.throttleDelay));
        this.on('render', () => {
            this.$el.addClass('double-panels');
        });
        this.on('show', () => {
            this.__handleWindowResize();
        });
        */
    },

    initialize() {
        this.regionModulesMap = [];
    },

    template: Handlebars.compile(template),

    className: 'split-panel_container',

    ui: {
        splitPanelWrapper: '.split-panel_wrapper'
    },

    events: {
        'mousedown @ui.resizer': '__handleResizerMousedown'
    },

    onRender() {
        const handlerRoutPairs = this.options.handlerRoutPairs;

        if (handlerRoutPairs && handlerRoutPairs.length) {
            this.__initializeViews(handlerRoutPairs);
        }
    },

    __handleResizerMousedown(event) {
        this.__stopDragging();
        this.__startDragging(event);
        return false;
    },

    __handleDocumentMouseMove(event) {
        if (!this.dragContext) {
            return;
        }

        const ctx = this.dragContext;
        if (event.pageX === ctx.pageX) {
            return;
        }

        const newPanel1Width = Math.min(Math.max(ctx.panel1InitialWidth + event.pageX - ctx.pageX, this.options.panel1Min), ctx.containerWidth - this.options.panel2Min);
        const leftWidthPx = newPanel1Width / ctx.containerWidth * 100;
        const rightWidthPx = 100 - leftWidthPx;

        this.ui.resizer.css('left', `${leftWidthPx}%`);

        this.__handleWindowResize();
        return false;
    },

    __handleDocumentMouseUp() {
        this.__stopDragging();
        return false;
    },

    __startDragging(event) {
        this.dragContext = {
            pageX: event.pageX,
            containerWidth: this.$el.width(),
            panel1InitialWidth: this.ui.panel1.width()
        };

        document.addEventListener('mousemove', this.__handleDocumentMouseMove);
        document.addEventListener('mouseup', this.__handleDocumentMouseUp);
    },

    __stopDragging() {
        if (!this.dragContext) {
            return;
        }

        document.removeEventListener('mousemove', this.__handleDocumentMouseMove);
        document.removeEventListener('mouseup', this.__handleDocumentMouseUp);

        this.dragContext = null;
    },

    __updatePanelClasses($panelEl) {
        const panelWidth = $panelEl.width();
        if (!panelWidth) {
            return;
        }

        let newClass;
        if (panelWidth < config.smallSize) {
            newClass = classes.smallPanelSize;
        } else if (panelWidth < config.largeSize) {
            newClass = classes.middlePanelSize;
        } else {
            newClass = classes.largePanelSize;
        }

        if (!$panelEl.hasClass(newClass)) {
            $panelEl.removeClass(classes.smallPanelSize);
            $panelEl.removeClass(classes.middlePanelSize);
            $panelEl.removeClass(classes.largePanelSize);
            $panelEl.addClass(newClass);
        }
    },

    __handleWindowResize() {
        this.__updatePanelClasses(this.ui.panel1);
        this.__updatePanelClasses(this.ui.panel2);
    },

    __initializeViews(handlerRoutPairs) {
        handlerRoutPairs.forEach((pair, i) => {
            const regionEl = document.createElement('div');
            regionEl.className = `js-tile${i + 1}-region split-panel_tile`;

            this.ui.splitPanelWrapper.append(regionEl);

            const region = this.addRegion(`js-tile${i + 1}-region`, {
                el: regionEl
            });
            this.regionModulesMap.push({
                routeRegExp: pair.routeRegExp,
                region
            });

            pair.callback(pair.route);
        });
    }
});
