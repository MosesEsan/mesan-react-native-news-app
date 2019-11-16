import React, {useState} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux'

import * as api from "../../api";
import * as c from "../../constants";
import {addCategoryHeadlines} from "../../actions";
import Article from "../../utils";

import PanelItem from '../../components/PanelItem'

export default function Articles(props) {
    const dispatch = useDispatch();
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    //Access Redux Store State
    const newsReducer = useSelector(({newsReducer}) => newsReducer);
    let category = navigation.getParam('category');
    category = category.toLowerCase();

    let data = newsReducer[category];
    let { articles, totalResults } = data;

    //==================================================================================================

    //2 - ON REFRESH
    async function onRefresh() {
        setIsRefreshing(true);

        try {
            let data = await api.getHeadlinesByCategory(category);
            data = {articles, totalResults} = data;
            dispatch(addCategoryHeadlines(category, data))
        } catch (error) {
            alert(error.message);
        } finally {
            setIsRefreshing(false)
        }
    }

    //==================================================================================================

    //2 - ON LOAD MORE
    async function onLoadMore() {
        if (!isLoadingMore){
            setIsLoadingMore(true);

            let length = newsReducer[category]['articles'].length;
            if(length < totalResults){
                let currentPage = length / c.PAGESIZE; //checks the current page
                let nextPage = currentPage + 1; //the next page

                try {
                    let data = await api.getHeadlinesByCategory(category, nextPage);
                    dispatch(addCategoryHeadlines(category, data, nextPage))
                } catch (error) {
                    alert(error.message);
                } finally {
                    setIsLoadingMore(false)
                }
            }
        }
    }

    //==================================================================================================

    //3 - RENDER NEWS ITEM
    const renderItem = ({item, index}) => {
        let article = new Article(item, navigate);

        return (
            <View style={{flex: 1, flexDirection: 'column', padding: 6}}>
                <PanelItem {...article}/>
            </View>
        );
    };

    //==================================================================================================

    //4 - RENDER FOOTER
    const renderFooter = () => {
        if (!(articles.length < totalResults)) return null;

        let footerStyle ={
            position: 'relative',
            paddingVertical: 20,
            marginTop: 10,
            marginBottom: 10
        };

        return (
            <View style={footerStyle}>
                <ActivityIndicator/>
            </View>
        );
    };

    //==================================================================================================

    //5 - RENDER
    return (
        <FlatList
            data={newsReducer[category]['articles']}
            renderItem={renderItem}
            numColumns={2}
            initialNumToRender={10}

            onRefresh={onRefresh}
            refreshing={isRefreshing}

            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}

            contentContainerStyle={{paddingHorizontal: 8}}
            keyExtractor={(item, index) => `${category}_${index.toString()}`}/>
    );
};

Articles.navigationOptions = ({navigation}) => {
    return {
        title: `${navigation.getParam('category')}`
    }
};