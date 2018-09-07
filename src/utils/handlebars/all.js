import or from './or';
import join from './join';
import equal from './equal';
import isNull from './isNull';
import highlightFragment from './highlightFragment';
import localize from './localize';
import localizedText from './localizedText';
import renderAsHtml from './renderAsHtml';
import renderFullDate from './renderFullDate';
import renderFullDateTime from './renderFullDateTime';
import renderShortDuration from './renderShortDuration';

Handlebars.registerHelper('or', or);
Handlebars.registerHelper('join', join);
Handlebars.registerHelper('equal', equal);
Handlebars.registerHelper('isNull', isNull);
Handlebars.registerHelper('highlightFragment', highlightFragment);
Handlebars.registerHelper('localize', localize);
Handlebars.registerHelper('localizedText', localizedText);
Handlebars.registerHelper('renderAsHtml', renderAsHtml);
Handlebars.registerHelper('renderFullDate', renderFullDate);
Handlebars.registerHelper('renderFullDateTime', renderFullDateTime);
Handlebars.registerHelper('renderShortDuration', renderShortDuration);
