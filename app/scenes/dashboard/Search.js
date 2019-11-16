import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import {SearchBar} from 'react-native-elements';

import axios from 'axios';

import * as api from "../../api";
import Article from "../../utils";

import PanelItem, {dividerStyle} from '../../components/PanelItem'

//ANIMATION VARIABLES
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.select({ios: IS_IPHONE_X ? 44 : 20, android: 24});

export default function Search(props) {
    const {navigate} = props.navigation;

    //1 - DECLARE VARIABLES
    const [result, setResult] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [cancelToken, setCancelToken] = useState('');

    //==================================================================================================

    //2 - HANDLE QUERY CHANGE
    const handleQueryChange = text => {
        setSearchText(text);
        executeSearch(text);
    };

    //==================================================================================================

    //3 - EXECUTE SEARCH
    const executeSearch = (text) => {
        if (text.length > 0) {
            setIsSearching(true);

            // Cancel the previous request before making a new request
            if (cancelToken) cancelToken.cancel('Operation canceled by the user.');

            // Create a new CancelToken
            let cancelToken_ = axios.CancelToken.source();
            setCancelToken(cancelToken_);

            api.search(text, cancelToken_)
                .then(({articles}) => setResult(articles))
                .catch((error) => {
                    if(!error.isCancel) alert(error.message)
                })
                .finally(() => setIsSearching(false));

        } else {
            setResult([]);
            setIsSearching(false);
        }
    };

    //==================================================================================================

    //4 - RENDER FLATLIST ITEM
    const renderItem = ({item, index}) => {
        let article = new Article(item, navigate);

        return (
            <View style={[{paddingVertical: 8, ...dividerStyle}]}>
                <PanelItem {...article} horizontal={true} grid={true}/>
            </View>)
    };

    const renderEmptyItem = () => {
        if (searchText.length > 0) return (<Text>{`No matches found for your search: ${searchText}`}</Text>);
        else return null;
    };

    //==================================================================================================

    //5 - RENDER
    return (
        <View style={{backgroundColor: "#ffff", flex: 1,}}>
            <View style={{borderBottomColor: '#a7a7aa', borderBottomWidth: StyleSheet.hairlineWidth}}>
                <View style={{height: STATUS_BAR_HEIGHT}}/>
                <SearchBar
                    containerStyle={{backgroundColor: "#ffffff", paddingTop: 4, paddingBottom: 4}}
                    inputContainerStyle={{backgroundColor: "#eee"}}
                    placeholder="Type Here..."
                    onChangeText={handleQueryChange}
                    value={searchText}
                    showCancel={true}
                    onCancel={() => props.navigation.goBack()}
                    autoFocus={true}
                    platform={Platform.OS}/>
            </View>
            <View style={{flex: 1}}>
                {
                    (isSearching) ?
                        <ActivityIndicator style={{paddingVertical: 8}}/>
                        :
                        <FlatList
                            data={result}
                            contentContainerStyle={{paddingHorizontal: 8}}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `Search_${item.title}`}
                            renderEmptyItem={renderEmptyItem}/>
                }
            </View>
        </View>
    )
};


Search.navigationOptions = screenProps => ({
    header: null
});