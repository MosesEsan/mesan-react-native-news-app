import React from 'react';
import { ActivityIndicator } from 'react-native';

import { WebView } from 'react-native-webview';

export default function Article(props) {
    const {navigation} = props;
    const article = navigation.getParam("article");

    //==================================================================================================

    return (
        <WebView source={{ uri: article.url }}
                 startInLoadingState={true}
                 onError={() => alert("Failed to load article.")}
                 renderLoading={() => <ActivityIndicator style={{paddingVertical: 8}}/>}/>
    );
};

Article.navigationOptions = ({navigation}) => {
    return {
        title: `${navigation.getParam('title')}`,
        headerRight: null
    }
};