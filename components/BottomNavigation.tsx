import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Message from '../newscreens/Message';
import CollectedMessage from '../newscreens/CollectedMessage';
import i18n from '../language/i18n';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

function CustomBottomTabNavigator() {
    const [locale, setLocale] = React.useState(i18n.locale);
    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    return (
        <Tab.Navigator
            initialRouteName="Message"
            shifting={false}
            activeColor="#7174F8"
            activeIndicatorStyle={{}}
            inactiveColor="#000000"
            barStyle={{ backgroundColor: '#f9f9f9', borderTopWidth: 1, borderTopColor: '#e6e6e6' }}>
            <Tab.Screen
                name="Message"
                component={Message}

                options={{
                    title: i18n.t('Message.Message'),
                    tabBarIcon: 'message',
                }}
            />
            <Tab.Screen
                name="Collected"
                component={CollectedMessage}
                options={{
                    title: i18n.t('Message.Collected'),
                    tabBarIcon: 'bookmark-outline',
                }}
            />
        </Tab.Navigator>
    );
}

export default CustomBottomTabNavigator;
