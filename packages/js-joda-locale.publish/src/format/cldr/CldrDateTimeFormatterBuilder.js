/**
 * @copyright (c) 2016, Philipp Thürwächter & Pattrick Hüper
 * @copyright (c) 2007-present, Stephen Colebourne & Michael Nascimento Santos
 * @license BSD-3-Clause (see LICENSE in the root directory of this source tree)
 */

import { DateTimeFormatterBuilder, IllegalArgumentException, TextStyle, ChronoField } from 'js-joda';

// TODO: hm... is this a good idea?? copied from joda currently, could we add a js-joda-utils module??
import { requireNonNull, requireInstance } from '../../assert';
import TextPrinterParser from '../parser/TextPrinterParser';
import CldrDateTimeTextProvider from './CldrDateTimeTextProvider';

/** DateTimeFormatterBuilder extension functions implementing locale handling using cldr data (http://cldr.unicode.org/)
 */
export default class CldrDateTimeFormatterBuilder extends DateTimeFormatterBuilder {

    //-----------------------------------------------------------------------
    // empty implementations of locale functionality, be implemented/overridden by js-joda-locale

    appendLocalizedOffset() {
        throw new IllegalArgumentException('js-joda-locale: Pattern using (localized) text not implemented yet!');
    }

    appendZoneText() {
        throw new IllegalArgumentException('js-joda-locale: Pattern using (localized) text not implemented yet!');
    }

    //-------------------------------------------------------------------------
    /**
     * function overloading for {@link CldrDateTimeFormatterBuilder#appendText}
     *
     * if called with 1 arguments and first argument is an instance of ChronoField,
     * then {@link CldrDateTimeFormatterBuilder.appendTextField} is executed.
     * if called with 2 arguments and second argument is an instance of TextStyle,
     * then {@link CldrDateTimeFormatterBuilder.appendTextFieldStyle} is executed.
     *
     * Otherwise {@link CldrDateTimeFormatterBuilder.appendTextFieldMap} is executed.
     *
     * @param {!ChronoField} field
     * @param {!(TextStyle|Object)} styleOrMap
     * @returns {DateTimeFormatterBuilder} this for chaining
     */
    appendText(field, styleOrMap) {
        if (styleOrMap === undefined) {
            return this.appendTextField(field);
        } else if (styleOrMap instanceof TextStyle) {
            return this.appendTextFieldStyle(field, styleOrMap);
        } else {
            return this.appendTextFieldMap(field, styleOrMap);
        }
    }

    /**
     * Appends the text of a date-time field to the formatter using the full
     * text style.
     * <p>
     * The text of the field will be output during a print.
     * The value must be within the valid range of the field.
     * If the value cannot be obtained then an exception will be thrown.
     * If the field has no textual representation, then the numeric value will be used.
     * <p>
     * The value will be printed as per the normal print of an integer value.
     * Only negative numbers will be signed. No padding will be added.
     *
     * @param {!ChronoField} field  the field to append, not null
     * @return {DateTimeFormatterBuilder} this, for chaining, not null
     */
    appendTextField(field) {
        return this.appendTextFieldStyle(field, TextStyle.FULL);
    }

    /**
     * Appends the text of a date-time field to the formatter.
     * <p>
     * The text of the field will be output during a print.
     * The value must be within the valid range of the field.
     * If the value cannot be obtained then an exception will be thrown.
     * If the field has no textual representation, then the numeric value will be used.
     * <p>
     * The value will be printed as per the normal print of an integer value.
     * Only negative numbers will be signed. No padding will be added.
     *
     * @param {!ChronoField} field  the field to append, not null
     * @param {!TextStyle} textStyle  the text style to use, not null
     * @return {DateTimeFormatterBuilder} this, for chaining, not null
     */
    appendTextFieldStyle(field, textStyle) {
        requireNonNull(field, 'field');
        requireInstance(field, ChronoField, 'field');
        requireNonNull(textStyle, 'textStyle');
        requireInstance(textStyle, TextStyle, 'textStyle');
        this._appendInternal(new TextPrinterParser(field, textStyle, new CldrDateTimeTextProvider()));
        return this;
    }

    /**
     * Appends the text of a date-time field to the formatter using the specified
     * map to supply the text.
     * <p>
     * The standard text outputting methods use the localized text in the JDK.
     * This method allows that text to be specified directly.
     * The supplied map is not validated by the builder to ensure that printing or
     * parsing is possible, thus an invalid map may throw an error during later use.
     * <p>
     * Supplying the map of text provides considerable flexibility in printing and parsing.
     * For example, a legacy application might require or supply the months of the
     * year as "JNY", "FBY", "MCH" etc. These do not match the standard set of text
     * for localized month names. Using this method, a map can be created which
     * defines the connection between each value and the text:
     * <pre>
     * Map&lt;Long, String&gt; map = new HashMap&lt;&gt;();
     * map.put(1, "JNY");
     * map.put(2, "FBY");
     * map.put(3, "MCH");
     * ...
     * builder.appendText(MONTH_OF_YEAR, map);
     * </pre>
     * <p>
     * Other uses might be to output the value with a suffix, such as "1st", "2nd", "3rd",
     * or as Roman numerals "I", "II", "III", "IV".
     * <p>
     * During printing, the value is obtained and checked that it is in the valid range.
     * If text is not available for the value then it is output as a number.
     * During parsing, the parser will match against the map of text and numeric values.
     *
     * @param {!ChronoField} field  the field to append, not null
     * @param {!Object} textLookup  the map from the value to the text
     * @return {DateTimeFormatterBuilder} this, for chaining, not null
     */
    appendTextFieldMap(field, textLookup) {
        requireNonNull(field, 'field');
        requireInstance(field, ChronoField, 'field');
        requireNonNull(textLookup, 'textLookup');
        throw new IllegalArgumentException('js-joda-locale: Pattern using (localized) text not implemented yet!');
        /* Map<Long, String> copy = new LinkedHashMap<Long, String>(textLookup);
        Map<TextStyle, Map<Long, String>> map = Collections.singletonMap(TextStyle.FULL, copy);
        final LocaleStore store = new LocaleStore(map);
        DateTimeTextProvider provider = new DateTimeTextProvider() {
            @Override
            public String getText(TemporalField field, long value, TextStyle style, Locale locale) {
                return store.getText(value, style);
            }
            @Override
            public Iterator<Entry<String, Long>> getTextIterator(TemporalField field, TextStyle style, Locale locale) {
                return store.getTextIterator(style);
            }
        };
        appendInternal(new TextPrinterParser(field, TextStyle.FULL, provider));
        */
        return this;
    }

    //-----------------------------------------------------------------------

}
