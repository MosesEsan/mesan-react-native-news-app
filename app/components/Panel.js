import React from 'react';
import {ScrollView, FlatList, StyleSheet, View, Text, Platform} from 'react-native';

export default function Panel(props) {
    const {title, titleStyle, ctaText, onCTAPress} = props;
    const {style, cols} = props;

    let Component = cols > 0 ? GridView : DefaultView;

    return (
        <View style={[styles.container,style]}>
            {title && <Header title={title} style={titleStyle} ctaText={ctaText} onPress={onCTAPress}/>}
            <Component {...props}/>
        </View>
    );
};

const Header = ({title, ctaText, onPress, style}) => {
    return (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionHeaderText, style]}>{title}</Text>
            {onPress && <Text style={[style, styles.cta]} onPress={onPress}>{ctaText}</Text>}
        </View>
    )
};

// DEFAULT VIEW
const DefaultView = ({title, data, renderItem}) => {
    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {data.map((item, index) => {
                return (
                    <View style={{margin: 8 * 1.5, marginRight: 0}} key={`${title}${index.toString()}`}>
                        {renderItem({item, index})}
                    </View>
                )
            })}
        </ScrollView>
    )
};



export const dividerColor = StyleSheet.hairlineWidth < 1 ? '#bcbbc1' : 'rgba(0, 0, 0, 0.12)';
export const dividerStyle = {borderBottomWidth: StyleSheet.hairlineWidth, borderColor:dividerColor};

//GRID VIEW
const GridView = ({title, cols, data, renderItem, showDivider}) => {
    return (
        <FlatList
            data={data}
            numColumns={cols > 2 ? 2 : cols} //Setting the number of column
            renderItem={(props) => {
                return (
                    <View style={[(cols > 1) ? styles.multiCol : styles.singleCol, (showDivider) && dividerStyle]}>
                        {renderItem(props)}
                    </View>
                )
            }}
            contentContainerStyle={{paddingHorizontal: 8}}
            keyExtractor={(item, index) => `Grid_${title}${index.toString()}`}
        />
    )
};

Panel.defaultProps = {
    data: [],
    renderItem: () => alert("Render Item function not declared"),
    style: {},

    title: null,
    titleStyle: {},
    ctaText: "View All",
    onCTAPress: null,
    cols: 0,
    showDivider:true
};

let font = Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff'
    },

    singleCol:{paddingVertical: 8},

    multiCol:{flex: 1, flexDirection: 'column', padding: 8},


    //HEADER STYLES
    sectionHeader: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8 * 1.5
    },

    sectionHeaderText: {
        color: '#363434',
        fontSize: 19,
        fontWeight: 'bold',
        fontFamily: font,
        flex: 1
    },

    cta: {
        color: "#D1644F",
        fontSize: 14,
        fontWeight: '500',
        fontFamily: font
    }
});